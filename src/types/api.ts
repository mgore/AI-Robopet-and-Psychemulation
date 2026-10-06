import { HardwareComponent, CompatibilityReport, GeneratedScript, LLMResult } from "../types";

export type RobotArchetype = "wheeled_rover" | "robotic_arm" | "hexapod";

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    isFallback?: boolean;
    modelUsed?: string;
    timestamp: string;
    processingTimeMs?: number;
  };
}

export interface SourcingRequest {
  robotType: RobotArchetype;
  customGoal?: string;
  budget: number;
  existingComponents?: string[];
}

export interface RecommendedPart {
  name: string;
  category: string;
  estimatedPriceUSD: number;
  specs: string;
  roleInProject: string;
}

export interface SourcingResponse {
  recommendedMcu: string;
  mcuReason: string;
  recommendedParts: RecommendedPart[];
  totalEstimatedCost: number;
  recommendedFramework: string;
  note?: string;
}

export interface CompatibilityRequest {
  robotType: RobotArchetype;
  mcu: HardwareComponent;
  components: HardwareComponent[];
  targetBudget?: number;
}

export interface SoftwareGeneratorRequest {
  component: HardwareComponent;
  mcu: HardwareComponent;
  format: "arduino_sketch" | "python_driver" | "bash_install" | "ros_launch";
  goal?: string;
}

export interface LLMSimulationRequest {
  systemPrompt: string;
  userCommand: string;
  robotType?: RobotArchetype | string;
  components?: HardwareComponent[];
}

export interface ArchitectHelpRequest {
  question: string;
  context?: string;
}

export interface ArchitectHelpResponse {
  answer: string;
  keyTakeaways: string[];
}

export interface NeuralSearchRequest {
  query: string;
  category?: string;
}

export interface NeuralSearchResult {
  name: string;
  category: string;
  estimatedPriceUSD: number;
  supplier: string;
  leadTime: string;
  inStock: boolean;
  matchScore: number;
  specsSummary: string;
}

export interface NeuralSearchResponse {
  results: NeuralSearchResult[];
  queryInterpretation: string;
}

export interface ConceptImageRequest {
  robotType: string;
  mcu: string;
  components?: (string | { name: string })[];
  missionGoal?: string;
  stylePrompt?: string;
  customSketchPrompt?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
  editPrompt?: string;
  baseImage?: string;
  chassisMaterial?: string;
  accentColor?: string;
}

export interface ConceptImageResponse {
  imageUrl: string;
  image: string;
  type: "image" | "svg";
  promptUsed: string;
  style: string;
  isAiGenerated: boolean;
  note?: string;
}

export type ValidationResult<T> =
  | { valid: true; data: T; error?: never }
  | { valid: false; error: string; data?: never };

// Runtime validation helpers

export function validateSourcingRequest(body: unknown): ValidationResult<SourcingRequest> {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  const validTypes = ["wheeled_rover", "robotic_arm", "hexapod"];
  const robotType = (b.robotType as string) || "wheeled_rover";
  if (!validTypes.includes(robotType)) {
    return { valid: false, error: `Invalid robotType. Must be one of: ${validTypes.join(", ")}` };
  }
  const budget = Number(b.budget);
  if (isNaN(budget) || budget <= 0 || budget > 100000) {
    return { valid: false, error: "Budget must be a positive number up to $100,000" };
  }
  const customGoal = typeof b.customGoal === "string" ? b.customGoal.slice(0, 2000) : undefined;
  const existingComponents = Array.isArray(b.existingComponents) 
    ? b.existingComponents.map(c => String(c).slice(0, 200))
    : undefined;

  return {
    valid: true,
    data: {
      robotType: robotType as RobotArchetype,
      budget,
      customGoal,
      existingComponents
    }
  };
}

export function validateCompatibilityRequest(body: unknown): ValidationResult<CompatibilityRequest> {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  const validTypes = ["wheeled_rover", "robotic_arm", "hexapod"];
  const robotType = (b.robotType as string) || "wheeled_rover";
  if (!validTypes.includes(robotType)) {
    return { valid: false, error: `Invalid robotType. Must be one of: ${validTypes.join(", ")}` };
  }
  if (!b.mcu || typeof b.mcu !== "object") {
    return { valid: false, error: "Missing or invalid primary controller (mcu)" };
  }
  if (!Array.isArray(b.components) || b.components.length === 0) {
    return { valid: false, error: "Components array must contain at least 1 component" };
  }
  if (b.components.length > 60) {
    return { valid: false, error: "Exceeded maximum allowed components in single build (60)" };
  }

  return {
    valid: true,
    data: {
      robotType: robotType as RobotArchetype,
      mcu: b.mcu as HardwareComponent,
      components: b.components as HardwareComponent[],
      targetBudget: typeof b.targetBudget === "number" ? b.targetBudget : undefined
    }
  };
}

