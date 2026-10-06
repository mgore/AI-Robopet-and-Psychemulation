import React, { useState } from "react";
import {
  Brain,
  Sliders,
  Play,
  Clock,
  Terminal,
  Sparkles,
  Layers,
  Cpu
} from "lucide-react";
import { LLMResult } from "../../types";
import { NeuralTrainingSearch } from "../NeuralTrainingSearch";

interface LLMBrainTabProps {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  userCommand: string;
  setUserCommand: (cmd: string) => void;
  llmLoading: boolean;
  playingAnimation: boolean;
  llmResult: LLMResult | null;
  currentActionIndex: number;
  actionProgress: number;
  onRunBrainSimulation: () => void;
  onStartAnimation: () => void;
  activeRobotType?: string;
  activeMCU?: { name: string; voltage: string };
}

export const LLMBrainTab: React.FC<LLMBrainTabProps> = ({
  systemPrompt,
  setSystemPrompt,
  userCommand,
  setUserCommand,
  llmLoading,
  playingAnimation,
  llmResult,
  currentActionIndex,
  actionProgress,
  onRunBrainSimulation,
  onStartAnimation,
  activeRobotType = "Autonomous Wheeled Rover",
  activeMCU
}) => {
  const [activeSubMode, setActiveSubMode] = useState<"simulation" | "neural_search">("simulation");

  return (
    <div className="flex flex-col gap-4">
      {/* SUB-TAB NAVIGATOR: LLM REASONING VS NEURAL TRAINING QUERY */}
      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-md">
        <button
          onClick={() => { setActiveSubMode("simulation"); }}
          className={`flex-1 py-2.5 px-3 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubMode === "simulation"
              ? "bg-violet-950 text-violet-300 border border-violet-700/80 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Brain className="w-4 h-4 text-violet-400" />
          <span>LLM Autonomous Agent Simulation</span>
        </button>

        <button
          onClick={() => { setActiveSubMode("neural_search"); }}
          className={`flex-1 py-2.5 px-3 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubMode === "neural_search"
              ? "bg-violet-950 text-violet-300 border border-violet-700/80 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>AI Neural Training &amp; Edge Model Search</span>
        </button>
      </div>

      {/* VIEW 1: SEPARATED NEURAL TRAINING QUERY ENGINE */}
      {activeSubMode === "neural_search" ? (
        <NeuralTrainingSearch
          activeRobotType={activeRobotType}
          activeMCU={activeMCU}
        />
      ) : (
        /* VIEW 2: AUTONOMOUS LLM BRAIN SIMULATION */
        <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-6 shadow-2xl flex flex-col gap-5">
          <div className="pb-3 border-b border-slate-800/60">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Brain className="w-5 h-5 text-violet-400" />
              Large Language Model (LLM) Brain Simulation
            </h3>
            <p className="text-xs text-slate-400">
              Configure parameters, issue commands, and view real-time logical reasoning steps mapped to physical hardware actuators.
            </p>
          </div>

          {/* Persona and Parameters */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-900 text-xs font-semibold text-slate-200 font-mono">
              <Sliders className="w-4 h-4 text-violet-400" />
              RoboMind Brain Parameters
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-slate-500 font-mono">System Instructions (Autonomous Persona / Safety Boundaries):</label>
              <input
                type="text"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded p-2.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>
          </div>

          {/* Natural language trigger command bar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-mono">Issue Natural Language Robotic Command:</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={userCommand}
                onChange={(e) => setUserCommand(e.target.value)}
                placeholder="e.g., Scan around, grab object if ToF is close, and sound buzzer..."
                className="flex-1 bg-slate-950 border border-slate-850 rounded px-3.5 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 font-mono"
              />
              <button
                onClick={onRunBrainSimulation}
                disabled={llmLoading || playingAnimation}
                className="w-full sm:w-auto px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold font-mono text-xs rounded hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] border-0 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                {llmLoading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Execute Brain
                  </>
                )}
              </button>
            </div>

            {/* Command Presets */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[
                "Sweep area scan and warn obstacles",
                "Go forward slowly to check ultrasonic path",
                "Grasp object using robotic hand claw",
                "Breathe LED safety alert light"
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setUserCommand(preset)}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded text-[10px] font-mono text-violet-400 transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Loading overlay */}
          {llmLoading && (
            <div className="p-16 flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-slate-900"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin"></div>
              </div>
              <div className="text-xs text-slate-300 font-mono tracking-wide">
                RoboPet Neural Reasoning in Progress...
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Synthesizing sensory readings and compiling motor command sequences.
              </div>
            </div>
          )}

          {/* Execution Result Area */}
          {llmResult && !llmLoading && (
            <div className="flex flex-col gap-4">
              {/* Inner monologue thoughts */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-900 pb-2">
                  <span className="flex items-center gap-1 text-violet-400 font-bold">
                    <Terminal className="w-4 h-4" />
                    Brain Cognitive Monologue
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">Step 1: Deliberation</span>
                </div>
                <div className="text-xs text-slate-300 italic whitespace-pre-line leading-relaxed font-mono">
                  "{llmResult.innerThoughts}"
                </div>
              </div>

              {/* Robot Speech / Audio Feedback */}
              {llmResult.robotSpeech && (
                <div className="p-3 bg-violet-950/30 rounded border border-violet-900/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-900/40 text-violet-300 flex items-center justify-center text-xs font-bold shrink-0">
                    🗣️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-violet-400 font-bold">
                      Robot Audio Feedback:
                    </div>
                    <div className="text-xs font-medium text-slate-200 truncate">
                      "{llmResult.robotSpeech}"
                    </div>
                  </div>
                </div>
              )}

              {/* Physical Actuator Action Sequences */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                    Hardware Action Plan ({llmResult.actionSequence.length} Steps)
                  </span>
                  <button
                    onClick={onStartAnimation}
                    disabled={playingAnimation}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 disabled:text-slate-600 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Replay Physical Actions
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {llmResult.actionSequence.map((act, i) => {
                    const isCurrent = playingAnimation && currentActionIndex === i;
                    const isDone = playingAnimation && currentActionIndex > i;

                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                          isCurrent
                            ? "bg-violet-950/40 border-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                            : isDone
                            ? "bg-slate-950 border-slate-900 opacity-60"
                            : "bg-slate-950 border-slate-850"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                              isCurrent
                                ? "bg-violet-600 text-white animate-pulse"
                                : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-200 font-mono flex items-center gap-2">
                              <span>{act.action}</span>
                              <span className="text-[10px] text-cyan-400 font-normal">
                                Target: {act.device}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                          <div className="text-right">
                            <span className="font-mono text-white text-[11px] font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                              {act.parameters}
                            </span>
                            <div className="text-[9px] text-slate-500 font-mono">{act.durationSeconds}s duration</div>
                          </div>

                          {/* Progress bar for running action */}
                          {isCurrent && (
                            <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                              <div
                                className="bg-violet-500 h-full transition-all duration-75"
                                style={{ width: `${actionProgress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Decision Autonomy Breakdown */}
              <div className="p-4 bg-violet-950/20 rounded border border-violet-900/30 text-xs">
                <span className="text-[10px] text-violet-400 font-mono uppercase tracking-wider block mb-1">
                  Decision Autonomy Breakdown:
                </span>
                <p className="text-slate-400 leading-relaxed text-[11px] whitespace-pre-line font-mono">
                  {llmResult.explanationOfAutonomy}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
