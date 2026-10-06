import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Clock,
  CheckCircle,
  AlertTriangle,
  BatteryCharging,
  Code,
  Zap,
  Battery,
  Sliders,
  ShieldCheck,
  Plus,
  Check,
  Activity,
  Cpu,
  Info,
  Layers,
  Flame,
  ArrowRight
} from "lucide-react";
import { HardwareComponent, CompatibilityReport } from "../../types";
import { calculatePowerBudget, PowerBudgetReport } from "../../services/bomService";

interface DiagnosticsTabProps {
  activeMCU: HardwareComponent;
  activeDrawer?: HardwareComponent[];
  onAddToDrawer?: (item: HardwareComponent) => void;
  catalog?: HardwareComponent[];
  diagnosticLoading: boolean;
  diagnosticReport: CompatibilityReport | null;
  onRunDiagnostics: () => void;
}

interface BatteryPreset {
  id: string;
  name: string;
  voltage: string;
  capacityMAh: number;
  chemistry: string;
  priceUSD: number;
  cRate: string;
  description: string;
}

const BATTERY_PRESETS: BatteryPreset[] = [
  {
    id: "1s_18650",
    name: "1S 3.7V 18650 Li-ion Cell",
    voltage: "3.7V (4.2V Peak)",
    capacityMAh: 2200,
    chemistry: "Li-ion NCR18650",
    priceUSD: 4.5,
    cRate: "2C (4.4A continuous)",
    description: "Compact sub-$5 single cell for low-power ESP32 companions with boost converters."
  },
  {
    id: "2s_18650_pack",
    name: "Dual 18650 Li-ion Pack (2S)",
    voltage: "7.4V (8.4V Peak)",
    capacityMAh: 2600,
    chemistry: "Li-ion 2S Pack",
    priceUSD: 9.8,
    cRate: "3C (7.8A continuous)",
    description: "Ideal balance of runtime, high reflex surge capacity, and safety for robotic pets."
  },
  {
    id: "2s_lipo_pack",
    name: "2S 7.4V 2200mAh LiPo Pack",
    voltage: "7.4V (8.4V Peak)",
    capacityMAh: 2200,
    chemistry: "Lithium Polymer (LiPo)",
    priceUSD: 14.2,
    cRate: "25C–50C (55A Burst)",
    description: "Ultra-low internal resistance for instant high-torque reflex servo snaps without voltage sag."
  },
  {
    id: "3s_lipo_pack",
    name: "3S 11.1V 3300mAh LiPo Pack",
    voltage: "11.1V (12.6V Peak)",
    capacityMAh: 3300,
    chemistry: "Lithium Polymer (LiPo)",
    priceUSD: 24.5,
    cRate: "35C (115A Burst)",
    description: "High-voltage performance pack for multi-servo hexapods and Jetson edge compute rigs."
  },
  {
    id: "4x_aa_nimh",
    name: "4x AA NiMH Rechargeable Pack",
    voltage: "4.8V (5.6V Peak)",
    capacityMAh: 2000,
    chemistry: "Nickel-Metal Hydride (NiMH)",
    priceUSD: 8.5,
    cRate: "1C–2C (4A max)",
    description: "Safe, flight-friendly standard cells with direct 5V servo logic compatibility."
  },
  {
    id: "usb_power_bank",
    name: "5V 5000mAh USB-C Power Bank",
    voltage: "5.0V Regulated",
    capacityMAh: 5000,
    chemistry: "Regulated LiPo / USB-C",
    priceUSD: 12.0,
    cRate: "5V 2.4A regulated output",
    description: "Plug-and-play commercial power bank with integrated charging and battery gauge."
  }
];

