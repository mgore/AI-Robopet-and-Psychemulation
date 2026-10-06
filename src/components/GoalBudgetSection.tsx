import React from "react";
import { 
  Sparkles, 
  Clock, 
  HelpCircle, 
  Cpu, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Layers, 
  TrendingUp,
  CreditCard,
  PieChart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GoalBudgetSectionProps {
  robotType: "wheeled_rover" | "robotic_arm" | "hexapod";
  setRobotType: (type: "wheeled_rover" | "robotic_arm" | "hexapod") => void;
  customGoal: string;
  setCustomGoal: (goal: string) => void;
  budget: number;
  setBudget: (budget: number) => void;
  grandTotalCost: number;
  baseHardwareCost: number;
  sourcingLoading: boolean;
  runAISourcing: () => void;
  aiBOMResult: unknown | null;
  setAiBOMResult: (res: unknown | null) => void;
  importAIBOM: () => void;
  getComponentThumbnail: (item: unknown) => string;
  onOpenGlossary: (term?: string) => void;
}

export const GoalBudgetSection: React.FC<GoalBudgetSectionProps> = ({
  robotType,
  setRobotType,
  customGoal,
  setCustomGoal,
  budget,
  setBudget,
  grandTotalCost,
  baseHardwareCost,
  sourcingLoading,
  runAISourcing,
  aiBOMResult,
  setAiBOMResult,
  importAIBOM,
  getComponentThumbnail,
  onOpenGlossary,
}) => {
  // Allowable expenditure calculations
  const remainingExpenditure = budget - grandTotalCost;
  const isUnderBudget = grandTotalCost <= budget;
  const expenditurePercentage = Math.min(100, Math.round((grandTotalCost / (budget || 1)) * 100));
  const overheadCost = Math.max(0, grandTotalCost - baseHardwareCost);

  return (
    <div id="section-goal-budget" className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col gap-6">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="text-xs bg-cyan-500/20 text-cyan-400 font-mono w-7 h-7 rounded-full flex items-center justify-center font-bold border border-cyan-500/40">
            1
          </span>
          <div>
            <h2 className="text-sm font-bold tracking-widest text-white uppercase font-mono">
              Mission Scope & Target Budget
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Define robotic archetype, formulate operational goals, and set the target investment cap.
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenGlossary("Microcontroller")}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:underline bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 transition"
          title="Open Tech Glossary for Robotic Architectures"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Architecture Guide</span>
        </button>
      </div>

      {/* 1. ROBOT ARCHETYPE SELECTION */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Select Robotic Archetype</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { 
              id: "wheeled_rover", 
              label: "Wheeled Rover", 
              desc: "Differential drive, SLAM navigation, and all-terrain wheeled traversal.",
              examples: "e.g., Delivery bot, lunar explorer, warehouse AGV"
            },
            { 
              id: "robotic_arm", 
              label: "Robotic Arm", 
              desc: "Multi-axis inverse kinematics, end-effector gripping, and sorting automation.",
              examples: "e.g., Pick-and-place sorter, welding arm, 3D printing gantry"
            },
            { 
              id: "hexapod", 
              label: "Android or Biomimetic", 
              desc: "Bipedal gait control, walking quadruped / spider kinematics, and expressive animatronics.",
              examples: "e.g., Humanoid walker, RoboDog quad, pet companion"
            }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setRobotType(t.id as unknown)}
              className={`p-3.5 rounded-xl border flex flex-col items-start sm:items-center text-left sm:text-center gap-1.5 transition-all cursor-pointer ${
                robotType === t.id
                  ? "bg-cyan-950/50 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/40"
                  : "bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <span className="text-xs font-bold font-mono text-cyan-300">{t.label}</span>
              <span className="text-[11px] text-slate-300 leading-snug">{t.desc}</span>
              <span className="text-[10px] text-slate-500 italic mt-0.5">{t.examples}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. CORE ROBOT OBJECTIVES (NATURAL LANGUAGE) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Autonomous Objectives & Mission Goals:
          </label>
          <span className="text-[10px] text-slate-500 font-mono">Guides Gemini AI BOM Synthesis</span>
        </div>
        <textarea
          value={customGoal}
          onChange={(e) => setCustomGoal(e.target.value)}
          placeholder="Describe your desired robot mission, sensing requirements, target payload, terrain, or edge ML capabilities (e.g., 'Autonomous lunar exploration rover with edge ML obstacle detection and RPLiDAR 360 map building')..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 h-24 resize-none font-sans leading-relaxed shadow-inner"
        />
      </div>

      {/* 3. TARGET BUDGET & ALLOWABLE EXPENDITURE LEDGER */}
      <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-4 sm:p-5 flex flex-col gap-4 shadow-inner">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Target Budget Calibration
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Selected Cap:</span>
            <span className="text-emerald-400 font-bold text-sm sm:text-base bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/50">
              ${budget} USD
            </span>
          </div>
        </div>

        {/* Target Budget Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Nominal Budget Limit:</span>
            <span className="text-cyan-400 font-bold">${budget} USD</span>
          </div>
          <input
            type="range"
            min="50"
            max="600"
            step="10"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-600">
            <span>$50 (Educational / Micro)</span>
            <span>$300 (Standard Mid-Tier)</span>
            <span>$600 (High-Spec Compute & LiDAR)</span>
          </div>
        </div>

        {/* Allowable Expenditure Alignment Ledger Card */}
        <div className="pt-2 border-t border-slate-850 flex flex-col gap-3">
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 text-xs font-mono">
            {/* Header / Metric Row */}
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2 font-bold">
                <PieChart className="w-4 h-4 text-cyan-400" />
                <span>Expenditure Formulation:</span>
              </span>
              <span className="font-bold text-white text-sm">
                ${grandTotalCost} <span className="text-slate-400 font-normal">/ ${budget} USD</span>
              </span>
            </div>

            {/* Expenditure Progress Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isUnderBudget
                      ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                      : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  }`}
                  style={{ width: `${Math.min(100, (grandTotalCost / (budget || 1)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>$0</span>
                <span className="text-slate-400 font-bold">
                  {expenditurePercentage}% of budget allocated
                </span>
                <span>${budget} Cap</span>
              </div>
            </div>

            {/* Breakdown Subtotals */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-850 text-xs">
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-850 flex flex-col">
                <span className="text-slate-500 uppercase tracking-wider text-[9px]">Hardware BOM</span>
                <strong className="text-slate-200 mt-0.5">${baseHardwareCost}.00</strong>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-850 flex flex-col">
                <span className="text-slate-500 uppercase tracking-wider text-[9px]">Overhead & Ship</span>
                <strong className="text-slate-200 mt-0.5">${overheadCost}.00</strong>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-850 flex flex-col">
                <span className="text-slate-500 uppercase tracking-wider text-[9px]">Remaining Balance</span>
                <strong className={`mt-0.5 ${isUnderBudget ? "text-emerald-400" : "text-rose-400"}`}>
                  {isUnderBudget ? `+$${remainingExpenditure}.00` : `-$${Math.abs(remainingExpenditure)}.00`}
                </strong>
              </div>
            </div>

            {/* Status explanation */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">Budget Status:</span>
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  isUnderBudget ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isUnderBudget ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Under Target Budget (${remainingExpenditure} reserve)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Exceeds Budget by ${Math.abs(remainingExpenditure)} USD</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* AI SOURCING TRIGGER BUTTON */}
        <button
          onClick={runAISourcing}
          disabled={sourcingLoading}
          className="w-full h-12 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold font-mono tracking-wider hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all uppercase disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-800 border-0 flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          {sourcingLoading ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Architect Synthesizing Solution...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI BOM for Target Budget</span>
            </>
          )}
        </button>
      </div>

      {/* AI RECOMMENDATION FLYOUT */}
      <AnimatePresence>
        {aiBOMResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-950 rounded-xl border border-cyan-800/60 overflow-hidden"
          >
            <div className="bg-cyan-950/40 px-4 py-3 border-b border-cyan-800/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-bold text-cyan-300 font-mono tracking-widest uppercase">
                  AI Architecture Recommendation
                </span>
              </div>
              <button
                onClick={() => setAiBOMResult(null)}
                className="text-xs text-slate-500 hover:text-white font-mono cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3.5 text-xs">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col gap-1">
                <span className="text-slate-400 font-mono">Recommended Controller:</span>
                <strong className="text-white text-sm flex items-center gap-1.5 font-mono">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  {aiBOMResult.recommendedMicrocontroller?.name || "Recommended MCU"}
                </strong>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  {aiBOMResult.recommendedMicrocontroller?.reason}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-slate-400">Proposed Parts Matrix:</span>
                <div className="max-h-40 overflow-y-auto border border-slate-800 bg-slate-900/40 rounded-lg divide-y divide-slate-800/80 pr-1">
                  {aiBOMResult.partsList?.map((part: any, i: number) => (
                    <div key={i} className="p-2.5 flex justify-between items-center text-xs hover:bg-slate-800/40 transition gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getComponentThumbnail(part)}
                          alt={part.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover border border-slate-800 shrink-0 bg-slate-900"
                        />
                        <div>
                          <div className="font-semibold text-slate-200">{part.name}</div>
                          <div className="text-[10px] text-cyan-400 font-mono">{part.category} • {part.specs}</div>
                        </div>
                      </div>
                      <span className="font-mono text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                        ${part.estimatedPriceUSD}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-cyan-950/30 rounded-lg border border-cyan-900/40 font-mono">
                <div>
                  <div className="text-slate-400 text-[10px]">Total Est. Cost:</div>
                  <div className="text-white font-bold text-base">${aiBOMResult.totalEstimatedCostUSD} USD</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">Software Stack:</div>
                  <div className="text-cyan-400 font-bold text-xs">{aiBOMResult.softwareFramework}</div>
                </div>
              </div>

              <button
                onClick={importAIBOM}
                className="w-full h-10 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg font-mono text-xs font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Load AI Parts into BOM Drawer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
