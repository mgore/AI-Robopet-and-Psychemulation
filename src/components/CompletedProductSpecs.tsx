import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lightbulb,
  FileCode,
  ChevronDown,
  ChevronUp,
  Wrench,
  ArrowRight,
  AlertTriangle,
  Download,
  ExternalLink
} from "lucide-react";

interface CompletedProductSpecsProps {
  robotType: string;
  blueprintOpen: boolean;
  setBlueprintOpen: (open: boolean) => void;
  finishedOpen: boolean;
  setFinishedOpen: (open: boolean) => void;
  onBackToPhase2: () => void;
  onRunDiagnostics: () => void;
  diagnosticLoading: boolean;
  onExportPDF: () => void;
  onProceedToPhase4: () => void;
}

export const CompletedProductSpecs: React.FC<CompletedProductSpecsProps> = ({
  robotType,
  blueprintOpen,
  setBlueprintOpen,
  finishedOpen,
  setFinishedOpen,
  onBackToPhase2,
  onRunDiagnostics,
  diagnosticLoading,
  onExportPDF,
  onProceedToPhase4
}) => {
  return (
    <div className="xl:col-span-12 mt-4 bg-slate-900/20 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-6">
      <div className="pb-3 border-b border-slate-800/60">
        <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Completed Product Schematics & Hardware References
        </h3>
        <p className="text-xs text-slate-400">
          Review other CAD drafts and physical builds for{" "}
          <span className="text-cyan-400 font-bold uppercase font-mono">
            {robotType.replace("_", " ")}
          </span>{" "}
          to guide assembly calibration and housing parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DROPDOWN 1: COMPLETED PRODUCTS BLUEPRINT / CAD SCHEMATIC */}
        <div className="bg-slate-950 border border-slate-850 rounded-lg overflow-hidden flex flex-col">
          <button
            onClick={() => setBlueprintOpen(!blueprintOpen)}
            className="w-full px-5 py-4 bg-slate-900/40 hover:bg-slate-900/80 transition flex items-center justify-between font-mono text-xs font-bold text-slate-200 border-b border-slate-850 cursor-pointer border-0"
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
                <FileCode className="w-4 h-4 text-cyan-400" />
                CAD Engineering Blueprint Schematics
              </span>
              <a
                href={robotType === 'wheeled_rover' ? "https://grabcad.com/library/wheeled-rover-1" : "https://github.com/topics/robotics"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-500 hover:text-cyan-400 transition"
                title="View CAD resources online"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <span className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
              {blueprintOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>

          <AnimatePresence>
            {blueprintOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-5 flex flex-col gap-4">
                  {/* Image Frame */}
                  <div className="relative border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50 aspect-video">
                    <img
                      src={
                        robotType === "wheeled_rover"
                          ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
                          : robotType === "robotic_arm"
                          ? "https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&q=80&w=800"
                          : "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800"
                      }
                      alt="Engineering Blueprint Schematic"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-90 contrast-125 saturate-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-[9px] text-cyan-400 font-mono font-bold uppercase tracking-widest">
                      REV 1.4 SCALE DRAWING
                    </span>
                  </div>

                  {/* Detail card */}
                  <div className="flex flex-col gap-2.5 text-xs">
                    <h4 className="font-bold text-white font-mono uppercase text-xs">
                      {robotType === "wheeled_rover"
                        ? "Autonomous Obstacle-Avoiding Rover Layout"
                        : robotType === "robotic_arm"
                        ? "6-DOF Kinematic Robotic Sorting Arm Layout"
                        : "Self-Stabilizing Insect Hexapod Walker Layout"}
                    </h4>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {robotType === "wheeled_rover"
                        ? "A comprehensive CAD mechanical layout detailing the 4WD chassis configuration, sensor mount coordinates, and center of mass calculations. The blueprint specifies the placement of the HC-SR04 ultrasonic array at 15-degree offsets to provide an overlapping cone of safety, alongside the central ESP32 microcontroller and dual H-bridge motor drivers."
                        : robotType === "robotic_arm"
                        ? "A multi-view orthographic projection outlining the rotational axes, link lengths, and joint torque ratings for the 6-DOF robotic manipulator. Features exact joint displacement dimensions and DH (Denavit-Hartenberg) parameters assumed by the inverse kinematics engine, highlighting the high-torque servo linkages at the base and shoulder."
                        : "The physical design layout of the 12-servo biomimetic spider robot. Outlines the 3-joint leg architecture (Coxa, Femur, Tibia) and the alignment of the 6-axis MPU6050 IMU at the exact center of gravity to optimize real-time balance calculations and gaits over uneven terrains."}
                    </p>

                    <div className="mt-2 flex flex-col gap-1.5 border-t border-slate-900 pt-3">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                        Mechanical Specs:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
                        {robotType === "wheeled_rover" ? (
                          <>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Chassis Material</span>
                              <strong className="text-slate-300">3mm Laser Acrylic</strong>
                            </div>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Wheelbase Length</span>
                              <strong className="text-slate-300">175 mm</strong>
                            </div>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Width Overall</span>
                              <strong className="text-slate-300">150 mm</strong>
                            </div>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Ground Clearance</span>
                              <strong className="text-slate-300">28 mm</strong>
                            </div>
                          </>
                        ) : robotType === "robotic_arm" ? (
                          <>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Structure</span>
                              <strong className="text-slate-300">Anodized 6061 Aluminum</strong>
                            </div>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Total Reach</span>
                              <strong className="text-slate-300">420 mm</strong>
                            </div>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Payload Max</span>
                              <strong className="text-slate-300">350 grams</strong>
                            </div>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Base Footprint</span>
                              <strong className="text-slate-300">140 x 140 mm</strong>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Chassis</span>
                              <strong className="text-slate-300">Carbon-Fiber Sandwich</strong>
                            </div>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Body Span</span>
                              <strong className="text-slate-300">260 mm</strong>
                            </div>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Leg Reach</span>
                              <strong className="text-slate-300">120 mm / leg</strong>
                            </div>
                            <div className="p-2 bg-slate-900/60 rounded border border-slate-900 flex justify-between">
                              <span className="text-slate-500">Step Height</span>
                              <strong className="text-slate-300">45 mm Max Obstacle</strong>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DROPDOWN 2: FINISHED PRODUCTS REFERENCE */}
        <div className="bg-slate-950 border border-slate-850 rounded-lg overflow-hidden flex flex-col">
          <button
            onClick={() => setFinishedOpen(!finishedOpen)}
            className="w-full px-5 py-4 bg-slate-900/40 hover:bg-slate-900/80 transition flex items-center justify-between font-mono text-xs font-bold text-slate-200 border-b border-slate-850 cursor-pointer border-0"
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-amber-400 uppercase tracking-wider">
                <Wrench className="w-4 h-4 text-amber-400" />
                Finished Physical Builds
              </span>
              <a
                href={robotType === 'hexapod' ? "https://www.thingiverse.com/thing:2661334" : "https://www.instructables.com/search/?q=robot+build"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-500 hover:text-amber-400 transition"
                title="View physical build inspiration online"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <span className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
              {finishedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>

          <AnimatePresence>
            {finishedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-5 flex flex-col gap-4">
                  {/* Image Frame */}
                  <div className="relative border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50 aspect-video">
                    <img
                      src={
                        robotType === "wheeled_rover"
                          ? "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
                          : robotType === "robotic_arm"
                          ? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                          : "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=800"
                      }
                      alt="Assembled Finished Product Reference"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-90 border-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-[9px] text-amber-400 font-mono font-bold uppercase tracking-widest">
                      PHYSICAL BUILD BENCHMARK
                    </span>
                  </div>

                  {/* Detail card */}
                  <div className="flex flex-col gap-2.5 text-xs">
                    <h4 className="font-bold text-white font-mono uppercase text-xs">
                      {robotType === "wheeled_rover"
                        ? "Fully Assembled Obstacle-Avoiding Rover"
                        : robotType === "robotic_arm"
                        ? "Constructed 6-DOF Robotic Manipulator"
                        : "Assembled 12-Servo Biomimetic Hexapod"}
                    </h4>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {robotType === "wheeled_rover"
                        ? "An assembled physical model of the Obstacle-Avoiding Rover. Features cleanly bundled wiring, a custom 18650 dual-cell battery pack positioned at the bottom-center for a low center of gravity, and the ultrasonic array projecting from the front bumper. Status LEDs verify system loop rates and network heartbeat."
                        : robotType === "robotic_arm"
                        ? "The fully constructed robotic arm mounted on a heavy timber workbench. Displays the PCA9685 PWM expansion board integrated with the Arduino Uno R4 Minima. The wire routing features soft braided sleeves allowing flexible 180-degree pivots without joint binding or tension spikes."
                        : "The complete insect-inspired hexapod in active stabilization mode. Features custom high-torque micro servos connected to the ESP32 motherboard. Leg tips are reinforced with silicon grip pads to maximize traction on polished tiles or sloped surfaces during creep-and-gait tests."}
                    </p>

                    <div className="mt-2 flex flex-col gap-1.5 border-t border-slate-900 pt-3">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                        Assembly & Calibration Advice:
                      </span>
                      <div className="p-3 bg-slate-900/60 rounded border border-slate-900 text-[11px] flex flex-col gap-1">
                        <div>
                          <strong className="text-slate-300 font-mono">Assembly Duration:</strong>{" "}
                          <span className="text-slate-400">
                            {robotType === "wheeled_rover"
                              ? "4-6 hours"
                              : robotType === "robotic_arm"
                              ? "6-8 hours"
                              : "8-12 hours"}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-300 font-mono">Build Tip:</strong>{" "}
                          <span className="text-slate-400 italic">
                            {robotType === "wheeled_rover"
                              ? "Make sure all motor wires are twisted pairs to reduce electromagnetic interference (EMI) near the ultrasonic sensor signal lines."
                              : robotType === "robotic_arm"
                              ? "Apply medium-strength threadlocker (blue) on all structural joint screws to prevent loosening from fast servo vibrations."
                              : "Calibrate all servo offsets to exactly 90 degrees during the software boot routine before screwing down physical leg horns."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Procedure Footer for Phase 3 */}
      <div className="pt-6 border-t border-violet-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        <button
          onClick={onBackToPhase2}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 font-mono text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Phase 2: BOM &amp; Sourcing</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onRunDiagnostics}
            disabled={diagnosticLoading}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Run Diagnostics</span>
          </button>
          <button
            onClick={onExportPDF}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-950/40 border-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Specs PDF</span>
          </button>
          <button
            onClick={onProceedToPhase4}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-mono text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-950/40 border-0"
          >
            <span>Proceed to Phase 4: Community Commons</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
