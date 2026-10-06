import React from "react";
import { HardwareComponent } from "../types";

interface PhaseStepperProps {
  currentPhase: number;
  setCurrentPhase: (phase: number) => void;
  robotType: string;
  activeDrawer: HardwareComponent[];
  grandTotalCost: number;
  budget: number;
}

export const PhaseStepper: React.FC<PhaseStepperProps> = ({
  currentPhase,
  setCurrentPhase,
  robotType,
  activeDrawer,
  grandTotalCost,
  budget
}) => {
  const handleStepClick = (phase: number) => {
    setCurrentPhase(phase);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5 sticky top-14 z-35 shadow-md">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full md:w-auto">
          {/* Step 1 */}
          <button
            onClick={() => { handleStepClick(1); }}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-mono cursor-pointer ${
              currentPhase === 1
                ? "bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] font-bold ring-1 ring-cyan-500/50"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentPhase === 1 ? "bg-cyan-400 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}
            >
              01
            </span>
            <div className="text-left hidden sm:flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider">Phase 1</span>
              <span className="text-[10px] text-slate-400 font-sans">Mission &amp; Budget</span>
            </div>
            <span className="sm:hidden font-bold">1. Goal</span>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => { handleStepClick(2); }}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-mono cursor-pointer ${
              currentPhase === 2
                ? "bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] font-bold ring-1 ring-emerald-500/50"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentPhase === 2 ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}
            >
              02
            </span>
            <div className="text-left hidden sm:flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider">Phase 2</span>
              <span className="text-[10px] text-slate-400 font-sans">BOM &amp; Sourcing</span>
            </div>
            <span className="sm:hidden font-bold">2. BOM</span>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => { handleStepClick(3); }}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-mono cursor-pointer ${
              currentPhase === 3
                ? "bg-violet-950/80 border-violet-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)] font-bold ring-1 ring-violet-500/50"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentPhase === 3 ? "bg-violet-400 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}
            >
              03
            </span>
            <div className="text-left hidden sm:flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider">Phase 3</span>
              <span className="text-[10px] text-slate-400 font-sans">Engineering Lab</span>
            </div>
            <span className="sm:hidden font-bold">3. Lab</span>
          </button>

          {/* Step 4 */}
          <button
            onClick={() => { handleStepClick(4); }}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-mono cursor-pointer ${
              currentPhase === 4
                ? "bg-pink-950/80 border-pink-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.25)] font-bold ring-1 ring-pink-500/50"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentPhase === 4 ? "bg-pink-400 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}
            >
              04
            </span>
            <div className="text-left hidden sm:flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider">Phase 4</span>
              <span className="text-[10px] text-slate-400 font-sans">Community Commons</span>
            </div>
            <span className="sm:hidden font-bold">4. Commons</span>
          </button>
        </div>

        {/* Quick Project Summary Pill */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs text-slate-300 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[10px] uppercase">Archetype:</span>
            <strong className="text-cyan-400 font-bold capitalize">{robotType.replace("_", " ")}</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[10px] uppercase">BOM:</span>
            <strong className="text-emerald-400 font-bold">{activeDrawer.length} parts</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[10px] uppercase">Cost:</span>
            <strong className={grandTotalCost <= budget ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              ${grandTotalCost} / ${budget}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
