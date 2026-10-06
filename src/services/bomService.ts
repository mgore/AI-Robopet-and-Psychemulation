import { HardwareComponent, ComponentCategory } from "../types";

export interface PowerBudgetReport {
  totalEstimatedCurrentMA: number;
  continuousDrawMA: number;
  peakDrawMA: number;
  idleDrawMA: number;
  estimatedBatteryRunHours: number;
  standbyRunHours: number;
  recommendedBatteryCapacity: string;
  hasBatteryIndicator: boolean;
  batteryIndicatorName?: string;
  dutyCycleLabel?: string;
  wattsEstimate: number;
  componentBreakdown: Array<{
    name: string;
    category: ComponentCategory;
    nominalMA: number;
    peakMA: number;
  }>;
}

export interface PinUsageReport {
  usedGPIO: number;
  totalAvailableGPIO: number;
  usedPWM: number;
  usedI2C: number;
  usedSPI: number;
  usedUART: number;
  isConstrained: boolean;
  pinoutSummary: string;
}

export const CONTROLLER_CATEGORIES: ReadonlySet<ComponentCategory> = new Set([
  "Microcontroller",
  "SBC",
  "SOM / Compute",
  "SOM / FPGA & MPSoC",
  "SOM / AI Accelerator",
  "Robot Platform"
]);

/**
 * Checks if a component category represents a main brain / controller
 */
export function isPrimaryControllerCategory(category: string): boolean {
  return CONTROLLER_CATEGORIES.has(category as ComponentCategory);
}

/**
 * Handles adding a component to the active BOM drawer according to robotics engineering rules
 */
export function addComponentToDrawer(
  currentDrawer: HardwareComponent[],
  component: HardwareComponent,
  activeMCU: HardwareComponent
): {
  updatedDrawer: HardwareComponent[];
  updatedMCU: HardwareComponent;
  message: string;
  success: boolean;
} {
  // If component is a primary controller or SOM, replace the active MCU
  if (isPrimaryControllerCategory(component.category)) {
    const updatedDrawer = currentDrawer
      .filter((c) => !isPrimaryControllerCategory(c.category))
      .concat(component);

    return {
      updatedDrawer,
      updatedMCU: component,
      message: `Selected ${component.name} as primary controller.`,
      success: true
    };
  }

  // Check duplicate
  if (currentDrawer.some((c) => c.id === component.id)) {
    return {
      updatedDrawer: currentDrawer,
      updatedMCU: activeMCU,
      message: `${component.name} is already in your build.`,
      success: false
    };
  }

  return {
    updatedDrawer: [...currentDrawer, component],
    updatedMCU: activeMCU,
    message: `Added ${component.name} to build drawer.`,
    success: true
  };
}

/**
 * Handles removing a component from the active BOM drawer safely
 */
export function removeComponentFromDrawer(
  currentDrawer: HardwareComponent[],
  componentId: string,
  activeMCU: HardwareComponent
): {
  updatedDrawer: HardwareComponent[];
  message: string;
  success: boolean;
} {
  const target = currentDrawer.find((c) => c.id === componentId);
  if (!target) {
    return { updatedDrawer: currentDrawer, message: "Component not found.", success: false };
  }

  if (target.id === activeMCU.id) {
    return {
      updatedDrawer: currentDrawer,
      message: "Primary controller cannot be removed directly. Select another controller to replace it.",
      success: false
    };
  }

  return {
    updatedDrawer: currentDrawer.filter((c) => c.id !== componentId),
    message: `Removed ${target.name} from drawer.`,
    success: true
  };
}

/**
 * Calculates estimated power budget across configured components
 */
