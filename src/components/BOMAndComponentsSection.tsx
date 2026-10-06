import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  QrCode, 
  Trash2, 
  Plus, 
  Check, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  DollarSign, 
  Workflow, 
  Sliders, 
  Smartphone, 
  HelpCircle, 
  Building2, 
  ArrowLeftRight, 
  BookmarkCheck, 
  PackageCheck, 
  RefreshCw,
  Globe,
  Scale
} from "lucide-react";
import { HardwareComponent } from "../types";
import { EquipmentComponentSearch } from "./EquipmentComponentSearch";

interface BOMAndComponentsSectionProps {
  activeDrawer: HardwareComponent[];
  contingencyList: HardwareComponent[];
  onAddToDrawer: (comp: HardwareComponent) => void;
  onRemoveFromDrawer: (id: string) => void;
  onAddToContingency: (comp: HardwareComponent) => void;
  onRemoveFromContingency: (id: string) => void;
  onSwapContingencyToActive: (comp: HardwareComponent) => void;
  activeMCU: HardwareComponent;
  pdfExportView: "budget" | "wiring" | "full";
  setPdfExportView: (v: "budget" | "wiring" | "full") => void;
  exportDrawerToPDF: (mode?: "budget" | "wiring" | "full") => void;
  onOpenQRModal: () => void;
  catalog: HardwareComponent[];
  getComponentThumbnail: (item: unknown) => string;
  onOpenGlossary: (term?: string) => void;
  budget: number;
  grandTotalCost: number;
  baseHardwareCost: number;
  triggerNotification: (msg: string) => void;
  onOpenDatasheet?: () => void;
  onOpenCompare?: () => void;
  onOpenVendorDirectory?: () => void;
}

