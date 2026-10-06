import { useState, useEffect, useCallback } from "react";
import { HardwareComponent, RobotProfile } from "../types";
import { SUPPLIER_CATALOG } from "../data";
import {
  buildWorkshopSyncUrl,
  downloadWorkshopQRImage,
  parseWorkshopSyncParams
} from "../services/qrSyncService";

export interface UseWorkshopSyncOptions {
  robotType: RobotProfile["type"];
  setRobotType: (type: RobotProfile["type"]) => void;
  budget: number;
  setBudget: (budget: number) => void;
  activeDrawer: HardwareComponent[];
  setActiveDrawer: (drawer: HardwareComponent[]) => void;
  pdfExportView?: "budget" | "wiring" | "full";
  onNotify?: (msg: string) => void;
}

export interface UseWorkshopSyncReturn {
  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
  copiedQRLink: boolean;
  getWorkshopSyncUrl: () => string;
  downloadQRImage: () => Promise<void>;
  copySyncLink: () => void;
}

export function useWorkshopSync({
  robotType,
  setRobotType,
  budget,
  setBudget,
  activeDrawer,
  setActiveDrawer,
  pdfExportView = "budget",
  onNotify
}: UseWorkshopSyncOptions): UseWorkshopSyncReturn {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copiedQRLink, setCopiedQRLink] = useState(false);

  const getWorkshopSyncUrl = useCallback(() => {
    return buildWorkshopSyncUrl(robotType, budget, activeDrawer, pdfExportView);
  }, [robotType, budget, activeDrawer, pdfExportView]);

  const downloadQRImage = useCallback(async () => {
    try {
      const url = getWorkshopSyncUrl();
      await downloadWorkshopQRImage(url, robotType);
      onNotify?.("Saved Workshop QR Code image to downloads!");
    } catch (err) {
      console.error("QR Download error:", err);
      onNotify?.("Failed to save QR Code image.");
    }
  }, [getWorkshopSyncUrl, robotType, onNotify]);

  const copySyncLink = useCallback(() => {
    const url = getWorkshopSyncUrl();
    void navigator.clipboard.writeText(url);
    setCopiedQRLink(true);
    onNotify?.("Copied Workshop Mobile Sync Link to clipboard!");
    setTimeout(() => { setCopiedQRLink(false); }, 2500);
  }, [getWorkshopSyncUrl, onNotify]);

  // Hydrate from search params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = parseWorkshopSyncParams(window.location.search);
    if (!parsed) return;

    if (parsed.robotType) {
      setRobotType(parsed.robotType);
    }
    if (parsed.budget) {
      setBudget(parsed.budget);
    }
    if (parsed.parts && parsed.parts.length > 0) {
      const matched = parsed.parts
        .map((id) => SUPPLIER_CATALOG.find((c) => c.id === id))
        .filter((c): c is HardwareComponent => Boolean(c));
      if (matched.length > 0) {
        setActiveDrawer(matched);
      }
    }
    if (parsed.mode === "workshop") {
      setTimeout(() => {
        onNotify?.("📱 Mobile Workshop Sync Active! Loaded hardware build state.");
      }, 800);
    }
  }, []);

  return {
    isQRModalOpen,
    setIsQRModalOpen,
    copiedQRLink,
    getWorkshopSyncUrl,
    downloadQRImage,
    copySyncLink
  };
}
