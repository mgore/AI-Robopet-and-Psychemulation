import { HardwareComponent } from "../types";

export type ShippingTier = "standard" | "express" | "economy";

export interface CostBreakdown {
  baseHardwareCost: number;
  shippingCost: number;
  toolsCost: number;
  trainingCost: number;
  grandTotalCost: number;
  budget: number;
  budgetExceeded: boolean;
  budgetDelta: number; // positive = over budget, negative = savings
  budgetUsedPercentage: number;
}

export interface CategorySummary {
  category: string;
  count: number;
  totalCost: number;
  percentageOfHardware: number;
}

/**
 * Calculates base hardware cost across all items in active drawer
 */
export function calculateBaseHardwareCost(items: HardwareComponent[]): number {
  if (!items || !Array.isArray(items)) return 0;
  const rawSum = items.reduce((sum, item) => sum + (Number(item.estimatedPriceUSD) || 0), 0);
  return Math.round(rawSum * 100) / 100;
}

/**
 * Returns shipping estimate based on selected logistics speed tier
 */
export function getShippingCost(tier: ShippingTier): number {
  switch (tier) {
    case "express":
      return 32;
    case "economy":
      return 10;
    case "standard":
    default:
      return 18;
  }
}

/**
 * Returns estimated cost for assembly workbench tools (soldering iron, wire strippers, multimeter)
 */
export function getToolsCost(includeTools: boolean): number {
  return includeTools ? 45 : 0;
}

/**
 * Returns estimated cost for computational training / simulation credits
 */
export function getTrainingCost(includeTraining: boolean): number {
  return includeTraining ? 25 : 0;
}

/**
 * Calculates complete project budget breakdown
 */
export function calculateCompleteProjectCost(
  items: HardwareComponent[],
  budget: number,
  shippingTier: ShippingTier = "standard",
  includeTools: boolean = true,
  includeTraining: boolean = true
): CostBreakdown {
  const baseHardwareCost = calculateBaseHardwareCost(items);
  const shippingCost = getShippingCost(shippingTier);
  const toolsCost = getToolsCost(includeTools);
  const trainingCost = getTrainingCost(includeTraining);
  const grandTotalCost = baseHardwareCost + shippingCost + toolsCost + trainingCost;
  const safeBudget = Math.max(1, budget || 250);
  const budgetExceeded = grandTotalCost > safeBudget;
  const budgetDelta = grandTotalCost - safeBudget;
  const budgetUsedPercentage = Math.round((grandTotalCost / safeBudget) * 100);

  return {
    baseHardwareCost,
    shippingCost,
    toolsCost,
    trainingCost,
    grandTotalCost,
    budget: safeBudget,
    budgetExceeded,
    budgetDelta,
    budgetUsedPercentage
  };
}

/**
 * Computes category breakdown for BOM visualizer
 */
export function getCategoryCostBreakdown(items: HardwareComponent[]): CategorySummary[] {
  if (!items || !Array.isArray(items)) return [];
  const baseHardwareCost = calculateBaseHardwareCost(items);
  const map = new Map<string, { count: number; totalCost: number }>();

  for (const item of items) {
    const cat = item.category || "Accessory";
    const existing = map.get(cat) || { count: 0, totalCost: 0 };
    existing.count += 1;
    existing.totalCost += Number(item.estimatedPriceUSD) || 0;
    map.set(cat, existing);
  }

  const summaries: CategorySummary[] = [];
  map.forEach((value, category) => {
    const roundedCost = Math.round(value.totalCost * 100) / 100;
    summaries.push({
      category,
      count: value.count,
      totalCost: roundedCost,
      percentageOfHardware: baseHardwareCost > 0 ? Math.round((roundedCost / baseHardwareCost) * 100) : 0
    });
  });

  // Sort descending by total cost
  return summaries.sort((a, b) => b.totalCost - a.totalCost);
}