export const BOMAndComponentsSection: React.FC<BOMAndComponentsSectionProps> = ({
  activeDrawer,
  contingencyList,
  onAddToDrawer,
  onRemoveFromDrawer,
  onAddToContingency,
  onRemoveFromContingency,
  onSwapContingencyToActive,
  activeMCU,
  pdfExportView,
  setPdfExportView,
  exportDrawerToPDF,
  onOpenQRModal,
  catalog,
  getComponentThumbnail,
  onOpenGlossary,
  budget,
  grandTotalCost,
  baseHardwareCost,
  triggerNotification,
  onOpenDatasheet,
  onOpenCompare,
  onOpenVendorDirectory
}) => {
  // Navigation tabs within this consolidated section
  const [viewTab, setViewTab] = useState<"bom" | "contingency" | "catalog" | "sourcing">("bom");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [natoFilterOnly, setNatoFilterOnly] = useState(false);

  // Filter components in catalog
  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      item.specs.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      (item.manufacturer && item.manufacturer.toLowerCase().includes(supplierSearch.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === "All" || item.category === selectedCategoryFilter;

    const matchesNato = !natoFilterOnly || item.isNatoAligned;

    return matchesSearch && matchesCategory && matchesNato;
  });

  const contingencyTotal = contingencyList.reduce((sum, item) => sum + item.estimatedPriceUSD, 0);

  return (
    <div id="section-bom-components" className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 shadow-2xl flex flex-col gap-4">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="text-xs bg-cyan-500/20 text-cyan-400 font-mono w-6 h-6 rounded-full flex items-center justify-center font-bold border border-cyan-500/40">
            2
          </span>
          <div>
            <h2 className="text-xs font-bold tracking-widest text-slate-200 uppercase font-mono">
              BOM & Hardware Components
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Active bill of materials, hardware pinouts, and contingency backup modules.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenGlossary("I2C")}
          className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 cursor-pointer hover:underline bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
          title="Learn hardware specifications and communication interfaces"
        >
          <HelpCircle className="w-3 h-3 text-cyan-400" />
          <span>Interface Specs</span>
        </button>
      </div>

      {/* SUB-SECTION TAB SELECTOR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => { setViewTab("bom"); }}
          className={`py-2 px-2 rounded-md font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === "bom"
              ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate">Active BOM ({activeDrawer.length})</span>
        </button>

        <button
          onClick={() => { setViewTab("contingency"); }}
          className={`py-2 px-2 rounded-md font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === "contingency"
              ? "bg-amber-950 text-amber-300 border border-amber-700/80 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate">Contingencies ({contingencyList.length})</span>
        </button>

        <button
          onClick={() => { setViewTab("catalog"); }}
          className={`py-2 px-2 rounded-md font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === "catalog"
              ? "bg-violet-950 text-violet-300 border border-violet-700/80 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-violet-400" />
          <span className="truncate">Catalog ({catalog.length})</span>
        </button>

        <button
          onClick={() => { setViewTab("sourcing"); }}
          className={`py-2 px-2 rounded-md font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === "sourcing"
              ? "bg-emerald-950 text-emerald-300 border border-emerald-700/80 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate">Equipment Search</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE BOM (BILL OF MATERIALS) */}
      {viewTab === "bom" && (
        <div className="flex flex-col gap-3.5">
          {/* Active Brain Controller & Quick Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-slate-950/90 rounded-lg border border-cyan-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-cyan-950 rounded text-cyan-400 border border-cyan-800/40">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] text-cyan-400 uppercase tracking-widest font-mono">
                    Active Brain Controller
                  </div>
                  <div className="text-xs font-bold text-white font-mono leading-tight">
                    {activeMCU.name}
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {activeMCU.voltage}
              </span>
            </div>

            <div className="p-2.5 bg-slate-950/90 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                  Hardware Total
                </div>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  ${baseHardwareCost} USD <span className="text-slate-500 font-normal">/ ${budget}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-1 rounded">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Sourced</span>
              </div>
            </div>
          </div>

          {/* Active BOM Item List */}
          <div className="overflow-y-auto max-h-[320px] border border-slate-800 bg-slate-950 rounded-lg divide-y divide-slate-900 pr-1 text-xs">
            {activeDrawer.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono flex flex-col items-center gap-2">
                <PackageCheck className="w-8 h-8 text-slate-600 stroke-1" />
                <p>No components in active BOM.</p>
                <button
                  onClick={() => setViewTab("catalog")}
                  className="px-3 py-1.5 bg-cyan-600 text-white rounded font-mono text-xs font-bold hover:bg-cyan-500 transition"
                >
                  Browse Hardware Catalog
                </button>
              </div>
            ) : (
              activeDrawer.map((item) => (
                <div
                  key={item.id}
                  className="p-3 flex justify-between items-center hover:bg-slate-900/40 transition group gap-3"
                >
                  <div className="flex items-center gap-3 max-w-[70%]">
                    <img
                      src={getComponentThumbnail(item)}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded object-cover border border-slate-800 shrink-0 bg-slate-900"
                    />
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-200 leading-tight">
                          {item.name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            item.category.includes("Microcontroller") || item.category.includes("SBC") || item.category.includes("SOM") || item.category.includes("Platform")
                              ? "bg-cyan-950/60 text-cyan-400 border border-cyan-900/50"
                              : item.category === "Sensor"
                              ? "bg-indigo-950/60 text-indigo-400 border border-indigo-900/50"
                              : item.category === "Actuator"
                              ? "bg-amber-950/60 text-amber-400 border border-amber-900/50"
                              : "bg-slate-900 text-slate-400 border border-slate-800"
                          }`}
                        >
                          {item.category}
                        </span>
                        {item.originCountry && (
                          <span className="text-[8px] bg-emerald-950/80 text-emerald-300 px-1 py-0.2 rounded font-mono border border-emerald-800/40 shrink-0">
                            🛡️ {item.originCountry}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono flex-wrap">
                        {item.manufacturer && (
                          <span className="text-slate-400 font-medium">{item.manufacturer}</span>
                        )}
                        <span>•</span>
                        <span>{item.interface}</span>
                        {item.productUrl && (
                          <a
                            href={item.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-cyan-400 hover:text-cyan-300 font-bold transition hover:underline"
                          >
                            Datasheet
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {item.authorizedSuppliers && item.authorizedSuppliers.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500">Vendors:</span>
                            {item.authorizedSuppliers.map((supplier, sIdx) => (
                              <a
                                key={sIdx}
                                href={supplier.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-emerald-400 hover:text-emerald-300 transition hover:underline"
                                title={`Sourced at ${supplier.name} (${supplier.region})`}
                              >
                                {supplier.name}
                                <ExternalLink className="w-2 h-2 opacity-70" />
                              </a>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-slate-200 font-bold">${item.estimatedPriceUSD}</span>

                    {/* Quick Move to Contingency button */}
                    <button
                      onClick={() => onAddToContingency(item)}
                      className="p-1.5 text-slate-400 hover:text-amber-300 rounded hover:bg-amber-950/30 transition cursor-pointer"
                      title="Save as Supplementary / Contingency alternative"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Item */}
                    <button
                      onClick={() => onRemoveFromDrawer(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-red-950/20 transition cursor-pointer"
                      title="Remove component from Active BOM"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PDF Export & Workshop Sync Action Suite */}
          {activeDrawer.length > 0 && (
            <div className="flex flex-col gap-2.5 pt-2.5 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-0.5">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  PDF Export Layout Mode:
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {pdfExportView === "budget" && "Cost & BOM Breakdown"}
                  {pdfExportView === "wiring" && "Pinout & Wiring Matrix"}
                  {pdfExportView === "full" && "Budget + Wiring (2 Pages)"}
                </span>
              </div>

              {/* View Toggle Selector */}
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  id="btn-layout-mode-budget"
                  onClick={() => setPdfExportView("budget")}
                  className={`py-1.5 px-2 rounded font-mono text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    pdfExportView === "budget"
                      ? "bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-900/40"
                  }`}
                >
                  <DollarSign className="w-3 h-3 text-cyan-400" />
                  Budget Breakdown Mode
                </button>
                <button
                  id="btn-layout-mode-full"
                  onClick={() => setPdfExportView("full")}
                  className={`py-1.5 px-2 rounded font-mono text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    pdfExportView === "full"
                      ? "bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-900/40"
                  }`}
                >
                  <Sliders className="w-3 h-3 text-emerald-400" />
                  Full Dossier Mode
                </button>
              </div>

              {/* MOVED BUTTON: Relocated to the space directly below the PDF Export Layout Mode */}
              <button
                id="btn-export-wiring-package"
                onClick={() => {
                  setPdfExportView("wiring");
                  exportDrawerToPDF("wiring");
                }}
                className="w-full p-3 rounded-xl font-mono transition-all flex items-center justify-between gap-3 cursor-pointer shadow-lg bg-gradient-to-r from-violet-950/90 via-slate-900 to-cyan-950/80 hover:from-violet-900 hover:to-cyan-900/90 border border-violet-500/70 hover:border-violet-400 text-violet-100 group active:scale-[0.99]"
                title="Export 2-Part Wiring Package: Page 1 Edited Wiring Pinout Matrix (No ETA Cost) + Page 2 Full-Page Wiring Schematic with Key as Image"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-900/90 text-violet-300 border border-violet-500/60 group-hover:scale-105 transition-transform shadow-inner">
                    <Workflow className="w-4 h-4 text-violet-300" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white group-hover:text-violet-200 transition-colors">
                        Export Wiring PDF & Schematic Diagram
                      </span>
                      <span className="text-[9px] bg-violet-900 text-violet-200 border border-violet-500/60 px-1.5 py-0.5 rounded font-mono font-semibold">
                        2-Part Export
                      </span>
                    </div>
                    <p className="text-[10px] text-violet-300/80 font-normal mt-0.5">
                      Part 1: Edited Wiring Matrix (No ETA Cost) • Part 2: Full-Page Schematic & Key (Image)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-cyan-300 bg-slate-950/90 px-2.5 py-1 rounded-md border border-cyan-800/70 flex items-center gap-1 shadow-sm group-hover:border-cyan-500">
                    <Download className="w-3 h-3 text-cyan-400" />
                    <span>PDF + PNG</span>
                  </span>
                </div>
              </button>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  id="btn-export-bom-pdf"
                  onClick={() => exportDrawerToPDF(pdfExportView === "wiring" ? "budget" : pdfExportView)}
                  className="py-2.5 px-3 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-100 hover:shadow-cyan-500/10"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {pdfExportView === "full" ? "Export Full Report PDF (3 Pages)" : "Export Budget Report PDF"}
                  </span>
                </button>

                <button
                  id="btn-workshop-qr"
                  onClick={onOpenQRModal}
                  className="py-2.5 px-2 bg-slate-950 hover:bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg group"
                >
                  <QrCode className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>Workshop QR</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUPPLEMENTARY & CONTINGENCY ELECTRONICS LIST */}
      {viewTab === "contingency" && (
        <div className="flex flex-col gap-3.5">
          <div className="p-3 bg-amber-950/20 rounded-lg border border-amber-900/40 flex items-start justify-between gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
                Contingency & Plan B Backups ({contingencyList.length} items)
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Save alternative microcontrollers, sensors, or drivers here. If lead times slip or you pivot designs, swap them straight into your BOM with one click.
              </p>
            </div>
            <span className="font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-1 rounded border border-amber-800/60 shrink-0">
              Est. ${contingencyTotal}
            </span>
          </div>

          <div className="overflow-y-auto max-h-[320px] border border-slate-800 bg-slate-950 rounded-lg divide-y divide-slate-900 pr-1 text-xs">
            {contingencyList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono flex flex-col items-center gap-2">
                <BookmarkCheck className="w-8 h-8 text-slate-600 stroke-1" />
                <p>No contingency components saved yet.</p>
                <p className="text-[11px] text-slate-600">
                  Browse the electronics list and click "Save Contingency" to store backup options.
                </p>
                <button
                  onClick={() => setViewTab("catalog")}
                  className="mt-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-mono text-xs font-bold transition"
                >
                  Browse Sourcing Catalog
                </button>
              </div>
            ) : (
              contingencyList.map((item) => {
                const inBOM = activeDrawer.some((d) => d.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3 flex justify-between items-center hover:bg-slate-900/40 transition group gap-3"
                  >
                    <div className="flex items-center gap-3 max-w-[70%]">
                      <img
                        src={getComponentThumbnail(item)}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded object-cover border border-slate-800 shrink-0 bg-slate-900"
                      />
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-slate-200 leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[9px] bg-amber-950/60 text-amber-400 border border-amber-900/50 px-1.5 py-0.2 rounded font-mono">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{item.specs}</p>
                        {item.authorizedSuppliers && item.authorizedSuppliers.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono mt-0.5">
                            <span className="text-slate-500">Vendors:</span>
                            {item.authorizedSuppliers.map((supplier, sIdx) => (
                              <a
                                key={sIdx}
                                href={supplier.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-amber-400 hover:text-amber-300 transition hover:underline"
                                title={`Sourced at ${supplier.name} (${supplier.region})`}
                              >
                                {supplier.name}
                                <ExternalLink className="w-2 h-2 opacity-70" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-amber-300 font-bold">${item.estimatedPriceUSD}</span>

                      {/* Swap / Add to Active BOM */}
                      <button
                        onClick={() => onSwapContingencyToActive(item)}
                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-mono text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Activate this component in the main BOM"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{inBOM ? "In BOM" : "Activate"}</span>
                      </button>

                      {/* Remove from Contingency */}
                      <button
                        onClick={() => onRemoveFromContingency(item.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-red-950/20 transition cursor-pointer"
                        title="Remove from contingency list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ALL ELECTRONICS & SOURCING CATALOG */}
      {viewTab === "catalog" && (
        <div className="flex flex-col gap-3">
          {/* Search and Category Filters */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search microcontrollers, SBCs, sensors, actuators, motor drivers, LiDAR..."
                value={supplierSearch}
                onChange={(e) => { setSupplierSearch(e.target.value); }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1">
              {[
                "All",
                "Microcontroller",
                "SBC",
                "SOM / Compute",
                "SOM / FPGA & MPSoC",
                "SOM / AI Accelerator",
                "Robot Platform",
                "Animatronics & Expression",
                "Sensor",
                "Actuator",
                "Motor Driver",
                "Power Supply",
                "Accessory"
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategoryFilter(cat); }}
                  className={`px-2 py-1 text-[10px] font-mono rounded transition cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? "bg-cyan-600 text-white font-bold"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => { setNatoFilterOnly(!natoFilterOnly); }}
                className={`ml-auto px-2.5 py-1 text-[10px] font-mono font-bold rounded transition flex items-center gap-1 cursor-pointer ${
                  natoFilterOnly
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
                title="Filter components with US or NATO ally supply origin"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{natoFilterOnly ? "US/NATO Only" : "Filter US/NATO"}</span>
              </button>
            </div>
          </div>

          {/* Catalog Items Grid */}
          <div className="max-h-[350px] overflow-y-auto grid grid-cols-1 gap-2 pr-1 text-xs">
            {filteredCatalog.map((item) => {
              const inDrawer = activeDrawer.some((d) => d.id === item.id);
              const inContingency = contingencyList.some((c) => c.id === item.id);

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border flex flex-col gap-2 transition ${
                    inDrawer
                      ? "bg-cyan-950/20 border-cyan-900/40"
                      : inContingency
                      ? "bg-amber-950/15 border-amber-900/30"
                      : "bg-slate-950 border-slate-850 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 max-w-[70%]">
                      <img
                        src={getComponentThumbnail(item)}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded object-cover border border-slate-800 shrink-0 bg-slate-900"
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-slate-200">{item.name}</strong>
                          <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded font-mono border border-slate-800">
                            {item.category}
                          </span>
                          {item.manufacturer && (
                            <span className="text-[9px] bg-cyan-950/60 text-cyan-300 px-1.5 py-0.2 rounded font-mono border border-cyan-800/40">
                              {item.manufacturer}
                            </span>
                          )}
                          {item.originCountry && (
                            <span className="text-[9px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.2 rounded font-mono border border-emerald-800/60 flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                              {item.originCountry}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{item.specs}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-0.5 flex-wrap">
                          <span>Logic: <strong className="text-slate-400">{item.voltage}</strong></span>
                          <span>Interface: <strong className="text-slate-400">{item.interface}</strong></span>
                          {item.productUrl && (
                            <a
                              href={item.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                            >
                              Spec / Store
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons: Add to BOM vs Add to Contingency */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="font-mono text-cyan-400 font-bold">${item.estimatedPriceUSD}</span>
                      
                      <div className="flex items-center gap-1">
                        {/* Save as Contingency */}
                        <button
                          onClick={() => {
                            if (inContingency) {
                              onRemoveFromContingency(item.id);
                            } else {
                              onAddToContingency(item);
                            }
                          }}
                          className={`p-1.5 rounded text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer border ${
                            inContingency
                              ? "bg-amber-950 text-amber-300 border-amber-700/80"
                              : "bg-slate-900 text-slate-400 hover:text-amber-300 border-slate-800 hover:bg-slate-850"
                          }`}
                          title={inContingency ? "Remove from Contingency List" : "Save as Supplementary / Contingency Backup"}
                        >
                          <BookmarkCheck className="w-3.5 h-3.5" />
                          <span>{inContingency ? "Saved" : "Backup"}</span>
                        </button>

                        {/* Add to Active BOM */}
                        {(() => {
                          const isBrain =
                            item.category.includes("Microcontroller") ||
                            item.category.includes("SBC") ||
                            item.category.includes("SOM") ||
                            item.category.includes("Platform");
                          return (
                            <button
                              onClick={() => onAddToDrawer(item)}
                              disabled={inDrawer && !isBrain}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition flex items-center gap-1 cursor-pointer ${
                                inDrawer
                                  ? isBrain
                                    ? "bg-cyan-950 text-cyan-400 border border-cyan-800/40"
                                    : "bg-emerald-950 text-emerald-400 border border-emerald-900/40 cursor-default"
                                  : "bg-cyan-600 text-white hover:bg-cyan-500"
                              }`}
                            >
                              {inDrawer ? (
                                isBrain ? (
                                  "Active Controller"
                                ) : (
                                  <>
                                    <Check className="w-3 h-3" />
                                    In BOM
                                  </>
                                )
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  Add BOM
                                </>
                              )}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Authorized Suppliers Bar */}
                  {item.authorizedSuppliers && item.authorizedSuppliers.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] flex-wrap gap-1.5">
                      <span className="text-slate-500 font-mono flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-emerald-400" />
                        Authorized Vendors:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.authorizedSuppliers.map((supplier, sIdx) => (
                          <a
                            key={sIdx}
                            href={supplier.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 text-cyan-400 hover:text-cyan-300 font-mono rounded border border-slate-800 hover:border-cyan-700/60 transition flex items-center gap-1"
                          >
                            <span>{supplier.name}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Toolbar directly below Catalog Items Table */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2.5">
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="text-slate-500">Components in view:</span>
              <span className="font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {filteredCatalog.length}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {onOpenVendorDirectory && (
                <button
                  onClick={onOpenVendorDirectory}
                  className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/80 hover:border-emerald-600 transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
                  title="Open Authorized Vendors & Sourcing Directory"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authorized Vendors Hub</span>
                </button>
              )}

              {(onOpenCompare || onOpenDatasheet) && (
                <button
                  id="btn-catalog-compare-specs"
                  onClick={onOpenCompare || onOpenDatasheet}
                  className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-violet-950/80 hover:bg-violet-900 text-violet-200 border border-violet-700/80 hover:border-violet-600 transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
                  title="Compare two hardware components side-by-side"
                >
                  <Scale className="w-3.5 h-3.5 text-violet-400" />
                  <span>Compare Specs</span>
                </button>
              )}

              {onOpenDatasheet && (
                <button
                  id="btn-catalog-master-datasheet"
                  onClick={onOpenDatasheet}
                  className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-700/80 hover:border-cyan-600 transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
                  title="Open comprehensive Sensors & SOM Master Datasheet (.CSV / Table)"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Master Datasheet (.CSV)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EQUIPMENT & COMPONENTS SEARCH (LARGER SAMPLE) */}
      {viewTab === "sourcing" && (
        <EquipmentComponentSearch
          catalog={catalog}
          getComponentThumbnail={getComponentThumbnail}
          onAddComponent={(item) => {
            onAddToDrawer(item);
            triggerNotification(`Added ${item.name} to active BOM.`);
          }}
          onAddContingency={(item) => {
            onAddToContingency(item);
            triggerNotification(`Saved ${item.name} to supplementary contingencies.`);
          }}
          onOpenVendorDirectory={onOpenVendorDirectory}
        />
      )}
    </div>
  );
};
