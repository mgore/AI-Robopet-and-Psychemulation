export type ComponentCategory =
  | "Microcontroller"
  | "SBC"
  | "SOM / Compute"
  | "SOM / FPGA & MPSoC"
  | "SOM / AI Accelerator"
  | "Robot Platform"
  | "Actuator"
  | "Motor Driver"
  | "Sensor"
  | "Power Supply"
  | "Chassis"
  | "Accessory"
  | "Animatronics & Expression";

export interface SupplierLink {
  name: string;
  region: string; // e.g. "USA Distributor", "NATO Ally (UK/Italy)"
  url: string;
}

export type RobotArchetypeTag = "wheeled_rover" | "kinematics_oriented" | "spider" | "android";

export interface HardwareComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  estimatedPriceUSD: number;
  specs: string;
  roleInProject: string;
  voltage: string;
  interface: string;
  productUrl?: string;
  manufacturer?: string;
  originCountry?: string;
  isNatoAligned?: boolean;
  natoAllianceNote?: string;
  authorizedSuppliers?: SupplierLink[];
  archetypeTags?: RobotArchetypeTag[];
}

export interface RobotProfile {
  type: "wheeled_rover" | "robotic_arm" | "hexapod";
  customGoal: string;
  budget: number;
}

export interface CompatibilityWarning {
  componentName: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface LevelShiftingNeed {
  component: string;
  signalLine: string;
  shiftNeeded: string;
}

export interface CompatibilityReport {
  overallStatus: "passed" | "warning" | "critical";
  warnings: CompatibilityWarning[];
  powerAnalysis: {
    totalEstimatedCurrentMA: number;
    recommendedBatteryPower: string;
    comments: string;
  };
  interfaceAnalysis: {
    gpioUsage: string;
    pinOutConflicts: string;
    recommendations: string;
  };
  levelShiftingNeeds: LevelShiftingNeed[];
  technicalAdvice: string;
}

export interface LLMAction {
  device: string;
  action: string;
  parameters: string;
  durationSeconds: number;
}

export interface LLMResult {
  innerThoughts: string;
  actionSequence: LLMAction[];
  robotSpeech: string;
  sensoryFeedbackMock: string;
  explanationOfAutonomy: string;
}

export interface GeneratedScript {
  scriptTitle: string;
  codeBlock: string;
  instructions: string;
  prerequisites: string[];
}

export interface CommunityDesignFile {
  name: string;
  format: "STL" | "STEP" | "DXF" | "KiCad" | "Code";
  size: string;
  downloadUrl?: string;
}

export interface CommunityInventoryItem {
  id: string;
  name: string;
  category: ComponentCategory;
  quantity: number;
  condition: "New" | "Bench-Tested" | "Used - Functional" | "Surplus";
  estimatedPriceUSD: number;
  status: "Available for Swap" | "In Active Build" | "Free to Adopt";
  specs?: string;
  voltage?: string;
  interface?: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  builder: string;
  avatar?: string;
  category: "photo" | "design" | "inventory" | "complete";
  description: string;
  imageUrl: string;
  designFiles: CommunityDesignFile[];
  inventoryItems: CommunityInventoryItem[];
  likes: number;
  comments: {
    user: string;
    text: string;
    time: string;
  }[];
  createdAt: string;
  tags: string[];
}
