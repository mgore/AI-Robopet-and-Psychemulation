import QRCode from "qrcode";
import { HardwareComponent } from "../types";

export interface WorkshopSyncState {
  robotType?: "wheeled_rover" | "robotic_arm" | "hexapod";
  budget?: number;
  parts?: string[];
  view?: "budget" | "wiring" | "full";
  mode?: string;
}

/**
 * Encodes current workshop build state into a mobile sync URL.
 */
export function buildWorkshopSyncUrl(
  robotType: string,
  budget: number,
  activeDrawer: HardwareComponent[],
  pdfExportView: "budget" | "wiring" | "full" = "budget"
): string {
  if (typeof window === "undefined") return "";
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const partIds = activeDrawer.map((item) => item.id).join(",");
  const params = new URLSearchParams({
    robotType,
    budget: budget.toString(),
    parts: partIds,
    view: pdfExportView,
    mode: "workshop"
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Downloads a high-resolution QR Code PNG image for mobile workshop benches.
 */
export async function downloadWorkshopQRImage(
  url: string,
  robotType: string
): Promise<void> {
  const dataUrl = await QRCode.toDataURL(url, { width: 500, margin: 2 });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `AIRoboPet_${robotType}_Workshop_QR.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parses URL search parameters for workshop hydration.
 */
export function parseWorkshopSyncParams(search: string): WorkshopSyncState | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const robotType = params.get("robotType") as "wheeled_rover" | "robotic_arm" | "hexapod" | null;
  const budgetStr = params.get("budget");
  const partsStr = params.get("parts");
  const view = params.get("view") as "budget" | "wiring" | "full" | null;
  const mode = params.get("mode") || undefined;

  if (!robotType && !partsStr) return null;

  return {
    robotType: robotType && ["wheeled_rover", "robotic_arm", "hexapod"].includes(robotType) ? robotType : undefined,
    budget: budgetStr ? parseInt(budgetStr, 10) || undefined : undefined,
    parts: partsStr ? partsStr.split(",").filter(Boolean) : undefined,
    view: view || undefined,
    mode
  };
}
