import React from "react";
import {
  BookOpen,
  Heart,
  Building2,
  Github
} from "lucide-react";
import { UserProfileBadge } from "./UserProfileBadge";
import { UserProfileDoc } from "../lib/firebase";
import { NeuralBrainIcon } from "./NeuralBrainIcon";

interface NavigationHeaderProps {
  paypalLink: string;
  onOpenGlossary: () => void;
  onOpenVendorDirectory?: () => void;
  onOpenGithubWorkflow?: () => void;
  userDoc: UserProfileDoc | null;
  onOpenAuthModal: () => void;
  triggerNotification: (msg: string) => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  paypalLink,
  onOpenGlossary,
  onOpenVendorDirectory,
  onOpenGithubWorkflow,
  userDoc,
  onOpenAuthModal,
  triggerNotification
}) => {
  return (
    <header className="min-h-16 py-2 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 md:px-6 sticky top-0 z-50 flex flex-wrap justify-between items-center gap-2 sm:gap-4 shadow-xl max-w-full overflow-hidden">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20 overflow-hidden border border-cyan-500/40">
          <NeuralBrainIcon className="w-full h-full" />
        </div>
        <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white uppercase font-display whitespace-nowrap">
          AI <span className="text-[#a855f7]">ROBOPET</span>
        </h1>
      </div>

      {/* Global Tech Help Glossary, Vendors Hub, Presets Loader & User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-end">
        {/* Authorized Vendors Directory Button */}
        {onOpenVendorDirectory && (
          <button
            onClick={onOpenVendorDirectory}
            className="px-2.5 sm:px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/80 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-emerald-500/10 shrink-0"
            title="Open Authorized Hardware Vendors & Distributor Links Directory"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Authorized Vendors</span>
            <span className="sm:hidden">Vendors</span>
          </button>
        )}

        {/* Tech Glossary & Help Guide Button */}
        <button
          onClick={onOpenGlossary}
          className="px-2.5 sm:px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/80 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-indigo-500/10 shrink-0"
          title="Open Robotics Tech Glossary & Tech Focus Guide"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="hidden sm:inline">Tech Glossary</span>
          <span className="sm:hidden">Help</span>
        </button>

        {/* Direct Support PayPal Button */}
        <a
          id="header-support-btn"
          href={paypalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 sm:px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/80 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-rose-500/10 shrink-0"
          title="Support AI RoboPet via PayPal"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/30 shrink-0" />
          <span>Support</span>
        </a>

        {/* User Profile Badge / Auth Button */}
        <UserProfileBadge
          userDoc={userDoc}
          onOpenAuthModal={onOpenAuthModal}
          triggerNotification={triggerNotification}
        />
      </div>
    </header>
  );
};