export function validateSoftwareGeneratorRequest(body: unknown): ValidationResult<SoftwareGeneratorRequest> {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  if (!b.component || typeof b.component !== "object") {
    return { valid: false, error: "Valid target component is required" };
  }
  if (!b.mcu || typeof b.mcu !== "object") {
    return { valid: false, error: "Valid host MCU is required" };
  }
  const validFormats = ["arduino_sketch", "python_driver", "bash_install", "ros_launch"];
  const format = (b.format as string) || "arduino_sketch";
  if (!validFormats.includes(format)) {
    return { valid: false, error: `Invalid format. Must be one of: ${validFormats.join(", ")}` };
  }

  return {
    valid: true,
    data: {
      component: b.component as HardwareComponent,
      mcu: b.mcu as HardwareComponent,
      format: format as SoftwareGeneratorRequest["format"],
      goal: typeof b.goal === "string" ? b.goal.slice(0, 1000) : undefined
    }
  };
}

export function validateLLMSimulationRequest(body: unknown): ValidationResult<LLMSimulationRequest> {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  const systemPrompt = typeof b.systemPrompt === "string" ? b.systemPrompt.trim().slice(0, 3000) : "";
  const userCommand = typeof b.userCommand === "string" ? b.userCommand.trim().slice(0, 2000) : "";
  if (!userCommand) {
    return { valid: false, error: "User command is required" };
  }

  return {
    valid: true,
    data: {
      systemPrompt: systemPrompt || "You are RoboMind, a safety-oriented autonomous explorer.",
      userCommand,
      robotType: typeof b.robotType === "string" ? b.robotType : "wheeled_rover",
      components: Array.isArray(b.components) ? b.components : undefined
    }
  };
}

export function validateArchitectHelpRequest(body: unknown): ValidationResult<ArchitectHelpRequest> {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  const question = typeof b.question === "string" ? b.question.trim().slice(0, 2000) : "";
  if (!question) {
    return { valid: false, error: "Question cannot be empty" };
  }

  return {
    valid: true,
    data: {
      question,
      context: typeof b.context === "string" ? b.context.slice(0, 4000) : undefined
    }
  };
}

export function validateNeuralSearchRequest(body: unknown): ValidationResult<NeuralSearchRequest> {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  const query = typeof b.query === "string" ? b.query.trim().slice(0, 500) : "";
  if (!query) {
    return { valid: false, error: "Search query is required" };
  }

  return {
    valid: true,
    data: {
      query,
      category: typeof b.category === "string" ? b.category : undefined
    }
  };
}

export function validateConceptImageRequest(body: unknown): ValidationResult<ConceptImageRequest> {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  const robotType = typeof b.robotType === "string" ? b.robotType.slice(0, 100) : "wheeled_rover";
  const mcu = typeof b.mcu === "string" ? b.mcu.slice(0, 100) : "ESP32-WROOM-32E";
  const validRatios = ["16:9", "4:3", "1:1"];
  const aspectRatio = validRatios.includes(b.aspectRatio as string) ? (b.aspectRatio as "16:9" | "4:3" | "1:1") : "16:9";

  return {
    valid: true,
    data: {
      robotType,
      mcu,
      components: Array.isArray(b.components) ? b.components : undefined,
      missionGoal: typeof b.missionGoal === "string" ? b.missionGoal.slice(0, 1000) : undefined,
      stylePrompt: typeof b.stylePrompt === "string" ? b.stylePrompt.slice(0, 500) : undefined,
      customSketchPrompt: typeof b.customSketchPrompt === "string" ? b.customSketchPrompt.slice(0, 1000) : undefined,
      aspectRatio,
      editPrompt: typeof b.editPrompt === "string" ? b.editPrompt.slice(0, 1000) : undefined,
      baseImage: typeof b.baseImage === "string" ? b.baseImage : undefined,
      chassisMaterial: typeof b.chassisMaterial === "string" ? b.chassisMaterial.slice(0, 200) : undefined,
      accentColor: typeof b.accentColor === "string" ? b.accentColor.slice(0, 200) : undefined
    }
  };
}
