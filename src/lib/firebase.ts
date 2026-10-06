import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  onSnapshot 
} from "firebase/firestore";

const env = (import.meta as any).env ?? {};

export const firebaseConfig = {
  projectId: (env.VITE_FIREBASE_PROJECT_ID as string | undefined)?.trim() || "your-project-id",
  appId: (env.VITE_FIREBASE_APP_ID as string | undefined)?.trim() || "1:000000000000:web:0000000000000000000000",
  apiKey: (env.VITE_FIREBASE_API_KEY as string | undefined)?.trim() || "YOUR_FIREBASE_API_KEY",
  authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined)?.trim() || "your-project-id.firebaseapp.com",
  firestoreDatabaseId: (env.VITE_FIREBASE_FIRESTORE_DATABASE_ID as string | undefined)?.trim() || "(default)",
  storageBucket: (env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined)?.trim() || "your-project-id.firebasestorage.app",
  messagingSenderId: (env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined)?.trim() || "000000000000",
  measurementId: (env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined)?.trim() || "",
  oAuthClientId: (env.VITE_FIREBASE_OAUTH_CLIENT_ID as string | undefined)?.trim() || "",
  recaptchaSiteKey: (env.VITE_FIREBASE_RECAPTCHA_SITE_KEY as string | undefined)?.trim() || "",
};

if (!env.VITE_FIREBASE_API_KEY || !env.VITE_FIREBASE_PROJECT_ID || !env.VITE_FIREBASE_APP_ID) {
  console.warn("Firebase is not configured. Set VITE_FIREBASE_* variables in your local .env file before enabling auth.");
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with default database or custom ID if specified
const customDbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = (customDbId && customDbId !== "(default)")
  ? getFirestore(app, customDbId)
  : getFirestore(app);

// Test connection on boot as mandated by integration guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('the client is offline') || error.message.includes('not found')) {
        console.info("Firestore status: database connecting or waiting for initial creation in console.");
      }
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

export interface UserProfileDoc {
  uid: string;
  name: string;
  screenName: string;
  email: string;
  selectedDrawer: any[];
  contingencyDrawer?: any[];
  robotType?: string;
  customGoal?: string;
  budget?: number;
  budgetMargin?: number;
  updatedAt: string;
  createdAt?: string;
}

export type FirestoreUserDocument = UserProfileDoc;

let isWritePending = false;
let pendingWriteRequest: { uid: string; data: Partial<UserProfileDoc> } | null = null;
let lastSyncedDataHash = "";

// Save or Update user profile and hardware selection in Firestore with throttling & deduplication
export async function saveUserDataToFirestore(
  uid: string, 
  data: Partial<UserProfileDoc>
): Promise<void> {
  if (!uid || !auth.currentUser || auth.currentUser.uid !== uid) return;

  // Deduplicate payloads to avoid exhausting single-document write quotas
  const normalizedCompare = JSON.stringify({
    uid,
    selectedDrawer: data.selectedDrawer,
    contingencyDrawer: data.contingencyDrawer,
    robotType: data.robotType,
    customGoal: data.customGoal,
    budget: data.budget,
    name: data.name,
    screenName: data.screenName
  });

  if (normalizedCompare === lastSyncedDataHash && !isWritePending) {
    return;
  }

  // If another write is already in flight, queue the latest state to execute sequentially
  if (isWritePending) {
    pendingWriteRequest = { uid, data };
    return;
  }

  isWritePending = true;
  lastSyncedDataHash = normalizedCompare;
  const path = `users/${uid}`;
  const userRef = doc(db, "users", uid);
  
  try {
    const payload: Partial<UserProfileDoc> = {
      ...data,
      uid,
      updatedAt: new Date().toISOString()
    };

    await setDoc(userRef, payload, { merge: true });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (error?.code === "resource-exhausted" || errorMsg.includes("resource-exhausted") || errorMsg.includes("queued writes")) {
      console.warn("Firestore write stream throttled. Data preserved in local storage safely.");
    } else {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  } finally {
    isWritePending = false;
    if (pendingWriteRequest) {
      const nextRequest = pendingWriteRequest;
      pendingWriteRequest = null;
      // Delay subsequent write by at least 600ms to stay well below Firestore 1 write/sec/doc limit
      setTimeout(() => {
        saveUserDataToFirestore(nextRequest.uid, nextRequest.data);
      }, 600);
    }
  }
}

// Subscribe to real-time user document updates
export function subscribeUserData(
  uid: string, 
  callback: (data: UserProfileDoc | null) => void,
  onError?: (err: any) => void
) {
  if (!uid || !auth.currentUser || auth.currentUser.uid !== uid) {
    return () => {};
  }
  const path = `users/${uid}`;
  const userRef = doc(db, "users", uid);

  return onSnapshot(
    userRef, 
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as UserProfileDoc);
      } else {
        callback(null);
      }
    },
    (error) => {
      const info = handleFirestoreError(error, OperationType.GET, path);
      if (onError) {
        onError(info);
      }
    }
  );
}

// Auth wrappers
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

export async function getIdToken(): Promise<string | null> {
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken();
}

export async function getAccessToken(): Promise<string | null> {
  if (!auth.currentUser) return null;
  const token = await auth.currentUser.getIdToken();
  return token;
}

export { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile };
export type { User };