export function calculatePowerBudget(
  components: HardwareComponent[],
  batteryCapacityMAh: number = 2200,
  dutyCycleMode: "standby" | "nominal" | "reflex" = "nominal"
): PowerBudgetReport {
  let continuousMA = 0;
  let peakMA = 0;
  let idleMA = 0;
  let hasBatteryIndicator = false;
  let batteryIndicatorName = "";

  const componentBreakdown: PowerBudgetReport["componentBreakdown"] = [];

  for (const comp of components) {
    const cat = comp.category;
    const name = comp.name.toLowerCase();
    const id = comp.id.toLowerCase();
    let compNominal = 15;
    let compPeak = 30;
    let compIdle = 5;

    // Check battery level indicators
    if (
      id.includes("battery_indicator") ||
      name.includes("battery level") ||
      name.includes("fuel gauge") ||
      name.includes("voltmeter")
    ) {
      hasBatteryIndicator = true;
      batteryIndicatorName = comp.name;
      compNominal = name.includes("fuel gauge") ? 0.05 : 15;
      compPeak = name.includes("fuel gauge") ? 0.1 : 18;
      compIdle = name.includes("fuel gauge") ? 0.02 : 0.01;
    } else if (cat === "Microcontroller") {
      compNominal = 90;
      compPeak = 240; // Wi-Fi TX burst
      compIdle = 25; // Light sleep / listen
    } else if (cat === "SBC" || cat === "SOM / Compute" || cat === "SOM / AI Accelerator") {
      if (name.includes("orin") || name.includes("jetson")) {
        compNominal = 2000;
        compPeak = 3500;
        compIdle = 650;
      } else if (name.includes("pi 4") || name.includes("pi 5")) {
        compNominal = 1200;
        compPeak = 2500;
        compIdle = 450;
      } else {
        compNominal = 800;
        compPeak = 1500;
        compIdle = 300;
      }
    } else if (cat === "Actuator") {
      if (name.includes("mg996r") || name.includes("high torque")) {
        compNominal = 250;
        compPeak = 1800;
        compIdle = 15;
      } else if (name.includes("sg90")) {
        compNominal = 100;
        compPeak = 500;
        compIdle = 8;
      } else {
        compNominal = 150;
        compPeak = 800;
        compIdle = 10;
      }
    } else if (cat === "Animatronics & Expression") {
      // Specialized companion components
      if (name.includes("servo") || name.includes("gimbal") || name.includes("pan/tilt")) {
        // High-speed reflex micro servos
        const isPack = name.includes("3-pack") || name.includes("pair");
        const multiplier = isPack ? 2.5 : 1;
        compNominal = Math.round(110 * multiplier);
        compPeak = Math.round(550 * multiplier);
        compIdle = Math.round(10 * multiplier);
      } else if (name.includes("oled") || name.includes("eye")) {
        compNominal = 30; // OLED eye screen pair
        compPeak = 55;
        compIdle = 15;
      } else if (name.includes("purr") || name.includes("transducer") || name.includes("exciter")) {
        compNominal = 80;
        compPeak = 220;
        compIdle = 0.5;
      } else if (name.includes("mood") || name.includes("ws2812b") || name.includes("neopixel")) {
        compNominal = 50;
        compPeak = 160;
        compIdle = 5;
      } else if (name.includes("speaker") || name.includes("amp")) {
        compNominal = 90;
        compPeak = 350;
        compIdle = 3;
      } else if (name.includes("whisker") || name.includes("touch") || name.includes("ttp223")) {
        compNominal = 2;
        compPeak = 5;
        compIdle = 0.5;
      } else {
        compNominal = 40;
        compPeak = 120;
        compIdle = 5;
      }
    } else if (cat === "Motor Driver") {
      compNominal = 40;
      compPeak = 150;
      compIdle = 12;
    } else if (cat === "Sensor") {
      if (name.includes("lidar")) {
        compNominal = 350;
        compPeak = 600;
        compIdle = 80;
      } else if (name.includes("camera")) {
        compNominal = 200;
        compPeak = 350;
        compIdle = 50;
      } else {
        compNominal = 15;
        compPeak = 30;
        compIdle = 2;
      }
    } else {
      compNominal = 10;
      compPeak = 20;
      compIdle = 2;
    }

    continuousMA += compNominal;
    peakMA += compPeak;
    idleMA += compIdle;

    componentBreakdown.push({
      name: comp.name,
      category: comp.category,
      nominalMA: compNominal,
      peakMA: compPeak
    });
  }

  // Weight average current draw based on user duty cycle mode
  let avgDrawMA = 0;
  let dutyCycleLabel = "Nominal Companion Mode";
  if (dutyCycleMode === "standby") {
    avgDrawMA = Math.max(30, Math.round(idleMA * 0.85 + continuousMA * 0.15));
    dutyCycleLabel = "Idle / Low Power Standby";
  } else if (dutyCycleMode === "reflex") {
    avgDrawMA = Math.max(80, Math.round(continuousMA * 0.45 + peakMA * 0.55));
    dutyCycleLabel = "High-Reflex Dynamic Hunt";
  } else {
    avgDrawMA = Math.max(50, Math.round(idleMA * 0.2 + continuousMA * 0.6 + peakMA * 0.2));
    dutyCycleLabel = "Nominal Balanced Operation";
  }

  const safeCapacity = batteryCapacityMAh * 0.85; // 85% usable battery efficiency
  const runHours = Math.round((safeCapacity / avgDrawMA) * 10) / 10;
  const standbyHours = Math.round((safeCapacity / Math.max(15, idleMA)) * 10) / 10;
  const wattsEstimate = Math.round(((avgDrawMA * 5.0) / 1000) * 10) / 10; // 5V nominal system rail

  let recommendedBattery = "7.4V 2S LiPo (2200mAh 25C)";
  if (continuousMA > 2000) {
    recommendedBattery = "11.1V 3S LiPo (3300mAh 45C) + 5V 5A UBEC Step-Down";
  } else if (continuousMA < 350) {
    recommendedBattery = "Dual 18650 Li-ion cells (7.4V 2600mAh) with 5V/3A Type-C Boost Shield";
  }

  return {
    totalEstimatedCurrentMA: avgDrawMA,
    continuousDrawMA: continuousMA,
    peakDrawMA: peakMA,
    idleDrawMA: idleMA,
    estimatedBatteryRunHours: runHours,
    standbyRunHours: standbyHours,
    recommendedBatteryCapacity: recommendedBattery,
    hasBatteryIndicator,
    batteryIndicatorName: batteryIndicatorName || undefined,
    dutyCycleLabel,
    wattsEstimate,
    componentBreakdown
  };
}

