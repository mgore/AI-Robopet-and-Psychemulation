import React, { useState } from "react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  saveUserDataToFirestore
} from "../lib/firebase";
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  AtSign, 
  Sparkles, 
  X, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { NeuralBrainIcon } from "./NeuralBrainIcon";
import { firebaseConfig } from "../lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (uid: string) => void;
  currentDrawer?: unknown[];
  currentRobotType?: string;
  currentCustomGoal?: string;
  currentBudget?: number;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  currentDrawer = [],
  currentRobotType = "mobile_rover",
  currentCustomGoal = "",
  currentBudget = 350
}) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [screenName, setScreenName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const generatedScreenName = user.email ? user.email.split("@")[0] : `builder_${user.uid.slice(0, 5)}`;

      // Save initial or merged profile & hardware selection to Firestore
      await saveUserDataToFirestore(user.uid, {
        uid: user.uid,
        name: user.displayName || name || "AI RoboPet Builder",
        screenName: screenName || generatedScreenName,
        email: user.email || "",
        selectedDrawer: currentDrawer,
        robotType: currentRobotType,
        customGoal: currentCustomGoal,
        budget: currentBudget
      });

      if (onAuthSuccess) onAuthSuccess(user.uid);
      onClose();
    } catch (err: unknown) {
      console.error("Google Auth Error:", err);
      const e = err as any;
      let message = e?.message || "Google sign-in failed. Please try again.";
      if (e?.message && e.message.toLowerCase().includes("app check")) {
        message = `Firebase App Check is enforcing verification. In Firebase Console (project: ${firebaseConfig.projectId}) > Build > App Check, set Identity Toolkit to 'Unenforced' to allow web sign-in.`;
      } else if (e?.code === "auth/configuration-not-found" || (e?.message && e.message.toLowerCase().includes("configuration-not-found"))) {
        message = `Firebase Authentication is not activated yet in your project. Open Firebase Console (project: ${firebaseConfig.projectId}) > Build > Authentication, click 'Get Started', and enable Google & Email/Password under Sign-in method.`;
      } else if (e?.code === "auth/api-key-not-valid" || (e?.message && e.message.toLowerCase().includes("api-key-not-valid"))) {
        message = "Firebase API key is invalid or restricted in Google Cloud Console. Enable Identity Toolkit API or check API restrictions in Google Cloud Console under APIs & Services > Credentials.";
      } else if (e?.code === "auth/popup-blocked") {
        message = "Browser or iframe blocked the Google popup window. Please open the app in a dedicated tab or use Email & Password below.";
      } else if (e?.code === "auth/internal-error") {
        message = "Google popup encountered an internal error. This occurs when 3rd-party cookies/iframe access is blocked by the browser, or when the domain is not yet in Firebase Console > Authentication > Settings > Authorized domains. Please use Email & Password login below or open the app in a dedicated tab.";
      } else if (e?.code === "auth/unauthorized-domain") {
        message = "Domain not yet authorized in Firebase Console (Authentication -> Settings -> Authorized Domains). Use Email/Password login directly in the meantime.";
      } else if (e?.code === "auth/operation-not-allowed") {
        message = "Google sign-in provider is not enabled in the Firebase Console. You can use Email & Password login below.";
      } else if (e?.code === "auth/popup-closed-by-user") {
        message = "Google sign-in popup was closed before completing.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (mode === "signup" && !screenName) {
      setError("Please provide a screen name.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        // Create user
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        // Update Auth profile name
        if (name) {
          await updateProfile(user, { displayName: name });
        }

        // Database basic info + hardware components in Firestore
        await saveUserDataToFirestore(user.uid, {
          uid: user.uid,
          name: name || "AI RoboPet Builder",
          screenName: screenName || email.split("@")[0],
          email: email,
          selectedDrawer: currentDrawer,
          robotType: currentRobotType,
          customGoal: currentCustomGoal,
          budget: currentBudget
        });

        if (onAuthSuccess) onAuthSuccess(user.uid);
        onClose();
      } else {
        // Sign In
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        // Save/update profile and sync hardware components
        await saveUserDataToFirestore(user.uid, {
          uid: user.uid,
          email: user.email || email,
          ...(currentDrawer.length > 0 ? { selectedDrawer: currentDrawer } : {})
        });

        if (onAuthSuccess) onAuthSuccess(user.uid);
        onClose();
      }
    } catch (err: any) {
      console.error("Email Auth Error:", err);
      let msg = err.message || "Authentication failed.";
      if (err.message && err.message.toLowerCase().includes("app check")) {
        msg = `Firebase App Check is enforcing verification. In Firebase Console (project: ${firebaseConfig.projectId}) > Build > App Check, set Identity Toolkit to 'Unenforced' to allow web sign-in.`;
      } else if (err.code === "auth/configuration-not-found" || (err.message && err.message.toLowerCase().includes("configuration-not-found"))) {
        msg = `Firebase Authentication is not activated yet in your project. Open Firebase Console (project: ${firebaseConfig.projectId}) > Build > Authentication, click 'Get Started', and enable Email/Password under Sign-in method.`;
      } else if (err.code === "auth/api-key-not-valid" || (err.message && err.message.toLowerCase().includes("api-key-not-valid"))) {
        msg = "Firebase API key is invalid or restricted in Google Cloud Console. Enable Identity Toolkit API or check API restrictions in Google Cloud Console under APIs & Services > Credentials.";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. If you don't have an account, click 'Create Account'.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists. Try signing in instead.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 p-6 border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800/50 rounded-full hover:bg-slate-800 transition cursor-pointer"
            title="Continue as Guest"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto mb-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/10 p-1">
            <NeuralBrainIcon className="w-full h-full" />
          </div>

          <h2 className="text-xl font-bold font-mono text-white tracking-tight">
            AI ROBOPET SUITE
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Authenticate to sync your hardware drawer & robot specs
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Google Sign In Choice */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold font-mono text-xs rounded-xl shadow-md transition flex items-center justify-center gap-3 cursor-pointer hover:shadow-cyan-500/10 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google Account
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 font-mono text-[10px] text-slate-500 uppercase tracking-widest relative z-10">
              OR EMAIL & PASSWORD
            </span>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(null); }}
              className={`py-2 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                mode === "signin" 
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(null); }}
              className={`py-2 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                mode === "signup" 
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl flex items-start gap-2 text-red-300 font-mono text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {mode === "signup" && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Builder Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); }}
                      placeholder="e.g. Alex Turing"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Screen Name */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Screen Name / Handle *
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required={mode === "signup"}
                      value={screenName}
                      onChange={(e) => { setScreenName(e.target.value); }}
                      placeholder="e.g. cyber_architect"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); }}
                  placeholder="builder@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); }}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-100 font-mono text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-500/10 disabled:opacity-50 mt-4"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {loading 
                ? "Authenticating..." 
                : mode === "signin" 
                  ? "Sign In & Sync Drawer" 
                  : "Register & Database Profile"
              }
            </button>
          </form>

          {/* Iframe tip / Open in new window */}
          <div className="flex flex-col items-center gap-2 pt-1 border-t border-slate-800/80">
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition underline cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open app in dedicated tab
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition underline cursor-pointer"
            >
              Skip for now (Continue in Guest Mode)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
