import { useState, useCallback } from "react";
import { HardwareComponent, RobotProfile } from "../types";
import {
  exportDrawerToPDF,
  generateWorkshopSyncUrl,
  parseWorkshopSyncUrl,
  exportProjectJSON,
  parseProjectJSON
} from "../services/exportService";

export interface UseProjectExportOptions {
  activeDrawer: HardwareComponent[];
  contingencyList: HardwareComponent[];
  robotType: RobotProfile["type"];
  customGoal: string;
  budget: number;
  activeMCU: HardwareComponent;
  shippingTier?: "standard" | "express" | "economy";
  includeToolsEst?: boolean;
  includeTrainingEst?: boolean;
  onImportBuild?: (imported: {
    activeDrawer: HardwareComponent[];
    contingencyList: HardwareComponent[];
    robotType: RobotProfile["type"];
    customGoal: string;
    budget: number;
  }) => void;
  onNotify?: (message: string) => void;
}

export interface UseProjectExportReturn {
  isExportingPDF: boolean;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  jsonModalOpen: boolean;
  setJsonModalOpen: (open: boolean) => void;
  jsonInput: string;
  setJsonInput: (json: string) => void;
  copiedQRLink: boolean;
  workshopSyncUrl: string;
  handleExportPDF: (exportMode?: "budget" | "wiring" | "full") => Promise<void>;
  handleDownloadJSON: () => void;
  handleImportJSON: () => void;
  handleCopyWorkshopLink: () => void;
  handleDownloadQRImage: () => void;
}

export function useProjectExport({
  activeDrawer,
  contingencyList,
  robotType,
  customGoal,
  budget,
  activeMCU,
  shippingTier = "standard",
  includeToolsEst = true,
  includeTrainingEst = true,
  onImportBuild,
  onNotify
}: UseProjectExportOptions): UseProjectExportReturn {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [copiedQRLink, setCopiedQRLink] = useState(false);

  // Generate real-time workshop sync URL
  const workshopSyncUrl = generateWorkshopSyncUrl(
    activeDrawer,
    robotType,
    budget,
    typeof window !== "undefined" ? window.location.origin : ""
  );

  // Export PDF
  const handleExportPDF = useCallback(
    async (exportMode: "budget" | "wiring" | "full" = "full") => {
      if (activeDrawer.length === 0) {
        onNotify?.("Build drawer is empty. Add parts before exporting specification PDF.");
        return;
      }
      setIsExportingPDF(true);
      try {
        await exportDrawerToPDF({
          exportMode,
          robotType,
          customGoal,
          budget,
          activeMCU,
          activeDrawer,
          shippingTier,
          includeToolsEst,
          includeTrainingEst
        });
        onNotify?.("Professional Robotics BOM specification PDF successfully generated!");
      } catch (err) {
        console.error("PDF export error:", err);
        onNotify?.("PDF generation failed. Check browser console.");
      } finally {
        setIsExportingPDF(false);
      }
    },
    [
      activeDrawer,
      robotType,
      customGoal,
      budget,
      activeMCU,
      shippingTier,
      includeToolsEst,
      includeTrainingEst,
      onNotify
    ]
  );

  // Export JSON file
  const handleDownloadJSON = useCallback(() => {
    try {
      const jsonContent = exportProjectJSON(
        activeDrawer,
        contingencyList,
        robotType,
        customGoal,
        budget
      );
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `roboarchitect_build_${robotType}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onNotify?.("Exported project build snapshot (.json)");
    } catch (err) {
      console.error("JSON export error:", err);
      onNotify?.("Failed to download project JSON.");
    }
  }, [activeDrawer, contingencyList, robotType, customGoal, budget, onNotify]);

  // Import JSON file or text
  const handleImportJSON = useCallback(() => {
    if (!jsonInput.trim()) {
      onNotify?.("Please paste a valid build JSON string.");
      return;
    }
    const parsed = parseProjectJSON(jsonInput);
    if (!parsed || !parsed.valid || !parsed.data || !parsed.data.activeDrawer) {
      onNotify?.(parsed.error || "Malformed JSON format or missing hardware components array.");
      return;
    }

    if (onImportBuild) {
      onImportBuild({
        activeDrawer: parsed.data.activeDrawer,
        contingencyList: parsed.data.contingencyList || [],
        robotType: (parsed.data.robotType as any) || "wheeled_rover",
        customGoal: parsed.data.customGoal || "",
        budget: parsed.data.budget || 250
      });
      setJsonModalOpen(false);
      setJsonInput("");
      onNotify?.("Successfully loaded project build from JSON configuration!");
    }
  }, [jsonInput, onImportBuild, onNotify]);

  // Copy sync link to clipboard
  const handleCopyWorkshopLink = useCallback(() => {
    void navigator.clipboard.writeText(workshopSyncUrl);
    setCopiedQRLink(true);
    setTimeout(() => { setCopiedQRLink(false); }, 2500);
    onNotify?.("Workshop sync link copied to clipboard!");
  }, [workshopSyncUrl, onNotify]);

  // Download QR code canvas
  const handleDownloadQRImage = useCallback(() => {
    const canvas = document.getElementById("workshop-qr-canvas") as HTMLCanvasElement;
    if (!canvas) {
      onNotify?.("QR Canvas element not ready yet.");
      return;
    }
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `workshop_qr_${robotType}.png`;
    a.click();
    onNotify?.("Downloaded High-Res Workshop QR Code (PNG)!");
  }, [robotType, onNotify]);

  return {
    isExportingPDF,
    qrModalOpen,
    setQrModalOpen,
    jsonModalOpen,
    setJsonModalOpen,
    jsonInput,
    setJsonInput,
    copiedQRLink,
    workshopSyncUrl,
    handleExportPDF,
    handleDownloadJSON,
    handleImportJSON,
    handleCopyWorkshopLink,
    handleDownloadQRImage
  };
}