/**
 * Calculates estimated GPIO and communication bus utilization
 */
export function calculatePinUsage(
  components: HardwareComponent[],
  mcu: HardwareComponent
): PinUsageReport {
  let usedGPIO = 0;
  let usedPWM = 0;
  let usedI2C = 0;
  let usedSPI = 0;
  let usedUART = 0;

  for (const comp of components) {
    if (comp.id === mcu.id) continue;
    const iface = (comp.interface || "").toLowerCase();
    const cat = comp.category;

    if (iface.includes("i2c")) usedI2C++;
    if (iface.includes("spi")) usedSPI++;
    if (iface.includes("uart")) usedUART++;
    if (iface.includes("pwm") || cat === "Actuator") usedPWM += 1;

    // Approximate GPIO pins required
    if (cat === "Sensor") {
      if (iface.includes("i2c")) usedGPIO += 2; // SDA, SCL
      else if (comp.name.toLowerCase().includes("hcsr04")) usedGPIO += 2; // Trig, Echo
      else usedGPIO += 1;
    } else if (cat === "Motor Driver") {
      if (iface.includes("i2c")) usedGPIO += 2;
      else usedGPIO += 4; // IN1, IN2, IN3, IN4 or ENA/ENB
    } else if (cat === "Actuator") {
      usedGPIO += 1;
    }
  }

  // Estimated available pins based on controller
  let totalAvailableGPIO = 26;
  const mcuName = mcu.name.toLowerCase();
  if (mcuName.includes("teensy 4.1")) totalAvailableGPIO = 42;
  else if (mcuName.includes("esp32-s3")) totalAvailableGPIO = 36;
  else if (mcuName.includes("esp32")) totalAvailableGPIO = 24;
  else if (mcuName.includes("uno r4")) totalAvailableGPIO = 14;
  else if (mcuName.includes("raspberry pi 4") || mcuName.includes("pi 5")) totalAvailableGPIO = 28;
  else if (mcuName.includes("orin") || mcuName.includes("jetson")) totalAvailableGPIO = 28;

  const isConstrained = usedGPIO > totalAvailableGPIO * 0.85;

  return {
    usedGPIO,
    totalAvailableGPIO,
    usedPWM,
    usedI2C,
    usedSPI,
    usedUART,
    isConstrained,
    pinoutSummary: `${usedGPIO}/${totalAvailableGPIO} GPIO Pins Assigned (${usedI2C} I2C device${usedI2C > 1 ? 's' : ''}, ${usedPWM} PWM channel${usedPWM > 1 ? 's' : ''})`
  };
}

/**
 * Checks for missing critical robotics subsystems
 */
export function findMissingSubsystems(components: HardwareComponent[]): string[] {
  const categories = new Set(components.map((c) => c.category));
  const missing: string[] = [];

  const hasController = components.some((c) => isPrimaryControllerCategory(c.category));
  if (!hasController) missing.push("Primary Controller (Microcontroller / SBC)");

  if (!categories.has("Power Supply")) {
    missing.push("Power Source (Battery pack, LiPo, or DC-DC regulator)");
  }

  if (!categories.has("Actuator") && !categories.has("Chassis")) {
    missing.push("Motion / Actuation (Motors, Servos, or Drive Chassis)");
  }

  return missing;
}
