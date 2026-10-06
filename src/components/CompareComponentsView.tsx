import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  Scale,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  ShieldCheck,
  SlidersHorizontal,
  BookmarkCheck,
  Search,
  ChevronDown
} from "lucide-react";
import { HardwareComponent } from "../types";
import { DATASHEET_ENTRIES, DatasheetRow } from "./DatasheetModal";
import { generateHardwareSvg } from "../lib/hardwareThumbnails";

export interface UnifiedComparisonItem {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  coreProcessor: string;
  coProcessorOrNPU: string;
  clockSpeed: string;
  ramAndFlash: string;
  voltage: string;
  interface: string;
  connectorType: string;
  operatingTemp: string;
  specs: string;
  priceUSD: number;
  origin: string;
  productUrl?: string;
  inDrawer: boolean;
  rawComponent?: HardwareComponent;
}

export interface CompareComponentsViewProps {
  activeDrawer?: HardwareComponent[];
  catalog?: HardwareComponent[];
  onAddToDrawer?: (item: HardwareComponent) => void;
  onRemoveFromDrawer?: (id: string) => void;
  onNotify?: (msg: string) => void;
  getComponentThumbnail?: (item: HardwareComponent) => string;
}

export function CompareComponentsView({
  activeDrawer = [],
  catalog = [],
  onAddToDrawer,
  onRemoveFromDrawer,
  onNotify,
  getComponentThumbnail
}: CompareComponentsViewProps) {
  // Pool of all available components (combining drawer, catalog, and datasheet entries)
  const unifiedPool: UnifiedComparisonItem[] = useMemo(() => {
    const map = new Map<string, UnifiedComparisonItem>();

    // 1. Add active drawer items first
    activeDrawer.forEach((item) => {
      // Check if item has a match in DATASHEET_ENTRIES for richer processor details
      const sheetMatch = DATASHEET_ENTRIES.find(
        (ds) =>
          ds.productName.toLowerCase().includes(item.name.toLowerCase()) ||
          item.name.toLowerCase().includes(ds.productName.toLowerCase())
      );

      map.set(item.id, {
        id: item.id,
        name: item.name,
        category: item.category,
        manufacturer: item.manufacturer || sheetMatch?.manufacturer || "Industrial Robotics Supplier",
        coreProcessor: sheetMatch?.coreProcessor || item.specs.split(",")[0] || "Embedded Processing Core",
        coProcessorOrNPU: sheetMatch?.coProcessorOrNPU || "Standard Hardware Acceleration",
        clockSpeed: sheetMatch?.clockSpeed || "Real-Time Frequency",
        ramAndFlash: sheetMatch?.ramAndFlash || "Internal Registers / SRAM",
        voltage: item.voltage || sheetMatch?.voltage || "3.3V / 5.0V",
        interface: item.interface || sheetMatch?.interface || "Standard I/O",
        connectorType: sheetMatch?.connectorType || "Standard 0.1\" Header / Terminal",
        operatingTemp: sheetMatch?.operatingTemp || "-20°C ~ +70°C",
        specs: item.specs || sheetMatch?.specs || "",
        priceUSD: item.estimatedPriceUSD,
        origin: item.originCountry || sheetMatch?.origin || "US / Allied Sourced",
        productUrl: item.productUrl || sheetMatch?.url,
        inDrawer: true,
        rawComponent: item
      });
    });

    // 2. Add catalog items (if not already added)
    catalog.forEach((item) => {
      if (!map.has(item.id)) {
        const sheetMatch = DATASHEET_ENTRIES.find(
          (ds) =>
            ds.productName.toLowerCase().includes(item.name.toLowerCase()) ||
            item.name.toLowerCase().includes(ds.productName.toLowerCase())
        );

        map.set(item.id, {
          id: item.id,
          name: item.name,
          category: item.category,
          manufacturer: item.manufacturer || sheetMatch?.manufacturer || "Robotics Supplier",
          coreProcessor: sheetMatch?.coreProcessor || item.specs.split(",")[0] || "Embedded Core",
          coProcessorOrNPU: sheetMatch?.coProcessorOrNPU || "Hardware Peripherals",
          clockSpeed: sheetMatch?.clockSpeed || "Standard Clock",
          ramAndFlash: sheetMatch?.ramAndFlash || "System Memory",
          voltage: item.voltage || sheetMatch?.voltage || "3.3V / 5.0V",
          interface: item.interface || sheetMatch?.interface || "Standard Interface",
          connectorType: sheetMatch?.connectorType || "Header / Terminal",
          operatingTemp: sheetMatch?.operatingTemp || "-20°C ~ +70°C",
          specs: item.specs || sheetMatch?.specs || "",
          priceUSD: item.estimatedPriceUSD,
          origin: item.originCountry || sheetMatch?.origin || "Sourced",
          productUrl: item.productUrl || sheetMatch?.url,
          inDrawer: activeDrawer.some((d) => d.id === item.id),
          rawComponent: item
        });
      }
    });

    // 3. Add datasheet entries that aren't already represented
    DATASHEET_ENTRIES.forEach((ds, idx) => {
      const id = `ds_${idx}_${ds.productName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`;
      const existing = Array.from(map.values()).find(
        (val) => val.name.toLowerCase() === ds.productName.toLowerCase()
      );
      if (!existing) {
        map.set(id, {
          id,
          name: ds.productName,
          category: ds.category,
          manufacturer: ds.manufacturer,
          coreProcessor: ds.coreProcessor,
          coProcessorOrNPU: ds.coProcessorOrNPU,
          clockSpeed: ds.clockSpeed,
          ramAndFlash: ds.ramAndFlash,
          voltage: ds.voltage,
          interface: ds.interface,
          connectorType: ds.connectorType,
          operatingTemp: ds.operatingTemp,
          specs: ds.specs,
          priceUSD: ds.priceUSD,
          origin: ds.origin,
          productUrl: ds.url,
          inDrawer: false
        });
      }
    });

    return Array.from(map.values());
  }, [activeDrawer, catalog]);

  // Selected item IDs
  const [selectedIdA, setSelectedIdA] = useState<string>("");
  const [selectedIdB, setSelectedIdB] = useState<string>("");
  const [copiedMD, setCopiedMD] = useState(false);

  // Initialize selected IDs based on activeDrawer
  useEffect(() => {
    if (activeDrawer.length >= 2) {
      if (!selectedIdA || !unifiedPool.some((i) => i.id === selectedIdA)) {
        setSelectedIdA(activeDrawer[0].id);
      }
      if (!selectedIdB || !unifiedPool.some((i) => i.id === selectedIdB)) {
        setSelectedIdB(activeDrawer[1].id);
      }
    } else if (activeDrawer.length === 1) {
      if (!selectedIdA) setSelectedIdA(activeDrawer[0].id);
      if (!selectedIdB) {
        // Choose a complementary item from unifiedPool that is not item A
        const other = unifiedPool.find((i) => i.id !== activeDrawer[0].id);
        if (other) setSelectedIdB(other.id);
      }
    } else if (unifiedPool.length >= 2) {
      if (!selectedIdA) setSelectedIdA(unifiedPool[0].id);
      if (!selectedIdB) setSelectedIdB(unifiedPool[1].id);
    }
  }, [activeDrawer, unifiedPool]);

  // Swap components
  const handleSwap = () => {
    const temp = selectedIdA;
    setSelectedIdA(selectedIdB);
    setSelectedIdB(temp);
    onNotify?.("Swapped comparison slots (A ↔ B)");
  };

  // Resolved items
  const itemA = useMemo(() => {
    return unifiedPool.find((i) => i.id === selectedIdA) || unifiedPool[0] || null;
  }, [unifiedPool, selectedIdA]);

  const itemB = useMemo(() => {
    return unifiedPool.find((i) => i.id === selectedIdB) || unifiedPool[1] || null;
  }, [unifiedPool, selectedIdB]);

  // Compatibility & Delta Engine
  const analysis = useMemo(() => {
    if (!itemA || !itemB) return null;

    // 1. Voltage comparison
    const voltA = (itemA.voltage || "").toLowerCase();
    const voltB = (itemB.voltage || "").toLowerCase();
    const isBoth33 = voltA.includes("3.3") && voltB.includes("3.3");
    const isBoth50 = voltA.includes("5") && voltB.includes("5") && !voltA.includes("3.3") && !voltB.includes("3.3");
    const isMismatch = (voltA.includes("3.3") && voltB.includes("5") && !voltB.includes("3.3")) ||
                       (voltB.includes("3.3") && voltA.includes("5") && !voltA.includes("3.3"));

    let voltageStatus: "direct_match" | "level_shifter_required" | "power_stage_warning" | "compatible" = "compatible";
    let voltageNote = "Verify matching supply rails and logic thresholds prior to interconnecting.";

    if (isBoth33) {
      voltageStatus = "direct_match";
      voltageNote = "Direct Logic Match (3.3V CMOS): Both modules can share direct I/O pins, I2C pull-ups, and SPI data lines without level shifting.";
    } else if (isBoth50) {
      voltageStatus = "direct_match";
      voltageNote = "Direct Logic Match (5.0V TTL): Both modules operate natively at 5V logic rails.";
    } else if (isMismatch) {
      voltageStatus = "level_shifter_required";
      voltageNote = "Logic Level Shifter Required: 3.3V logic inputs cannot tolerate 5.0V signals. Use a bidirectional MOSFET shifter (e.g. BSS138) or TXS0108E.";
    } else if (voltA.includes("12") || voltB.includes("12") || voltA.includes("24") || voltB.includes("24")) {
      voltageStatus = "power_stage_warning";
      voltageNote = "High Voltage / Motor Isolation: One module uses high DC voltage. Ensure optocoupled logic isolation or separate ground planes.";
    }

    // 2. Protocols
    const parseProtocols = (str: string) => {
      const protocols = ["i2c", "spi", "uart", "pwm", "can", "pcie", "adc", "gpio", "usb", "ble", "wi-fi"];
      const s = str.toLowerCase();
      return protocols.filter((p) => s.includes(p));
    };

    const protoA = parseProtocols(`${itemA.interface} ${itemA.specs}`);
    const protoB = parseProtocols(`${itemB.interface} ${itemB.specs}`);
    const sharedProtocols = protoA.filter((p) => protoB.includes(p));

    // 3. Price Delta
    const priceDiff = Math.abs(itemA.priceUSD - itemB.priceUSD);
    const percentDiff = itemA.priceUSD > 0
      ? Math.round(((itemB.priceUSD - itemA.priceUSD) / itemA.priceUSD) * 100)
      : 0;

    return {
      voltageStatus,
      voltageNote,
      sharedProtocols,
      priceDiff,
      percentDiff
    };
  }, [itemA, itemB]);

  // Export comparison table as Markdown
  const handleCopyMarkdown = () => {
    if (!itemA || !itemB) return;
    const text = [
      `# Component Comparison: ${itemA.name} vs ${itemB.name}`,
      ``,
      `| Specification | ${itemA.name} | ${itemB.name} | Delta / Comparison |`,
      `| :--- | :--- | :--- | :--- |`,
      `| **Category** | ${itemA.category} | ${itemB.category} | ${itemA.category === itemB.category ? "Identical Category" : "Different Architecture Tier"} |`,
      `| **Manufacturer** | ${itemA.manufacturer} | ${itemB.manufacturer} | ${itemA.manufacturer === itemB.manufacturer ? "Same Manufacturer" : "Cross-Vendor"} |`,
      `| **Price (USD)** | $${itemA.priceUSD.toFixed(2)} | $${itemB.priceUSD.toFixed(2)} | Diff: $${analysis?.priceDiff.toFixed(2)} (${analysis?.percentDiff}% relative) |`,
      `| **Operating Voltage** | ${itemA.voltage} | ${itemB.voltage} | ${analysis?.voltageNote} |`,
      `| **Core Processor** | ${itemA.coreProcessor} | ${itemB.coreProcessor} | ${itemA.coreProcessor === itemB.coreProcessor ? "Matching Core" : "Alternative Compute"} |`,
      `| **Co-Processor / NPU** | ${itemA.coProcessorOrNPU} | ${itemB.coProcessorOrNPU} | - |`,
      `| **Clock Frequency** | ${itemA.clockSpeed} | ${itemB.clockSpeed} | - |`,
      `| **Memory (RAM/Flash)** | ${itemA.ramAndFlash} | ${itemB.ramAndFlash} | - |`,
      `| **Communication Buses** | ${itemA.interface} | ${itemB.interface} | Shared: ${analysis?.sharedProtocols.join(", ") || "None"} |`,
      `| **Connector / Headers** | ${itemA.connectorType} | ${itemB.connectorType} | - |`,
      `| **Operating Temp** | ${itemA.operatingTemp} | ${itemB.operatingTemp} | - |`,
      `| **Sourcing Origin** | ${itemA.origin} | ${itemB.origin} | - |`,
      `| **Direct Vendor URL** | ${itemA.productUrl || "N/A"} | ${itemB.productUrl || "N/A"} | - |`,
      ``,
      `*Generated from Robotics Workshop BOM Comparator*`
    ].join("\n");

    void navigator.clipboard.writeText(text);
    setCopiedMD(true);
    setTimeout(() => { setCopiedMD(false); }, 2000);
    onNotify?.("Copied Side-by-Side Comparison Markdown to clipboard!");
  };

  const getThumbnailSrc = (item: UnifiedComparisonItem) => {
    if (item.rawComponent && getComponentThumbnail) {
      return getComponentThumbnail(item.rawComponent);
    }
    return generateHardwareSvg(item.name, item.category, item.id);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/80 font-mono text-xs">
      {/* TOP CONTROLS & DRAWER QUICK-PICK BAR */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 shrink-0 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-violet-400 font-bold flex items-center gap-1.5 text-xs">
              <Scale className="w-4 h-4 text-violet-400" />
              Side-by-Side Spec Comparator
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {activeDrawer.length} item{activeDrawer.length === 1 ? "" : "s"} in your build drawer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:text-white"
              title="Swap Slot A and Slot B"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>Swap (A ↔ B)</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:text-white"
              title="Copy comparison as Markdown table"
            >
              {copiedMD ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedMD ? "Copied Markdown!" : "Copy Report"}</span>
            </button>
          </div>
        </div>

        {/* ACTIVE DRAWER CHIPS (FAST 1-CLICK SELECTOR) */}
        {activeDrawer.length > 0 ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
            <span className="text-slate-500 shrink-0 flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
              Drawer Items:
            </span>
            {activeDrawer.map((d) => {
              const isSelectedA = selectedIdA === d.id;
              const isSelectedB = selectedIdB === d.id;
              return (
                <div
                  key={d.id}
                  className={`px-2 py-1 rounded-lg border flex items-center gap-1.5 whitespace-nowrap transition ${
                    isSelectedA
                      ? "bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm"
                      : isSelectedB
                      ? "bg-violet-950/80 border-violet-500 text-violet-200 shadow-sm"
                      : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="font-semibold">{d.name}</span>
                  <div className="flex items-center gap-1 ml-1">
                    <button
                      onClick={() => { setSelectedIdA(d.id); }}
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold cursor-pointer transition ${
                        isSelectedA
                          ? "bg-cyan-500 text-slate-950"
                          : "bg-slate-800 hover:bg-cyan-900 text-slate-300 hover:text-cyan-200"
                      }`}
                      title="Load into Slot A (Left)"
                    >
                      A
                    </button>
                    <button
                      onClick={() => { setSelectedIdB(d.id); }}
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold cursor-pointer transition ${
                        isSelectedB
                          ? "bg-violet-500 text-slate-950"
                          : "bg-slate-800 hover:bg-violet-900 text-slate-300 hover:text-violet-200"
                      }`}
                      title="Load into Slot B (Right)"
                    >
                      B
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800 text-slate-400 text-[11px] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Your build drawer is currently empty. We have loaded items from your component catalog and scraped suppliers (Micro Center, PiShop, Newark, Adafruit, DigiKey) so you can compare any two modules!
            </span>
          </div>
        )}

        {/* COMPONENT SELECTOR DROPDOWNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Selector A */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Component A (Left Slot)</span>
              {itemA.inDrawer && (
                <span className="text-[9px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800">
                  In Drawer
                </span>
              )}
            </label>
            <select
              value={selectedIdA}
              onChange={(e) => { setSelectedIdA(e.target.value); }}
              className="bg-slate-900 border border-cyan-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {activeDrawer.length > 0 && (
                <optgroup label="── Active Build Drawer ──">
                  {activeDrawer.map((d) => (
                    <option key={`drawer-a-${d.id}`} value={d.id}>
                      ★ {d.name} (${d.estimatedPriceUSD}) [{d.category}]
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="── Catalog & Scraped Suppliers (Micro Center, PiShop, Newark, DigiKey, Adafruit) ──">
                {unifiedPool
                  .filter((i) => !activeDrawer.some((d) => d.id === i.id))
                  .map((i) => (
                    <option key={`catalog-a-${i.id}`} value={i.id}>
                      {i.name} (${i.priceUSD}) [{i.category}]
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Selector B */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-violet-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Component B (Right Slot)</span>
              {itemB.inDrawer && (
                <span className="text-[9px] text-violet-300 bg-violet-950/80 px-1.5 py-0.2 rounded border border-violet-800">
                  In Drawer
                </span>
              )}
            </label>
            <select
              value={selectedIdB}
              onChange={(e) => { setSelectedIdB(e.target.value); }}
              className="bg-slate-900 border border-violet-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-violet-400 cursor-pointer"
            >
              {activeDrawer.length > 0 && (
                <optgroup label="── Active Build Drawer ──">
                  {activeDrawer.map((d) => (
                    <option key={`drawer-b-${d.id}`} value={d.id}>
                      ★ {d.name} (${d.estimatedPriceUSD}) [{d.category}]
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="── Catalog & Scraped Suppliers (Micro Center, PiShop, Newark, DigiKey, Adafruit) ──">
                {unifiedPool
                  .filter((i) => !activeDrawer.some((d) => d.id === i.id))
                  .map((i) => (
                    <option key={`catalog-b-${i.id}`} value={i.id}>
                      {i.name} (${i.priceUSD}) [{i.category}]
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN SCROLLABLE COMPARISON BODY */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-4">
        {/* HERO CARDS SIDE-BY-SIDE */}
        {itemA && itemB && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Card A */}
            <div className="p-3.5 bg-slate-900/90 border border-cyan-800/60 rounded-xl flex flex-col gap-3 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-700" />
              <div className="flex items-start gap-3">
                <img
                  src={getThumbnailSrc(itemA)}
                  alt={itemA.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-contain bg-slate-950 border border-slate-800 p-1 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                      {itemA.category}
                    </span>
                    {itemA.inDrawer ? (
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        In Drawer
                      </span>
                    ) : (
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                        Catalog / Sourced
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 leading-snug break-words">
                    {itemA.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    by {itemA.manufacturer}
                  </div>
                </div>
              </div>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-3 gap-2 p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 text-center">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Unit Price</div>
                  <div className="text-sm font-bold text-emerald-400">
                    ${itemA.priceUSD.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Logic Voltage</div>
                  <div className="text-xs font-bold text-cyan-300">
                    {itemA.voltage.split("/")[0] || itemA.voltage}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Origin</div>
                  <div className="text-[10px] font-bold text-slate-300 truncate">
                    {itemA.origin.split("(")[0].trim() || "USA"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-auto pt-1">
                {itemA.inDrawer && onRemoveFromDrawer && itemA.rawComponent ? (
                  <button
                    onClick={() => {
                      onRemoveFromDrawer(itemA.id);
                      onNotify?.(`Removed ${itemA.name} from drawer`);
                    }}
                    className="flex-1 py-1.5 px-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/70 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove from Drawer</span>
                  </button>
                ) : onAddToDrawer && itemA.rawComponent ? (
                  <button
                    onClick={() => {
                      onAddToDrawer(itemA.rawComponent!);
                      onNotify?.(`Added ${itemA.name} to drawer`);
                    }}
                    className="flex-1 py-1.5 px-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Drawer</span>
                  </button>
                ) : null}

                {itemA.productUrl && (
                  <a
                    href={itemA.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Store / Spec</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Card B */}
            <div className="p-3.5 bg-slate-900/90 border border-violet-800/60 rounded-xl flex flex-col gap-3 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
              <div className="flex items-start gap-3">
                <img
                  src={getThumbnailSrc(itemB)}
                  alt={itemB.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-contain bg-slate-950 border border-slate-800 p-1 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] bg-violet-950 text-violet-300 border border-violet-800 px-2 py-0.5 rounded font-bold">
                      {itemB.category}
                    </span>
                    {itemB.inDrawer ? (
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        In Drawer
                      </span>
                    ) : (
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                        Catalog / Sourced
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 leading-snug break-words">
                    {itemB.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    by {itemB.manufacturer}
                  </div>
                </div>
              </div>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-3 gap-2 p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 text-center">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Unit Price</div>
                  <div className="text-sm font-bold text-emerald-400">
                    ${itemB.priceUSD.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Logic Voltage</div>
                  <div className="text-xs font-bold text-violet-300">
                    {itemB.voltage.split("/")[0] || itemB.voltage}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Origin</div>
                  <div className="text-[10px] font-bold text-slate-300 truncate">
                    {itemB.origin.split("(")[0].trim() || "USA"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-auto pt-1">
                {itemB.inDrawer && onRemoveFromDrawer && itemB.rawComponent ? (
                  <button
                    onClick={() => {
                      onRemoveFromDrawer(itemB.id);
                      onNotify?.(`Removed ${itemB.name} from drawer`);
                    }}
                    className="flex-1 py-1.5 px-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/70 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove from Drawer</span>
                  </button>
                ) : onAddToDrawer && itemB.rawComponent ? (
                  <button
                    onClick={() => {
                      onAddToDrawer(itemB.rawComponent!);
                      onNotify?.(`Added ${itemB.name} to drawer`);
                    }}
                    className="flex-1 py-1.5 px-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Drawer</span>
                  </button>
                ) : null}

                {itemB.productUrl && (
                  <a
                    href={itemB.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Store / Spec</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM COMPATIBILITY & DELTA INSIGHTS */}
        {analysis && itemA && itemB && (
          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Automated Engineering Compatibility &amp; Interconnect Analysis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Voltage Card */}
              <div
                className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
                  analysis.voltageStatus === "direct_match"
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                    : analysis.voltageStatus === "level_shifter_required"
                    ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  {analysis.voltageStatus === "direct_match" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : analysis.voltageStatus === "level_shifter_required" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>Voltage Compatibility</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {analysis.voltageNote}
                </p>
              </div>

              {/* Shared Protocols Card */}
              <div className="p-2.5 rounded-lg border bg-slate-950 border-slate-800 flex flex-col gap-1 text-slate-300">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Communication Protocols</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {analysis.sharedProtocols.length > 0 ? (
                    <>
                      Shared buses:{" "}
                      <span className="text-cyan-300 font-bold uppercase">
                        {analysis.sharedProtocols.join(", ")}
                      </span>
                      . Direct data link feasible.
                    </>
                  ) : (
                    "No identical bus protocols detected. An intermediary bridge (e.g. UART-to-I2C or SPI) may be required."
                  )}
                </p>
              </div>

              {/* Cost Differential Card */}
              <div className="p-2.5 rounded-lg border bg-slate-950 border-slate-800 flex flex-col gap-1 text-slate-300">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cost Differential</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Price difference is{" "}
                  <span className="text-emerald-400 font-bold">
                    ${analysis.priceDiff.toFixed(2)} USD
                  </span>
                  .{" "}
                  {itemA.priceUSD < itemB.priceUSD
                    ? `${itemA.name} is ${Math.abs(analysis.percentDiff)}% more economical.`
                    : itemB.priceUSD < itemA.priceUSD
                    ? `${itemB.name} is ${Math.abs(analysis.percentDiff)}% more economical.`
                    : "Both items are identically priced."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DETAILED SIDE-BY-SIDE SPECIFICATION TABLE */}
        {itemA && itemB && (
          <div className="border border-slate-800 rounded-xl overflow-hidden shadow-inner bg-slate-950/70">
            <div className="p-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                Comprehensive Technical Specifications Matrix
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                14 Comparative Parameters
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-3 w-1/4">Specification Parameter</th>
                    <th className="p-3 w-[37%] bg-cyan-950/20 text-cyan-300 border-l border-r border-slate-800/80">
                      {itemA.name} (Slot A)
                    </th>
                    <th className="p-3 w-[38%] bg-violet-950/20 text-violet-300">
                      {itemB.name} (Slot B)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-[11px]">
                  {/* Category */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Architecture Category</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                        {itemA.category}
                      </span>
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      <span className="px-2 py-0.5 rounded bg-violet-950 border border-violet-800 text-violet-300 font-bold">
                        {itemB.category}
                      </span>
                    </td>
                  </tr>

                  {/* Manufacturer */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Manufacturer &amp; Brand</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      {itemA.manufacturer}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      {itemB.manufacturer}
                    </td>
                  </tr>

                  {/* Unit Price */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Estimated Unit Cost</td>
                    <td className="p-3 bg-cyan-950/10 border-l border-r border-slate-800/80">
                      <span className="text-emerald-400 font-bold text-xs">
                        ${itemA.priceUSD.toFixed(2)} USD
                      </span>
                    </td>
                    <td className="p-3 bg-violet-950/10">
                      <span className="text-emerald-400 font-bold text-xs">
                        ${itemB.priceUSD.toFixed(2)} USD
                      </span>
                    </td>
                  </tr>

                  {/* Operating Voltage */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Supply &amp; Logic Voltage</td>
                    <td className="p-3 bg-cyan-950/10 text-cyan-200 font-bold border-l border-r border-slate-800/80">
                      {itemA.voltage}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-violet-200 font-bold">
                      {itemB.voltage}
                    </td>
                  </tr>

                  {/* Core Processor */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Primary Core Processor</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      {itemA.coreProcessor}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      {itemB.coreProcessor}
                    </td>
                  </tr>

                  {/* Co-Processor / NPU */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Co-Processor / Accelerator / NPU</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      {itemA.coProcessorOrNPU}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      {itemB.coProcessorOrNPU}
                    </td>
                  </tr>

                  {/* Clock Frequency */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Clock Frequency / Execution Speed</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      {itemA.clockSpeed}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      {itemB.clockSpeed}
                    </td>
                  </tr>

                  {/* Memory */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">RAM, Flash &amp; Storage</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      {itemA.ramAndFlash}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      {itemB.ramAndFlash}
                    </td>
                  </tr>

                  {/* Communication Interface */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Buses, Peripherals &amp; Comms</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      {itemA.interface}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      {itemB.interface}
                    </td>
                  </tr>

                  {/* Connector Form Factor */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Pinout &amp; Connector Form Factor</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      {itemA.connectorType}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      {itemB.connectorType}
                    </td>
                  </tr>

                  {/* Operating Temperature */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Operating Temperature Range</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      {itemA.operatingTemp}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      {itemB.operatingTemp}
                    </td>
                  </tr>

                  {/* Key Hardware Specs */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Technical Capabilities &amp; Notes</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-300 leading-relaxed border-l border-r border-slate-800/80">
                      {itemA.specs}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-300 leading-relaxed">
                      {itemB.specs}
                    </td>
                  </tr>

                  {/* Sourcing Origin */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Supply Chain &amp; NATO Alliance</td>
                    <td className="p-3 bg-cyan-950/10 text-slate-200 border-l border-r border-slate-800/80">
                      {itemA.origin}
                    </td>
                    <td className="p-3 bg-violet-950/10 text-slate-200">
                      {itemB.origin}
                    </td>
                  </tr>

                  {/* Direct Vendor & Sourcing Destination Links */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-400">Authorized Vendors &amp; Sourcing</td>
                    <td className="p-3 bg-cyan-950/10 border-l border-r border-slate-800/80">
                      <div className="flex flex-col gap-1.5 text-xs font-mono">
                        {itemA.authorizedSuppliers && itemA.authorizedSuppliers.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {itemA.authorizedSuppliers.map((sup, idx) => (
                              <a
                                key={idx}
                                href={sup.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-850 text-cyan-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/60 transition"
                                title={`Buy from ${sup.name} (${sup.region})`}
                              >
                                <span>{sup.name}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        ) : null}
                        {itemA.productUrl && (
                          <a
                            href={itemA.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold underline"
                          >
                            <span>Datasheet / Official Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {!itemA.productUrl && (!itemA.authorizedSuppliers || itemA.authorizedSuppliers.length === 0) && (
                          <span className="text-slate-500">In Workshop BOM</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 bg-violet-950/10">
                      <div className="flex flex-col gap-1.5 text-xs font-mono">
                        {itemB.authorizedSuppliers && itemB.authorizedSuppliers.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {itemB.authorizedSuppliers.map((sup, idx) => (
                              <a
                                key={idx}
                                href={sup.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-850 text-violet-400 hover:text-violet-300 border border-slate-800 hover:border-violet-700/60 transition"
                                title={`Buy from ${sup.name} (${sup.region})`}
                              >
                                <span>{sup.name}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        ) : null}
                        {itemB.productUrl && (
                          <a
                            href={itemB.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold underline"
                          >
                            <span>Datasheet / Official Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {!itemB.productUrl && (!itemB.authorizedSuppliers || itemB.authorizedSuppliers.length === 0) && (
                          <span className="text-slate-500">In Workshop BOM</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
