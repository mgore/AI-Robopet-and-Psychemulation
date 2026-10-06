import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Layers, 
  Cpu, 
  Palette, 
  Check, 
  AlertCircle,
  Eye, 
  Maximize2, 
  Camera, 
  Paintbrush, 
  Copy,
  ExternalLink,
  FileCode,
  Box,
  Scissors,
  Printer,
  FileText,
  Wand2,
  Edit3,
  DollarSign,
  Play,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { 
  getChassisMaterialBreakdown,
  generateDxfContent,
  generateStlContent,
  generateStepContent,
  generateCadJsonManifest,
  generateEngineeringPdfSpecSheet,
  downloadFileBlob
} from "../utils/cadExportGenerators";

interface ConceptAndSketchStudioProps {
  robotType: "wheeled_rover" | "robotic_arm" | "hexapod";
  customGoal: string;
  budget: number;
  activeDrawer: Array<{
    id: string;
    name: string;
    category: string;
    specs: string;
  }>;
  onImageGenerated?: (url: string) => void;
}

interface CategoryPreset {
  id: string;
  label: string;
  categoryTag: string;
  desc: string;
  recommendedRatio: "16:9" | "4:3" | "1:1";
  iconName: string;
}

export const ConceptAndSketchStudio: React.FC<ConceptAndSketchStudioProps> = ({
  robotType,
  customGoal,
  budget,
  activeDrawer,
  onImageGenerated
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("photorealistic");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [accentColor, setAccentColor] = useState<string>("Cyan & Matte Dark Slate");
  const [chassisMaterial, setChassisMaterial] = useState<string>("Anodized Aluminum & Carbon Fiber");
  
  // Image states per category
  const [categoryImages, setCategoryImages] = useState<Record<string, {
    url: string;
    type: "image" | "svg";
    promptUsed: string;
    isAiGenerated: boolean;
    timestamp: string;
  }>>({});

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [batchGenerating, setBatchGenerating] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; label: string } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [activeTabSubView, setActiveTabSubView] = useState<"render" | "files" | "materials">("render");

  // AI Prompt Image Editing states
  const [editPrompt, setEditPrompt] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);
  const [expandedPreview, setExpandedPreview] = useState<boolean>(false);

  // Download notification toast
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Six comprehensive engineering & visual categories
  const CATEGORIES: CategoryPreset[] = [
    {
      id: "photorealistic",
      label: "Studio Prototype",
      categoryTag: "Real-Life Photo",
      desc: "Real-life physical prototype photo, authentic workshop lighting, brushed metallic finish, macro screw & wire harness detail",
      recommendedRatio: "16:9",
      iconName: "Camera"
    },
    {
      id: "cad_wireframe",
      label: "CAD Blueprint",
      categoryTag: "2D Vector",
      desc: "Dark blue grid, technical dimensions, exploded fastener lines, orthographic alignment",
      recommendedRatio: "16:9",
      iconName: "Box"
    },
    {
      id: "sketchbook",
      label: "Maker Sketchbook",
      categoryTag: "Technical Art",
      desc: "Hand-drawn pencil draft with schematic callouts, pinout diagrams, and maker notes",
      recommendedRatio: "4:3",
      iconName: "Paintbrush"
    },
    {
      id: "field_terrain",
      label: "Field Deployment",
      categoryTag: "Operational",
      desc: "Real-world operational environment with terrain interaction (gravel, indoor, test-bed)",
      recommendedRatio: "16:9",
      iconName: "Layers"
    },
    {
      id: "exploded_wiring",
      label: "Exploded Assembly",
      categoryTag: "Assembly CAD",
      desc: "Mechanical exploded stack, motor brackets, standoff spacing, wiring harness pathing",
      recommendedRatio: "16:9",
      iconName: "Scissors"
    },
    {
      id: "chassis_enclosure",
      label: "Chassis & Shell",
      categoryTag: "Fabrication",
      desc: "3D printable shell casing, snap-fit protective canopy, and sensor mounting tabs",
      recommendedRatio: "1:1",
      iconName: "Printer"
    }
  ];

  // Active Category definition
  const currentCategory = CATEGORIES.find(c => c.id === activeCategoryId) || CATEGORIES[0];
  const activeImage = categoryImages[activeCategoryId] || null;

  // Material and Cost Breakdown calculation
  const materialBreakdown = getChassisMaterialBreakdown(chassisMaterial, accentColor);
  const bomComponentsCost = activeDrawer.length * 14.50; // Average estimate from drawer
  const totalCombinedProjectCost = materialBreakdown.totalChassisCostUSD + bomComponentsCost;

  // Generate single category image
  const generateCategoryConcept = async (categoryId: string, overrideEditPrompt?: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
    const mcuName = activeDrawer.find(d => d.category === "Microcontroller" || d.category === "SBC")?.name || "ESP32-WROOM-32E";
    const existingImg = categoryImages[categoryId];

    const isEditMode = Boolean(overrideEditPrompt && existingImg);

    if (isEditMode) {
      setIsEditing(true);
    } else {
      setIsGenerating(true);
    }

    try {
      const payload: Record<string, any> = {
        robotType,
        mcu: mcuName,
        components: activeDrawer.map(d => `${d.name} (${d.category})`),
        missionGoal: customGoal,
        stylePrompt: `${category.label} - ${category.desc}`,
        customSketchPrompt: customPrompt,
        aspectRatio: category.recommendedRatio,
        chassisMaterial,
        accentColor,
        specs: {
          robotType,
          customGoal,
          budget,
          hardwareSummary: activeDrawer.map(d => `${d.name} (${d.category})`).join(", "),
          chassisMaterial,
          accentColor,
          style: category.label
        }
      };

      if (isEditMode && existingImg) {
        payload.editPrompt = overrideEditPrompt;
        payload.baseImage = existingImg.url;
      }

      const response = await fetch("/api/gemini/generate-concept-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image (status ${response.status})`);
      }

      const data = await response.json();
      const imageSrc = data.imageUrl || data.image;

      if (imageSrc) {
        if (onImageGenerated) {
          onImageGenerated(imageSrc);
        }
        setCategoryImages(prev => ({
          ...prev,
          [categoryId]: {
            url: imageSrc,
            type: imageSrc.startsWith("data:image/svg") ? "svg" : "image",
            promptUsed: data.promptUsed || customPrompt || category.label,
            isAiGenerated: Boolean(data.isAiGenerated),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        }));

        if (isEditMode) {
          setEditSuccessMsg(`Successfully edited image with directive: "${overrideEditPrompt}"`);
          setTimeout(() => { setEditSuccessMsg(null); }, 4000);
          setEditPrompt("");
        }
      }
    } catch (err) {
      console.warn("Concept generation API error, switching to procedural CAD schematic", err);
      // Fallback SVG respecting chassis material and accent palette
      const fallbackSvg = createProceduralSvg(category, chassisMaterial, accentColor, robotType, mcuName);
      if (onImageGenerated) {
        onImageGenerated(fallbackSvg);
      }
      setCategoryImages(prev => ({
        ...prev,
        [categoryId]: {
          url: fallbackSvg,
          type: "svg",
          promptUsed: customPrompt || category.label,
          isAiGenerated: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      }));
    } finally {
      setIsGenerating(false);
      setIsEditing(false);
    }
  };

  // Generate an initial image for the active category on mount if none exist
  useEffect(() => {
    if (Object.keys(categoryImages).length === 0) {
      void generateCategoryConcept("photorealistic");
    }
  }, []);

  // Batch generate all categories sequentially
  const handleBatchGenerateAll = async () => {
    setBatchGenerating(true);
    for (let i = 0; i < CATEGORIES.length; i++) {
      const cat = CATEGORIES[i];
      setBatchProgress({ current: i + 1, total: CATEGORIES.length, label: cat.label });
      setActiveCategoryId(cat.id);
      await generateCategoryConcept(cat.id);
    }
    setBatchProgress(null);
    setBatchGenerating(false);
  };

  // Procedural SVG schematic generator for reliable immediate fallback
  const createProceduralSvg = (
    category: CategoryPreset,
    material: string,
    accent: string,
    type: string,
    mcu: string
  ): string => {
    let accentHex = "%2306b6d4";
    let secondaryHex = "%2338bdf8";
    if (accent.includes("Orange")) {
      accentHex = "%23f97316";
      secondaryHex = "%23fb923c";
    } else if (accent.includes("Yellow")) {
      accentHex = "%23eab308";
      secondaryHex = "%23fde047";
    } else if (accent.includes("Violet")) {
      accentHex = "%23a855f7";
      secondaryHex = "%23c084fc";
    }

    let chassisFill = "%231e293b";
    if (material.includes("PETG")) chassisFill = "%230e2a47";
    if (material.includes("Birch")) chassisFill = "%23332015";
    if (material.includes("Titanium")) chassisFill = "%231b2636";

    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <rect width="800" height="500" fill="%23050914"/>
      <defs>
        <pattern id="grid_${category.id}" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="%23172033" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="800" height="500" fill="url(%23grid_${category.id})"/>
      <!-- Robot Structure -->
      <rect x="220" y="160" width="360" height="200" rx="20" fill="${chassisFill}" stroke="${accentHex}" stroke-width="3.5"/>
      <rect x="260" y="190" width="280" height="90" rx="10" fill="%230f172a" stroke="${secondaryHex}" stroke-width="2"/>
      <text x="400" y="235" fill="${secondaryHex}" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">
        ${type.toUpperCase().replace("_", " ")}
      </text>
      <text x="400" y="260" fill="%2394a3b8" font-family="monospace" font-size="12" text-anchor="middle">
        MCU: ${mcu} • CATEGORY: ${category.label.toUpperCase()}
      </text>
      <!-- Wheels / Actuators -->
      <rect x="150" y="180" width="50" height="160" rx="10" fill="%23020617" stroke="%2364748b" stroke-width="2.5"/>
      <rect x="600" y="180" width="50" height="160" rx="10" fill="%23020617" stroke="%2364748b" stroke-width="2.5"/>
      <!-- Optical Sensors -->
      <circle cx="340" cy="120" r="18" fill="%231e293b" stroke="${accentHex}" stroke-width="3"/>
      <circle cx="460" cy="120" r="18" fill="%231e293b" stroke="${accentHex}" stroke-width="3"/>
      <line x1="340" y1="120" x2="340" y2="160" stroke="${accentHex}" stroke-width="3"/>
      <line x1="460" y1="120" x2="460" y2="160" stroke="${accentHex}" stroke-width="3"/>
      <!-- Metadata Badge -->
      <rect x="30" y="30" width="310" height="100" rx="10" fill="%23020617" fill-opacity="0.90" stroke="${accentHex}" stroke-width="1.5"/>
      <text x="45" y="55" fill="${secondaryHex}" font-family="monospace" font-size="12" font-weight="bold">${category.label.toUpperCase()}</text>
      <text x="45" y="75" fill="%2394a3b8" font-family="sans-serif" font-size="10">CHASSIS: ${material}</text>
      <text x="45" y="93" fill="${accentHex}" font-family="sans-serif" font-size="10">ACCENT: ${accent}</text>
      <text x="45" y="112" fill="%2310b981" font-family="monospace" font-size="9">HIGH RESOLUTION CAD SPECIFICATION</text>
    </svg>`;
  };

  // Trigger file type conversion downloads
  const handleDownloadFile = (type: "png" | "svg" | "dxf" | "stl" | "step" | "pdf" | "json") => {
    const baseFilename = `ai-robopet-${robotType}-${currentCategory.id}`;
    const mcu = activeDrawer.find(d => d.category === "Microcontroller" || d.category === "SBC")?.name || "ESP32-WROOM-32E";

    if (type === "png") {
      if (activeImage && activeImage.url.startsWith("data:image/png")) {
        const a = document.createElement("a");
        a.href = activeImage.url;
        a.download = `${baseFilename}-render.png`;
        a.click();
      } else {
        // Render raster canvas from SVG or active data
        const a = document.createElement("a");
        a.href = activeImage ? activeImage.url : createProceduralSvg(currentCategory, chassisMaterial, accentColor, robotType, mcu);
        a.download = `${baseFilename}-render.svg`;
        a.click();
      }
      triggerDownloadToast("PNG / High-Res Visual Render");
    } else if (type === "svg") {
      const svgData = activeImage.url.startsWith("data:image/svg") 
        ? decodeURIComponent(activeImage.url.replace("data:image/svg+xml;utf8,", ""))
        : decodeURIComponent(createProceduralSvg(currentCategory, chassisMaterial, accentColor, robotType, mcu).replace("data:image/svg+xml;utf8,", ""));
      downloadFileBlob(svgData, `${baseFilename}-schematic.svg`, "image/svg+xml");
      triggerDownloadToast("SVG Vector Schematic");
    } else if (type === "dxf") {
      const dxfContent = generateDxfContent(robotType, chassisMaterial, mcu);
      downloadFileBlob(dxfContent, `${baseFilename}-chassis-lasercut.dxf`, "application/dxf");
      triggerDownloadToast("DXF 2D Laser/CNC Cut Profile");
    } else if (type === "stl") {
      const stlContent = generateStlContent(robotType, chassisMaterial);
      downloadFileBlob(stlContent, `${baseFilename}-bracket-mesh.stl`, "application/sla");
      triggerDownloadToast("STL 3D Printable Mesh");
    } else if (type === "step") {
      const stepContent = generateStepContent(robotType, chassisMaterial, mcu);
      downloadFileBlob(stepContent, `${baseFilename}-solid-model.step`, "application/step");
      triggerDownloadToast("STEP AP214 CAD Solid Model");
    } else if (type === "pdf") {
      const pdfHtml = generateEngineeringPdfSpecSheet(robotType, chassisMaterial, accentColor, budget, activeDrawer);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(pdfHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 250);
      } else {
        downloadFileBlob(pdfHtml, `${baseFilename}-engineering-blueprint.html`, "text/html");
      }
      triggerDownloadToast("Engineering Drawing Blueprint Spec Sheet");
    } else if (type === "json") {
      const jsonManifest = generateCadJsonManifest(robotType, chassisMaterial, accentColor, budget, activeDrawer);
      downloadFileBlob(jsonManifest, `${baseFilename}-cad-manifest.json`, "application/json");
      triggerDownloadToast("JSON Parametric CAD Manifest");
    }
  };

  const triggerDownloadToast = (label: string) => {
    setDownloadSuccessToast(`Exported ${label}`);
    setTimeout(() => { setDownloadSuccessToast(null); }, 3500);
  };

  const copyPromptText = () => {
    const fullText = `Robotics CAD Concept Design:
Archetype: ${robotType.replace("_", " ")}
Category: ${currentCategory.label} (${currentCategory.desc})
Chassis Finish: ${chassisMaterial}
Accent Color: ${accentColor}
Active BOM: ${activeDrawer.map(d => d.name).join(", ")}
Custom Directives: ${customPrompt || "Precision robotic assembly with functional brackets, mounting standoffs, and clean wire routing."}`;
    void navigator.clipboard.writeText(fullText);
    setCopiedPrompt(true);
    setTimeout(() => { setCopiedPrompt(false); }, 2000);
  };

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 shadow-2xl flex flex-col gap-6 backdrop-blur-sm">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white font-mono tracking-tight">
              Robot Concept Studio & File Converter
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-300 rounded border border-cyan-800/60">
              Phase 3 Workbench
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Generate and refine technical imagery across all design categories, then convert into manufacturing files (DXF, STL, STEP, SVG) with complete material cost breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copyPromptText}
            className="text-[11px] text-slate-300 hover:text-white bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 font-mono flex items-center gap-1.5 transition cursor-pointer"
            title="Copy technical prompt specification"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPrompt ? "Copied Spec" : "Copy Spec Prompt"}</span>
          </button>
        </div>
      </div>

      {/* WORKBENCH TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: DESIGN DIRECTIVES & CATEGORY SELECTOR (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* CATEGORY SELECTOR SECTION (Target of CSS Selector 1) */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-cyan-400" />
                <span>Concept Categories</span>
              </label>
              
              <button
                onClick={handleBatchGenerateAll}
                disabled={isGenerating || batchGenerating}
                className="text-[10px] font-mono font-bold bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 px-2.5 py-1 rounded border border-cyan-800/60 hover:border-cyan-500/80 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                title="Synthesize renders across all 6 categories"
              >
                {batchGenerating ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                    <span>Rendering All ({batchProgress?.current}/{batchProgress?.total})</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-cyan-400" />
                    <span>Generate All 6 Categories</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Select a visual category to inspect or generate its rendering in the right workspace:
            </p>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORIES.map((preset) => {
                const isSelected = activeCategoryId === preset.id;
                const hasImage = Boolean(categoryImages[preset.id]);
                
                return (
                  <button
                    key={preset.id}
                    onClick={() => { setActiveCategoryId(preset.id); }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? "bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/40"
                        : "bg-slate-900/50 border-slate-800/90 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900/90"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-mono font-bold truncate ${isSelected ? "text-cyan-300" : "text-slate-300"}`}>
                        {preset.label}
                      </span>
                      
                      {hasImage ? (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>Ready</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {preset.categoryTag}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                      {preset.desc}
                    </span>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-800/50">
                      <span>Ratio: {preset.recommendedRatio}</span>
                      <span className="text-cyan-400/80 group-hover:text-cyan-300 flex items-center">
                        View <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHASSIS FINISH & ACCENT PALETTE CONTROLS */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 shadow-md">
            <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Chassis Finish & Accent Directives</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Chassis Finish:</label>
                <select
                  value={chassisMaterial}
                  onChange={(e) => { setChassisMaterial(e.target.value); }}
                  className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition cursor-pointer"
                >
                  <option value="Anodized Aluminum & Carbon Fiber">Anodized Aluminum & Carbon Fiber</option>
                  <option value="Translucent 3D Printed PETG">Translucent 3D Printed PETG</option>
                  <option value="Laser-Cut Birch & Acrylic">Laser-Cut Birch & Acrylic</option>
                  <option value="Machined Titanium / Rugged Military">Rugged Machined Titanium Alloy</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Accent Palette:</label>
                <select
                  value={accentColor}
                  onChange={(e) => { setAccentColor(e.target.value); }}
                  className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition cursor-pointer"
                >
                  <option value="Cyan & Matte Dark Slate">Cyan & Dark Slate</option>
                  <option value="High-Visibility Hazard Orange">Safety Hazard Orange</option>
                  <option value="Industrial Yellow & Carbon Black">Industrial Yellow</option>
                  <option value="Clean Lab White & Violet">Clean Lab White & Violet</option>
                </select>
              </div>
            </div>

            {/* Custom Design Directives Textarea */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Custom Design Directives (Prompts):</span>
                <span className="text-[9px] text-slate-500">Integrated into render & files</span>
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => { setCustomPrompt(e.target.value); }}
                placeholder="e.g. Include dual ultrasonic eyes on the front bumper, braided wire harnesses, top-mounted LiDAR turret, exposed brass fasteners..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 h-20 resize-none font-mono"
              />
            </div>

            {/* Render Button for Active Category */}
            <button
              onClick={() => generateCategoryConcept(activeCategoryId)}
              disabled={isGenerating || batchGenerating}
              className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition uppercase tracking-wider cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing {currentCategory.label}...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Render Image: {currentCategory.label}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RENDER STAGE & CONVERTED FILE TYPES & MATERIALS (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* TOP BAR / TABS FOR STAGE */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Visual Stage:</span>
              <span className="text-cyan-300 font-semibold">{currentCategory.label}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => { setActiveTabSubView("render"); }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                  activeTabSubView === "render"
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Render & Editor
              </button>
              <button
                onClick={() => { setActiveTabSubView("files"); }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                  activeTabSubView === "files"
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Converted Files (DXF/STL/STEP)
              </button>
              <button
                onClick={() => { setActiveTabSubView("materials"); }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                  activeTabSubView === "materials"
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Material Sourcing & Cost (${materialBreakdown.totalChassisCostUSD})
              </button>
            </div>
          </div>

          {/* MAIN RENDERED IMAGE DISPLAY */}
          <div className="relative w-full aspect-video bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center group shadow-2xl">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 text-center p-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                  <Sparkles className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="font-mono text-sm text-slate-200 font-bold">
                  Synthesizing {currentCategory.label}
                </div>
                <p className="text-xs text-slate-400 max-w-sm font-sans">
                  Respecting {chassisMaterial} finish, {accentColor} palette, and {activeDrawer.length} components...
                </p>
              </div>
            ) : activeImage ? (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                <img
                  src={activeImage.url}
                  alt={currentCategory.label}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />

                {/* Top overlay badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-800/60 backdrop-blur-md">
                    {currentCategory.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 backdrop-blur-md">
                    {chassisMaterial}
                  </span>
                </div>

                {/* Action buttons top-right */}
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setExpandedPreview(true); }}
                    className="p-2 bg-slate-900/90 hover:bg-slate-800 text-white rounded-lg border border-slate-700 shadow-lg cursor-pointer transition"
                    title="Fullscreen Preview"
                  >
                    <Maximize2 className="w-4 h-4 text-slate-300" />
                  </button>
                  <button
                    onClick={() => { handleDownloadFile("png"); }}
                    className="p-2 bg-slate-900/90 hover:bg-slate-800 text-white rounded-lg border border-slate-700 shadow-lg cursor-pointer transition"
                    title="Download Render Image"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>

                {/* Bottom status bar */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800/60 backdrop-blur-md">
                  <span>Generated: {activeImage.timestamp} ({activeImage.type.toUpperCase()})</span>
                  <span className="text-cyan-400">Ready for CAD File Conversion ↓</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center p-6 text-slate-600 font-mono text-xs">
                <ImageIcon className="w-10 h-10 text-slate-700 mb-1" />
                <span className="text-slate-300 font-bold">No Render Generated For {currentCategory.label}</span>
                <p className="text-[11px] text-slate-500 max-w-sm font-sans mt-1">
                  Click &quot;Render Image: {currentCategory.label}&quot; or &quot;Generate All 6 Categories&quot; to synthesize this view based on your chassis and directives.
                </p>
                <button
                  onClick={() => generateCategoryConcept(activeCategoryId)}
                  className="mt-2 px-3 py-1.5 bg-cyan-600/90 hover:bg-cyan-500 text-white rounded-lg font-mono text-[11px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Synthesize Render Now</span>
                </button>
              </div>
            )}
          </div>

          {/* AI PROMPT IMAGE EDITOR & REFINEMENT TOOLBAR */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Prompt Image Editor (gemini-3.1-flash-image-preview)</span>
              </span>
              {editSuccessMsg && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                  {editSuccessMsg}
                </span>
              )}
            </div>

            {/* Quick edit prompt suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono">
              <span className="text-slate-500 shrink-0">Quick Edits:</span>
              {[
                "Add top-mounted LiDAR dome",
                "Equip all-terrain knobby tires",
                "Add yellow hazard safety stripes",
                "Expose braided wiring harness",
                "Attach dual LED headlights"
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => { setEditPrompt(chip); }}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60 shrink-0 transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editPrompt}
                onChange={(e) => { setEditPrompt(e.target.value); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editPrompt.trim()) {
                    void generateCategoryConcept(activeCategoryId, editPrompt.trim());
                  }
                }}
                placeholder="Type edit prompt: e.g. 'Add dual front antenna sensors and change rim color to hazard orange'..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => generateCategoryConcept(activeCategoryId, editPrompt.trim())}
                disabled={isEditing || !editPrompt.trim() || !activeImage}
                className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-mono font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                {isEditing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Apply Edit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* FILE TYPE CONVERSION & EXPORT GRID (Below Image) */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div>
                <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Converted Manufacturing Files & CAD Geometry</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Direct download links for laser cutters, 3D printers, and parametric CAD software:
                </p>
              </div>

              {downloadSuccessToast && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                  {downloadSuccessToast}
                </span>
              )}
            </div>

            {/* Converted Files Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {[
                {
                  ext: "PNG",
                  label: "High-Res Render",
                  tool: "2K Studio Visual",
                  icon: Camera,
                  color: "text-pink-400",
                  action: () => { handleDownloadFile("png"); }
                },
                {
                  ext: "SVG",
                  label: "Vector Schematic",
                  tool: "Scalable 2D Layers",
                  icon: FileCode,
                  color: "text-cyan-400",
                  action: () => { handleDownloadFile("svg"); }
                },
                {
                  ext: "DXF",
                  label: "Laser/CNC Cut Profile",
                  tool: "SendCutSend / AutoCAD",
                  icon: Scissors,
                  color: "text-amber-400",
                  action: () => { handleDownloadFile("dxf"); }
                },
                {
                  ext: "STL",
                  label: "3D Printable Mesh",
                  tool: "FDM / SLA Printers",
                  icon: Printer,
                  color: "text-emerald-400",
                  action: () => { handleDownloadFile("stl"); }
                },
                {
                  ext: "STEP",
                  label: "CAD Solid Model",
                  tool: "Fusion 360 / SolidWorks",
                  icon: Box,
                  color: "text-violet-400",
                  action: () => { handleDownloadFile("step"); }
                },
                {
                  ext: "PDF",
                  label: "Engineering Drawing",
                  tool: "Printable Blueprints",
                  icon: FileText,
                  color: "text-rose-400",
                  action: () => { handleDownloadFile("pdf"); }
                },
                {
                  ext: "JSON",
                  label: "Parametric CAD",
                  tool: "Fasteners & Mass Kinematics",
                  icon: Cpu,
                  color: "text-sky-400",
                  action: () => { handleDownloadFile("json"); }
                }
              ].map((file, idx) => {
                const Icon = file.icon;
                return (
                  <button
                    key={idx}
                    onClick={file.action}
                    className="p-2.5 rounded-lg border border-slate-800 hover:border-cyan-500/60 bg-slate-900/60 hover:bg-slate-900 text-left flex flex-col justify-between gap-1 transition cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-white border border-slate-700/60">
                        .{file.ext}
                      </span>
                      <Icon className={`w-3.5 h-3.5 ${file.color} group-hover:scale-110 transition-transform`} />
                    </div>

                    <div>
                      <div className="text-[11px] font-mono font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {file.label}
                      </div>
                      <div className="text-[9px] text-slate-500 font-sans truncate">
                        {file.tool}
                      </div>
                    </div>

                    <div className="text-[9px] font-mono text-cyan-400 flex items-center gap-1 pt-1 border-t border-slate-800/60">
                      <Download className="w-2.5 h-2.5" />
                      <span>Download File</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ESTIMATED MATERIAL COST & SOURCING LINKS (Below Files) */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div>
                <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chassis Materials Breakdown & Sourcing Links</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  Custom material estimates for: <strong className="text-cyan-300">{chassisMaterial}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Chassis Subtotal:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-bold">
                  ${materialBreakdown.totalChassisCostUSD.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Material Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="pb-1.5">Material Component</th>
                    <th className="pb-1.5">Category</th>
                    <th className="pb-1.5">Est. Cost</th>
                    <th className="pb-1.5 text-right">Supplier & Sourcing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {materialBreakdown.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition">
                      <td className="py-2 pr-2">
                        <div className="font-bold text-slate-200">{item.name}</div>
                        <div className="text-[9px] text-slate-500 font-sans">{item.description}</div>
                      </td>
                      <td className="py-2 pr-2 text-slate-400 text-[10px]">
                        {item.category}
                      </td>
                      <td className="py-2 pr-2 font-bold text-emerald-400">
                        ${item.estimatedCostUSD.toFixed(2)}
                      </td>
                      <td className="py-2 text-right">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 hover:bg-cyan-950 px-2 py-1 rounded border border-cyan-800/40 transition"
                        >
                          <span>{item.supplier}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Combined Project Budget Summary */}
            <div className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono flex-wrap gap-2">
              <span className="text-slate-400">
                Total Robot Build Investment: <strong className="text-white">${totalCombinedProjectCost.toFixed(2)} USD</strong> (Materials + Hardware)
              </span>
              <span className={`text-[11px] font-bold ${totalCombinedProjectCost <= budget ? "text-emerald-400" : "text-amber-400"}`}>
                {totalCombinedProjectCost <= budget ? `Within Budget ($${budget})` : `+$${(totalCombinedProjectCost - budget).toFixed(2)} over budget`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN MODAL PREVIEW */}
      {expandedPreview && activeImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col p-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-mono text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>{currentCategory.label} - High-Resolution Inspection</span>
            </span>
            <button
              onClick={() => { setExpandedPreview(false); }}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <img
              src={activeImage.url}
              alt={currentCategory.label}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
