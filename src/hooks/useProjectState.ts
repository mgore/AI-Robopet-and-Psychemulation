import { useState, useMemo, useCallback } from "react";
import { HardwareComponent, RobotProfile } from "../types";
import { PRESET_PROJECTS, SUPPLIER_CATALOG } from "../data";
import {
  calculateCompleteProjectCost,
  getCategoryCostBreakdown,
  ShippingTier,
  CostBreakdown,
  CategorySummary
} from "../services/costService";
import {
  addComponentToDrawer,
  removeComponentFromDrawer,
  calculatePowerBudget,
  calculatePinUsage,
  findMissingSubsystems,
  isPrimaryControllerCategory,
  PowerBudgetReport,
  PinUsageReport
} from "../services/bomService";

export interface UseProjectStateReturn {
  // Core Configuration
  robotType: RobotProfile["type"];
  setRobotType: (type: RobotProfile["type"]) => void;
  customGoal: string;
  setCustomGoal: (goal: string) => void;
  budget: number;
  setBudget: (budget: number) => void;

  // Active BOM & Components
  activeMCU: HardwareComponent;
  setActiveMCU: (mcu: HardwareComponent) => void;
  activeDrawer: HardwareComponent[];
  setActiveDrawer: (drawer: HardwareComponent[]) => void;
  contingencyList: HardwareComponent[];
  setContingencyList: (list: HardwareComponent[]) => void;

  // Logistics & Additional Options
  shippingTier: ShippingTier;
  setShippingTier: (tier: ShippingTier) => void;
  includeToolsEst: boolean;
  setIncludeToolsEst: (include: boolean) => void;
  includeTrainingEst: boolean;
  setIncludeTrainingEst: (include: boolean) => void;

  // Computed Analysis & Budgets
  costBreakdown: CostBreakdown;
  categoryBreakdown: CategorySummary[];
  powerBudget: PowerBudgetReport;
  pinUsage: PinUsageReport;
  missingSubsystems: string[];

  // Actions
  loadPreset: (presetName: string, onNotify?: (msg: string) => void) => void;
  addToDrawer: (component: HardwareComponent, onNotify?: (msg: string) => void) => void;
  removeFromDrawer: (id: string, onNotify?: (msg: string) => void) => void;
  addToContingency: (component: HardwareComponent, onNotify?: (msg: string) => void) => void;
  removeFromContingency: (id: string, onNotify?: (msg: string) => void) => void;
  swapContingencyToActive: (component: HardwareComponent, onNotify?: (msg: string) => void) => void;
}

