import { useState, useEffect, useRef, useCallback } from "react";
import { auth, onAuthStateChanged, subscribeUserData, saveUserDataToFirestore, User, UserProfileDoc } from "../lib/firebase";
import { HardwareComponent } from "../types";

export function useAuthSync({
  activeDrawer,
  contingencyList,
  robotType,
  customGoal,
  budget,
  setActiveDrawer,
  setContingencyList,
  setRobotType,
  setCustomGoal,
  setBudget,
}: {
  activeDrawer: HardwareComponent[];
  contingencyList: HardwareComponent[];
  robotType: string;
  customGoal: string;
  budget: number;
  setActiveDrawer: (drawer: HardwareComponent[]) => void;
  setContingencyList: (list: HardwareComponent[]) => void;
  setRobotType: (type: any) => void;
  setCustomGoal: (goal: string) => void;
  setBudget: (budget: number) => void;
}) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserProfileDoc | null>(null);
  const [initialAuthChecked, setInitialAuthChecked] = useState(false);
  
  const isRemoteUpdateRef = useRef(false);
  const lastSyncedHashRef = useRef("");
  const syncDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }

      if (user) {
        unsubDoc = subscribeUserData(user.uid, (docData) => {
          if (docData) {
            setUserDoc(docData);
            isRemoteUpdateRef.current = true;
            lastSyncedHashRef.current = JSON.stringify({
              selectedDrawer: docData.selectedDrawer || [],
              contingencyDrawer: docData.contingencyDrawer || [],
              robotType: docData.robotType || "",
              customGoal: docData.customGoal || "",
              budget: typeof docData.budget === "number" ? docData.budget : null
            });

            if (docData.selectedDrawer && Array.isArray(docData.selectedDrawer) && docData.selectedDrawer.length > 0) {
              setActiveDrawer(docData.selectedDrawer);
            }
            if (docData.contingencyDrawer && Array.isArray(docData.contingencyDrawer)) {
              setContingencyList(docData.contingencyDrawer);
            }
            if (docData.robotType) setRobotType(docData.robotType as any);
            if (docData.customGoal) setCustomGoal(docData.customGoal);
            if (typeof docData.budget === "number") setBudget(docData.budget);
          }
        });
      } else {
        setUserDoc(null);
        lastSyncedHashRef.current = "";
      }
      setInitialAuthChecked(true);
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
      if (syncDebounceTimerRef.current) clearTimeout(syncDebounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!authUser || !initialAuthChecked) return;

    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    const currentHash = JSON.stringify({
      selectedDrawer: activeDrawer || [],
      contingencyDrawer: contingencyList || [],
      robotType: robotType || "",
      customGoal: customGoal || "",
      budget: typeof budget === "number" ? budget : null
    });

    if (currentHash === lastSyncedHashRef.current) return;

    if (syncDebounceTimerRef.current) clearTimeout(syncDebounceTimerRef.current);

    syncDebounceTimerRef.current = setTimeout(() => {
      lastSyncedHashRef.current = currentHash;
      saveUserDataToFirestore(authUser.uid, {
        uid: authUser.uid,
        selectedDrawer: activeDrawer,
        contingencyDrawer: contingencyList,
        robotType,
        customGoal,
        budget
      }).catch((err) => {
        console.warn("Auto sync to Firestore deferred:", err);
      });
    }, 1200);

    return () => {
      if (syncDebounceTimerRef.current) clearTimeout(syncDebounceTimerRef.current);
    };
  }, [activeDrawer, contingencyList, robotType, customGoal, budget, authUser, initialAuthChecked]);

  return { authUser, userDoc };
}
