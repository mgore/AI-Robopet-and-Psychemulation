import React from "react";
import {
  MonitorPlay,
  Clock,
  Terminal,
  Copy,
  FileCode
} from "lucide-react";
import { HardwareComponent } from "../../types";
import { SimulationReport } from "../../services/simulationService";

interface PhysicsSimulationTabProps {
  selectedSimulator: "gazebo" | "coppelia";
  setSelectedSimulator: (sim: "gazebo" | "coppelia") => void;
  simGenerating: boolean;
  simReport: SimulationReport | null;
  onGenerateSimulation: () => void;
  onCopy: (text: string, label?: string) => void;
  activeDrawer: HardwareComponent[];
}

export const PhysicsSimulationTab: React.FC<PhysicsSimulationTabProps> = ({
  selectedSimulator,
  setSelectedSimulator,
  simGenerating,
  simReport,
  onGenerateSimulation,
  onCopy,
  activeDrawer
}) => {
  return (
    <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-6 shadow-2xl flex flex-col gap-5">
      <div className="pb-3 border-b border-slate-800/60">
        <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
          <MonitorPlay className="w-5 h-5 text-sky-400" />
          Virtual Integration Physics Simulator Lab
        </h3>
        <p className="text-xs text-slate-400">
          Test robot models, coordinate transformations, sensor layouts, and LLM behavior in physics-backed virtual sandboxes before procurement.
        </p>
      </div>

      {/* Selector cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedSimulator("gazebo")}
          className={`p-4 rounded border flex flex-col gap-2 text-left cursor-pointer transition ${
            selectedSimulator === "gazebo"
              ? "bg-sky-950/25 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.1)] text-white"
              : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-400"
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <span className="font-bold font-mono text-xs uppercase tracking-wider text-sky-400">
              Gazebo Physics (ROS 2)
            </span>
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                selectedSimulator === "gazebo" ? "border-sky-400 bg-sky-500/10 text-sky-400" : "border-slate-700"
              }`}
            >
              {selectedSimulator === "gazebo" && "✓"}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            The industry standard simulator for Robot Operating System (ROS 2). Features complete rigid body physics dynamics, contact point forces, sensor simulation, and direct ROS topic bridging.
          </p>
        </button>

        <button
          onClick={() => setSelectedSimulator("coppelia")}
          className={`p-4 rounded border flex flex-col gap-2 text-left cursor-pointer transition ${
            selectedSimulator === "coppelia"
              ? "bg-sky-950/25 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.1)] text-white"
              : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-400"
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <span className="font-bold font-mono text-xs uppercase tracking-wider text-sky-400">
              CoppeliaSim Virtual Scene
            </span>
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                selectedSimulator === "coppelia" ? "border-sky-400 bg-sky-500/10 text-sky-400" : "border-slate-700"
              }`}
            >
              {selectedSimulator === "coppelia" && "✓"}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            An exceptionally fast, lightweight scenes-based editor formerly called V-REP. Supports native kinematic calculations, Lua/Python child script controllers, and direct API server binding.
          </p>
        </button>
      </div>

      {/* Generate Trigger */}
      <div className="flex justify-center py-2">
        <button
          onClick={onGenerateSimulation}
          disabled={simGenerating}
          className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-950/40 text-white rounded font-bold font-mono text-xs transition flex items-center justify-center gap-2 cursor-pointer border-0 shadow-[0_0_15px_rgba(14,165,233,0.2)] hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]"
        >
          {simGenerating ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              COMPUTING CAD URDF VERTICES...
            </>
          ) : (
            <>
              <MonitorPlay className="w-4 h-4" />
              GENERATE SIMULATION ENVIRONMENT
            </>
          )}
        </button>
      </div>

      {/* Sim reports */}
      {simGenerating && (
        <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-900"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-sky-400 animate-spin"></div>
          </div>
          <div className="flex flex-col gap-1 animate-pulse">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
              Compiling Inertial Tensors & Joint Transforms
            </span>
            <span className="text-slate-500 text-[10px] font-mono">
              Mapping component list: {activeDrawer.map((p) => p.name).join(", ")}
            </span>
          </div>
        </div>
      )}

      {simReport && !simGenerating && (
        <div className="flex flex-col gap-5">
          {/* Workspace config */}
          <div className="bg-slate-950 border border-slate-850 rounded flex flex-col">
            <div className="bg-slate-900/60 px-4 py-2.5 border-b border-slate-850 flex justify-between items-center text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-sky-400">
                <Terminal className="w-4 h-4" />
                Workspace Setup Script
              </span>
              <button
                onClick={() => onCopy(simReport.workspaceSetup, "Setup script")}
                className="p-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 whitespace-pre leading-relaxed">
              {simReport.workspaceSetup}
            </div>
          </div>

          {/* Core model config */}
          <div className="bg-slate-950 border border-slate-850 rounded flex flex-col">
            <div className="bg-slate-900/60 px-4 py-2.5 border-b border-slate-850 flex justify-between items-center text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-sky-400">
                <FileCode className="w-4 h-4" />
                {selectedSimulator === "gazebo"
                  ? "URDF Physical Robot Joint Model (urdf/robot.urdf)"
                  : "CoppeliaSim Autonomous Child Script"}
              </span>
              <button
                onClick={() => onCopy(simReport.urdfCode || simReport.luaScript || "", "Code block")}
                className="p-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-400 whitespace-pre leading-relaxed max-h-96">
              {selectedSimulator === "gazebo" ? simReport.urdfCode : simReport.luaScript}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-sky-950/15 border border-sky-900/30 rounded text-xs flex flex-col gap-2">
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold">
              Launch & Simulation Execution Steps:
            </span>
            <p className="text-slate-300 leading-relaxed font-mono whitespace-pre-line text-[11px]">
              {simReport.instructions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
