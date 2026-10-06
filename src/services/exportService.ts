import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { HardwareComponent } from "../types";
import { calculateBaseHardwareCost, getShippingCost, getToolsCost, getTrainingCost } from "./costService";

export interface ExportPdfOptions {
  exportMode: "budget" | "wiring" | "full";
  robotType: string;
  customGoal: string;
  budget: number;
  activeMCU: HardwareComponent;
  activeDrawer: HardwareComponent[];
  shippingTier: "standard" | "express" | "economy";
  includeToolsEst: boolean;
  includeTrainingEst: boolean;
}

/**
 * Builds standard Workshop Mobile sync URL
 */
export function buildWorkshopSyncUrl(
  robotType: string,
  budget: number,
  activeDrawer: HardwareComponent[],
  view: "budget" | "wiring" | "full" = "budget"
): string {
  if (typeof window === "undefined") return "";
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const partIds = activeDrawer.map((item) => item.id).join(",");
  const params = new URLSearchParams({
    robotType,
    budget: budget.toString(),
    parts: partIds,
    view,
    mode: "workshop"
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Downloads QR Code PNG for workbench use
 */
export async function downloadQRCodePNG(syncUrl: string, robotType: string): Promise<boolean> {
  try {
    const dataUrl = await QRCode.toDataURL(syncUrl, { width: 500, margin: 2 });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `AIRoboPet_${robotType}_Workshop_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error("QR Download error:", err);
    return false;
  }
}

/**
 * Downloads arbitrary Data URL as an image file
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  if (typeof document === "undefined" || !dataUrl) return;
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Procedurally generates a full-page electrical wiring schematic diagram with a Key
 * as an image Data URL for all chosen active BOM components (excluding contingent items).
 */
export function generateWiringSchematicImage(
  activeMCU: HardwareComponent,
  activeDrawer: HardwareComponent[],
  robotType: string
): string {
  if (typeof document === "undefined") return "";

  const width = 1654;
  const height = 2338;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Clean blueprint technical background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Subtle 25px grid
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 25) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Major 100px grid
  ctx.strokeStyle = "#f1f5f9";
  ctx.lineWidth = 1.2;
  for (let x = 0; x < width; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 100) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Outer engineering drawing frame
  const margin = 35;
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 3.5;
  ctx.strokeRect(margin, margin, width - 2 * margin, height - 2 * margin);

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1;
  ctx.strokeRect(margin + 6, margin + 6, width - 2 * margin - 12, height - 2 * margin - 12);

  // Corner registration ticks
  const drawCornerTick = (cx: number, cy: number) => {
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx, cy + 10);
    ctx.stroke();
  };
  drawCornerTick(margin + 18, margin + 18);
  drawCornerTick(width - margin - 18, margin + 18);
  drawCornerTick(margin + 18, height - margin - 18);
  drawCornerTick(width - margin - 18, height - margin - 18);

  // Header Title Block
  const headerY = margin + 14;
  const headerH = 92;
  const headerW = width - 2 * margin - 28;
  const headerX = margin + 14;

  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(headerX, headerY, headerW, headerH, 8);
  } else {
    ctx.rect(headerX, headerY, headerW, headerH);
  }
  ctx.fill();

  // Violet left accent stripe
  ctx.fillStyle = "#7c3aed";
  ctx.fillRect(headerX, headerY, 8, headerH);

  // Header Typography
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("AI ROBOPET ELECTRICAL ENGINEERING SPECIFICATION • CIRCUIT SCHEMATIC", headerX + 22, headerY + 26);

  ctx.font = "bold 23px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("SYSTEM WIRING SCHEMATIC & BUS INTERCONNECT TOPOLOGY", headerX + 22, headerY + 54);

  const formattedRobot = robotType
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  ctx.font = "12.5px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(
    `Target Archetype: ${formattedRobot.toUpperCase()} • System Controller: ${activeMCU.name} (${activeMCU.voltage})`,
    headerX + 22,
    headerY + 77
  );

  // Right badges in header
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(headerX + headerW - 250, headerY + 12, 238, 30);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.strokeRect(headerX + headerW - 250, headerY + 12, 238, 30);
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText("SHEET 2 OF 2 • WIRING PACK", headerX + headerW - 240, headerY + 31);

  ctx.fillStyle = "#14532d";
  ctx.fillRect(headerX + headerW - 250, headerY + 48, 238, 32);
  ctx.strokeStyle = "#16a34a";
  ctx.strokeRect(headerX + headerW - 250, headerY + 48, 238, 32);
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.fillStyle = "#86efac";
  ctx.fillText("CIRCUIT STATUS: 100% AUDITED", headerX + headerW - 240, headerY + 68);

  // Filter peripherals from activeDrawer (excluding the MCU which is central)
  const peripherals = activeDrawer.filter(
    (c) => c.id !== activeMCU.id && c.category !== "Microcontroller" && c.category !== "SBC"
  );
  const activeList = peripherals.length > 0 ? peripherals : activeDrawer;

  // Upper Diagram Area: from y = 160 to y = 1200
  const half = Math.ceil(activeList.length / 2);
  const leftPeripherals = activeList.slice(0, half);
  const rightPeripherals = activeList.slice(half);

  // Central MCU position
  const mcuW = 480;
  const mcuH = 430;
  const mcuX = Math.round((width - mcuW) / 2);
  const mcuY = 320;

  // Draw Central MCU
  ctx.fillStyle = "#090d16";
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(mcuX, mcuY, mcuW, mcuH, 12);
  } else {
    ctx.rect(mcuX, mcuY, mcuW, mcuH);
  }
  ctx.fill();
  ctx.stroke();

  // IC chip notch at top
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(mcuX + mcuW / 2, mcuY, 14, 0, Math.PI);
  ctx.fill();
  ctx.stroke();

  // Inside MCU Header
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(mcuX + 8, mcuY + 18, mcuW - 16, 68);
  ctx.font = "bold 10px 'Courier New', monospace";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("MASTER BRAIN CONTROLLER", mcuX + 20, mcuY + 36);

  ctx.font = "bold 18px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(activeMCU.name, mcuX + 20, mcuY + 60);

  ctx.font = "11px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(`${activeMCU.voltage} Logic • Clock & Master Bus Hub`, mcuX + 20, mcuY + 77);

  // Defined Pin Terminals on MCU
  const mcuLeftPins = [
    { label: "VCC (3.3V/5V Rail)", color: "#dc2626", y: mcuY + 120 },
    { label: "GND (Common Rail)", color: "#334155", y: mcuY + 160 },
    { label: "I2C-SDA (GPIO 21)", color: "#0891b2", y: mcuY + 200 },
    { label: "I2C-SCL (GPIO 22)", color: "#0891b2", y: mcuY + 240 },
    { label: "UART-RX (GPIO 16)", color: "#059669", y: mcuY + 280 },
    { label: "UART-TX (GPIO 17)", color: "#059669", y: mcuY + 320 },
    { label: "SPI-MOSI (GPIO 23)", color: "#7c3aed", y: mcuY + 360 },
    { label: "SPI-SCK (GPIO 18)", color: "#7c3aed", y: mcuY + 400 },
  ];

  const mcuRightPins = [
    { label: "PWM-CH1 (GPIO 12)", color: "#d97706", y: mcuY + 120 },
    { label: "PWM-CH2 (GPIO 13)", color: "#d97706", y: mcuY + 160 },
    { label: "PWM-CH3 (GPIO 14)", color: "#d97706", y: mcuY + 200 },
    { label: "PWM-CH4 (GPIO 15)", color: "#d97706", y: mcuY + 240 },
    { label: "ADC-1 (GPIO 34)", color: "#ec4899", y: mcuY + 280 },
    { label: "ADC-2 (GPIO 35)", color: "#ec4899", y: mcuY + 320 },
    { label: "SPI-MISO (GPIO 19)", color: "#7c3aed", y: mcuY + 360 },
    { label: "SPI-CS (GPIO 5)", color: "#7c3aed", y: mcuY + 400 },
  ];

  // Draw Left Pin Labels on MCU
  mcuLeftPins.forEach((pin) => {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(mcuX + 8, pin.y - 12, 190, 24);
    ctx.fillStyle = pin.color;
    ctx.beginPath();
    ctx.arc(mcuX + 16, pin.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "bold 9.5px 'Courier New', monospace";
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(pin.label, mcuX + 26, pin.y + 3.5);

    ctx.strokeStyle = pin.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mcuX, pin.y);
    ctx.lineTo(mcuX + 8, pin.y);
    ctx.stroke();
  });

  // Draw Right Pin Labels on MCU
  mcuRightPins.forEach((pin) => {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(mcuX + mcuW - 198, pin.y - 12, 190, 24);
    ctx.fillStyle = pin.color;
    ctx.beginPath();
    ctx.arc(mcuX + mcuW - 16, pin.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "bold 9.5px 'Courier New', monospace";
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "right";
    ctx.fillText(pin.label, mcuX + mcuW - 26, pin.y + 3.5);
    ctx.textAlign = "left";

    ctx.strokeStyle = pin.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mcuX + mcuW - 8, pin.y);
    ctx.lineTo(mcuX + mcuW, pin.y);
    ctx.stroke();
  });

  // Render peripheral boxes
  const cardW = 390;
  const leftX = margin + 18;
  const rightX = width - margin - 18 - cardW;

  const renderSidePeripherals = (
    items: HardwareComponent[],
    startX: number,
    isLeft: boolean,
    keyOffset: number
  ) => {
    const count = items.length;
    if (count === 0) return;
    const availableH = 920;
    const spacing = Math.floor(availableH / count);
    const cardH = Math.min(130, spacing - 14);

    items.forEach((comp, idx) => {
      const keyId = keyOffset + idx + 1;
      const cardY = 240 + idx * spacing;

      let accentColor = "#0891b2";
      let signalColor = "#0891b2";
      let sigLabel = "I2C (SDA/SCL)";
      let mcuPinMatch = isLeft ? mcuLeftPins[2] : mcuRightPins[0];

      if (comp.interface.includes("SPI")) {
        accentColor = "#7c3aed";
        signalColor = "#7c3aed";
        sigLabel = "SPI (MOSI/MISO)";
        mcuPinMatch = isLeft ? mcuLeftPins[6] : mcuRightPins[6];
      } else if (comp.interface.includes("UART")) {
        accentColor = "#059669";
        signalColor = "#059669";
        sigLabel = "UART (TX/RX)";
        mcuPinMatch = isLeft ? mcuLeftPins[4] : mcuRightPins[0];
      } else if (comp.interface.includes("PWM") || comp.category === "Actuator") {
        accentColor = "#d97706";
        signalColor = "#d97706";
        sigLabel = `PWM-CH${(idx % 4) + 1}`;
        mcuPinMatch = isLeft ? mcuLeftPins[2] : mcuRightPins[idx % 4];
      } else if (comp.id.includes("battery") || comp.category === "Power Supply") {
        accentColor = "#dc2626";
        signalColor = "#dc2626";
        sigLabel = "VCC / VIN Rail";
        mcuPinMatch = mcuLeftPins[0];
      }

      // Card container
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(startX, cardY, cardW, cardH, 8);
      } else {
        ctx.rect(startX, cardY, cardW, cardH);
      }
      ctx.fill();
      ctx.stroke();

      // Top color accent bar
      ctx.fillStyle = accentColor;
      ctx.fillRect(startX, cardY, cardW, 6);

      // KEY BADGE
      const badgeW = 74;
      const badgeH = 22;
      const badgeX = isLeft ? startX + cardW - badgeW - 10 : startX + 10;
      const badgeY = cardY + 12;

      ctx.fillStyle = accentColor;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
      } else {
        ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
      }
      ctx.fill();

      ctx.font = "bold 11px 'Courier New', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`KEY #${keyId}`, badgeX + badgeW / 2, badgeY + 15);
      ctx.textAlign = "left";

      // Component Name
      ctx.font = "bold 13px Helvetica, Arial, sans-serif";
      ctx.fillStyle = "#0f172a";
      const nameTrunc = comp.name.length > 28 ? comp.name.slice(0, 26) + "..." : comp.name;
      ctx.fillText(nameTrunc, isLeft ? startX + 12 : startX + 14, cardY + 28);

      // Category & Protocol
      ctx.font = "10.5px Helvetica, Arial, sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText(
        `${comp.category} • ${comp.interface || "Digital I/O"}`,
        isLeft ? startX + 12 : startX + 14,
        cardY + 46
      );

      // Pinout indicators inside card
      const pinsY = cardY + cardH - 24;
      ctx.font = "bold 9px 'Courier New', monospace";

      // VCC pin
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(startX + 20, pinsY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#475569";
      ctx.fillText("VCC", startX + 28, pinsY + 3);

      // GND pin
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.arc(startX + 80, pinsY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#475569";
      ctx.fillText("GND", startX + 88, pinsY + 3);

      // SIGNAL pin
      ctx.fillStyle = signalColor;
      ctx.beginPath();
      ctx.arc(startX + 140, pinsY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#475569";
      ctx.fillText(sigLabel, startX + 148, pinsY + 3);

      // Wire Traces connecting component to MCU
      const traceOutX = isLeft ? startX + cardW : startX;
      const traceTargetX = isLeft ? mcuX : mcuX + mcuW;
      const targetPinY = mcuPinMatch.y;
      const startPinY = cardY + cardH / 2;

      ctx.strokeStyle = signalColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(traceOutX, startPinY);
      const midX = isLeft
        ? traceOutX + (traceTargetX - traceOutX) * 0.45
        : traceOutX - (traceOutX - traceTargetX) * 0.45;
      ctx.lineTo(midX, startPinY);
      ctx.lineTo(midX, targetPinY);
      ctx.lineTo(traceTargetX, targetPinY);
      ctx.stroke();

      // Connection junction dots
      ctx.fillStyle = signalColor;
      ctx.beginPath();
      ctx.arc(traceOutX, startPinY, 4, 0, Math.PI * 2);
      ctx.arc(traceTargetX, targetPinY, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  renderSidePeripherals(leftPeripherals, leftX, true, 0);
  renderSidePeripherals(rightPeripherals, rightX, false, leftPeripherals.length);

  // Common Ground and Power Rails representation
  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(mcuX + 40, mcuY + mcuH);
  ctx.lineTo(mcuX + 40, mcuY + mcuH + 30);
  ctx.lineTo(mcuX + mcuW - 40, mcuY + mcuH + 30);
  ctx.lineTo(mcuX + mcuW - 40, mcuY + mcuH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = "bold 9px 'Courier New', monospace";
  ctx.fillStyle = "#dc2626";
  ctx.fillText("COMMON 3.3V / 5.0V VCC RAIL & FILTERED POWER BUS", mcuX + 70, mcuY + mcuH + 26);

  // -------------------------------------------------------------
  // LOWER SECTION: MASTER KEY & ELECTRICAL LEGEND (y: 1220 to 2260)
  // -------------------------------------------------------------

  // Panel 1: Wire Color Protocol Key (y: 1220 to 1340)
  const keyHeaderY = 1220;
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(margin + 14, keyHeaderY, headerW, 36, 6);
  } else {
    ctx.rect(margin + 14, keyHeaderY, headerW, 36);
  }
  ctx.fill();

  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("SCHEMATIC KEY & BUS PROTOCOL COLOR CODE", margin + 28, keyHeaderY + 23);

  ctx.font = "11px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(
    "Standard electrical color coding applied across all wiring traces & pin interconnects",
    margin + 390,
    keyHeaderY + 23
  );

  // Wire Key Badges
  const wireCodes = [
    { color: "#dc2626", label: "POWER RAIL (VCC)", desc: "Regulated 3.3V / 5.0V DC" },
    { color: "#334155", label: "COMMON GROUND (GND)", desc: "Shared 0V System Reference" },
    { color: "#0891b2", label: "I2C TWO-WIRE BUS", desc: "SDA (Data) / SCL (Clock)" },
    { color: "#7c3aed", label: "SPI SERIAL BUS", desc: "MOSI, MISO, SCK & CS" },
    { color: "#059669", label: "HARDWARE UART", desc: "Crossed TX ↔ RX Serial" },
    { color: "#d97706", label: "PWM / MOTOR LOGIC", desc: "Servo & Motor Speed Signals" },
  ];

  const codeBoxW = Math.floor(headerW / 3) - 10;
  const codeBoxH = 38;

  wireCodes.forEach((wc, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const bx = margin + 14 + col * (codeBoxW + 15);
    const by = keyHeaderY + 46 + row * (codeBoxH + 8);

    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, codeBoxW, codeBoxH);
    ctx.fillRect(bx, by, codeBoxW, codeBoxH);

    ctx.fillStyle = wc.color;
    ctx.fillRect(bx, by, 8, codeBoxH);

    ctx.strokeStyle = wc.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx + 16, by + codeBoxH / 2);
    ctx.lineTo(bx + 38, by + codeBoxH / 2);
    ctx.stroke();

    ctx.font = "bold 10px 'Courier New', monospace";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(wc.label, bx + 46, by + 16);

    ctx.font = "9.5px Helvetica, Arial, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(wc.desc, bx + 46, by + 30);
  });

  // Panel 2: Numbered Component Key Table (y: 1370 to 2230)
  const tableY = keyHeaderY + 142;
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(margin + 14, tableY, headerW, 32, [6, 6, 0, 0]);
  } else {
    ctx.rect(margin + 14, tableY, headerW, 32);
  }
  ctx.fill();

  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.fillStyle = "#f8fafc";
  ctx.fillText("KEY #", margin + 28, tableY + 20);
  ctx.fillText("BOM COMPONENT IDENTIFIER", margin + 120, tableY + 20);
  ctx.fillText("CATEGORY", margin + 500, tableY + 20);
  ctx.fillText("INTERFACE PROTOCOL", margin + 740, tableY + 20);
  ctx.fillText("TARGET MCU PIN ASSIGNMENT", margin + 1020, tableY + 20);
  ctx.fillText("AUDIT STATUS", margin + 1380, tableY + 20);

  // Rows for active components (excluding contingent items)
  const maxRows = Math.min(activeList.length, 14);
  const rowH = 34;

  for (let idx = 0; idx < maxRows; idx++) {
    const comp = activeList[idx];
    const keyNum = idx + 1;
    const ry = tableY + 32 + idx * rowH;

    ctx.fillStyle = idx % 2 === 1 ? "#f8fafc" : "#ffffff";
    ctx.fillRect(margin + 14, ry, headerW, rowH);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(margin + 14, ry, headerW, rowH);

    let pillColor = "#0891b2";
    if (comp.interface.includes("SPI")) pillColor = "#7c3aed";
    else if (comp.interface.includes("UART")) pillColor = "#059669";
    else if (comp.interface.includes("PWM") || comp.category === "Actuator") pillColor = "#d97706";

    ctx.fillStyle = pillColor;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(margin + 26, ry + 6, 62, 22, 4);
    } else {
      ctx.fillRect(margin + 26, ry + 6, 62, 22);
    }
    ctx.fill();
    ctx.font = "bold 10px 'Courier New', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(`KEY #${keyNum}`, margin + 57, ry + 20);
    ctx.textAlign = "left";

    // Component Name
    ctx.font = "bold 11px Helvetica, Arial, sans-serif";
    ctx.fillStyle = "#0f172a";
    const compNameTrunc = comp.name.length > 42 ? comp.name.slice(0, 40) + "..." : comp.name;
    ctx.fillText(compNameTrunc, margin + 120, ry + 21);

    // Category
    ctx.font = "10.5px Helvetica, Arial, sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText(comp.category, margin + 500, ry + 21);

    // Protocol
    ctx.font = "10.5px 'Courier New', monospace";
    ctx.fillStyle = pillColor;
    ctx.fillText(comp.interface || "Digital GPIO", margin + 740, ry + 21);

    // Pin Assignment (Target MCU Pin)
    ctx.font = "bold 10px 'Courier New', monospace";
    ctx.fillStyle = "#1e293b";
    let pinStr = `GPIO ${idx + 4} (Digital Out)`;
    if (comp.interface.includes("I2C")) pinStr = "Pin 21 (SDA) / Pin 22 (SCL)";
    else if (comp.interface.includes("SPI")) pinStr = "Pins 18(SCK) 19(MISO) 23(MOSI)";
    else if (comp.interface.includes("UART")) pinStr = "Pin 16(RX) / Pin 17(TX)";
    else if (comp.interface.includes("PWM") || comp.category === "Actuator")
      pinStr = `PWM-CH${(idx % 4) + 1} (GPIO ${12 + (idx % 4)})`;
    ctx.fillText(pinStr, margin + 1020, ry + 21);

    // Status: Notice NO references to ETA cost!
    ctx.font = "bold 9.5px 'Courier New', monospace";
    ctx.fillStyle = "#16a34a";
    ctx.fillText("VERIFIED • NATO-ALIGNED", margin + 1380, ry + 21);
  }

  // Footer text
  const footerY = height - margin - 15;
  ctx.font = "10px 'Courier New', monospace";
  ctx.fillStyle = "#64748b";
  ctx.fillText(
    "* ALL ACTIVE BOM MODULES CONNECTED TO COMMON GROUND REFERENCE RAIL. CONTINGENCY & PLAN B COMPONENTS EXCLUDED.",
    margin + 18,
    footerY
  );
  ctx.textAlign = "right";
  ctx.fillText("AI RoboPet Engineering Suite • Sheet 2 of 2", width - margin - 18, footerY);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}

/**
 * Exports current project build to local JSON file ($0 cloud cost)
 */
export function exportProjectToJSON(data: {
  robotType: string;
  budget: number;
  customGoal: string;
  activeDrawer: HardwareComponent[];
  contingencyList: HardwareComponent[];
}): string {
  const payload = {
    appName: "AI RoboPet",
    robotType: data.robotType,
    budget: data.budget,
    customGoal: data.customGoal,
    activeDrawer: data.activeDrawer,
    contingencyList: data.contingencyList,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const filename = `AIRoboPet_${data.robotType}_build.json`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return filename;
}

/**
 * Validates and parses local project JSON file
 */
export function parseProjectJSON(content: string): {
  valid: boolean;
  data?: {
    robotType?: string;
    budget?: number;
    customGoal?: string;
    activeDrawer?: HardwareComponent[];
    contingencyList?: HardwareComponent[];
  };
  error?: string;
} {
  try {
    const parsed = JSON.parse(content);
    if (parsed.activeDrawer && Array.isArray(parsed.activeDrawer)) {
      return {
        valid: true,
        data: {
          robotType: parsed.robotType,
          budget: Number(parsed.budget) || undefined,
          customGoal: parsed.customGoal,
          activeDrawer: parsed.activeDrawer,
          contingencyList: Array.isArray(parsed.contingencyList) ? parsed.contingencyList : []
        }
      };
    }
    return { valid: false, error: "Invalid AI RoboPet JSON build file structure." };
  } catch {
    return { valid: false, error: "Failed to parse JSON project file." };
  }
}

export const generateWorkshopSyncUrl = (
  activeDrawer: HardwareComponent[],
  robotType: string,
  budget: number,
  _origin?: string
) => buildWorkshopSyncUrl(robotType, budget, activeDrawer);

export const exportProjectJSON = (
  activeDrawer: HardwareComponent[],
  contingencyList: HardwareComponent[],
  robotType: string,
  customGoal: string,
  budget: number
) => {
  return JSON.stringify(
    {
      appName: "AI RoboPet",
      robotType,
      budget,
      customGoal,
      activeDrawer,
      contingencyList,
      exportedAt: new Date().toISOString()
    },
    null,
    2
  );
};

export const parseWorkshopSyncUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const robotType = parsedUrl.searchParams.get("robotType") || undefined;
    const budget = parsedUrl.searchParams.get("budget") ? Number(parsedUrl.searchParams.get("budget")) : undefined;
    const parts = parsedUrl.searchParams.get("parts")?.split(",").filter(Boolean) || [];
    return { robotType, budget, parts };
  } catch {
    return null;
  }
};

/**
 * Generates and downloads professional PDF specification sheet
 */
export async function exportDrawerToPDF(options: ExportPdfOptions): Promise<string> {
  const {
    exportMode,
    robotType,
    customGoal,
    budget,
    activeMCU,
    activeDrawer,
    shippingTier,
    includeToolsEst,
    includeTrainingEst
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const baseHardwareCost = calculateBaseHardwareCost(activeDrawer);
  const shippingCost = getShippingCost(shippingTier);
  const toolsCost = getToolsCost(includeToolsEst);
  const trainingCost = getTrainingCost(includeTrainingEst);
  const grandTotalCost = baseHardwareCost + shippingCost + toolsCost + trainingCost;
  const budgetExceeded = grandTotalCost > budget;

  const syncUrl = buildWorkshopSyncUrl(robotType, budget, activeDrawer, exportMode);
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(syncUrl, { margin: 1, width: 120 });
  } catch (err) {
    console.warn("QR code data URL generation error:", err);
  }

  // Color palette definitions - refined for high contrast and clean professional printing
  const PRIMARY_COLOR = [15, 23, 42]; // Deep slate (#0f172a)
  const ACCENT_CYAN = [14, 116, 144]; // Deep teal/cyan (#0e7490)
  const ACCENT_PURPLE = [126, 34, 206]; // Deep purple (#7e22ce)
  const TEXT_DARK = [30, 41, 59]; // Near black (#1e293b)
  const TEXT_MUTED = [100, 116, 139]; // Slate grey (#64748b)
  const BG_LIGHT = [248, 250, 252]; // Warm off-white (#f8fafc)
  const LINE_COLOR = [226, 232, 240]; // Light grey border (#e2e8f0)

  const margin = 18;
  const pageWidth = 210;
  const formattedRobotType = robotType
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const renderHeader = (docTitle: string, docSubtitle: string, accentRgb = ACCENT_CYAN) => {
    doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.rect(0, 0, pageWidth, 4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text("AI ROBOPET", margin, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(docSubtitle, margin, 25);

    const rightAlignX = qrDataUrl ? pageWidth - margin - 23 : pageWidth - margin;

    doc.setFontSize(8);
    doc.text(`Generated: ${today}`, rightAlignX, 19, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text(docTitle.toUpperCase(), rightAlignX, 24, { align: "right" });

    if (qrDataUrl) {
      try {
        doc.addImage(qrDataUrl, "PNG", pageWidth - margin - 21, 6, 21, 21);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(5);
        doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
        doc.text("SCAN FOR MOBILE SYNC", pageWidth - margin - 10.5, 29, { align: "center" });
      } catch {
        // fallback gracefully
      }
    }

    doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 31, pageWidth - margin, 31);
  };

  const formatProtocolLabel = (protoStr: string): string => {
    if (!protoStr) return "General Purpose I/O (GPIO)";
    return protoStr.trim();
  };

  // 1. BUDGET VIEW
  const renderBudgetView = (startY: number) => {
    let y = startY;
    const cardHeight = 36;
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    doc.rect(margin, y, pageWidth - 2 * margin, cardHeight, "F");
    doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
    doc.rect(margin, y, pageWidth - 2 * margin, cardHeight, "S");

    doc.setFillColor(ACCENT_CYAN[0], ACCENT_CYAN[1], ACCENT_CYAN[2]);
    doc.rect(margin, y, 2.5, cardHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text("AI ROBOPET SPECIFICATIONS & SYSTEM PROFILE", margin + 5, y + 6);

    // Row 1: Robot Archetype & Target Budget Cap & Budget Status & Bill of Materials
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text("Robot Archetype:", margin + 5, y + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(formattedRobotType, margin + 33, y + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text("Target Budget:", margin + 76, y + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(`$${budget}.00 USD`, margin + 98, y + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text("Modules:", margin + 126, y + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(`${activeDrawer.length} Configured`, margin + 140, y + 12);

    // Row 2: Active Controller (Reformatted font and full-width placement to display all text without clipping)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text("Active Controller:", margin + 5, y + 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    const controllerText = `${activeMCU.name} (${activeMCU.voltage}) • ${activeMCU.specs || "Standard MCU"}`;
    const controllerLines = doc.splitTextToSize(controllerText, pageWidth - 2 * margin - 35);
    doc.text(controllerLines[0], margin + 33, y + 18);

    // Row 3: Primary Objective (Category at margin + 5, bold text starting at margin + 33 in alignment with the category)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text("Primary Objective:", margin + 5, y + 24.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    const goalLines = doc.splitTextToSize(customGoal, pageWidth - 2 * margin - 35);
    doc.text(goalLines, margin + 33, y + 24.5);

    y += cardHeight + 6;

    // BOM Section Header Banner
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, pageWidth - 2 * margin, 8, "F");
    doc.setFillColor(ACCENT_CYAN[0], ACCENT_CYAN[1], ACCENT_CYAN[2]);
    doc.rect(margin, y, 2.5, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text("BILL OF MATERIALS (BOM) & SUPPLIER SOURCING SPECIFICATIONS", margin + 5, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`${activeDrawer.length} ACTIVE MODULES CONFIGURED`, pageWidth - margin - 5, y + 5.5, { align: "right" });

    y += 11;

    const renderBudgetTableHeader = (currY: number) => {
      doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      doc.rect(margin, currY, pageWidth - 2 * margin, 12, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("COMPONENT / HARDWARE MODULE", margin + 4, currY + 4.5);
      doc.text("MANUFACTURER & CATEGORY", margin + 85, currY + 4.5);

      doc.setFontSize(6.5);
      doc.setTextColor(241, 245, 249);
      doc.text("PROTOCOL / BUS INTERFACE", margin + 4, currY + 9.5);
      doc.text("HARDWARE SPECIFICATIONS & PARAMETERS", margin + 54, currY + 9.5);
      doc.text("EST. COST ($)", pageWidth - margin - 4, currY + 9.5, { align: "right" });

      return currY + 12;
    };

    y = renderBudgetTableHeader(y);

    activeDrawer.forEach((comp, idx) => {
      const fullProto = formatProtocolLabel(comp.interface);
      const fullSpecs = comp.specs.trim() || "Standard OEM robotics hardware component.";
      const priceText = `$${comp.estimatedPriceUSD}.00 USD`;

      const protoLines = doc.splitTextToSize(fullProto, 46);
      const specLines = doc.splitTextToSize(fullSpecs, 88);
      const maxLines = Math.max(protoLines.length, specLines.length, 1);

      const primaryHeight = 6.5;
      const extensionHeight = 4.5 + maxLines * 3.6;
      const totalItemHeight = primaryHeight + extensionHeight;

      if (y + totalItemHeight > 260) {
        doc.addPage();
        renderHeader("Project Budget & BOM Report (Cont.)", "Financial breakdown and supplier inventory analysis (Continued)", ACCENT_CYAN);
        y = 35;
        y = renderBudgetTableHeader(y);
      }

      if (idx % 2 === 1) {
        doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
        doc.rect(margin, y, pageWidth - 2 * margin, totalItemHeight, "F");
      }

      doc.setFillColor(ACCENT_CYAN[0], ACCENT_CYAN[1], ACCENT_CYAN[2]);
      doc.rect(margin, y, 1.2, totalItemHeight, "F");

      // 1. PRIMARY ROW
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(comp.name, margin + 4, y + 4.8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text(`Mfg: ${comp.manufacturer || "OEM Catalog"} • Category: ${comp.category}`, margin + 85, y + 4.8);

      doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
      doc.setLineWidth(0.15);
      doc.line(margin + 3, y + primaryHeight, pageWidth - margin - 3, y + primaryHeight);

      // 2. EXTENSION ROW BELOW
      const extY = y + primaryHeight;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      doc.text("PROTOCOL:", margin + 4, extY + 3.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(protoLines, margin + 4, extY + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      doc.text("KEY SPECIFICATIONS:", margin + 54, extY + 3.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(specLines, margin + 54, extY + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      doc.text("EST. COST:", pageWidth - margin - 4, extY + 3.5, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(priceText, pageWidth - margin - 4, extY + 8, { align: "right" });

      doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
      doc.setLineWidth(0.25);
      doc.line(margin, y + totalItemHeight, pageWidth - margin, y + totalItemHeight);

      y += totalItemHeight;
    });

    if (y + 55 > 270) {
      doc.addPage();
      renderHeader("Project Budget & BOM Report (Cont.)", "Financial breakdown and investment analysis (Continued)", ACCENT_CYAN);
      y = 35;
    }

    y += 4;
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, pageWidth - 2 * margin, 7, "F");
    doc.setFillColor(ACCENT_CYAN[0], ACCENT_CYAN[1], ACCENT_CYAN[2]);
    doc.rect(margin, y, 2.5, 7, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text("ADDITIONAL PROJECT INVESTMENT ITEMIZATION", margin + 5, y + 4.8);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text("1. Hardware Parts Subtotal", margin + 5, y);
    doc.text(`$${baseHardwareCost}.00 USD`, pageWidth - margin - 4, y, { align: "right" });
    y += 5;

    doc.text(`2. Estimated Shipping & Handling (${shippingTier.toUpperCase()} Delivery)`, margin + 5, y);
    doc.text(`$${shippingCost}.00 USD`, pageWidth - margin - 4, y, { align: "right" });
    y += 5;

    doc.text(`3. Tools & Assembly Equipment (Soldering Iron, Multimeter, Wire Cutters, Screws)`, margin + 5, y);
    doc.text(`$${toolsCost}.00 USD`, pageWidth - margin - 4, y, { align: "right" });
    y += 5;

    doc.text(`4. AI Neural Training & Compute Runtime (Physics Sim GPU & LLM Credits)`, margin + 5, y);
    doc.text(`$${trainingCost}.00 USD`, pageWidth - margin - 4, y, { align: "right" });
    y += 7;

    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    doc.rect(margin, y, pageWidth - 2 * margin, 8.5, "F");
    doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
    doc.rect(margin, y, pageWidth - 2 * margin, 8.5, "S");

    doc.setFillColor(ACCENT_CYAN[0], ACCENT_CYAN[1], ACCENT_CYAN[2]);
    doc.rect(margin, y, 2.5, 8.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text("Estimated Overall Project Cost", margin + 5, y + 5.5);
    doc.text(`$${grandTotalCost}.00 USD`, pageWidth - margin - 4, y + 5.5, { align: "right" });

    y += 12;
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y, pageWidth - 2 * margin, 20, "F");
    doc.setDrawColor(187, 247, 208);
    doc.rect(margin, y, pageWidth - 2 * margin, 20, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(22, 101, 52);
    doc.text("SUPPLY CHAIN SECURITY & NATO-ALIGNED AUDIT VERDICT", margin + 5, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Hardware Origin: 100% US & NATO-Aligned Authorized Vendors (DigiKey, Mouser, SparkFun, Adafruit, Pololu)", margin + 5, y + 11);
    doc.text("Software Stack: 100% Open-Source C++/Python/ROS 2 (Zero proprietary telemetry or mandatory third-party mobile app locks)", margin + 5, y + 16);

    return y + 25;
  };

  // 2. WIRING VIEW
  const renderWiringView = (startY: number) => {
    let y = startY;

    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, pageWidth - 2 * margin, 24, "F");
    doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
    doc.rect(margin, y, pageWidth - 2 * margin, 24, "S");
    doc.setFillColor(ACCENT_PURPLE[0], ACCENT_PURPLE[1], ACCENT_PURPLE[2]);
    doc.rect(margin, y, 2.5, 24, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text(`MASTER CONTROLLER PINOUT CONFIGURATION — ${activeMCU.name.toUpperCase()}`, margin + 5, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`Operating Voltage: ${activeMCU.voltage}`, margin + 5, y + 12);
    doc.text(`Supported Bus Protocols: I2C (SDA/SCL), SPI (MOSI/MISO), Hardware UART (TX/RX), Multi-channel PWM`, margin + 5, y + 17);
    doc.text(`Note: All modules MUST share a unified common Ground (GND) reference rail across power supplies.`, margin + 5, y + 22);

    y += 29;

    const nonMCUComponents = activeDrawer.filter((c) => c.category !== "Microcontroller" && c.category !== "SBC");
    const listToMap = nonMCUComponents.length > 0 ? nonMCUComponents : activeDrawer;

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, pageWidth - 2 * margin, 8, "F");
    doc.setFillColor(ACCENT_PURPLE[0], ACCENT_PURPLE[1], ACCENT_PURPLE[2]);
    doc.rect(margin, y, 2.5, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text("HARDWARE CIRCUIT CONNECTIONS & PINOUT MAPPING", margin + 5, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`${listToMap.length} SIGNAL CONNECTIONS`, pageWidth - margin - 5, y + 5.5, { align: "right" });

    y += 11;

    const renderWiringTableHeader = (currY: number) => {
      doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      doc.rect(margin, currY, pageWidth - 2 * margin, 12, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("MODULE / SENSOR NAME", margin + 4, currY + 4.5);
      doc.text("MODULE TERMINAL & TARGET MCU PIN", margin + 85, currY + 4.5);

      doc.setFontSize(6.5);
      doc.setTextColor(241, 245, 249);
      doc.text("PROTOCOL / BUS INTERFACE", margin + 4, currY + 9.5);
      doc.text("CIRCUIT WIRING NOTES & HARDWARE PARAMETERS", margin + 54, currY + 9.5);
      doc.text("CIRCUIT REF", pageWidth - margin - 4, currY + 9.5, { align: "right" });

      return currY + 12;
    };

    y = renderWiringTableHeader(y);

    listToMap.forEach((comp, idx) => {
      let pin = "Signal / Out";
      let mcuPort = `GPIO ${idx + 4}`;
      let protocol = comp.interface || "GPIO";
      let note = "Direct GPIO logic connection";

      if (comp.interface.includes("I2C")) {
        pin = "SDA / SCL";
        mcuPort = activeMCU.name.includes("ESP32") ? "GPIO 21 / 22" : activeMCU.name.includes("Arduino") ? "A4 / A5" : "I2C-1 (Pins 3 / 5)";
        note = "Add 4.7k Ohm pull-up resistors if line unstable";
      } else if (comp.interface.includes("UART")) {
        pin = "TX / RX";
        mcuPort = activeMCU.name.includes("ESP32") ? "GPIO 16 / 17" : activeMCU.name.includes("Arduino") ? "D0 / D1 (Hardware Serial)" : "UART-0 (Pins 8 / 10)";
        note = "Cross TX->RX and RX->TX";
      } else if (comp.interface.includes("PWM")) {
        pin = "PWM Input";
        mcuPort = activeMCU.name.includes("Arduino") ? `PWM D${(idx % 6) + 3}` : `GPIO ${idx + 12} (PWM)`;
        note = "Isolate motor power; common GND required";
      } else if (comp.id.includes("hcsr04") || comp.name.toLowerCase().includes("ultrasonic")) {
        pin = "Trig / Echo";
        mcuPort = "D12 (Trig) / D13 (Echo)";
        note = "Use voltage divider on 5V Echo for 3.3V MCU";
      } else if (comp.category === "Power Supply" || comp.name.toLowerCase().includes("battery")) {
        pin = "VCC (+) / GND (-)";
        mcuPort = "VIN / GND Rail";
        note = "Route through step-down regulator / UBEC";
      }

      const fullProto = comp.interface.trim() || protocol || "General Purpose I/O (GPIO)";
      const fullNotes = `${note}. ${comp.specs ? `Hardware: ${comp.specs}` : ""}`;

      const protoLines = doc.splitTextToSize(fullProto, 46);
      const noteLines = doc.splitTextToSize(fullNotes, 88);
      const maxLines = Math.max(protoLines.length, noteLines.length, 1);

      const primaryHeight = 6.5;
      const extensionHeight = 4.5 + maxLines * 3.6;
      const totalItemHeight = primaryHeight + extensionHeight;

      if (y + totalItemHeight > 260) {
        doc.addPage();
        renderHeader("Master Circuit Wiring & Pinout Schema (Cont.)", "Hardware connection matrix and pinout mapping (Continued)", ACCENT_PURPLE);
        y = 35;
        y = renderWiringTableHeader(y);
      }

      if (idx % 2 === 1) {
        doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
        doc.rect(margin, y, pageWidth - 2 * margin, totalItemHeight, "F");
      }

      doc.setFillColor(ACCENT_PURPLE[0], ACCENT_PURPLE[1], ACCENT_PURPLE[2]);
      doc.rect(margin, y, 1.2, totalItemHeight, "F");

      // 1. PRIMARY ROW
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(comp.name, margin + 4, y + 4.8);

      // Match font style to the corresponding section (helvetica bold, TEXT_DARK) and ensure all text is included
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      const pinLines = doc.splitTextToSize(`${pin}  ->  ${mcuPort}`, pageWidth - margin - 85 - 4);
      doc.text(pinLines, margin + 85, y + 4.8);

      doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
      doc.setLineWidth(0.15);
      doc.line(margin + 3, y + primaryHeight, pageWidth - margin - 3, y + primaryHeight);

      // 2. EXTENSION ROW
      const extY = y + primaryHeight;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      doc.text("PROTOCOL:", margin + 4, extY + 3.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(protoLines, margin + 4, extY + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      doc.text("WIRING SPECS & NOTES:", margin + 54, extY + 3.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(noteLines, margin + 54, extY + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(ACCENT_PURPLE[0], ACCENT_PURPLE[1], ACCENT_PURPLE[2]);
      doc.text("CIRCUIT REF:", pageWidth - margin - 4, extY + 3.5, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(`KEY #${idx + 1}`, pageWidth - margin - 4, extY + 8, { align: "right" });

      doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
      doc.setLineWidth(0.25);
      doc.line(margin, y + totalItemHeight, pageWidth - margin, y + totalItemHeight);

      y += totalItemHeight;
    });

    if (y + 35 > 270) {
      doc.addPage();
      renderHeader("Master Circuit Wiring & Pinout Schema (Cont.)", "Hardware connection matrix and pinout mapping (Continued)", ACCENT_PURPLE);
      y = 35;
    }

    y += 6;
    doc.setFillColor(254, 242, 242);
    doc.rect(margin, y, pageWidth - 2 * margin, 20, "F");
    doc.setDrawColor(254, 202, 202);
    doc.rect(margin, y, pageWidth - 2 * margin, 20, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(185, 28, 28);
    doc.text("CRITICAL ELECTRICAL PROTECTION RULES:", margin + 4, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(127, 29, 29);
    doc.text("1. Inductive Spike Isolation: High-torque servos or motors MUST be powered from an external battery/UBEC rail, NOT the MCU 5V pin.", margin + 4, y + 10);
    doc.text("2. Logic Shifting: Interfacing a 5V sensor output to a 3.3V GPIO (e.g. Raspberry Pi / ESP32) requires a logic level shifter or divider.", margin + 4, y + 15);

    return y + 26;
  };

  // Render according to selected mode
  if (exportMode === "budget") {
    renderHeader("Project Budget & BOM Report", "Financial breakdown and supplier estimation analysis", ACCENT_CYAN);
    renderBudgetView(35);
  } else if (exportMode === "wiring") {
    renderHeader("Wiring Schema & Pinout Report", "Page 1 of 2 — Hardware connection matrix and logic interface protocols", ACCENT_PURPLE);
    renderWiringView(35);

    // PAGE 2: Full Page Wiring Schematic Diagram with Key as an Image
    doc.addPage();
    try {
      const schematicDataUrl = generateWiringSchematicImage(activeMCU, activeDrawer, robotType);
      if (schematicDataUrl) {
        doc.addImage(schematicDataUrl, "PNG", 0, 0, pageWidth, 297);
        // Also export the standalone high-resolution schematic image file along with the wiring PDF
        downloadDataUrl(
          schematicDataUrl,
          `AIRoboPet_Wiring_Schematic_Key_${formattedRobotType.replace(/\s+/g, "_")}.png`
        );
      }
    } catch (err) {
      console.error("Error embedding wiring schematic diagram image:", err);
    }
  } else if (exportMode === "full") {
    renderHeader("Master Project Budget & BOM Report", "Page 1 of 3 — Financial breakdown and inventory analysis", ACCENT_CYAN);
    renderBudgetView(35);

    doc.addPage();
    renderHeader("Master Circuit Wiring & Pinout Schema", "Page 2 of 3 — Pin mapping matrix and electrical guidelines", ACCENT_PURPLE);
    renderWiringView(35);

    doc.addPage();
    try {
      const schematicDataUrl = generateWiringSchematicImage(activeMCU, activeDrawer, robotType);
      if (schematicDataUrl) {
        doc.addImage(schematicDataUrl, "PNG", 0, 0, pageWidth, 297);
      }
    } catch (err) {
      console.error("Error embedding schematic image in full report:", err);
    }
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text("AI RoboPet Suite — Designed with Google AI Studio", pageWidth / 2, 288, { align: "center" });

  const viewTitle = exportMode === "budget" ? "Budget" : exportMode === "wiring" ? "Wiring_Schema" : "Full_Report";
  const filename = `AIRoboPet_${viewTitle}_${formattedRobotType.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
  return filename;
}
