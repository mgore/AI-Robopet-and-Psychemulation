import React, { useState } from "react";
import { UserProfileDoc, signOut, auth, saveUserDataToFirestore, googleProvider, signInWithPopup } from "../lib/firebase";
import { 
  User as UserIcon, 
  LogOut, 
  AtSign, 
  CheckCircle2, 
  Edit3, 
  X,
  Database,
  Mail
} from "lucide-react";

interface UserProfileBadgeProps {
  userDoc: UserProfileDoc | null;
  onOpenAuthModal: () => void;
  triggerNotification?: (msg: string) => void;
}

export const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({
  userDoc,
  onOpenAuthModal,
  triggerNotification
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editScreenName, setEditScreenName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const generatedScreenName = user.email ? user.email.split("@")[0] : `builder_${user.uid.slice(0, 5)}`;
      await saveUserDataToFirestore(user.uid, {
        uid: user.uid,
        name: user.displayName || "AI RoboPet Builder",
        screenName: generatedScreenName,
        email: user.email || ""
      });
      if (triggerNotification) triggerNotification("Signed in with Google account!");
    } catch (err: unknown) {
      console.error("Google Sign-In Error:", err);
      const e = err as any;
      onOpenAuthModal();
      if (triggerNotification) {
        if (e?.code === "auth/configuration-not-found" || (e?.message && e.message.toLowerCase().includes("configuration-not-found"))) {
          triggerNotification("Firebase Auth not activated. See login dialog for setup steps.");
        } else if (e?.code === "auth/api-key-not-valid" || (e?.message && e.message.toLowerCase().includes("api-key-not-valid"))) {
          triggerNotification("Firebase API key error. See login dialog for details.");
        } else if (e?.code === "auth/popup-blocked") {
          triggerNotification("Popup window blocked. Please sign in via the dialog.");
        } else if (e?.code !== "auth/popup-closed-by-user") {
          triggerNotification("Please sign in with Email or Google in the dialog.");
        }
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (triggerNotification) triggerNotification("Signed out successfully.");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleOpenEdit = () => {
    if (userDoc) {
      setEditName(userDoc.name || "");
      setEditScreenName(userDoc.screenName || "");
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDoc) return;

    setIsSaving(true);
    try {
      await saveUserDataToFirestore(userDoc.uid, {
        uid: userDoc.uid,
        name: editName,
        screenName: editScreenName
      });
      if (triggerNotification) triggerNotification("User profile updated in Firestore!");
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!userDoc) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Google Play Standard Sign in with Google Button */}
        <button
          id="header-google-signin-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleSigningIn}
          className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-sans font-medium transition flex items-center gap-2 cursor-pointer shadow-sm hover:shadow disabled:opacity-50 shrink-0"
          title="Sign in with Google (Standard Google Play Account)"
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
          <span className="hidden sm:inline">Sign in with Google</span>
          <span className="sm:hidden">Google</span>
        </button>

        {/* Standard Email Login Button */}
        <button
          id="header-email-signin-btn"
          type="button"
          onClick={onOpenAuthModal}
          className="px-2.5 sm:px-3 py-1.5 bg-slate-800/90 hover:bg-slate-750 active:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:text-cyan-300 shrink-0"
          title="Sign in with Email and Password"
        >
          <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline">Email Login</span>
          <span className="sm:hidden">Email</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 pr-2.5 rounded-xl font-mono shadow-md">
        
        {/* User avatar circle */}
        <div 
          onClick={handleOpenEdit}
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm"
          title="Click to edit profile"
        >
          {userDoc.name ? userDoc.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* User info labels */}
        <div className="flex flex-col text-left leading-tight max-w-[140px] md:max-w-[200px]">
          <span className="font-bold text-slate-200 text-xs truncate">{userDoc.name || "Builder"}</span>
          <span className="text-[10px] text-cyan-400 font-semibold truncate">@{userDoc.screenName || "handle"}</span>
        </div>

        {/* Database Sync indicator badge */}
        <div 
          className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-[9px] font-bold shrink-0"
          title="Profile and Hardware selection real-time database active"
        >
          <Database className="w-2.5 h-2.5 text-emerald-400" />
          <span>Synced</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <button
            onClick={handleOpenEdit}
            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition cursor-pointer"
            title="Edit Profile"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={handleSignOut}
            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 font-mono">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                Edit Builder Profile
              </h3>
              <button
                onClick={() => { setShowEditModal(false); }}
                className="p-1 text-slate-400 hover:text-white rounded-full bg-slate-800/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Screen Name / Handle
                </label>
                <div className="relative">
                  <AtSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={editScreenName}
                    onChange={(e) => { setEditScreenName(e.target.value); }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-100 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