export function useProjectState(): UseProjectStateReturn {
  const [robotType, setRobotType] = useState<RobotProfile["type"]>("wheeled_rover");
  const [customGoal, setCustomGoal] = useState(
    "A self-driving explorer rover that maps rooms via LiDAR, avoids collisions with ultrasonic sensors, and streams telemetry over Wi-Fi."
  );
  const [budget, setBudget] = useState(250);

  // Default MCU: ESP32 DevKitC
  const [activeMCU, setActiveMCU] = useState<HardwareComponent>(() => {
    return (
      SUPPLIER_CATALOG.find((c) => c.id === "esp32_wroom") ||
      SUPPLIER_CATALOG[0]
    );
  });

  // Default initial components
  const [activeDrawer, setActiveDrawer] = useState<HardwareComponent[]>(() => {
    return [
      SUPPLIER_CATALOG.find((c) => c.id === "esp32_wroom")!,
      SUPPLIER_CATALOG.find((c) => c.id === "tb6612")!,
      SUPPLIER_CATALOG.find((c) => c.id === "hcsr04")!,
      SUPPLIER_CATALOG.find((c) => c.id === "mpu6050")!,
      SUPPLIER_CATALOG.find((c) => c.id === "lipo_2s")!,
      SUPPLIER_CATALOG.find((c) => c.id === "ubec_5v")!
    ].filter(Boolean);
  });

  const [contingencyList, setContingencyList] = useState<HardwareComponent[]>(() => {
    return [
      SUPPLIER_CATALOG.find((c) => c.id === "vl53l0x")!,
      SUPPLIER_CATALOG.find((c) => c.id === "holder_18650")!
    ].filter(Boolean);
  });

  // Shipping & tools estimations
  const [shippingTier, setShippingTier] = useState<ShippingTier>("standard");
  const [includeToolsEst, setIncludeToolsEst] = useState(true);
  const [includeTrainingEst, setIncludeTrainingEst] = useState(true);

  // Computed cost breakdown
  const costBreakdown = useMemo(() => {
    return calculateCompleteProjectCost(
      activeDrawer,
      budget,
      shippingTier,
      includeToolsEst,
      includeTrainingEst
    );
  }, [activeDrawer, budget, shippingTier, includeToolsEst, includeTrainingEst]);

  // Computed category breakdown
  const categoryBreakdown = useMemo(() => {
    return getCategoryCostBreakdown(activeDrawer);
  }, [activeDrawer]);

  // Computed power analysis
  const powerBudget = useMemo(() => {
    return calculatePowerBudget(activeDrawer);
  }, [activeDrawer]);

  // Computed pin & bus utilization
  const pinUsage = useMemo(() => {
    return calculatePinUsage(activeDrawer, activeMCU);
  }, [activeDrawer, activeMCU]);

  // Missing subsystems validation
  const missingSubsystems = useMemo(() => {
    return findMissingSubsystems(activeDrawer);
  }, [activeDrawer]);

  // Load Preset
  const loadPreset = useCallback(
    (presetName: string, onNotify?: (msg: string) => void) => {
      const preset = PRESET_PROJECTS.find((p) => p.name === presetName);
      if (preset) {
        setRobotType(preset.type);
        setCustomGoal(preset.goal);
        setBudget(preset.budget);

        const mcuComp = preset.components.find((c) => isPrimaryControllerCategory(c.category));
        if (mcuComp) {
          setActiveMCU(mcuComp);
        }
        setActiveDrawer(preset.components);
        onNotify?.(`Loaded preset: "${presetName}"`);
      }
    },
    []
  );

  // Add component to active BOM
  const addToDrawer = useCallback(
    (component: HardwareComponent, onNotify?: (msg: string) => void) => {
      setActiveDrawer((prev) => {
        const result = addComponentToDrawer(prev, component, activeMCU);
        if (result.updatedMCU.id !== activeMCU.id) {
          setActiveMCU(result.updatedMCU);
        }
        onNotify?.(result.message);
        return result.updatedDrawer;
      });
    },
    [activeMCU]
  );

  // Remove component from active BOM
  const removeFromDrawer = useCallback(
    (id: string, onNotify?: (msg: string) => void) => {
      setActiveDrawer((prev) => {
        const result = removeComponentFromDrawer(prev, id, activeMCU);
        onNotify?.(result.message);
        return result.updatedDrawer;
      });
    },
    [activeMCU]
  );

  // Add component to contingency list
  const addToContingency = useCallback(
    (component: HardwareComponent, onNotify?: (msg: string) => void) => {
      setContingencyList((prev) => {
        if (prev.some((c) => c.id === component.id)) {
          onNotify?.(`${component.name} is already in your contingency list.`);
          return prev;
        }
        onNotify?.(`Saved ${component.name} as contingency backup.`);
        return [...prev, component];
      });
    },
    []
  );

  // Remove component from contingency list
  const removeFromContingency = useCallback(
    (id: string, onNotify?: (msg: string) => void) => {
      setContingencyList((prev) => {
        const target = prev.find((c) => c.id === id);
        if (target) {
          onNotify?.(`Removed ${target.name} from contingency list.`);
        }
        return prev.filter((c) => c.id !== id);
      });
    },
    []
  );

  // Swap contingency component into active BOM
  const swapContingencyToActive = useCallback(
    (component: HardwareComponent, onNotify?: (msg: string) => void) => {
      addToDrawer(component, onNotify);
    },
    [addToDrawer]
  );

  return {
    robotType,
    setRobotType,
    customGoal,
    setCustomGoal,
    budget,
    setBudget,
    activeMCU,
    setActiveMCU,
    activeDrawer,
    setActiveDrawer,
    contingencyList,
    setContingencyList,
    shippingTier,
    setShippingTier,
    includeToolsEst,
    setIncludeToolsEst,
    includeTrainingEst,
    setIncludeTrainingEst,
    costBreakdown,
    categoryBreakdown,
    powerBudget,
    pinUsage,
    missingSubsystems,
    loadPreset,
    addToDrawer,
    removeFromDrawer,
    addToContingency,
    removeFromContingency,
    swapContingencyToActive
  };
}