export const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({
  activeMCU,
  activeDrawer = [],
  onAddToDrawer,
  catalog = [],
  diagnosticLoading,
  diagnosticReport,
  onRunDiagnostics
}) => {
  // Battery Estimator State
  const [selectedPresetId, setSelectedPresetId] = useState<string>("2s_18650_pack");
  const [customCapacityMAh, setCustomCapacityMAh] = useState<number>(2600);
  const [useCustomCapacity, setUseCustomCapacity] = useState<boolean>(false);
  const [dutyCycleMode, setDutyCycleMode] = useState<"standby" | "nominal" | "reflex">("nominal");

  // Simulated push-to-test button for LED battery gauge
  const [testButtonPressed, setTestButtonPressed] = useState<boolean>(false);

  // Active battery preset
  const currentBattery = useMemo(() => {
    return BATTERY_PRESETS.find(b => b.id === selectedPresetId) || BATTERY_PRESETS[1];
  }, [selectedPresetId]);

  const effectiveCapacityMAh = useCustomCapacity ? customCapacityMAh : currentBattery.capacityMAh;

  // Calculate comprehensive power budget & runtime report
  const powerReport = useMemo<PowerBudgetReport>(() => {
    return calculatePowerBudget(activeDrawer, effectiveCapacityMAh, dutyCycleMode);
  }, [activeDrawer, effectiveCapacityMAh, dutyCycleMode]);

  // Check if active drawer contains a battery indicator
  const hasOnboardIndicator = powerReport.hasBatteryIndicator;

  // Battery cost efficiency ($ per operating hour)
  const costPerOperatingHour = useMemo(() => {
    if (powerReport.estimatedBatteryRunHours <= 0) return 0;
    const battCost = currentBattery.priceUSD;
    return (battCost / powerReport.estimatedBatteryRunHours).toFixed(2);
  }, [currentBattery.priceUSD, powerReport.estimatedBatteryRunHours]);

  // Find battery indicator item in catalog if user wants to add it
  const indicatorCatalogItem = useMemo(() => {
    return (
      catalog.find(c => c.id === "battery_indicator_led_bargraph") ||
      catalog.find(c => c.id.includes("battery_indicator")) ||
      catalog.find(c => c.name.toLowerCase().includes("battery level"))
    );
  }, [catalog]);

  const handleAddIndicator = () => {
    if (indicatorCatalogItem && onAddToDrawer) {
      onAddToDrawer(indicatorCatalogItem);
    }
  };

  return (
    <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col gap-8">
      
      {/* ========================================================================= */}
      {/* SECTION 1: SYSTEM POWER BUDGET & BATTERY RUNTIME ESTIMATOR WORKBENCH */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 md:p-6 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Phase 3 Engineering Tool
              </span>
              <span className="text-[10px] text-slate-500 font-mono">BOM Electrical Telemetry</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-mono mt-1">
              <BatteryCharging className="w-5 h-5 text-emerald-400" />
              System Power Budget &amp; Battery Runtime Estimator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulates real-world operating hours based on microcontrollers, motors, companion servos, and fast-twitch reflex duty cycles.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">
              Active Hardware: <strong className="text-white">{activeDrawer.length} components</strong>
            </span>
          </div>
        </div>

        {/* BATTERY SELECTION & DUTY CYCLE CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Column 1: Battery Presets */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 font-semibold">
              <Battery className="w-3.5 h-3.5 text-cyan-400" />
              1. Choose Battery Configuration:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {BATTERY_PRESETS.map((preset) => {
                const isSelected = !useCustomCapacity && selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setUseCustomCapacity(false);
                    }}
                    className={`p-2.5 rounded-lg text-left transition border font-mono flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-cyan-950/60 border-cyan-500 text-white shadow-sm"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{preset.name}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {preset.voltage} • {preset.capacityMAh} mAh • {preset.cRate}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 shrink-0 ml-2">
                      ${preset.priceUSD.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Capacity Option */}
            <div className="pt-2">
              <button
                onClick={() => setUseCustomCapacity(!useCustomCapacity)}
                className={`text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer ${
                  useCustomCapacity ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Custom Battery Capacity Slider {useCustomCapacity ? "(Active)" : ""}</span>
              </button>

              {useCustomCapacity && (
                <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-cyan-800/60 flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Custom Capacity:</span>
                    <span className="text-cyan-400 font-bold">{customCapacityMAh} mAh</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="10000"
                    step="100"
                    value={customCapacityMAh}
                    onChange={(e) => setCustomCapacityMAh(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>300 mAh (Micro)</span>
                    <span>5,000 mAh</span>
                    <span>10,000 mAh (Heavy)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Operational Duty Cycle Simulator */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              2. Simulation Duty Cycle &amp; Reflex Mode:
            </label>
            <div className="flex flex-col gap-2">
              {[
                {
                  id: "standby" as const,
                  title: "Low-Power Standby & Listen",
                  badge: "Quiescent (~30-80mA)",
                  desc: "MCU in sleep/listen mode. Servos idle with zero torque load. Waits for capacitive touch or voice wake."
                },
                {
                  id: "nominal" as const,
                  title: "Nominal Companion Mode",
                  badge: "Balanced (~180-450mA)",
                  desc: "Procedural eye blinking, intermittent ear tilts, ambient tail wagging, and periodic sensor sweeps."
                },
                {
                  id: "reflex" as const,
                  title: "High-Reflex Dynamic Snaps",
                  badge: "Peak Activity (~600-1800mA)",
                  desc: "Continuous rapid-twitch ear adjustments, pan-tilt head tracking, frequent purring, and fast obstacle evasion."
                }
              ].map((mode) => {
                const isSelected = dutyCycleMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setDutyCycleMode(mode.id)}
                    className={`p-3 rounded-lg text-left transition border font-mono flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-amber-950/40 border-amber-500 text-white shadow-md"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold">{mode.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        isSelected
                          ? "bg-amber-900/50 text-amber-300 border-amber-600/60"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}>
                        {mode.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {mode.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Circuit Brownout Safety Note */}
            <div className="p-3 bg-violet-950/20 border border-violet-800/40 rounded-lg text-xs flex items-start gap-2 text-slate-300">
              <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong className="text-violet-300">Brownout Prevention:</strong> When running high-speed reflex servos, power actuators directly from a 5V UBEC or battery shield rail. Never power micro-servos from the MCU 3.3V pin to avoid CPU reboot brownouts.
              </p>
            </div>
          </div>

          {/* Column 3: Live Results & Battery Gauge */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 font-semibold">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              3. Telemetry Results &amp; Hardware Gauge:
            </label>

            {/* Primary Big Metric Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/40 rounded-xl p-4 shadow-lg flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                  Estimated System Runtime
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  {powerReport.dutyCycleLabel}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight">
                  {powerReport.estimatedBatteryRunHours}
                </span>
                <span className="text-base font-bold font-mono text-emerald-500">hours</span>
                <span className="text-xs font-mono text-slate-500 ml-auto">
                  (~{Math.round(powerReport.estimatedBatteryRunHours * 60)} mins)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">Avg Draw:</span>
                  <span className="font-bold text-white">{powerReport.totalEstimatedCurrentMA} mA</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">Peak Reflex Burst:</span>
                  <span className="font-bold text-amber-400">{powerReport.peakDrawMA} mA</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">Sleep / Standby:</span>
                  <span className="font-bold text-cyan-400">{powerReport.standbyRunHours} hrs</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">Operating Cost:</span>
                  <span className="font-bold text-emerald-300">${costPerOperatingHour}/hr</span>
                </div>
              </div>
            </div>

            {/* HARDWARE BATTERY LEVEL INDICATOR MODULE */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-slate-200">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span>Onboard Battery Indicator</span>
                </div>
                {hasOnboardIndicator ? (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    Verified in BOM
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                    Not in BOM
                  </span>
                )}
              </div>

              {/* Realistic 5-Segment LED Bargraph Visualizer */}
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Simulated Exterior LED Gauge:</span>
                  <button
                    onClick={() => {
                      setTestButtonPressed(true);
                      setTimeout(() => setTestButtonPressed(false), 1200);
                    }}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[9px] font-mono transition cursor-pointer flex items-center gap-1"
                    title="Press momentary push-to-test hardware button"
                  >
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    <span>Push To Test</span>
                  </button>
                </div>

                {/* 5-Segment LEDs */}
                <div className="flex items-center gap-1.5 py-1 px-2 bg-slate-950 rounded border border-slate-850 justify-between">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-4 rounded-sm bg-red-950 border border-red-800 flex items-center justify-center">
                      <div className={`w-1 h-3 rounded-xs ${testButtonPressed ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "bg-red-500"}`} />
                    </div>
                    <div className="w-2 h-4 rounded-sm bg-amber-950 border border-amber-800 flex items-center justify-center">
                      <div className={`w-1 h-3 rounded-xs ${testButtonPressed ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-amber-500"}`} />
                    </div>
                    <div className="w-2 h-4 rounded-sm bg-emerald-950 border border-emerald-800 flex items-center justify-center">
                      <div className={`w-1 h-3 rounded-xs ${testButtonPressed ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-emerald-500"}`} />
                    </div>
                    <div className="w-2 h-4 rounded-sm bg-emerald-950 border border-emerald-800 flex items-center justify-center">
                      <div className={`w-1 h-3 rounded-xs ${testButtonPressed ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-emerald-400"}`} />
                    </div>
                    <div className="w-2 h-4 rounded-sm bg-emerald-950 border border-emerald-800 flex items-center justify-center">
                      <div className={`w-1 h-3 rounded-xs ${testButtonPressed ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-emerald-400"}`} />
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold">
                    {testButtonPressed ? "100% • 8.4V FULL" : "READY (PUSH TEST)"}
                  </div>
                </div>

                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>Cutoff (&lt;6.8V)</span>
                  <span>Nominal (7.4V)</span>
                  <span>Full (8.4V)</span>
                </div>
              </div>

              {/* Status Note or 1-Click Add Button */}
              {hasOnboardIndicator ? (
                <div className="text-[11px] text-emerald-300/90 font-sans flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Your BOM includes <strong>{powerReport.batteryIndicatorName}</strong>. Zero quiescent standby drain with instant push-to-test optical feedback.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    Companion robots benefit from an exterior battery gauge so you know when to recharge without opening the chassis.
                  </p>
                  {onAddToDrawer && indicatorCatalogItem && (
                    <button
                      onClick={handleAddIndicator}
                      className="w-full py-2 px-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 text-xs font-mono font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Add $1.80 LED Battery Indicator to BOM</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ACTIVE BOM POWER CONSUMPTION BREAKDOWN TABLE */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Component Electrical Draw Breakdown ({powerReport.componentBreakdown.length} items)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Total Continuous: <strong className="text-slate-200">{powerReport.continuousDrawMA} mA</strong> • Peak Reflex: <strong className="text-amber-400">{powerReport.peakDrawMA} mA</strong>
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto pr-1 border border-slate-800 rounded-lg bg-slate-950">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-900 text-[10px] text-slate-400 uppercase sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Component</th>
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2 text-right">Nominal (mA)</th>
                  <th className="py-2 px-2 text-right">Peak Reflex (mA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {powerReport.componentBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500 text-[11px]">
                      No active components in BOM. Add parts in Phase 2 to populate electrical current draw.
                    </td>
                  </tr>
                ) : (
                  powerReport.componentBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition">
                      <td className="py-1.5 px-3 font-semibold text-slate-200 max-w-[200px] truncate">
                        {item.name}
                      </td>
                      <td className="py-1.5 px-2 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-right text-slate-300">
                        {item.nominalMA} mA
                      </td>
                      <td className="py-1.5 px-2 text-right font-bold text-amber-400">
                        {item.peakMA} mA
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: CIRCUIT COMPATIBILITY & SIGNAL DIAGNOSTICS */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-5 pt-2 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-slate-800/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Active Circuit Compatibility Diagnostics
            </h3>
            <p className="text-xs text-slate-400">
              Validates logic voltage, pin bus contention, and signal levels for {activeMCU.name}.
            </p>
          </div>
          <button
            onClick={onRunDiagnostics}
            disabled={diagnosticLoading}
            className="w-full md:w-auto px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold rounded hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] border-0 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {diagnosticLoading ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                Scanning Signals...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Run AI Diagnostic Check
              </>
            )}
          </button>
        </div>

        {!diagnosticReport && !diagnosticLoading && (
          <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-lg">
            Click &quot;Run AI Diagnostic Check&quot; to verify voltage, bus conflicts, and power draw for your selected MCU ({activeMCU.name}).
          </div>
        )}

        {diagnosticReport && !diagnosticLoading && (
          <div className="flex flex-col gap-4">
            {/* Status badge */}
            <div
              className={`p-4 rounded-lg border flex items-center justify-between ${
                diagnosticReport.overallStatus === "passed"
                  ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400"
                  : diagnosticReport.overallStatus === "warning"
                  ? "bg-amber-950/20 border-amber-900/50 text-amber-400"
                  : "bg-red-950/20 border-red-900/50 text-red-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-slate-950/40">
                  {diagnosticReport.overallStatus === "passed" ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <AlertTriangle
                      className={`w-6 h-6 ${
                        diagnosticReport.overallStatus === "warning" ? "text-amber-400" : "text-red-400"
                      }`}
                    />
                  )}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                    DIAGNOSTIC VERDICT STATUS
                  </div>
                  <h4 className="text-sm font-bold font-mono uppercase">
                    {diagnosticReport.overallStatus === "passed"
                      ? "COMPATIBILITY ASSURED"
                      : diagnosticReport.overallStatus === "warning"
                      ? "WARNING FLAGS RAISED"
                      : "CRITICAL SYSTEM CONFLICTS"}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-slate-950 rounded border border-slate-850">
                MCU: {activeMCU.name}
              </span>
            </div>

            {/* Warnings feed */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Warning Logs &amp; Flagged Conflicts:</span>
              {diagnosticReport.warnings.length === 0 ? (
                <div className="p-4 bg-slate-950 rounded border border-slate-850 text-center text-xs text-slate-500 font-mono">
                  No hardware warnings flagged! Your circuit architecture looks pristine.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {diagnosticReport.warnings.map((warn, index) => (
                    <div key={index} className="p-3.5 bg-slate-950 border border-slate-850 rounded flex items-start gap-3">
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          warn.severity === "high"
                            ? "text-red-400"
                            : warn.severity === "medium"
                            ? "text-amber-400"
                            : "text-slate-400"
                        }`}
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5 flex-wrap">
                          <span>{warn.title}</span>
                          <span className="text-[9px] text-slate-500">({warn.componentName})</span>
                          <span
                            className={`text-[8px] px-1.5 py-0.2 font-mono rounded ${
                              warn.severity === "high"
                                ? "bg-red-950/40 text-red-400 border border-red-900/30"
                                : "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                            }`}
                          >
                            {warn.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-400 leading-normal mt-1 text-[11px]">{warn.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side-by-side: power analysis + Level shifts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Power Summary from AI Diagnostic */}
              <div className="p-4 bg-slate-950 rounded border border-slate-850 flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900 text-xs font-semibold text-slate-200 font-mono">
                  <BatteryCharging className="w-4 h-4 text-cyan-400" />
                  AI Diagnostic Power Evaluation
                </div>
                <div className="text-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Peak Current Estimate:</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {diagnosticReport.powerAnalysis.totalEstimatedCurrentMA} mA
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">Recommended Battery:</span>
                    <span className="font-mono text-white text-right leading-tight max-w-[60%]">
                      {diagnosticReport.powerAnalysis.recommendedBatteryPower}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal mt-1 border-t border-slate-900 pt-2">
                    {diagnosticReport.powerAnalysis.comments}
                  </p>
                </div>
              </div>

              {/* Level shifts */}
              <div className="p-4 bg-slate-950 rounded border border-slate-850 flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900 text-xs font-semibold text-slate-200 font-mono">
                  <Code className="w-4 h-4 text-cyan-400" />
                  Level-Shifting Guidelines
                </div>
                <div className="text-xs flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {diagnosticReport.levelShiftingNeeds.length === 0 ? (
                    <span className="text-slate-500 text-[11px] font-mono p-2">
                      All pins aligned. No logic level shifters required.
                    </span>
                  ) : (
                    diagnosticReport.levelShiftingNeeds.map((shift, i) => (
                      <div key={i} className="p-2 bg-slate-900/50 rounded border border-slate-800 text-[10px] leading-relaxed flex flex-col">
                        <span className="text-slate-200 font-bold">{shift.component}</span>
                        <span className="text-slate-400 font-mono">Line: {shift.signalLine}</span>
                        <span className="text-cyan-400 font-mono mt-0.5">{shift.shiftNeeded}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Technical Advice */}
            <div className="p-4 bg-cyan-950/20 rounded border border-cyan-900/30 text-xs">
              <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider block mb-1">
                Architect Assembly Advisory:
              </span>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line font-sans text-[11px]">
                {diagnosticReport.technicalAdvice}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
