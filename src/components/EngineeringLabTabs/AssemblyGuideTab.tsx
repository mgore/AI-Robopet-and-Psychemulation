import React, { useState } from "react";
import {
  Wrench,
  Workflow,
  Lightbulb,
  Cpu,
  Brain,
  Users,
  ArrowRight,
  Camera,
  Layers,
  Box,
  Sliders
} from "lucide-react";
import { HardwareComponent } from "../../types";

interface AssemblyGuideTabProps {
  activeDrawer: HardwareComponent[];
  activeMCU: HardwareComponent;
  onOpenCommunityCommons?: () => void;
}

export const AssemblyGuideTab: React.FC<AssemblyGuideTabProps> = ({
  activeDrawer,
  activeMCU,
  onOpenCommunityCommons
}) => {
  const [assemblySubTab, setAssemblySubTab] = useState<"ai_robopet" | "growbot">("ai_robopet");

  return (
    <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-6 shadow-2xl flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b border-slate-800/60 gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <Wrench className="w-5 h-5 text-emerald-400" />
            Robotics Construction Manual & Assembly Roadmap
          </h3>
          <p className="text-xs text-slate-400">
            Step-by-step guidelines for building real companion robots, including physical body and cerebral model training.
          </p>
        </div>

        {/* SUB-TAB TOGGLES */}
        <div className="flex bg-slate-950 p-1.5 rounded-lg border border-slate-850 self-stretch md:self-auto">
          <button
            onClick={() => { setAssemblySubTab("ai_robopet"); }}
            className={`flex-1 md:flex-initial px-4 py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer border-0 ${
              assemblySubTab === "ai_robopet"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                : "bg-transparent text-slate-400 hover:text-white"
            }`}
          >
            Wiring & Board Pins
          </button>
          <button
            onClick={() => { setAssemblySubTab("growbot"); }}
            className={`flex-1 md:flex-initial px-4 py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer border-0 ${
              assemblySubTab === "growbot"
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/10"
                : "bg-transparent text-slate-400 hover:text-white"
            }`}
          >
            GrowBot DIY Companion Guide
          </button>
        </div>
      </div>

      {assemblySubTab === "ai_robopet" ? (
        <div className="flex flex-col gap-5">
          {/* Dynamic Schematics wiring table */}
          <div className="bg-slate-950 border border-slate-850 rounded p-4 flex flex-col gap-3">
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-cyan-500" />
              Proposed Circuit Connection Pins ({activeMCU.name})
            </span>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 text-[10px]">
                    <th className="py-2">MODULE</th>
                    <th className="py-2">MODULE PIN</th>
                    <th className="py-2">INTERFACE</th>
                    <th className="py-2">RECOMMENDED MCU PORT</th>
                    <th className="py-2">LOGIC LVL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {activeDrawer
                    .filter((c) => c.category !== "Microcontroller" && c.category !== "SBC")
                    .map((comp, idx) => {
                      let pin = "Signal / Out";
                      let mcuPort = `GPIO ${idx + 4}`;
                      let protocol = comp.interface;
                      let lvl = comp.voltage;

                      if (comp.interface.includes("I2C")) {
                        pin = "SDA / SCL";
                        mcuPort = activeMCU.name.includes("ESP32")
                          ? "GPIO 21 / 22"
                          : activeMCU.name.includes("Arduino")
                          ? "A4 / A5"
                          : "I2C-1 (Pins 3 / 5)";
                      } else if (comp.interface.includes("UART")) {
                        pin = "TX / RX";
                        mcuPort = activeMCU.name.includes("ESP32")
                          ? "GPIO 16 / 17"
                          : activeMCU.name.includes("Arduino")
                          ? "D0 / D1 (Hardware Serial)"
                          : "UART-0 (Pins 8 / 10)";
                      } else if (comp.interface.includes("PWM")) {
                        pin = "PWM Input";
                        mcuPort = `PWM Pin ${idx + 5}`;
                      } else if (comp.id.includes("hcsr04")) {
                        pin = "Trig / Echo";
                        mcuPort = "D12 (Trig) / D13 (Echo)";
                      }

                      return (
                        <tr key={idx} className="hover:bg-slate-900/30">
                          <td className="py-2 text-white font-sans">{comp.name}</td>
                          <td className="py-2 text-slate-400">{pin}</td>
                          <td className="py-2 text-cyan-500">{protocol}</td>
                          <td className="py-2 text-emerald-400 font-bold">{mcuPort}</td>
                          <td className="py-2 text-slate-500">{lvl}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assembly steps */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-mono text-slate-400 uppercase">Interactive Build Phases:</span>
            {[
              {
                title: "Phase 1: Logic Bench Testing",
                desc: "Solder header pins onto all drivers and sensors. Wire your primary controller on a testbed, upload basic blink sketches or I2C address scanner scripts to confirm logic gates are responsive before structural assembly.",
                tips: "Ensure common ground (GND) is secured between computer, driver, and controller rails."
              },
              {
                title: "Phase 2: Power and Actuator Calibrations",
                desc: "Secure battery packs and step-down UBEC converters. Mount DC motors or coordinate joint servos. Configure minimum/maximum PWM angle widths and verify current levels under stall load conditions.",
                tips: "NEVER run high current servos directly off the 5V line of a Raspberry Pi or micro-controller. Always isolate motor power."
              },
              {
                title: "Phase 3: Sensor Alignment",
                desc: "Mount ultrasonic sonars, ToF sensors, RPLIDAR range tools or cameras onto the structural frame. Verify sensory range metrics are logged correctly on terminal registers under physical constraints.",
                tips: "Keep distance sensor sight-lines clear of chassis structures to prevent continuous echo bounce back."
              },
              {
                title: "Phase 4: LLM Brain Integration Playground",
                desc: "Initialize serial/TCP interfaces on host scripts. Bind the robot motor execution nodes to the LLM backend outputs to process high-level autonomy logic securely.",
                tips: "Configure emergency manual shutdown protocols (e.g. timeout loops) in firmware to bypass LLM latency errors during tests."
              }
            ].map((step, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-850 rounded flex items-start gap-4">
                <span className="text-xs font-mono font-bold bg-emerald-950/50 border border-emerald-900 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="text-xs">
                  <h4 className="font-semibold text-white text-sm">{step.title}</h4>
                  <p className="text-slate-400 leading-relaxed mt-1">{step.desc}</p>
                  <div className="mt-2.5 flex items-center gap-1.5 text-cyan-550 font-mono text-[11px] bg-cyan-950/15 px-3 py-1.5 rounded border border-cyan-950/40">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                    <span>Tip: {step.tips}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* GrowBot Intro Overview */}
          <div className="p-4.5 bg-violet-950/10 border border-violet-900/30 rounded-lg flex flex-col md:flex-row items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=250"
              alt="GrowBot Miniature Companion"
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-lg object-cover border border-violet-800 bg-slate-950 shadow-inner"
            />
            <div className="text-xs text-slate-300">
              <strong className="text-white text-sm block mb-1">GrowBot DIY Companion Construction Manual</strong>
              This step-by-step master outline synthesizes the key insights from Brit Cruise's GrowBot documentary. It maps out the exact hardware blueprint for building the robot's physical body and the dual-system software training pipeline required to bring a truly responsive, lifelike robot companion to life for under $100.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HARDWARE BLUEPRINT: THE ROBOT BODY */}
            <div className="bg-slate-950 border border-slate-850 rounded-lg p-5 flex flex-col gap-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-900">
                <Cpu className="w-4 h-4 text-cyan-400" />
                I. Hardware Sphere: Body Construction
              </span>

              <div className="flex flex-col gap-4.5 text-xs">
                {/* Part 1 */}
                <div className="flex gap-3">
                  <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded h-fit shrink-0">
                    01
                  </span>
                  <div>
                    <strong className="text-slate-100 font-mono block">Processor: $15 Raspberry Pi Zero 2</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Acts as the central motherboard. Runs lightweight Linux and executes the reactive neural controller locally. Connects wirelessly to external LLM servers for high-level language cognition.
                    </p>
                  </div>
                </div>

                {/* Part 2 */}
                <div className="flex gap-3">
                  <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded h-fit shrink-0">
                    02
                  </span>
                  <div>
                    <strong className="text-slate-100 font-mono block">Core Sensory Organs (IMU & Vision)</strong>
                    <ul className="list-disc pl-4 text-slate-400 text-[11px] leading-relaxed mt-1 flex flex-col gap-1">
                      <li>
                        <strong className="text-slate-350">MPU-6050 6-Axis IMU (I2C):</strong> Measures raw acceleration and rotation along three axes. This is the robot's physical "feel," enabling it to detect tilt, balance, shaking, and petting.
                      </li>
                      <li>
                        <strong className="text-slate-350">5MP CSI Ribbon Camera ($5):</strong> Hooked directly to the camera port to capture real-time frames for rapid image-based face tracking.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Part 3 */}
                <div className="flex gap-3">
                  <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded h-fit shrink-0">
                    03
                  </span>
                  <div>
                    <strong className="text-slate-100 font-mono block">Limbs & Audio Actuators</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Uses two standard SG90 micro-servos connected to leg brackets (fabricated with 3D printing or custom acrylic, with rubber bands for safety tension). A mini-speaker and digital microphone ring facilitate audio responses and wake commands.
                    </p>
                  </div>
                </div>

                {/* Part 4 */}
                <div className="flex gap-3">
                  <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded h-fit shrink-0">
                    04
                  </span>
                  <div>
                    <strong className="text-slate-100 font-mono block">Power Loop & Noise Suppression</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Powered by a standard 2S 7.4V 1200mAh drone battery pack. Motor cables must be tightly twisted together to minimize electromagnetic interference (EMI) around high-gain I2C line sensor readings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SOFTWARE BLUEPRINT: THE ROBOT BRAIN */}
            <div className="bg-slate-950 border border-slate-850 rounded-lg p-5 flex flex-col gap-4">
              <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-900">
                <Brain className="w-4 h-4 text-violet-400" />
                II. Software Sphere: Brain Training
              </span>

              <div className="flex flex-col gap-4.5 text-xs">
                {/* Layer 1 */}
                <div className="flex gap-3">
                  <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-violet-400 px-2 py-0.5 rounded h-fit shrink-0">
                    01
                  </span>
                  <div>
                    <strong className="text-slate-100 font-mono block">System 1: Fast Unconscious Reflexes</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      A local policy neural network running on the Pi at 50Hz (50 times/sec) to handle walking, balancing, and posture.
                    </p>
                    <div className="p-2.5 bg-slate-900/60 rounded border border-slate-900 mt-1.5 font-mono text-[10px] text-slate-400 leading-normal">
                      <div>
                        <strong className="text-cyan-400">Inputs:</strong> History of last 5 IMU readings + prev action
                      </div>
                      <div>
                        <strong className="text-violet-400">Outputs:</strong> Direct servo target angles
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layer 2 */}
                <div className="flex gap-3">
                  <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-violet-400 px-2 py-0.5 rounded h-fit shrink-0">
                    02
                  </span>
                  <div>
                    <strong className="text-slate-100 font-mono block">Cerebellar Simulation (Isaac Lab)</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Physical learning takes too long on real motors and breaks materials. Instead, build a digital twin and train the policy inside an RL simulator (e.g., Isaac Lab or Google Colab on an H100 GPU for $15). The policy learns optimal balance weights through millions of trials in minutes.
                    </p>
                  </div>
                </div>

                {/* Layer 3 */}
                <div className="flex gap-3">
                  <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-violet-400 px-2 py-0.5 rounded h-fit shrink-0">
                    03
                  </span>
                  <div>
                    <strong className="text-slate-100 font-mono block">System 2: Slow Conscious Reasoning</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Binds System 1 to Gemini 2.5 Flash to handle complex visual and textual reasoning (e.g., understanding human face coords, translating "play dead" into specific motor triggers, or maintaining long-term game state) in ~1 second.
                    </p>
                  </div>
                </div>

                {/* Layer 4 */}
                <div className="flex gap-3">
                  <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-violet-400 px-2 py-0.5 rounded h-fit shrink-0">
                    04
                  </span>
                  <div>
                    <strong className="text-slate-100 font-mono block">Consolidation Phase ("Dreaming")</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Periodic background "dreaming" routines. The Pi packages memory log files, IMU readings, and behavioral outcomes, then uploads them to a cloud model. The model extracts meta-insights (e.g. "I tilt too far left when turning") and writes optimized software calibration parameters back into the local Pi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* COMMUNAL EXCHANGE PORTAL */}
            <div className="bg-gradient-to-r from-violet-950/50 via-pink-950/20 to-slate-950 border border-violet-700/60 rounded-xl p-5 shadow-2xl flex flex-col gap-4 relative overflow-hidden lg:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-violet-900/40 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-900/80 text-violet-300 border border-violet-700/60 flex items-center gap-1">
                      <Users className="w-3 h-3 text-violet-400" />
                      Community Model Weights, Photos &amp; Inventory Portal
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">● Open Communal Hub</span>
                  </div>
                  <h4 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    Makers Open Exchange: Model Weights, Build Photos, 3D CAD &amp; Inventory
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                    Positioned directly below the cerebral model training guidelines: share your trained Isaac Lab policy weights, inspect real builder photos, download chassis STLs, and adopt or swap spare sensor inventory with the community.
                  </p>
                </div>
                {onOpenCommunityCommons && (
                  <button
                    onClick={onOpenCommunityCommons}
                    className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-violet-950/40 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer border-0"
                  >
                    <span>Open Community Commons</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Communal preview cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div
                  onClick={onOpenCommunityCommons}
                  className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-violet-600/50 rounded-lg flex flex-col gap-1.5 cursor-pointer transition"
                >
                  <span className="text-[10px] text-violet-400 uppercase font-bold flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Shared Photos
                  </span>
                  <span className="text-slate-200 font-sans font-bold truncate">Dual-Track Rover Field Photos</span>
                  <span className="text-[10px] text-slate-500">14 obstacle test courses logged by @AeroBotics</span>
                </div>
                <div
                  onClick={onOpenCommunityCommons}
                  className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-pink-600/50 rounded-lg flex flex-col gap-1.5 cursor-pointer transition"
                >
                  <span className="text-[10px] text-pink-400 uppercase font-bold flex items-center gap-1">
                    <Layers className="w-3 h-3" /> 3D CAD &amp; Print
                  </span>
                  <span className="text-slate-200 font-sans font-bold truncate">Hexapod Coxa/Femur STLs</span>
                  <span className="text-[10px] text-slate-500">0.2mm tolerance brackets by @CyberKinetics</span>
                </div>
                <div
                  onClick={onOpenCommunityCommons}
                  className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-600/50 rounded-lg flex flex-col gap-1.5 cursor-pointer transition"
                >
                  <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                    <Box className="w-3 h-3" /> Available Inventory
                  </span>
                  <span className="text-slate-200 font-sans font-bold truncate">4x ESP32-S3 &amp; MPU-6050 IMUs</span>
                  <span className="text-[10px] text-emerald-400">Ready to swap by @HardwareHacker_Kai</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP BY STEP ASSEMBLY ACTION WORKFLOW */}
          <div className="bg-slate-950 border border-slate-850 rounded-lg p-5 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <Sliders className="w-4 h-4 text-emerald-400" />
              III. Step-by-Step DIY Assembly Checklist
            </span>

            <div className="flex flex-col gap-3.5">
              {[
                {
                  step: "Step 1: Structural Setup & Power",
                  desc: "3D print the case and secure the 2S LiPo battery in the lowest compartment. Solder header pins onto the MPU-6050 IMU and the Pi Zero 2. Isolate power rails between the micro-servos and the Pi Zero to prevent brownouts.",
                  checkpoint: "Confirmed stable 5.1V supply to the Pi and dedicated 6V rail to the TowerPro servos."
                },
                {
                  step: "Step 2: Connect Local Sensor Bus",
                  desc: "Wire the MPU-6050 to the Pi I2C port (SDA/SCL). Install the 5MP CSI camera via ribbon cable and the LED ring status board. Keep all cabling extremely tight and twisted.",
                  checkpoint: "I2C address scan detects MPU-6050 at address 0x68 and camera feed initializes successfully."
                },
                {
                  step: "Step 3: Setup Local System 1 Reflexes",
                  desc: "Deploy the compiled neural network model onto the local Pi. Test local policy execution loop: feed IMU acceleration arrays continuously, verify that servos jitter smoothly to maintain vertical gravity balancing.",
                  checkpoint: "Reflex loop executes reliably at 50Hz (20ms interval)."
                },
                {
                  step: "Step 4: Connect Cloud System 2 Mind",
                  desc: "Establish a socket listener on the Pi Zero to transmit image streams and IMU averages to the Gemini API. Test high-level prompts. Introduce the face-tracking logic: let the model direct the servos to center detected human face coordinates.",
                  checkpoint: "Gemini 2.5 Flash processes raw visual data and sends back coordination targets in under 1 second."
                },
                {
                  step: "Step 5: Calibrate Emotional Profiles (Disney Mode)",
                  desc: "Add overlapping animations for emotional profiles. Map the NeoPixel colors and buzzer frequencies to 'breathing state', 'angry state', and 'happy purr'. Enable offline log bundling for the dreaming loop.",
                  checkpoint: "Robot successfully transitions to anger (red flashing + sharp rapid leg stomps) when handled roughly."
                }
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-900/40 rounded border border-slate-900 flex items-start gap-4 hover:border-slate-800 transition"
                >
                  <span className="text-xs font-mono font-bold bg-emerald-950/60 border border-emerald-900 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="text-xs">
                    <h4 className="font-bold text-slate-100 font-sans">{s.step}</h4>
                    <p className="text-slate-400 leading-relaxed mt-1 text-[11px]">{s.desc}</p>
                    <div className="mt-2 text-[10px] text-cyan-500 font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span>
                      <span>
                        <strong>Success Criteria:</strong> {s.checkpoint}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
