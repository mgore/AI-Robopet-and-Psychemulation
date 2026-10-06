import React, { useMemo } from "react";
import {
  Calculator,
  PackageCheck,
  Truck,
  Wrench,
  GraduationCap,
  Download,
  QrCode,
  Link2,
  ExternalLink,
  Zap
} from "lucide-react";
import { HardwareComponent } from "../types";
import { calculatePowerBudget } from "../services/bomService";

interface ProjectRunningTabProps {
  budget: number;
  grandTotalCost: number;
  baseHardwareCost: number;
  budgetExceeded: boolean;
  activeDrawer: HardwareComponent[];
  shippingTier: "standard" | "express" | "economy";
  setShippingTier: (tier: "standard" | "express" | "economy") => void;
  includeToolsEst: boolean;
  setIncludeToolsEst: (include: boolean) => void;
  includeTrainingEst: boolean;
  setIncludeTrainingEst: (include: boolean) => void;
  exportDrawerToPDF: (view: "budget" | "wiring" | "full") => void;
  onOpenQRModal: () => void;
  getComponentThumbnail: (item: unknown) => string;
}

export const ProjectRunningTab: React.FC<ProjectRunningTabProps> = ({
  budget,
  grandTotalCost,
  baseHardwareCost,
  budgetExceeded,
  activeDrawer,
  shippingTier,
  setShippingTier,
  includeToolsEst,
  setIncludeToolsEst,
  includeTrainingEst,
  setIncludeTrainingEst,
  exportDrawerToPDF,
  onOpenQRModal,
  getComponentThumbnail
}) => {
  const powerBudget = useMemo(() => {
    return calculatePowerBudget(activeDrawer);
  }, [activeDrawer]);

  return (
    <section className="mt-8">
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6 md:p-8 shadow-2xl backdrop-blur flex flex-col gap-6">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950/80 border border-emerald-800/60 rounded-xl text-emerald-400 shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg md:text-xl font-bold font-mono text-white">Full Project Investment Running Tab</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  Live BOM Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time cost ledger including manufacturer links, estimated shipping/handling, and estimated tools/training overhead.
              </p>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs shrink-0 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Target Budget Cap</span>
              <span className="font-bold text-slate-300">${budget}.00 USD</span>
            </div>
            <div className="h-8 w-px bg-slate-850" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Running Total Cost</span>
              <span className={`font-bold ${budgetExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
                ${grandTotalCost}.00 USD
              </span>
            </div>
            <div className="h-8 w-px bg-slate-850" />
            <div className="flex flex-col" title="Estimated runtime under nominal companion load; deep tuning and duty cycle tests in Phase 3 Workbench">
              <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-amber-400" />
                Est. Runtime
              </span>
              <span className="font-bold text-cyan-400">
                ~{powerBudget.estimatedBatteryRunHours} hrs
                <span className="text-[10px] text-slate-400 font-normal ml-1">({powerBudget.totalEstimatedCurrentMA}mA)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Active Components List with Rooted Manufacturer Links */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              Chosen Hardware Components ({activeDrawer.length} Items)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Hardware Subtotal: <strong className="text-slate-200">${baseHardwareCost}.00 USD</strong>
            </span>
          </div>

          {activeDrawer.length === 0 ? (
            <div className="p-6 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              No items added to drawer yet. Use the Supplier Lookup tool above to select components.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeDrawer.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 flex flex-col justify-between gap-3 hover:border-slate-700 transition group"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={getComponentThumbnail(item)}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0 bg-slate-900"
                    />
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-200 text-xs truncate">{item.name}</span>
                        <span className="font-mono text-emerald-400 text-xs font-bold shrink-0">${item.estimatedPriceUSD}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono line-clamp-1">{item.specs}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.interface}</span>
                      </div>
                    </div>
                  </div>

                  {/* Manufacturer & Authorized Vendor Links */}
                  <div className="pt-2 border-t border-slate-900 flex flex-col gap-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-medium truncate max-w-[140px]">
                        {item.manufacturer || "OEM Component"}
                      </span>
                      {item.productUrl ? (
                        <a
                          href={item.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition hover:underline bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50 text-[10px]"
                          title={`Open manufacturer catalog page for ${item.name}`}
                        >
                          <Link2 className="w-3 h-3" />
                          Datasheet
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-600 italic text-[10px]">Manufacturer Direct</span>
                      )}
                    </div>

                    {/* Authorized Supplier Links */}
                    {item.authorizedSuppliers && item.authorizedSuppliers.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-slate-900/60 text-[10px]">
                        <span className="text-slate-500 font-semibold">Vendors:</span>
                        {item.authorizedSuppliers.map((supplier, sIdx) => (
                          <a
                            key={sIdx}
                            href={supplier.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-850 text-cyan-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/60 transition"
                            title={`Purchase from ${supplier.name} (${supplier.region})`}
                          >
                            <span>{supplier.name}</span>
                            <ExternalLink className="w-2 h-2 opacity-70" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Cost Adjustment & Additional Expense Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Shipping & Handling Control */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold font-mono text-slate-200 uppercase">1. Shipping &amp; Handling Cost</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Rough-in shipping overhead from component distributors.
            </p>

            <div className="grid grid-cols-3 gap-1.5 mt-1 font-mono text-[10px]">
              {[
                { id: "economy", label: "Economy", cost: "$10", time: "5-8 days" },
                { id: "standard", label: "Standard", cost: "$18", time: "2-4 days" },
                { id: "express", label: "Express", cost: "$32", time: "1-2 days" }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setShippingTier(tier.id as unknown)}
                  className={`p-2 rounded border flex flex-col items-center gap-0.5 transition cursor-pointer ${
                    shippingTier === tier.id
                      ? "bg-emerald-950 text-emerald-300 border-emerald-700 font-bold"
                      : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span>{tier.label}</span>
                  <span className="text-xs font-bold">{tier.cost}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tools & Equipment Overhead */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-violet-400" />
                <h4 className="text-xs font-bold font-mono text-slate-200 uppercase">2. Assembly &amp; Tools</h4>
              </div>
              <button
                onClick={() => setIncludeToolsEst(!includeToolsEst)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                  includeToolsEst
                    ? "bg-violet-950 text-violet-300 border border-violet-800"
                    : "bg-slate-900 text-slate-500 border border-slate-800"
                }`}
              >
                {includeToolsEst ? "Included ($45)" : "Excluded ($0)"}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Estimated bench tools &amp; hardware: Soldering station, multimeter, wire strippers, heat shrink, fasteners ($45 est).
            </p>
            <div className="text-[10px] font-mono text-slate-500 bg-slate-900/60 p-2 rounded border border-slate-850">
              <span className="text-slate-400">Kit includes:</span> Anode wire, thermal shrink tubing, brass standoffs, M3 screws.
            </div>
          </div>

          {/* Neural Training & Compute Overhead */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold font-mono text-slate-200 uppercase">3. Training &amp; Compute</h4>
              </div>
              <button
                onClick={() => setIncludeTrainingEst(!includeTrainingEst)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                  includeTrainingEst
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                    : "bg-slate-900 text-slate-500 border border-slate-800"
                }`}
              >
                {includeTrainingEst ? "Included ($25)" : "Excluded ($0)"}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Estimated training overhead: RL physics GPU simulation time + LLM prompt token credits ($25 est).
            </p>
            <div className="text-[10px] font-mono text-slate-500 bg-slate-900/60 p-2 rounded border border-slate-850">
              <span className="text-slate-400">Compute covers:</span> Isaac Gym physics sim + GenAI code generation context.
            </div>
          </div>

        </div>

        {/* Bottom Total Summary & Action Bar */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-mono flex-wrap">
                <span className="text-xs text-slate-400 uppercase tracking-widest">Grand Total Overall Investment:</span>
                {budgetExceeded ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-red-950 text-red-400 border border-red-900/60 rounded">
                    Exceeds Budget Cap (+${grandTotalCost - budget})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900/60 rounded">
                    Within Budget Cap (-${budget - grandTotalCost})
                  </span>
                )}
              </div>
              <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
                ${grandTotalCost}.00 <span className="text-xs text-slate-400 font-normal">USD</span>
              </div>
            </div>
          </div>

          {/* PDF Export & Workshop Sync Shortcuts */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <button
              onClick={() => exportDrawerToPDF("budget")}
              className="flex-1 md:flex-initial px-3.5 py-2.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-200 text-xs font-mono font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              Budget PDF
            </button>
            <button
              onClick={() => exportDrawerToPDF("wiring")}
              className="flex-1 md:flex-initial px-3.5 py-2.5 bg-violet-950/80 hover:bg-violet-900 border border-violet-700/80 text-violet-200 text-xs font-mono font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              Wiring PDF
            </button>
            <button
              onClick={() => exportDrawerToPDF("full")}
              className="flex-1 md:flex-initial px-3.5 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 text-xs font-mono font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              Full Report PDF
            </button>
            <button
              onClick={onOpenQRModal}
              className="flex-1 md:flex-initial px-3.5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              title="Generate Mobile Workshop QR Code for scanning on phone/tablet"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              Workshop QR
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
