import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  validateSourcingRequest,
  validateCompatibilityRequest,
  validateSoftwareGeneratorRequest,
  validateLLMSimulationRequest,
  validateArchitectHelpRequest,
  validateNeuralSearchRequest,
  validateConceptImageRequest
} from "./src/types/api";

// Load environment variables
dotenv.config();

// Rate limiting & timeout middlewares
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

function rateLimitMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "global_client";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "API rate limit exceeded. Please wait a minute before making more requests."
      }
    });
  }

  entry.count++;
  next();
}

function timeoutMiddleware(timeoutMs: number = 30000) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: {
            code: "GATEWAY_TIMEOUT",
            message: "Request exceeded timeout limit of 30 seconds."
          }
        });
      }
    }, timeoutMs);

    res.on("finish", () => { clearTimeout(timer); });
    res.on("close", () => { clearTimeout(timer); });
    next();
  };
}

// Initialize the Gemini client helper
let isKeyPermanentlyInvalid = false;

function isKeyUsable(key: string | undefined): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (
    !trimmed ||
    trimmed === "MY_GEMINI_API_KEY" ||
    trimmed === "YOUR_API_KEY" ||
    trimmed.startsWith("MY_") ||
    trimmed.length < 10
  ) {
    return false;
  }
  return true;
}

function getGeminiClient(): GoogleGenAI | null {
  if (isKeyPermanentlyInvalid) return null;
  const currentKey = process.env.GEMINI_API_KEY;
  if (!isKeyUsable(currentKey)) {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: currentKey?.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (error) {
    console.error("Failed to instantiate Gemini API client:", error);
    return null;
  }
}

function cleanJsonText(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, "");
    cleaned = cleaned.replace(/\n```$/, "");
  }
  return cleaned.trim();
}

async function generateContentWithFallback(
  client: GoogleGenAI,
  prompt: string | unknown,
  config?: unknown
) {
  const models = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.1-flash-lite"];
  let lastError: unknown = null;

  for (const model of models) {
    try {
      const contentsPayload = typeof prompt === "string" ? prompt : prompt;
      const response = await client.models.generateContent({
        model: model,
        contents: contentsPayload,
        config: config,
      });

      if (response && response.text) {
        return response;
      }
    } catch (err: unknown) {
      lastError = err;
      const e = err as any;
      const errMsg = e?.message || String(err);
      
      const isAuthOrKeyInvalid =
        e?.status === "INVALID_ARGUMENT" ||
        e?.status === 400 ||
        e?.status === 401 ||
        e?.status === 403 ||
        errMsg.includes("API_KEY_INVALID") ||
        errMsg.includes("API key not valid") ||
        errMsg.includes("API_KEY") ||
        errMsg.includes("UNAUTHENTICATED");

      const isQuotaOrDepleted =
        e?.status === "RESOURCE_EXHAUSTED" ||
        e?.status === 429 ||
        errMsg.includes("429") ||
        errMsg.includes("prepayment") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("quota");

      if (isAuthOrKeyInvalid) {
        isKeyPermanentlyInvalid = true;
        console.info("[Gemini SDK] Notice: API key is invalid or not yet configured. Operating seamlessly with local robotics engineering engine.");
        break;
      }

      if (isQuotaOrDepleted) {
        console.info(`[Gemini SDK] Model ${model} reported quota or depleted credits; transitioning to offline robotics engine.`);
        break;
      }

      // If a specific model is not found, try the next model silently
    }
  }

  throw lastError || new Error("All fallback models failed to respond");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON bodies
  app.use(express.json());

  // Enable CORS and PWA asset serving
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Explicit PWA static asset serving directly from disk with precise MIME types
  const publicDir = path.join(process.cwd(), "public");
  const distDir = path.join(process.cwd(), "dist");

  const sendFileIfExists = (res: express.Response, fileName: string, contentType: string) => {
    let target = path.join(publicDir, fileName);
    if (!fs.existsSync(target)) {
      target = path.join(distDir, fileName);
    }
    if (fs.existsSync(target)) {
      const stat = fs.statSync(target);
      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": stat.size,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*"
      });
      fs.createReadStream(target).pipe(res);
    } else {
      res.status(404).send("File not found");
    }
  };
  
  app.all("/icon-512.png", (req, res) => {
    sendFileIfExists(res, "icon-512.png", "image/png");
  });

  app.all("/icon-192.png", (req, res) => {
    sendFileIfExists(res, "icon-192.png", "image/png");
  });

  app.all("/icon-512.svg", (req, res) => {
    sendFileIfExists(res, "icon-512.svg", "image/svg+xml");
  });

  app.all("/manifest.json", (req, res) => {
    sendFileIfExists(res, "manifest.json", "application/manifest+json; charset=utf-8");
  });

  app.all("/sw.js", (req, res) => {
    sendFileIfExists(res, "sw.js", "application/javascript; charset=utf-8");
  });

  app.use(express.static(publicDir, { index: false }));

  // Apply rate limiting and timeout boundary to all /api endpoints
  app.use("/api", rateLimitMiddleware, timeoutMiddleware(30000));

  // Helper to load supplier catalog items
  function getFullProductCatalog() {
    // Import SUPPLIER_CATALOG from src/data.ts or construct it
    // Since server.ts runs via tsx, we can read/import from src/data.ts
    // Let's import or define a fallback catalog parser
    try {
      // We can also parse public/datasheets/robotics_sensors_and_som_datasheet.csv if needed
      const csvPath = path.join(publicDir, "datasheets", "robotics_sensors_and_som_datasheet.csv");
      if (fs.existsSync(csvPath)) {
        const csvContent = fs.readFileSync(csvPath, "utf-8");
        const lines = csvContent.split("\n").filter(l => l.trim().length > 0);
        if (lines.length > 1) {
          const items = [];
          const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ""));
            if (cols.length >= 2) {
              items.push({
                id: `csv_item_${i}`,
                name: cols[0] || `Component ${i}`,
                category: cols[1] || "Sensor",
                estimatedPriceUSD: parseFloat(cols[2]) || 25,
                specs: cols[3] || "Standard robotics component",
                roleInProject: cols[4] || "General purpose integration"
              });
            }
          }
          if (items.length > 0) return items;
        }
      }
    } catch (e) {
      // ignore
    }

    // Default rich fallback catalog
    return [
      { id: "esp32_wroom", name: "ESP32-WROOM-32E (DevKitC)", category: "Microcontroller", estimatedPriceUSD: 6, specs: "Dual-core Tensilica LX6 @240MHz, Wi-Fi and BLE", roleInProject: "IoT rover controller" },
      { id: "arduino_uno_r4", name: "Arduino Uno R4 Minima", category: "Microcontroller", estimatedPriceUSD: 20, specs: "Renesas RA4M1 32-bit ARM Cortex-M4", roleInProject: "Sensor reading & PWM" },
      { id: "raspberry_pi_4", name: "Raspberry Pi 4 Model B (4GB)", category: "SBC", estimatedPriceUSD: 55, specs: "Quad-Core ARM v8, 4GB LPDDR4", roleInProject: "SLAM navigation & ROS 2" },
      { id: "mg996r_servo", name: "MG996R Metal Gear High-Torque Servo", category: "Actuator", estimatedPriceUSD: 10, specs: "10 kg/cm torque at 6V", roleInProject: "Arm joint or steering actuation" },
      { id: "hcsr04_sonar", name: "HC-SR04 Ultrasonic Sensor", category: "Sensor", estimatedPriceUSD: 4, specs: "2cm-400cm distance range", roleInProject: "Obstacle detection" },
      { id: "rplidar_a1", name: "RPLIDAR A1M8 360 Degree LiDAR", category: "Sensor", estimatedPriceUSD: 89, specs: "360° laser scanner, 12m range", roleInProject: "Mapping & localization" },
      { id: "l298n_driver", name: "L298N Dual H-Bridge Motor Driver", category: "Sensor", estimatedPriceUSD: 5, specs: "Dual DC channel driver", roleInProject: "Motor power switching" },
      { id: "lipo_2s", name: "2S 7.4V 1500mAh LiPo Battery", category: "Power Supply", estimatedPriceUSD: 18, specs: "Rechargeable 25C discharge", roleInProject: "Power supply" }
    ];
  }

  // API Route: Paginated Product / Catalog API (GET /api/products and alias /api/catalog)
  const handleProductsPagination = (req: express.Request, res: express.Response) => {
    try {
      const queryParams = req.query;
      
      // Parse & validate page
      let page = 1;
      if (queryParams.page !== undefined) {
        const parsedPage = Number(queryParams.page);
        if (isNaN(parsedPage) || !Number.isInteger(parsedPage) || parsedPage < 1) {
          return res.status(400).json({
            success: false,
            error: {
              code: "INVALID_PARAMETER",
              message: "Invalid 'page' parameter. Must be a positive integer >= 1."
            }
          });
        }
        page = parsedPage;
      }

      // Parse & validate limit
      let limit = 20;
      if (queryParams.limit !== undefined) {
        const parsedLimit = Number(queryParams.limit);
        if (isNaN(parsedLimit) || !Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          return res.status(400).json({
            success: false,
            error: {
              code: "INVALID_PARAMETER",
              message: "Invalid 'limit' parameter. Must be an integer between 1 and 100."
            }
          });
        }
        limit = parsedLimit;
      }

      // Optional filters
      const search = typeof queryParams.search === "string" ? queryParams.search.trim().toLowerCase() : "";
      const category = typeof queryParams.category === "string" ? queryParams.category.trim().toLowerCase() : "";

      let allProducts = getFullProductCatalog();

      // Apply search filter
      if (search) {
        allProducts = allProducts.filter((p: any) => 
          (p.name && p.name.toLowerCase().includes(search)) ||
          (p.category && p.category.toLowerCase().includes(search)) ||
          (p.specs && p.specs.toLowerCase().includes(search)) ||
          (p.roleInProject && p.roleInProject.toLowerCase().includes(search))
        );
      }

      // Apply category filter
      if (category) {
        allProducts = allProducts.filter((p: any) => 
          p.category && p.category.toLowerCase() === category
        );
      }

      const totalCount = allProducts.length;
      const totalPages = Math.ceil(totalCount / limit) || 1;

      // Handle out-of-range page request gracefully or return empty items
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const items = allProducts.slice(startIndex, endIndex);

      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return res.json({
        success: true,
        data: {
          items,
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage
        },
        // Backward compatibility properties on root envelope
        items,
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: err?.message || "Internal server error during pagination"
        }
      });
    }
  };

  app.get("/api/products", handleProductsPagination);
  app.get("/api/catalog", handleProductsPagination);

  // API Route: Sourcing recommendations
  app.post("/api/ai/sourcing-recommendations", async (req, res) => {
    const validation = validateSourcingRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: validation.error }
      });
    }

    const { robotType, customGoal, budget } = validation.data;

    const systemPrompt = `You are AI RoboPet, an expert senior hardware roboticist and systems engineer. 
Your task is to recommend a tailored DIY robot bill of materials (BOM), custom design notes, and an assembly roadmap.
You must adhere strictly to the budget of $${budget || "unlimited"} USD if specified.

Focus on practical, standard, hobbyist-accessible parts like:
- MCUs/SBCs: Raspberry Pi 4/5, ESP32, Arduino, Jetson Nano.
- Actuators: MG996R servos, NEMA 17 steppers, SG90 mini servos, L298N drivers, PCA9685 PWM drivers.
- Sensors: HC-SR04 ultrasonic, RPLIDAR A1, MPU6050 IMU, Pi Camera, VL53L0X ToF.
- Power: LiPo batteries (2S/3S), 18650 cells, power distribution boards, UBEC step-down converters.

Keep recommendations precise, highly technical, and strictly feasible.`;

    const prompt = `Recommend a sourcing BOM and architect roadmap for a custom robot.
Robot Type: ${robotType}
Custom Functionality / Goal: ${customGoal}
Budget: $${budget || "Not limited"} USD

Generate a structured JSON response matching the required schema. Ensure pricing is realistic for hobbyist suppliers.`;

    const aiClient = getGeminiClient();
    if (aiClient) {
      try {
        const response = await generateContentWithFallback(aiClient, prompt, {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedMicrocontroller: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the recommended board (e.g. Raspberry Pi 4 Model B, ESP32-WROOM)" },
                  reason: { type: Type.STRING, description: "Why this microcontroller fits this specific robot project" }
                },
                required: ["name", "reason"]
              },
              partsList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Part name (e.g., MG996R High Torque Servo, RPLIDAR A1)" },
                    category: { type: Type.STRING, description: "One of: Microcontroller, SBC, Actuator, Motor Driver, Sensor, Power Supply, Chassis, Accessory" },
                    estimatedPriceUSD: { type: Type.NUMBER, description: "Hobbyist pricing in USD" },
                    specs: { type: Type.STRING, description: "Technical specs like torque, dimensions, interface protocol" },
                    roleInProject: { type: Type.STRING, description: "Specific role of this part in the robot architecture" }
                  },
                  required: ["name", "category", "estimatedPriceUSD", "specs", "roleInProject"]
                }
              },
              totalEstimatedCostUSD: { type: Type.NUMBER, description: "Sum of recommended parts prices" },
              softwareFramework: { type: Type.STRING, description: "Recommended stack: ROS 2 (Humble), Arduino C++, MicroPython, or pure Python" },
              customDesignNotes: { type: Type.STRING, description: "Architectural advice on weight distribution, sensor fields of view, motor power lines, or driver heat sinks" },
              suggestedAssemblyRoadmap: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Staged chronological steps to assemble, test, and program this custom robot."
              }
            },
            required: ["recommendedMicrocontroller", "partsList", "totalEstimatedCostUSD", "softwareFramework", "customDesignNotes", "suggestedAssemblyRoadmap"]
          }
        });

        const cleanedText = cleanJsonText(response.text || "{}");
        return res.json(JSON.parse(cleanedText));
      } catch (error: unknown) {
        if (!isKeyPermanentlyInvalid) {
          console.info("[AI RoboPet] Sourcing recommendations operating with local robotics engine.");
        }
        return res.json(getSimulatedSourcing(robotType, customGoal, budget));
      }
    } else {
      // Return high-fidelity simulated response if no API key is set
      return res.json(getSimulatedSourcing(robotType, customGoal, budget));
    }
  });

  // API Route: Compatibility check
  app.post("/api/ai/compatibility-check", async (req, res) => {
    const rawMcu = typeof req.body.mcu === "object" && req.body.mcu !== null 
      ? req.body.mcu 
      : { name: req.body.microcontroller || "ESP32", category: "Microcontroller" };
    const rawComponents = Array.isArray(req.body.components) && req.body.components.length > 0 
      ? req.body.components 
      : [{ name: "Standard Sensor", category: "Sensor" }];

    const validation = validateCompatibilityRequest({
      robotType: req.body.robotType || "wheeled_rover",
      mcu: rawMcu,
      components: rawComponents,
      targetBudget: req.body.targetBudget
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: validation.error }
      });
    }

    const { mcu, components } = validation.data;
    const microcontroller = mcu.name;
    const powerSource = req.body.powerSource;

    const systemPrompt = `You are AI RoboPet, an expert diagnostic system for DIY hardware development. 
Analyze a list of robotics hardware components and a microcontroller to verify electrical, signal, protocol, and logical compatibility.
Look for:
1. Current draw issues (e.g., drawing high servo current directly from ESP32/Arduino 5V pins instead of an external battery/PCA9685).
2. Level shifting issues (e.g., 3.3V I2C logic on ESP32 connected directly to standard 5V I2C sensors without levels, or vice versa).
3. GPIO shortages (running out of pins, using special boot/strapping pins inappropriately).
4. Interface mismatch (connecting an analog sensor to a Raspberry Pi which has no built-in ADC).
5. Protocol conflicts (I2C address overlaps, or connecting serial UART LiDAR to single UART microcontrollers without software serial).

Provide highly technical, concrete warnings, power budgets, and level shifting needs.`;

    const prompt = `Analyze this configuration:
Microcontroller: ${microcontroller}
Power Source: ${powerSource || "Not specified / USB Power"}
Selected Components:
${JSON.stringify(components, null, 2)}

Generate a detailed compatibility report as a JSON object matching the required schema.`;

    const aiClient = getGeminiClient();
    if (aiClient) {
      try {
        const response = await generateContentWithFallback(aiClient, prompt, {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallStatus: { type: Type.STRING, description: "Must be exactly one of: 'passed' (fully compatible), 'warning' (minor issues/recommendations), 'critical' (will cause damage, power failure, or cannot run)" },
              warnings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    componentName: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    severity: { type: Type.STRING, description: "Must be: low, medium, or high" }
                  },
                  required: ["componentName", "title", "description", "severity"]
                }
              },
              powerAnalysis: {
                type: Type.OBJECT,
                properties: {
                  totalEstimatedCurrentMA: { type: Type.INTEGER, description: "Total peak current in mA drawn by all components together" },
                  recommendedBatteryPower: { type: Type.STRING, description: "E.g., 2S 7.4V LiPo with 5V 3A UBEC, or 4x AA batteries" },
                  comments: { type: Type.STRING, description: "Power routing warning or green lights" }
                },
                required: ["totalEstimatedCurrentMA", "recommendedBatteryPower", "comments"]
              },
              interfaceAnalysis: {
                type: Type.OBJECT,
                properties: {
                  gpioUsage: { type: Type.STRING, description: "Review of pin counts and type requirements (PWM, ADC, I2C, SPI)" },
                  pinOutConflicts: { type: Type.STRING, description: "Any identified overlapping or restricted pins" },
                  recommendations: { type: Type.STRING, description: "Pin mapping or expander ideas" }
                },
                required: ["gpioUsage", "pinOutConflicts", "recommendations"]
              },
              levelShiftingNeeds: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    component: { type: Type.STRING, description: "The component needing logic level shifting" },
                    signalLine: { type: Type.STRING, description: "e.g., SDA/SCL, TX/RX, Trigger Pin" },
                    shiftNeeded: { type: Type.STRING, description: "e.g., 5V to 3.3V level shifter, or 3.3V to 5V booster" }
                  },
                  required: ["component", "signalLine", "shiftNeeded"]
                }
              },
              technicalAdvice: { type: Type.STRING, description: "Comprehensive, structured expert summary guide to ensure safety during assembly." }
            },
            required: ["overallStatus", "warnings", "powerAnalysis", "interfaceAnalysis", "levelShiftingNeeds", "technicalAdvice"]
          }
        });

        const cleanedText = cleanJsonText(response.text || "{}");
        const parsed = JSON.parse(cleanedText);
        return res.json({
          success: true,
          data: parsed,
          ...parsed,
          meta: { isFallback: false, modelUsed: "gemini", timestamp: new Date().toISOString() }
        });
      } catch (error: any) {
        if (!isKeyPermanentlyInvalid) {
          console.info("[AI RoboPet] Compatibility diagnostics operating with local electrical validator.");
        }
        const fallback = getSimulatedCompatibility(microcontroller, components, powerSource);
        return res.json({
          success: true,
          data: fallback,
          ...fallback,
          meta: { isFallback: true, modelUsed: "local-electrical-validator", timestamp: new Date().toISOString() }
        });
      }
    } else {
      const fallback = getSimulatedCompatibility(microcontroller, components, powerSource);
      return res.json({
        success: true,
        data: fallback,
        ...fallback,
        meta: { isFallback: true, modelUsed: "local-electrical-validator", timestamp: new Date().toISOString() }
      });
    }
  });

  // API Route: LLM autonomous brain simulation
  app.post("/api/ai/llm-simulation", async (req, res) => {
    const validation = validateLLMSimulationRequest({
      systemPrompt: req.body.systemPrompt,
      userCommand: req.body.userCommand,
      robotType: req.body.robotType,
      components: req.body.activeHardware || req.body.components
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: validation.error }
      });
    }

    const { systemPrompt, userCommand } = validation.data;
    const activeHardware = req.body.activeHardware || req.body.components || [];

    const mcuStr = activeHardware?.find((h: any) => h.category === "Microcontroller" || h.category === "SBC")?.name || "Generic Robot";
    const sensorsStr = activeHardware?.filter((h: any) => h.category === "Sensor").map((h: any) => h.name).join(", ") || "basic proximity sensors";
    const actuatorsStr = activeHardware?.filter((h: any) => h.category === "Actuator").map((h: any) => h.name).join(", ") || "basic drive motors";

    const systemInstruction = `You are RoboMind, the embedded Large Language Model acting as the "brain" of a DIY robot.
The robot is controlled by: ${mcuStr}.
It is equipped with these sensors: ${sensorsStr}.
And has these physical actuators: ${actuatorsStr}.

Your job is to receive a natural language command from a human, simulate the sensory feedback from the robot's environment, formulate an inner technical reasoning step, plan a structured action sequence in terms of physical devices, and generate a speech response.

System-level persona / safety prompt of the robot brain:
"${systemPrompt || "You are a friendly autonomous assistant. Prioritize safety and structured motion."}"

Be extremely creative, and highly specific to the actual hardware. For example, if the robot has an ultrasonic distance sensor, simulate reading a close distance (e.g. 12cm) to avoid obstacles. If it has a camera, describe parsing an image. Always generate concrete actions mapped to active devices.`;

    const prompt = `Human commander says: "${userCommand}"

Think step-by-step. What are your sensors reading? What are your motors doing? Output a structured action plan and speech.`;

    const aiClient = getGeminiClient();
    if (aiClient) {
      try {
        const response = await generateContentWithFallback(aiClient, prompt, {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              innerThoughts: { type: Type.STRING, description: "Robot's self-reasoning, processing environmental sensor inputs, making a plan." },
              actionSequence: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    device: { type: Type.STRING, description: "The component triggered (e.g. Servo, Motor Driver, buzzer, LED, camera, RPLIDAR)" },
                    action: { type: Type.STRING, description: "Action taken (e.g. setSpeed, writeAngle, blink, ping, startScan)" },
                    parameters: { type: Type.STRING, description: "The quantitative value (e.g. '180 deg', '50% PWM', 'HIGH', 'color: green')" },
                    durationSeconds: { type: Type.NUMBER, description: "Estimated physical duration to complete this action" }
                  },
                  required: ["device", "action", "parameters", "durationSeconds"]
                }
              },
              robotSpeech: { type: Type.STRING, description: "Audio announcement or LCD/OLED text display output to communicate back to the human." },
              sensoryFeedbackMock: { type: Type.STRING, description: "What mock telemetry triggered this (e.g. 'Ultrasonic: 12cm, Gyro: Z-rot 1.5 rad/s, Camera: human face detected at 85% confidence')" },
              explanationOfAutonomy: { type: Type.STRING, description: "Explain how your prompt/weights led to selecting these specific actions over others." }
            },
            required: ["innerThoughts", "actionSequence", "robotSpeech", "sensoryFeedbackMock", "explanationOfAutonomy"]
          }
        });

        const cleanedText = cleanJsonText(response.text || "{}");
        const parsed = JSON.parse(cleanedText);
        return res.json({
          success: true,
          data: parsed,
          ...parsed,
          meta: { isFallback: false, modelUsed: "gemini", timestamp: new Date().toISOString() }
        });
      } catch (error: any) {
        if (!isKeyPermanentlyInvalid) {
          console.info("[AI RoboPet] LLM Brain simulation operating with local robotics engine.");
        }
        const fallback = getSimulatedBrain(userCommand, mcuStr, sensorsStr, actuatorsStr);
        return res.json({
          success: true,
          data: fallback,
          ...fallback,
          meta: { isFallback: true, modelUsed: "local-brain-simulator", timestamp: new Date().toISOString() }
        });
      }
    } else {
      const fallback = getSimulatedBrain(userCommand, mcuStr, sensorsStr, actuatorsStr);
      return res.json({
        success: true,
        data: fallback,
        ...fallback,
        meta: { isFallback: true, modelUsed: "local-brain-simulator", timestamp: new Date().toISOString() }
      });
    }
  });

  // API Route: Script / Code generator
  app.post("/api/ai/software-generator", async (req, res) => {
    const rawComp = req.body.component || { name: req.body.hardwareName || "Sensor", category: "Sensor" };
    const rawMcu = req.body.mcu || { name: req.body.selectedMCU || "ESP32", category: "Microcontroller" };
    const rawFormat = req.body.format || req.body.codeType || "arduino_sketch";

    const validation = validateSoftwareGeneratorRequest({
      component: rawComp,
      mcu: rawMcu,
      format: rawFormat,
      goal: req.body.goal
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: validation.error }
      });
    }

    const { component, mcu, format } = validation.data;
    const hardwareName = component.name;
    const selectedMCU = mcu.name;
    const codeType = format;

    const systemPrompt = `You are AI RoboPet, a specialized firmware developer and DevOps engineer for robots.
You generate exact, syntactically perfect, production-grade scripts and source code for microcontrollers and single board computers.

Generate files matching the requested codeType:
- 'bash_install': A robust shell script to install dependencies, driver libraries, ROS packages, or setup a workspace.
- 'arduino_sketch': An elegant, fully-commented C++ Arduino IDE sketch using standard libraries (e.g. Servo.h, Wire.h) with setup() and loop() for the component.
- 'python_driver': A Python 3 class or script interfacing with GPIO, I2C (using smbus2 or adafruit), serial, or ROS 2 node publishing telemetry.
- 'ros_launch': A standard ROS 2 python launch file configuring nodes, parameters, and remappings.

Include detailed instructions on where to save the file, how to compile/run, and what libraries must be installed.`;

    const prompt = `Generate a ${codeType} configuration file or code block.
Component Name: ${hardwareName}
Microcontroller / Computer: ${selectedMCU}

Generate a structured JSON response matching the required schema. Ensure the code is complete, correct, and not just boilerplate.`;

    const aiClient = getGeminiClient();
    if (aiClient) {
      try {
        const response = await generateContentWithFallback(aiClient, prompt, {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scriptTitle: { type: Type.STRING, description: "Proposed file name or title (e.g., motor_driver.py, install_ros.sh)" },
              codeBlock: { type: Type.STRING, description: "The full, raw code block with correct formatting." },
              instructions: { type: Type.STRING, description: "Technical guide on how to upload, compile, run, or execute this script." },
              prerequisites: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Required packages, physical wiring pins assumed, or hardware modifications required."
              }
            },
            required: ["scriptTitle", "codeBlock", "instructions", "prerequisites"]
          }
        });

        const cleanedText = cleanJsonText(response.text || "{}");
        const parsed = JSON.parse(cleanedText);
        return res.json({
          success: true,
          data: parsed,
          ...parsed,
          meta: { isFallback: false, modelUsed: "gemini", timestamp: new Date().toISOString() }
        });
      } catch (error: any) {
        if (!isKeyPermanentlyInvalid) {
          console.info("[AI RoboPet] Firmware generator operating with local driver generator.");
        }
        const fallback = getSimulatedCode(hardwareName, selectedMCU, codeType);
        return res.json({
          success: true,
          data: fallback,
          ...fallback,
          meta: { isFallback: true, modelUsed: "local-code-generator", timestamp: new Date().toISOString() }
        });
      }
    } else {
      const fallback = getSimulatedCode(hardwareName, selectedMCU, codeType);
      return res.json({
        success: true,
        data: fallback,
        ...fallback,
        meta: { isFallback: true, modelUsed: "local-code-generator", timestamp: new Date().toISOString() }
      });
    }
  });

  // API Route: Gemini Tech Help & Interactive Robotics Architect Assistant
  app.post("/api/gemini/architect-help", async (req, res) => {
    const rawMsg = req.body.message || req.body.question;
    const validation = validateArchitectHelpRequest({
      question: rawMsg,
      context: typeof req.body.context === "object" ? JSON.stringify(req.body.context) : req.body.context
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: validation.error }
      });
    }

    const message = validation.data.question;
    const context = req.body.context;

    const systemPrompt = `You are the AI RoboPet Senior Robotics Advisor. 
You provide clear, friendly, and deeply technical robotics engineering guidance for makers, students, and engineers.
Topics you master:
- Microcontroller & SBC architecture (ESP32, Raspberry Pi, Arduino, STM32, Teensy, Jetson Orin)
- Power budgets, LiPo batteries, C-ratings, voltage regulation (UBEC, Buck/Boost), and common ground
- Logic level shifting (3.3V vs 5.0V), PWM duty cycles, I2C pull-ups, SPI clock rates, UART baud rates
- Motor drivers (L298N, TB6612, PCA9685, A4988, DRV8833, VESC), stall torque, back-EMF flyback diodes
- Sensors (LiDAR, ultrasonic HC-SR04, ToF VL53L0X, BNO085/MPU6050 IMU, cameras)
- Software frameworks (ROS 2 Humble, Micro-ROS, Arduino C++, CircuitPython, OpenCV, MoveIt 2)

Format your answer with clear markdown, bullet points, pin connection tables, or brief code snippets where helpful. Be concise, direct, and actionable.`;

    const formattedContext = context 
      ? `\nActive Robot Context: Archetype=${context.robotType || "General"}, MCU=${context.activeMCU || "ESP32"}, Hardware=${(context.hardware || []).join(", ")}, Goal=${context.goal || "Autonomous navigation"}`
      : "";

    const aiClient = getGeminiClient();
    if (aiClient) {
      try {
        const response = await generateContentWithFallback(
          aiClient, 
          `${formattedContext}\n\nUser Question: ${message}`,
          {
            systemInstruction: systemPrompt,
          }
        );

        const reply = response.text || "";
        return res.json({
          success: true,
          data: { reply },
          reply,
          meta: { isFallback: false, modelUsed: "gemini", timestamp: new Date().toISOString() }
        });
      } catch (error: any) {
        if (!isKeyPermanentlyInvalid) {
          console.info("[AI RoboPet] Advisor chat operating with local robotics knowledge base.");
        }
        const reply = getSimulatedHelpResponse(message, context);
        return res.json({
          success: true,
          data: { reply },
          reply,
          meta: { isFallback: true, modelUsed: "local-knowledge-base", timestamp: new Date().toISOString() }
        });
      }
    } else {
      const reply = getSimulatedHelpResponse(message, context);
      return res.json({
        success: true,
        data: { reply },
        reply,
        meta: { isFallback: true, modelUsed: "local-knowledge-base", timestamp: new Date().toISOString() }
      });
    }
  });

  // API Route: Google Search Grounding for Equipment, Components, and AI Neural Training Sites
  app.post("/api/gemini/search", async (req, res) => {
    const validation = validateNeuralSearchRequest({
      query: req.body.query,
      category: req.body.categoryLimit
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: validation.error }
      });
    }

    const { query } = validation.data;
    const categoryLimit = req.body.categoryLimit;

    let searchPrompt = "";
    if (categoryLimit === "components") {
      searchPrompt = `Search specifically for hardware component specifications, pinout datasheets, pricing, and purchase links from electronics distributors (DigiKey, Mouser, Adafruit, SparkFun, RobotShop, AliExpress, Pololu) for: "${query}". 
Provide a concise overview of specs, operating voltage, pinout warnings, typical price range in USD, and top supplier links.`;
    } else if (categoryLimit === "ai_neural") {
      searchPrompt = `Search specifically for AI neural training resources, pre-trained Edge ML models, datasets, and framework repositories (Hugging Face, Roboflow, PyTorch Hub, Edge Impulse, Kaggle, Ultralytics YOLO) for robotics application: "${query}".
Provide dataset names, recommended neural architecture (e.g. YOLOv8-nano, MobileNetV3, FastSAM), training steps, and direct platform links.`;
    } else if (categoryLimit === "datasheets") {
      searchPrompt = `Search for engineering datasheets, pinout diagrams, and official ROS 2 package repositories for: "${query}". Include hardware wiring connection charts and pin tables.`;
    } else {
      searchPrompt = `Search for the latest robotics hardware, suppliers, and AI models regarding: "${query}". Include clear specs, pricing, and verified source links.`;
    }

    const aiClient = getGeminiClient();
    if (aiClient) {
      try {
        let response: unknown = null;
        let modelUsed = "gemini-3.8-flash";
        try {
          response = await aiClient.models.generateContent({
            model: "gemini-3.8-flash",
            contents: searchPrompt,
            config: {
              tools: [{ googleSearch: {} }],
            },
          });
        } catch (firstErr) {
          console.info("[AI RoboPet] Falling back to gemini-3.7-flash for search grounding.");
          modelUsed = "gemini-3.7-flash";
          response = await aiClient.models.generateContent({
            model: "gemini-3.7-flash",
            contents: searchPrompt,
            config: {
              tools: [{ googleSearch: {} }],
            },
          });
        }

        const respAny = response as any;
        const replyText = respAny?.text || "No summary returned.";
        const groundingMetadata = (respAny?.candidates && respAny.candidates[0]?.groundingMetadata) || {};
        
        const sources: Array<{ title: string; url: string; snippet?: string }> = [];
        if (groundingMetadata.groundingChunks) {
          for (const chunk of groundingMetadata.groundingChunks) {
            if (chunk.web?.uri) {
              sources.push({
                title: chunk.web.title || new URL(chunk.web.uri).hostname,
                url: chunk.web.uri,
              });
            }
          }
        }

        const searchQueries: string[] = groundingMetadata.webSearchQueries || [];

        const searchResultData = {
          summary: replyText,
          sources: sources.slice(0, 8),
          searchQueries,
          categoryLimit: categoryLimit || "all"
        };

        return res.json({
          success: true,
          data: searchResultData,
          ...searchResultData,
          meta: { isFallback: false, modelUsed, timestamp: new Date().toISOString() }
        });
      } catch (error: any) {
        const errMsg = error?.message || String(error);
        const isAuthOrKeyInvalid =
          error?.status === "INVALID_ARGUMENT" ||
          error?.status === 400 ||
          error?.status === 401 ||
          error?.status === 403 ||
          errMsg.includes("API_KEY_INVALID") ||
          errMsg.includes("API key not valid") ||
          errMsg.includes("API_KEY") ||
          errMsg.includes("UNAUTHENTICATED");

        if (isAuthOrKeyInvalid) {
          isKeyPermanentlyInvalid = true;
          console.info("[AI RoboPet] Gemini API key unconfigured or invalid. Operating with built-in hardware parts database.");
        } else {
          console.info("[AI RoboPet] Gemini Search Grounding fallback activated.");
        }
        const fallback = getSimulatedSearchResults(query, categoryLimit);
        return res.json({
          success: true,
          data: fallback,
          ...fallback,
          meta: { isFallback: true, modelUsed: "local-parts-db", timestamp: new Date().toISOString() }
        });
      }
    } else {
      const fallback = getSimulatedSearchResults(query, categoryLimit);
      return res.json({
        success: true,
        data: fallback,
        ...fallback,
        meta: { isFallback: true, modelUsed: "local-parts-db", timestamp: new Date().toISOString() }
      });
    }
  });

  // API Route: Generate or Edit Concept Image from Specs / Sketchbook Design
  app.post("/api/gemini/generate-concept-image", async (req, res) => {
    const validation = validateConceptImageRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: validation.error }
      });
    }

    const specs = req.body.specs || {};
    const robotType = req.body.robotType || specs.robotType || "Autonomous Wheeled Rover";
    const mcu = req.body.mcu || specs.mcu || "ESP32-WROOM";
    const components = req.body.components || specs.hardwareSummary || [];
    const missionGoal = req.body.missionGoal || req.body.customGoal || specs.customGoal || "Autonomous navigation, obstacle avoidance, and telemetry reporting";
    const stylePrompt = req.body.stylePrompt || req.body.style || specs.style || "Industrial CAD Blueprint & 3D Engineering Render";
    const customSketchPrompt = req.body.customSketchPrompt || req.body.prompt || specs.customSketchPrompt || "";
    const aspectRatio = req.body.aspectRatio || "16:9";
    const baseImage = req.body.baseImage || null;
    const editPrompt = req.body.editPrompt || null;
    const chassisMaterial = req.body.chassisMaterial || specs.chassisMaterial || "Anodized Aluminum & Carbon Fiber";
    const accentColor = req.body.accentColor || specs.accentColor || "Cyan & Matte Dark Slate";

    const compsList = Array.isArray(components) 
      ? components.map(c => typeof c === 'string' ? c : c.name).join(", ") 
      : (typeof components === 'string' ? components : "Standard sensors and motors");
    const selectedRatio = aspectRatio === "16:9" ? "16:9" : aspectRatio === "4:3" ? "4:3" : "1:1";
    const style = stylePrompt || "Industrial CAD Blueprint & 3D Engineering Render";

    let promptText = "";
    if (editPrompt && baseImage) {
      promptText = `Realistic, high-fidelity physical photograph edit of a real DIY robot build in a robotics workshop setting. Real-life quality, macro camera lens, tangible workshop materials and authentic textures.
Modification Directive: ${editPrompt}
Preserve Core Archetype: ${robotType}
Chassis Material & Finish: ${chassisMaterial}
Accent Color Palette: ${accentColor}
Active Hardware Components: ${mcu}, ${compsList}
Maintain high physical engineering fidelity, authentic CNC/3D printed textures, clean laboratory lighting, and precise mounting hardware. No CGI or cartoon styling. Real-life photorealistic quality.`;
    } else {
      promptText = `Real-life quality photograph of a physical, functional DIY robot prototype in a real robotics workshop or engineering laboratory. Shot on a 50mm f/2.8 lens with natural depth of field and softbox studio lighting.
Tangible Physical Details: Authentic brushed 6061 aluminum plate or carbon fiber PETG textures, real stainless steel M3 socket hardware, neatly routed braided silicone wiring harness, real PCB traces, realistic sensor glass reflections.
Robot Archetype: ${robotType}
Primary Controller: ${mcu}
Key Installed Hardware: ${compsList}
Mission Objective & Task: ${missionGoal}
Visual Category & Setting: ${style}
Chassis Finish & Construction Material: ${chassisMaterial}
Accent Color Palette: ${accentColor}
Custom Design Directives & Details: ${customSketchPrompt || "Sleek matte finish chassis, visible braided wiring harness, status display, neatly mounted sensors"}
Photorealism Requirements: Photorealistic real-life quality, tangible manufacturing details, real mechanical fasteners and brackets, authentic physical workshop background. Zero cartoonish or CGI artifice.`;
    }

    const aiClient = getGeminiClient();
    if (aiClient) {
      const imageModels = ["gemini-3.1-flash-image-preview", "gemini-3.1-flash-image", "gemini-3.1-flash-lite-image"];
      
      for (const model of imageModels) {
        try {
          const parts: unknown[] = [];
          if (baseImage && editPrompt) {
            const cleanBase64 = baseImage.replace(/^data:image\/\w+;base64,/, "");
            const mimeType = baseImage.includes("image/jpeg") ? "image/jpeg" : baseImage.includes("image/webp") ? "image/webp" : "image/png";
            parts.push({
              inlineData: {
                mimeType,
                data: cleanBase64
              }
            });
          }
          parts.push({ text: promptText });

          const response = await aiClient.models.generateContent({
            model,
            contents: { parts },
            config: {
              imageConfig: {
                aspectRatio: selectedRatio as any,
                imageSize: "1K",
              },
            },
          });

          let imageUrl: string | null = null;
          if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                const mime = part.inlineData.mimeType || "image/png";
                imageUrl = `data:${mime};base64,${part.inlineData.data}`;
                break;
              }
            }
          }

          if (imageUrl) {
            const imgData = {
              imageUrl,
              image: imageUrl,
              type: "image" as const,
              promptUsed: promptText,
              style,
              isAiGenerated: true,
              chassisMaterial,
              accentColor
            };
            return res.json({
              success: true,
              data: imgData,
              ...imgData,
              meta: { isFallback: false, modelUsed: model, timestamp: new Date().toISOString() }
            });
          }
        } catch (error: any) {
          const errMsg = error?.message || String(error);
          const isAuthOrKeyInvalid =
            error?.status === "INVALID_ARGUMENT" ||
            error?.status === 400 ||
            error?.status === 401 ||
            error?.status === 403 ||
            errMsg.includes("API_KEY_INVALID") ||
            errMsg.includes("API key not valid") ||
            errMsg.includes("API_KEY") ||
            errMsg.includes("UNAUTHENTICATED");

          if (isAuthOrKeyInvalid) {
            isKeyPermanentlyInvalid = true;
            break;
          }
          // Continue to next model if available
        }
      }
    }

    // High-fidelity fallback concept schematic generator incorporating chassis finish, accent palette, and design directives
    const fallbackSvg = generateConceptSvg(robotType, mcu, compsList, missionGoal, style, chassisMaterial, accentColor, customSketchPrompt);
    const fallbackData = {
      imageUrl: fallbackSvg,
      image: fallbackSvg,
      type: "svg" as const,
      promptUsed: promptText,
      style,
      isAiGenerated: false,
      chassisMaterial,
      accentColor,
      note: "High-precision vector blueprint schematic generated from active design directives and material specs."
    };
    return res.json({
      success: true,
      data: fallbackData,
      ...fallbackData,
      meta: { isFallback: true, modelUsed: "local-blueprint-engine", timestamp: new Date().toISOString() }
    });
  });

  // ==========================================
  // Veo Video Generation API Routes
  // ==========================================

  // Initiate Veo video generation (supports text prompt + optional uploaded base64 robot photo)
  app.post("/api/veo/generate-video", async (req, res) => {
    const { prompt, image, aspectRatio = "16:9", robotType, missionGoal } = req.body;

    const goalText = missionGoal || "Autonomous navigation, obstacle avoidance, and telemetry reporting";
    const typeText = robotType || "Autonomous Wheeled Rover";
    const videoPrompt = prompt || `A photorealistic 1080p real-life video of a physical ${typeText} in an engineering testing facility or maker workshop. The robot accomplishes its primary mission: '${goalText}'. Authentic camera panning, smooth motor kinematics, blinking status LEDs, realistic mechanical vibrations, and authentic workshop reflections.`;
    const selectedRatio = aspectRatio === "9:16" ? "9:16" : "16:9";

    const aiClient = getGeminiClient();
    if (aiClient) {
      // Primary model required: veo-3.1-fast-generate-preview (with graceful fallbacks)
      const veoModels = [
        "veo-3.1-fast-generate-preview",
        "veo-3.1-lite-generate-preview",
        "veo-3.1-generate-preview"
      ];

      for (const model of veoModels) {
        try {
          const config: unknown = {
            numberOfVideos: 1,
            resolution: "720p",
            aspectRatio: selectedRatio
          };

          let imagePayload: unknown = undefined;
          if (image && typeof image === "string" && image.includes("base64")) {
            const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");
            const mimeType = image.includes("image/jpeg") ? "image/jpeg" : image.includes("image/webp") ? "image/webp" : "image/png";
            imagePayload = {
              imageBytes: cleanBase64,
              mimeType
            };
          }

          const requestOptions: unknown = {
            model,
            prompt: videoPrompt,
            config
          };

          if (imagePayload) {
            (requestOptions as any).image = imagePayload;
          }

          const operation = await (aiClient.models as any).generateVideos(requestOptions);

          if (operation && operation.name) {
            return res.json({
              success: true,
              operationName: operation.name,
              modelUsed: model,
              promptUsed: videoPrompt,
              aspectRatio: selectedRatio,
              isSimulated: false
            });
          }
        } catch (err: any) {
          console.warn(`[Veo Video Engine] Model ${model} returned error:`, err?.message || err);
          // Try next model
        }
      }
    }

    // High-fidelity structured simulated operation fallback when Veo credentials are unavailable in container
    const mockOpId = `sim-veo-op-${Date.now()}`;
    return res.json({
      success: true,
      operationName: mockOpId,
      isSimulated: true,
      modelUsed: "veo-3.1-fast-generate-preview (simulation)",
      promptUsed: videoPrompt,
      aspectRatio: selectedRatio
    });
  });

  // Poll Veo video generation status
  app.post("/api/veo/video-status", async (req, res) => {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ success: false, error: "operationName is required" });
    }

    // Simulated operation polling handler
    if (operationName.startsWith("sim-veo-op-")) {
      const createdTime = parseInt(operationName.replace("sim-veo-op-", ""), 10);
      const elapsed = Date.now() - createdTime;
      const totalDuration = 5500; // 5.5 seconds simulation cycle
      const done = elapsed >= totalDuration;
      const progressPercent = Math.min(100, Math.round((elapsed / totalDuration) * 100));

      return res.json({
        success: true,
        done,
        isSimulated: true,
        progressPercent,
        stage: progressPercent < 30 
          ? "Translating Phase 1 Mission Directives into physical trajectory..." 
          : progressPercent < 70 
          ? "Synthesizing 1080p photorealistic frame motion & sensor HUD..." 
          : "Finalizing video render..."
      });
    }

    const aiClient = getGeminiClient();
    if (!aiClient) {
      return res.json({ success: true, done: true, isSimulated: true, progressPercent: 100 });
    }

    try {
      const updated = await (aiClient.operations as any).getVideosOperation({
        operation: { name: operationName }
      });
      return res.json({
        success: true,
        done: Boolean(updated.done),
        error: updated.error || null,
        isSimulated: false
      });
    } catch (err: any) {
      console.warn("[Veo Video Status] Polling error:", err?.message || err);
      return res.json({
        success: true,
        done: true,
        isSimulated: true,
        progressPercent: 100
      });
    }
  });

  // Stream or download completed Veo video
  app.post("/api/veo/video-download", async (req, res) => {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ success: false, error: "operationName is required" });
    }

    const aiClient = getGeminiClient();
    if (aiClient && !operationName.startsWith("sim-veo-op-")) {
      try {
        const updated = await (aiClient.operations as any).getVideosOperation({
          operation: { name: operationName }
        });
        const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
        if (uri) {
          const videoRes = await fetch(uri, {
            headers: { "x-goog-api-key": process.env.GEMINI_API_KEY || "" }
          });
          res.setHeader("Content-Type", "video/mp4");
          const arrayBuffer = await videoRes.arrayBuffer();
          return res.send(Buffer.from(arrayBuffer));
        }
      } catch (err: any) {
        console.warn("[Veo Video Download] Error streaming video binary:", err?.message || err);
      }
    }

    return res.status(404).json({
      success: false,
      message: "Video binary unavailable or simulated. Video playback is rendered via interactive mission canvas."
    });
  });

  // Vite development integration or static files serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : undefined,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI RoboPet Server booting on port ${PORT}`);
  });
}

// SIMULATED FALLBACK HANDLERS
// These ensure the user has a beautiful experience even if GEMINI_API_KEY is not defined yet!

function getSimulatedSourcing(robotType: string, customGoal: string, budget: number) {
  const selectedBudget = budget || 150;
  let recommendedMcu = "ESP32-WROOM-32E";
  let mcuReason = "ESP32 provides exceptional performance, built-in Wi-Fi and Bluetooth, and runs MicroPython/Arduino C++, making it optimal for small IoT rovers and budget-friendly robotics.";
  let parts = [];
  let framework = "Arduino C++ & Micro-ROS";

  if (robotType.toLowerCase().includes("arm") || robotType.toLowerCase().includes("manipulator")) {
    recommendedMcu = "Raspberry Pi 4 (4GB)";
    mcuReason = "A robotic arm requires high-speed coordinate transformations, serial communication, and inverse kinematics calculations. Raspberry Pi running ROS 2 allows real-time execution of MoveIt profiles.";
    parts = [
      { name: "Raspberry Pi 4 Model B (4GB)", category: "SBC", estimatedPriceUSD: 55, specs: "Quad-Core ARM v8, 4GB LPDDR4, 40 GPIO pins", roleInProject: "Main workspace controller, handles inverse kinematics calculations and ROS 2 workspace." },
      { name: "PCA9685 16-Channel 12-bit PWM Driver", category: "Motor Driver", estimatedPriceUSD: 8, specs: "I2C interface, built-in clock, up to 6V servos", roleInProject: "Generates independent, jitter-free PWM signals for arm servos." },
      { name: "MG996R Metal Gear High-Torque Servo (x4)", category: "Actuator", estimatedPriceUSD: 40, specs: "10 kg/cm torque at 6V, metal gears, 180° rotation", roleInProject: "Provides power to base, shoulder, elbow, and wrist pitch joints." },
      { name: "SG90 Micro Servo (x1)", category: "Actuator", estimatedPriceUSD: 4, specs: "1.6 kg/cm, lightweight, plastic gears", roleInProject: "Drives the end-effector gripper mechanism." },
      { name: "VL53L0X Time-of-Flight Sensor", category: "Sensor", estimatedPriceUSD: 7, specs: "Precise infrared distance via I2C, 2m max range", roleInProject: "Mounted on the gripper to detect proximity of items to grab." },
      { name: "5V 5A AC-DC Power Adapter", category: "Power Supply", estimatedPriceUSD: 15, specs: "Wall adapter, 5V DC, barrel connector", roleInProject: "Supplies high peak currents to the PCA9685 servo driver board." }
    ];
    framework = "ROS 2 Humble with MoveIt 2 (Python/C++)";
  } else if (robotType.toLowerCase().includes("hexapod") || robotType.toLowerCase().includes("legged")) {
    recommendedMcu = "ESP32-S3 Developer Board";
    mcuReason = "Multi-legged spiders require rapid multi-servo gait calculation. ESP32-S3's dual-core speed and I2S/PWM capabilities easily handle 12 to 18 servos in real time.";
    parts = [
      { name: "ESP32-S3-DevKitC-1", category: "Microcontroller", estimatedPriceUSD: 9, specs: "Xtensa 32-bit dual-core, 240MHz, 8MB PSRAM, Wi-Fi/BT", roleInProject: "Core firmware runner. Calculates inverse kinematics for gait cycles and accepts UDP wireless gamepad commands." },
      { name: "PCA9685 16-Channel Servo Driver", category: "Motor Driver", estimatedPriceUSD: 8, specs: "I2C interface, 12-bit precision, external V+ terminal", roleInProject: "Controls the 12 independent leg joint servos (Coxa and Femur) using only 2 pins." },
      { name: "SG90 Micro Servo (x12)", category: "Actuator", estimatedPriceUSD: 36, specs: "1.6 kg/cm torque, lightweight 9g", roleInProject: "Acts as Coxa (hip) and Femur (thigh) joint actuators for all 6 legs." },
      { name: "MPU6050 6-Axis Accelerometer/Gyro", category: "Sensor", estimatedPriceUSD: 5, specs: "I2C motion tracking, digital motion processing", roleInProject: "Provides real-time body tilt/roll telemetry to dynamically stabilize the gait on uneven ground." },
      { name: "2S 7.4V 1500mAh LiPo Battery", category: "Power Supply", estimatedPriceUSD: 18, specs: "Rechargeable, 25C discharge rate", roleInProject: "Supplies raw power to servos and ESP32 regulator." },
      { name: "5V 3A UBEC Regulator", category: "Power Supply", estimatedPriceUSD: 6, specs: "Step-down, step from 7.4V to clean 5.0V", roleInProject: "Steps down battery voltage to safe 5V for PCA9685 and ESP32." }
    ];
    framework = "Espressif IDF (C++) or Arduino IDE";
  } else {
    // Wheeled rover
    recommendedMcu = "Raspberry Pi 4 Model B (2GB) + Arduino Uno";
    mcuReason = "A wheeled autonomous rover benefits from a dual-processor configuration: Raspberry Pi handles high-level SLAM mapping, camera processing, and AI, while Arduino handles real-time wheel encoder ticks and motor driver PWM safely.";
    parts = [
      { name: "Raspberry Pi 4 Model B (2GB)", category: "SBC", estimatedPriceUSD: 45, specs: "Quad-core Cortex-A72, Wi-Fi, Bluetooth, USB 3.0", roleInProject: "Performs navigational path planning, SLAM mapping, and hosts the LLM client node." },
      { name: "Arduino Uno R3", category: "Microcontroller", estimatedPriceUSD: 18, specs: "ATmega328P, 5V logic, 14 digital IO pins", roleInProject: "Real-time motor pulse width modulation (PWM) and ultrasonic ping timing controller." },
      { name: "L298N Dual H-Bridge Motor Driver", category: "Motor Driver", estimatedPriceUSD: 5, specs: "Dual DC channel, supports up to 2A per channel", roleInProject: "Routes high power to the yellow hobby gear motors based on Arduino PWM inputs." },
      { name: "TT Dual-Shaft Gear Motors (x2)", category: "Actuator", estimatedPriceUSD: 8, specs: "1:48 gear ratio, 3V-6V DC operation", roleInProject: "Provides rotational drive to left and right wheels." },
      { name: "HC-SR04 Ultrasonic Sensor", category: "Sensor", estimatedPriceUSD: 4, specs: "Ultrasonic range, 2cm-400cm, 5V", roleInProject: "Pings forward space to execute emergency stops when obstacles are within 15cm." },
      { name: "RPLIDAR A1M8 360 Degree LiDAR", category: "Sensor", estimatedPriceUSD: 89, specs: "360° laser scanner, 12m range, UART 115200bps", roleInProject: "Maps environment and enables Hector SLAM navigation without encoders." },
      { name: "18650 Li-ion Cells (x2) with Holder", category: "Power Supply", estimatedPriceUSD: 12, specs: "7.4V combined output, 2500mAh rating", roleInProject: "Supplies raw, rechargeable juice to motors and controllers." }
    ];
    framework = "ROS 2 Humble Nav2 & Micro-ROS";
  }

  // Filter parts if budget is tight
  if (budget && budget > 0) {
    let currentCost = parts.reduce((sum, p) => sum + p.estimatedPriceUSD, 0);
    if (currentCost > budget) {
      // Remove lidar or replace with ultrasonic to fit budget
      parts = parts.filter(p => p.name !== "RPLIDAR A1M8 360 Degree LiDAR");
      parts.push({
        name: "VL53L0X Time-of-Flight Sensor (x2)",
        category: "Sensor",
        estimatedPriceUSD: 14,
        specs: "I2C infrared range finder, precise up to 2m",
        roleInProject: "Provides left and right proximity tracking in place of expensive LiDAR mapping."
      });
    }
  }

  const finalCost = parts.reduce((sum, p) => sum + p.estimatedPriceUSD, 0);

  return {
    recommendedMicrocontroller: {
      name: recommendedMcu,
      reason: mcuReason
    },
    partsList: parts,
    totalEstimatedCostUSD: finalCost,
    softwareFramework: framework,
    customDesignNotes: `1. ISOLATE POWER: Actuators draw huge current spikes. Always isolate the ${recommendedMcu} logic power supply from the motor/servo driver power supply.
2. COM PROTOCOL: Ensure you attach common grounds. When using I2C devices (like PCA9685 or IMUs), verify pull-up resistors are active on the master logic lines.
3. PHYSICAL BALANCING: Place batteries as low and centered as possible to prevent flipping during rapid deceleration.`,
    suggestedAssemblyRoadmap: [
      "Flash operating system or micro-ROS firmware onto the " + recommendedMcu,
      "Test microcontrollers by uploading basic blink and I2C address scanner scripts",
      "Solder pins onto drivers and sensors, assemble the primary chassis structure",
      "Wire actuators to drivers, and connect driver control logic to the microcontroller",
      "Integrate power regulators, and perform low-speed manual movement testing",
      "Mount distance sensors and verify real-time distance telemetry is visible in terminal",
      "Write autonomous safety algorithms (e.g. stop-before-crash) before loading LLM APIs"
    ]
  };
}

function getSimulatedCompatibility(mcu: string, components: any[], power: string) {
  const warnings: any[] = [];
  const levelShifts: any[] = [];
  let isEsp32OrPi = mcu.toLowerCase().includes("esp32") || mcu.toLowerCase().includes("raspberry") || mcu.toLowerCase().includes("jetson");
  
  let totalCurrent = 150; // Base MCU current mA

  components.forEach(comp => {
    const name = comp.name.toLowerCase();
    
    // Power warnings
    if (name.includes("servo") || name.includes("motor") || name.includes("stepper")) {
      totalCurrent += name.includes("servo") ? 800 : 1200;
      warnings.push({
        componentName: comp.name,
        title: "High Peak Current Warning",
        description: `Actuators like ${comp.name} can draw up to 1-2 Amps under stall conditions. NEVER draw this current directly from the ${mcu}'s 5V regulator. Use an external battery with a dedicated driver board (e.g. PCA9685/L298N) and connect common ground.`,
        severity: "high"
      });
    }

    // Level shifting warnings
    if (isEsp32OrPi && (name.includes("sr04") || name.includes("ultrasonic") || name.includes("uno") || name.includes("l298n"))) {
      if (!name.includes("3.3v")) {
        levelShifts.push({
          component: comp.name,
          signalLine: "Echo / Logic Signal Trigger",
          shiftNeeded: "5V down to 3.3V resistor voltage divider (or bidirectional level shifter)"
        });
        warnings.push({
          componentName: comp.name,
          title: "Logic Level Mismatch",
          description: `The standard HC-SR04/L298N outputs a 5V signal, which will degrade or destroy the ${mcu}'s 3.3V GPIO input pins. Implement a level shifter or 1k/2k Ohm resistor divider on the Echo line.`,
          severity: "medium"
        });
      }
    }

    // ADC Raspberry Pi warning
    if (mcu.toLowerCase().includes("raspberry pi 4") || mcu.toLowerCase().includes("raspberry pi 5")) {
      if (name.includes("analog") || name.includes("photoresistor") || name.includes("joystick")) {
        warnings.push({
          componentName: comp.name,
          title: "Missing Analog-to-Digital Converter",
          description: "Raspberry Pi single board computers do not have built-in ADC pins. To read analog telemetry from this sensor, you must integrate an ADS1115 or MCP3008 ADC board via I2C/SPI.",
          severity: "high"
        });
      }
    }
  });

  // Battery recommendation
  let recBattery = "2S 7.4V LiPo Battery with 5V/3A UBEC Step-Down Converter";
  if (totalCurrent < 800) {
    recBattery = "4x AA NiMH Batteries (4.8V - 6V) or standard 5V Power Bank";
  }

  let status = "passed";
  if (warnings.some(w => w.severity === "high")) status = "critical";
  else if (warnings.length > 0) status = "warning";

  return {
    overallStatus: status,
    warnings: warnings,
    powerAnalysis: {
      totalEstimatedCurrentMA: totalCurrent,
      recommendedBatteryPower: recBattery,
      comments: totalCurrent > 1000 
        ? "High current draw detected due to physical motors. Do not attempt to run this setup purely off USB laptop power, as it will cause immediate brownouts."
        : "Low current profile. Safe to run off standard battery cell packs."
    },
    interfaceAnalysis: {
      gpioUsage: `Analyzed microcontroller ${mcu}. Sufficient digital pins available for standard serial or I2C protocols.`,
      pinOutConflicts: levelShifts.length > 0 ? "Potential logic conflict on GPIO pin boundaries due to 5V inputs." : "No pin conflicts detected.",
      recommendations: "Utilize dedicated hardware pins for I2C (SDA/SCL) and hardware UART (RX/TX) rather than software-emulated protocols to ensure stable baud rates."
    },
    levelShiftingNeeds: levelShifts,
    technicalAdvice: `AI RoboPet Diagnostics completed! Your selected microcontroller is ${mcu}. 
- ALWAYS wire battery power directly to motor driver inputs, bypassing microcontroller rails.
- Ensure all grounds (MCU GND, battery GND, Driver GND) are securely tied together.
- For 3.3V safety, double-check all I2C lines are not pulled up to 5V by external sensors.`
  };
}

function getSimulatedBrain(command: string, mcu: string, sensors: string, actuators: string) {
  let thoughts = `Human command received: "${command}". I must parse this into structured motion. I am checking sensory feedback. `;
  let actions: unknown[] = [];
  let speech = "Initializing sequence.";
  let mockTelemetry = "";

  const cmd = command.toLowerCase();

  if (cmd.includes("forward") || cmd.includes("move") || cmd.includes("go to")) {
    thoughts += "Command requests motion. Distance sensors reporting clear path (distance > 30cm). Starting wheel motors forward.";
    mockTelemetry = "Ultrasonic: 120cm, Gyro Yaw: 0.0 rad, Encoder ticks: 0";
    actions = [
      { device: "Motor Driver (L298N/TB6612)", action: "setSpeed", parameters: "Forward 75% Duty Cycle", durationSeconds: 2 },
      { device: "LED Indicator", action: "blink", parameters: "Color: Green, Frequency: 2Hz", durationSeconds: 2 },
      { device: "Motor Driver (L298N/TB6612)", action: "setSpeed", parameters: "0% (Stop)", durationSeconds: 0.5 }
    ];
    speech = "Affirmative, moving forward. Obstacle sensor is clear.";
  } else if (cmd.includes("avoid") || cmd.includes("scan") || cmd.includes("look around")) {
    thoughts += "User requested environment scan. I need to spin the radar/servo or sweep ultrasonic sensor left and right to build a physical clearance profile.";
    mockTelemetry = "RPLIDAR: Active, IMU roll: 0.01 rad";
    actions = [
      { device: "Pan-Tilt Micro Servo", action: "writeAngle", parameters: "45 degrees (Sweep Left)", durationSeconds: 0.8 },
      { device: "HC-SR04 Ultrasonic", action: "ping", parameters: "Measured: 42cm", durationSeconds: 0.2 },
      { device: "Pan-Tilt Micro Servo", action: "writeAngle", parameters: "135 degrees (Sweep Right)", durationSeconds: 0.8 },
      { device: "HC-SR04 Ultrasonic", action: "ping", parameters: "Measured: 12cm (Obstacle detected!)", durationSeconds: 0.2 },
      { device: "Pan-Tilt Micro Servo", action: "writeAngle", parameters: "90 degrees (Center)", durationSeconds: 0.5 }
    ];
    speech = "Starting sensory sweep. Obstacle detected on my right side at 12 centimeters.";
  } else if (cmd.includes("grab") || cmd.includes("arm") || cmd.includes("pick up")) {
    thoughts += "Command is to pick up an object. Opening gripper, moving arm joints down, checking proximity via ToF sensor, closing gripper, and lifting.";
    mockTelemetry = "ToF Distance: 15mm (object inside gripper), Servo current: 240mA";
    actions = [
      { device: "Gripper Servo", action: "writeAngle", parameters: "10 degrees (Fully Open)", durationSeconds: 0.5 },
      { device: "Shoulder & Elbow Servos", action: "writeAngle", parameters: "Shoulder: 45°, Elbow: 90° (Reach Down)", durationSeconds: 1.5 },
      { device: "ToF Proximity Sensor", action: "ping", parameters: "Value: 12mm", durationSeconds: 0.1 },
      { device: "Gripper Servo", action: "writeAngle", parameters: "90 degrees (Close / Grip object)", durationSeconds: 1.0 },
      { device: "Shoulder Servo", action: "writeAngle", parameters: "Shoulder: 95° (Lift object up)", durationSeconds: 1.2 }
    ];
    speech = "Reaching down to secure target. Time-of-Flight sensor confirms object is securely in gripper.";
  } else {
    // Default fallback
    thoughts += "Interpreting general directive. I will trigger local physical indicators to confirm system status and acknowledge connection.";
    mockTelemetry = "System Heartbeat: OK, Battery Voltage: 7.8V";
    actions = [
      { device: "LED Status Strip", action: "writeRGB", parameters: "Breathe Blue", durationSeconds: 1.5 },
      { device: "Piezo Buzzer", action: "tone", parameters: "Frequency: 1047Hz (C6), Duration: 150ms", durationSeconds: 0.2 }
    ];
    speech = `RoboMind online! Ready to control ${mcu} and deploy physical actions. Give me a navigation or manipulation command.`;
  }

  return {
    innerThoughts: thoughts,
    actionSequence: actions,
    robotSpeech: speech,
    sensoryFeedbackMock: mockTelemetry,
    explanationOfAutonomy: `Based on active actuators (${actuators}) and local logic constraints, the LLM mapped the command string into sequential hardware control vectors. High-level commands are decoupled from basic loop frequencies to prevent thread blocking on the main MCU.`
  };
}

function getSimulatedCode(hardware: string, mcu: string, type: string) {
  let title = "driver.py";
  let code = "";
  let inst = "";
  let pre: string[] = [];

  const h = hardware.toLowerCase();

  if (type === "arduino_sketch") {
    title = `${h.replace(/\s+/g, "_")}_test.ino`;
    pre = ["Arduino IDE installed", "Connect board via USB-C cable", `Add suitable library for ${hardware} if needed`];
    code = `/*
 * AI RoboPet - Automated Hardware Driver
 * Device: ${hardware}
 * Target MCU: ${mcu}
 */

#include <Wire.h>

// I2C/GPIO Pin configuration based on AI RoboPet pin-out logic
const int SIGNAL_PIN = 3; 
const int LED_INDICATOR = 13;

void setup() {
  Serial.begin(115200);
  while (!Serial) { delay(10); } // Wait for serial monitor
  
  pinMode(SIGNAL_PIN, INPUT);
  pinMode(LED_INDICATOR, OUTPUT);
  
  Serial.println("--- ${hardware} Initializing ---");
  
  // Custom initialization logic for target board
  digitalWrite(LED_INDICATOR, HIGH);
  delay(500);
  digitalWrite(LED_INDICATOR, LOW);
  Serial.println("Setup Complete. Ready.");
}

void loop() {
  // Read value from component
  int sensorState = digitalRead(SIGNAL_PIN);
  
  if (sensorState == HIGH) {
    Serial.println("[TELEM] ${hardware} state changed to ACTIVE");
    digitalWrite(LED_INDICATOR, HIGH);
  } else {
    digitalWrite(LED_INDICATOR, LOW);
  }
  
  delay(100); // 10Hz sampling loop
}`;
    inst = `1. Open the Arduino IDE.
2. Copy this code and paste it into a new sketch.
3. In Tools > Board, select your target board (${mcu}).
4. Connect your hardware to physical digital Pin 3 (Signal) and GND/VCC.
5. Click Upload, and open the Serial Monitor at 115200 baud to view logs.`;
  } else if (type === "python_driver") {
    title = `${h.replace(/\s+/g, "_")}_driver.py`;
    pre = ["Python 3.8+ installed on robot computer", "RPi.GPIO or Adafruit-Blinka dependency installed", "Common ground wire connected"];
    code = `#!/usr/bin/env python3
"""
AI RoboPet - Autonomous Component Driver
Hardware: ${hardware}
Platform: ${mcu}
"""

import time
import sys

class RobotComponentDriver:
    def __init__(self, channel_pin=18):
        self.channel_pin = channel_pin
        print(f"[{self.__class__.__name__}] Initializing ${hardware} on GPIO Pin {self.channel_pin}")
        try:
            # We use simulated GPIO here; replace with RPi.GPIO on Pi hardware
            import os
            self.hardware_active = True
        except ImportError:
            print("RPi.GPIO module not found. Running in simulation mode.")
            self.hardware_active = False

    def read_telemetry(self):
        """Reads raw data values from the physical component"""
        if not self.hardware_active:
            # Mock high quality sine-wave or feedback loops
            import math
            return 20.0 + math.sin(time.time()) * 5.0
        
        # Real hardware logic:
        # return GPIO.input(self.channel_pin)
        return 1.0

    def run_telemetry_loop(self, interval_seconds=1.0):
        print(f"Starting telemetric feed for ${hardware}...")
        try:
            while True:
                val = self.read_telemetry()
                print(f"[DATA_FEED] timestamp={time.time():.2f} device='${hardware}' value={val:.2f}")
                time.sleep(interval_seconds)
        except KeyboardInterrupt:
            print("\\nLoop terminated by user. Releasing hardware resources.")

if __name__ == '__main__':
    # Pin 18 is standard hardware PWM/Digital pin on board
    driver = RobotComponentDriver(channel_pin=18)
    driver.run_telemetry_loop(interval_seconds=0.5)
`;
    inst = `1. Save this script to your robot computer's file system as '${title}'.
2. Make the file executable: 'chmod +x ${title}'.
3. Wire the ${hardware} to GPIO Pin 18 on the ${mcu}.
4. Run the script using Python: 'python3 ${title}'.`;
  } else if (type === "bash_install") {
    title = `install_${h.replace(/\s+/g, "_")}.sh`;
    pre = ["Ubuntu 20.04/22.04 or Raspberry Pi OS", "Internet connection on target device", "Sudo privileges"];
    code = `#!/bin/bash
# AI RoboPet - Environment setup script
# Component: ${hardware}
# Target MCU/SBC: ${mcu}

echo "=== AI RoboPet Setup Automation ==="
echo "Updating system package list..."
sudo apt-get update -y

echo "Installing general python, pip, and system headers..."
sudo apt-get install -y python3-pip python3-dev build-essential git

if [[ "${hardware}" == *"LiDAR"* || "${hardware}" == *"LIDAR"* ]]; then
  echo "Setting up specific LiDAR system dependencies and USB rules..."
  sudo usermod -a -G dialout $USER
  # Create udev rules for serial connection to prevent access permission errors
  echo 'KERNEL=="ttyUSB*", MODE="0666"' | sudo tee /etc/udev/rules.d/99-serial.rules
  sudo udevadm control --reload-rules && sudo udevadm trigger
fi

echo "Installing required python libraries for ${hardware}..."
pip3 install --upgrade pip
pip3 install smbus2 pyserial numpy adafruit-blinka

echo "Setup workspace directories..."
mkdir -p ~/robot_ws/src

echo "=== SETUP COMPLETE ==="
echo "Please restart your terminal session or reboot the SBC to apply serial permissions!"
`;
    inst = `1. Save the shell script into your computer terminal as 'install_driver.sh'.
2. Grant run permissions: 'chmod +x install_driver.sh'.
3. Execute the script: './install_driver.sh'.
4. Connect your hardware via USB/Serial or GPIO, and restart terminal shell.`;
  } else {
    // ros_launch
    title = `${h.replace(/\s+/g, "_")}_node_launch.py`;
    pre = ["ROS 2 (Humble or Iron) installation active", "Colcon workspace initialized", "Source setup.bash run"];
    code = `import os
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    """
    AI RoboPet - ROS 2 Launch Configuration
    Integrates ${hardware} node into system telemetry pipeline.
    """
    # Define parameters for real-time serial or topic frequencies
    component_node = Node(
        package='robot_telemetry_pkg',
        executable='driver_node',
        name='${h.replace(/\s+/g, "_")}_driver',
        output='screen',
        parameters=[{
            'baudrate': 115200,
            'device_port': '/dev/ttyUSB0',
            'publish_frequency': 20.0,
            'hardware_target': '${mcu}'
        }],
        remappings=[
            ('/telemetry/raw', '/robot/sensors/${h.replace(/\s+/g, "_")}_data')
        ]
    )

    # Core system diagnostics logger
    diagnostics_node = Node(
        package='diagnostic_aggregator',
        executable='aggregator_node',
        name='diagnostic_aggregator',
        output='log'
    )

    return LaunchDescription([
        component_node,
        diagnostics_node
    ])
`;
    inst = `1. Place this launch file in your ROS 2 package's launch/ folder.
2. In your CMakeLists.txt or setup.py, ensure launch files are exported.
3. Compile the workspace: 'colcon build --packages-select robot_telemetry_pkg'.
4. Source environment: 'source install/setup.bash'.
5. Launch the node: 'ros2 launch robot_telemetry_pkg ${title}'.`;
  }

  return {
    scriptTitle: title,
    codeBlock: code,
    instructions: inst,
    prerequisites: pre
  };
}

function getSimulatedHelpResponse(query: string, context: any): string {
  const q = query.toLowerCase();
  const mcu = context?.activeMCU || "ESP32";

  if (q.includes("shifter") || q.includes("voltage") || q.includes("3.3v") || q.includes("5v") || q.includes("level")) {
    return `### ⚡ Logic Level Shifting & Voltage Isolation Guide

When connecting 5V components (e.g. Arduino modules, standard ultrasonic sensors) to 3.3V microcontrollers (like **${mcu}** or Raspberry Pi):

1. **Why It Matters**: 3.3V GPIO inputs are **not 5V tolerant**. Exceeding 3.6V will permanently damage the silicon gate oxide.
2. **Bidirectional Signals (I2C SDA / SCL)**:
   - Use a BSS138 or TXS0108E bidirectional level shifter.
   - Connect **HV** pin to 5.0V, **LV** pin to 3.3V, and **GND** to common ground.
3. **Unidirectional Signals (HC-SR04 Echo Pin)**:
   - Use a 1kΩ + 2kΩ resistor voltage divider:
   \`\`\`
   Echo Pin (5V) ───[ 1kΩ ]───┬───> GPIO Pin (3.3V)
                              │
                           [ 2kΩ ]
                              │
                             GND
   \`\`\`
4. **Common Ground**: Always ensure the battery ground, MCU ground, and driver ground are tied together.`;
  }

  if (q.includes("battery") || q.includes("lipo") || q.includes("power") || q.includes("ubec") || q.includes("current")) {
    return `### 🔋 Power Architecture & LiPo Battery Sizing

For reliable robotics operation with **${mcu}** and servos:

1. **Voltage Regulation**:
   - **2S LiPo (7.4V Nominal / 8.4V Peak)**: Ideal for standard hobby rovers and arms. Use a **5V 3A UBEC (Step-Down Buck Regulator)** to power the logic board, and power servos directly from 6V-7.4V if rated for high voltage.
   - **3S LiPo (11.1V Nominal / 12.6V Peak)**: Ideal for high-torque NEMA steppers or heavy brushless drive motors.
2. **Discharge C-Rating**:
   - $\\text{Max Discharge Amps} = \\text{Capacity (Ah)} \\times \\text{C-Rating}$
   - Example: $2200\\text{mAh} \\times 25\\text{C} = 55\\text{ Amps peak!}$
3. **Brownout Prevention**:
   - Never power high-current motors directly from the MCU's 5V/3.3V regulator pins.
   - Place a $470\\mu\\text{F} - 1000\\mu\\text{F}$ low-ESR capacitor across the servo power rail.`;
  }

  if (q.includes("ros") || q.includes("ros 2") || q.includes("humble") || q.includes("micro-ros") || q.includes("topic")) {
    return `### 🤖 ROS 2 & Micro-ROS Architecture

To link your **${mcu}** into the ROS 2 Humble telemetry pipeline:

1. **Micro-ROS on MCU**:
   - Flash micro-ROS client onto the ESP32/Teensy via PlatformIO or Arduino IDE.
   - Publishes directly to standard ROS 2 topics (\`/cmd_vel\`, \`/odom\`, \`/sensor/imu\`).
2. **Serial Agent Transport**:
   \`\`\`bash
   # Run the micro-ROS agent on your host SBC / PC:
   ros2 run micro_ros_agent micro_ros_agent serial --dev /dev/ttyUSB0 -b 115200
   \`\`\`
3. **Check Live Topics**:
   \`\`\`bash
   ros2 topic list
   ros2 topic echo /sensor/imu
   \`\`\`
4. **Coordinate Frames (TF2)**: Ensure your base footprint, base link, and laser frames are published with static transforms.`;
  }

  if (q.includes("driver") || q.includes("motor") || q.includes("tb6612") || q.includes("l298n") || q.includes("pca9685")) {
    return `### ⚙️ Motor Driver & PWM Control Configuration

1. **TB6612FNG vs. L298N**:
   - **TB6612FNG (Recommended)**: Modern MOSFET-based driver. Extremely low heat, 1.2A continuous per channel, and zero voltage drop.
   - **L298N (Older BJT)**: Loses ~2V as heat dissipation. Requires heavy heatsink.
2. **PCA9685 16-Channel PWM Servo Expander**:
   - I2C Address: \`0x40\` (default).
   - Requires only 2 GPIO pins (SDA, SCL) from **${mcu}** to drive 16 servos at 50Hz PWM with 12-bit precision.
   - Hook up external 5V-6V power to the blue screw terminal block (never draw servo power from the logic VCC).`;
  }

  return `### 🛠️ AI RoboPet Engineering Recommendations

Based on your active configuration (**${mcu}** with ${context?.hardware?.length || "standard"} modules):

- **Signal Integrity**: Keep high-current motor wires twisted and separated from analog/I2C sensor wires to avoid inductive electromagnetic interference (EMI).
- **Decoupling**: Add a $0.1\\mu\\text{F}$ ceramic capacitor close to sensitive sensor VCC/GND pins.
- **Boot Strapping Warning**: On ESP32, avoid using GPIO 0, 2, 12, or 15 for motor triggers as they change boot modes when pulled HIGH/LOW during startup.
- **Fail-Safe Timeout**: Always implement a software watchdog timer in your loop: if no radio/Wi-Fi command is received within 500ms, immediately zero the motor PWM duty cycle!

*Feel free to ask about specific schematics, ROS 2 topics, kinematics math, or battery calculators!*`;
}

function getSimulatedSearchResults(query: string, categoryLimit?: string) {
  const q = query.toLowerCase();

  if (categoryLimit === "ai_neural") {
    return {
      summary: `### 🧠 AI Neural Robotics & Edge ML Search Results for "${query}"

Here are the top-rated datasets, neural network weights, and deployment frameworks for edge robotics:

1. **Ultralytics YOLOv8-Nano / YOLOv11 (Robotics Vision)**
   - *Architecture*: 3.2M params, optimized for PyTorch & TensorRT.
   - *Latency*: ~12ms on Raspberry Pi 5 / Jetson Orin Nano.
   - *Link*: [Ultralytics GitHub & Docs](https://github.com/ultralytics/ultralytics)

2. **Roboflow Universe - Autonomous Rover & Obstacle Detection Dataset**
   - *Dataset*: Over 25,000 annotated indoor/outdoor frames (walls, terrain, charging stations, obstacles).
   - *Format*: COCO JSON, YOLO TXT, Pascal VOC.
   - *Link*: [Roboflow Robotics Datasets](https://universe.roboflow.com/search?q=robotics)

3. **Hugging Face Robotics - LeRobot & Edge Telemetry Models**
   - *Model*: PyTorch end-to-end imitation learning and visual policy models for arms and rovers.
   - *Link*: [Hugging Face LeRobot](https://huggingface.co/lerobot)

4. **Edge Impulse Studio - Embedded Sensor & Audio Classifier**
   - *Target*: ESP32-S3, Arduino Portenta, Raspberry Pi.
   - *Link*: [Edge Impulse Edge AI](https://www.edgeimpulse.com/)`,
      sources: [
        { title: "Hugging Face LeRobot Models & Datasets", url: "https://huggingface.co/lerobot" },
        { title: "Roboflow Universe Robotics Datasets", url: "https://universe.roboflow.com" },
        { title: "Ultralytics YOLO Real-Time Object Detection", url: "https://docs.ultralytics.com" },
        { title: "Edge Impulse Embedded Neural Networks", url: "https://www.edgeimpulse.com" },
        { title: "PyTorch Robotics & Computer Vision Hub", url: "https://pytorch.org/hub" }
      ],
      searchQueries: [
        `${query} robotics dataset huggingface`,
        `${query} edge ai pytorch roboflow`,
        `${query} embedded neural network model`
      ],
      categoryLimit: "ai_neural"
    };
  }

  if (categoryLimit === "components") {
    return {
      summary: `### 🛒 Verified Hardware Component Suppliers for "${query}"

Found high-reliability sourcing options across verified distributors:

1. **Adafruit Industries & SparkFun Electronics**
   - *Specialty*: Pre-tested breakout boards, STEMMA QT / Qwiic plug-and-play I2C sensors, open-source schematic diagrams.
   - *Typical Availability*: High stock with step-by-step wiring tutorials.
   - *Link*: [Adafruit Component Search](https://www.adafruit.com)

2. **DigiKey & Mouser Electronics**
   - *Specialty*: Industrial grade microcontrollers, MOSFET drivers, voltage regulators, passives, and bulk semiconductors.
   - *Specs*: Complete parametric datasheets, RoHS compliance verification.
   - *Link*: [DigiKey Sourcing Portal](https://www.digikey.com)

3. **RobotShop & Pololu**
   - *Specialty*: Metal gear motors, high-torque servos, chassis kits, optical encoders, and motor drivers.
   - *Link*: [RobotShop Robotics Sourcing](https://www.robotshop.com)

4. **AliExpress & JLCPCB / PCBWay**
   - *Specialty*: Low-cost prototype quantities, custom PCB fabrication, SMD component assembly.`,
      sources: [
        { title: "Adafruit Industries Robotics & Electronics", url: "https://www.adafruit.com" },
        { title: "DigiKey Parametric Hardware Search", url: "https://www.digikey.com" },
        { title: "Mouser Electronics Engineering Components", url: "https://www.mouser.com" },
        { title: "Pololu Robotics & Motor Control", url: "https://www.pololu.com" },
        { title: "RobotShop Professional & DIY Kits", url: "https://www.robotshop.com" }
      ],
      searchQueries: [
        `${query} digikey datasheet price`,
        `${query} adafruit breakout wiring pinout`,
        `${query} robotshop supplier hardware`
      ],
      categoryLimit: "components"
    };
  }

  return {
    summary: `### 🌐 Grounded Robotics Search Results for "${query}"

1. **Hardware Specifications & Pinouts**:
   - Voltage requirements: 3.3V / 5.0V with standard I2C/SPI interfaces.
   - Typical power consumption: 80mA - 450mA peak.
2. **Software Drivers & Libraries**:
   - Compatible with Arduino C++, MicroPython, CircuitPython, and ROS 2 Humble nodes.
3. **Recommended Next Steps**:
   - Check supplier inventory on DigiKey or Adafruit.
   - Integrate with AI RoboPet BOM and run AI Compatibility Diagnostics.`,
    sources: [
      { title: "Robotics Hardware Specs & Tutorials", url: "https://learn.adafruit.com" },
      { title: "ROS 2 Humble Documentation & Packages", url: "https://docs.ros.org/en/humble" },
      { title: "GitHub Open-Source Robotics Drivers", url: "https://github.com" }
    ],
    searchQueries: [`${query} robotics hardware`, `${query} datasheet pinout`],
    categoryLimit: categoryLimit || "all"
  };
}

function generateConceptSvg(
  robotType: string,
  mcu: string,
  components: string,
  goal: string,
  style: string,
  chassisMaterial: string = "Anodized Aluminum & Carbon Fiber",
  accentColor: string = "Cyan & Matte Dark Slate",
  customPrompt: string = ""
): string {
  const isArm = (robotType || "").toLowerCase().includes("arm");
  const isHexapod = (robotType || "").toLowerCase().includes("hexapod") || (robotType || "").toLowerCase().includes("spider");

  // Determine accent color hex
  let primaryAccent = "%2306b6d4"; // cyan
  let secondaryAccent = "%2338bdf8";
  if (accentColor.includes("Orange")) {
    primaryAccent = "%23f97316";
    secondaryAccent = "%23fb923c";
  } else if (accentColor.includes("Yellow")) {
    primaryAccent = "%23eab308";
    secondaryAccent = "%23fde047";
  } else if (accentColor.includes("Violet") || accentColor.includes("White")) {
    primaryAccent = "%23a855f7";
    secondaryAccent = "%23c084fc";
  }

  // Determine chassis fill
  let chassisFill = "%231e293b";
  if (chassisMaterial.includes("PETG")) {
    chassisFill = "%230d2238";
  } else if (chassisMaterial.includes("Birch")) {
    chassisFill = "%232d1d13";
  } else if (chassisMaterial.includes("Titanium") || chassisMaterial.includes("Alloy")) {
    chassisFill = "%23161f2c";
  }

  if (isArm) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" fill="none">
      <rect width="600" height="450" rx="16" fill="%23090d16"/>
      <!-- Grid Lines / CAD Blueprint style -->
      <g stroke="%231e293b" stroke-width="1" stroke-dasharray="4 4">
        <line x1="50" y1="0" x2="50" y2="450"/><line x1="150" y1="0" x2="150" y2="450"/><line x1="250" y1="0" x2="250" y2="450"/><line x1="350" y1="0" x2="350" y2="450"/><line x1="450" y1="0" x2="450" y2="450"/><line x1="550" y1="0" x2="550" y2="450"/>
        <line x1="0" y1="75" x2="600" y2="75"/><line x1="0" y1="150" x2="600" y2="150"/><line x1="0" y1="225" x2="600" y2="225"/><line x1="0" y1="300" x2="600" y2="300"/><line x1="0" y1="375" x2="600" y2="375"/>
      </g>
      <!-- Base Turntable Plate -->
      <ellipse cx="300" cy="380" rx="120" ry="30" fill="${chassisFill}" stroke="${primaryAccent}" stroke-width="3"/>
      <rect x="230" y="340" width="140" height="35" rx="6" fill="%230f172a" stroke="${secondaryAccent}" stroke-width="2"/>
      <text x="300" y="362" fill="${secondaryAccent}" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">BASE TURNTABLE (MG996R)</text>
      <!-- Arm Segment 1: Bicep Linkage -->
      <line x1="300" y1="340" x2="210" y2="210" stroke="%230284c7" stroke-width="24" stroke-linecap="round"/>
      <line x1="300" y1="340" x2="210" y2="210" stroke="${primaryAccent}" stroke-width="4" stroke-linecap="round"/>
      <!-- Elbow Joint -->
      <circle cx="210" cy="210" r="22" fill="%23090d16" stroke="${secondaryAccent}" stroke-width="3"/>
      <circle cx="210" cy="210" r="8" fill="${primaryAccent}"/>
      <!-- Arm Segment 2: Forearm Linkage -->
      <line x1="210" y1="210" x2="380" y2="120" stroke="%230284c7" stroke-width="18" stroke-linecap="round"/>
      <line x1="210" y1="210" x2="380" y2="120" stroke="${primaryAccent}" stroke-width="3" stroke-linecap="round"/>
      <!-- Wrist & End-Effector Gripper -->
      <circle cx="380" cy="120" r="16" fill="%23090d16" stroke="%2310b981" stroke-width="3"/>
      <!-- Gripper Pincers -->
      <path d="M 380 120 L 430 80 L 450 100" stroke="%2310b981" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M 380 120 L 430 150 L 450 130" stroke="%2310b981" stroke-width="8" stroke-linecap="round" fill="none"/>
      <!-- Laser / Sensor Beam -->
      <line x1="430" y1="115" x2="550" y2="115" stroke="%23ef4444" stroke-width="2" stroke-dasharray="6 3"/>
      <!-- Spec Label Callout Card -->
      <rect x="25" y="25" width="240" height="105" rx="8" fill="%23020617" fill-opacity="0.90" stroke="${primaryAccent}" stroke-width="1.5"/>
      <text x="38" y="48" fill="${secondaryAccent}" font-family="monospace" font-size="12" font-weight="bold">6-DOF KINEMATIC ARM</text>
      <text x="38" y="66" fill="%2394a3b8" font-family="sans-serif" font-size="10">MCU: ${mcu}</text>
      <text x="38" y="82" fill="${primaryAccent}" font-family="sans-serif" font-size="10">CHASSIS: ${chassisMaterial.substring(0, 24)}</text>
      <text x="38" y="98" fill="%23f59e0b" font-family="sans-serif" font-size="9">PALETTE: ${accentColor.substring(0, 26)}</text>
      <text x="38" y="114" fill="%2310b981" font-family="sans-serif" font-size="9">STYLE: ${style.substring(0, 26)}</text>
    </svg>`;
  }

  if (isHexapod) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" fill="none">
      <rect width="600" height="450" rx="16" fill="%23080c14"/>
      <!-- Grid -->
      <g stroke="%231e293b" stroke-width="1" stroke-dasharray="4 4">
        <line x1="100" y1="0" x2="100" y2="450"/><line x1="200" y1="0" x2="200" y2="450"/><line x1="300" y1="0" x2="300" y2="450"/><line x1="400" y1="0" x2="400" y2="450"/><line x1="500" y1="0" x2="500" y2="450"/>
      </g>
      <!-- 6 Articulated Legs (Biomimetic Spider) -->
      <!-- Left Legs -->
      <path d="M 240 180 L 140 120 L 70 170" stroke="${primaryAccent}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M 220 225 L 110 225 L 50 300" stroke="${primaryAccent}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M 240 270 L 140 330 L 70 380" stroke="${primaryAccent}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <!-- Right Legs -->
      <path d="M 360 180 L 460 120 L 530 170" stroke="${primaryAccent}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M 380 225 L 490 225 L 550 300" stroke="${primaryAccent}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M 360 270 L 460 330 L 530 380" stroke="${primaryAccent}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <!-- Central Body Hull -->
      <polygon points="300,160 370,195 370,255 300,290 230,255 230,195" fill="${chassisFill}" stroke="${primaryAccent}" stroke-width="4"/>
      <!-- Top Turret LiDAR / Sensor -->
      <circle cx="300" cy="225" r="32" fill="%230f172a" stroke="%23f43f5e" stroke-width="3"/>
      <circle cx="300" cy="225" r="16" fill="%23f43f5e"/>
      <circle cx="300" cy="225" r="45" fill="none" stroke="%23f43f5e" stroke-width="1.5" stroke-dasharray="4 4"/>
      <!-- Badge -->
      <rect x="25" y="25" width="240" height="105" rx="8" fill="%23020617" fill-opacity="0.90" stroke="${primaryAccent}" stroke-width="1.5"/>
      <text x="38" y="48" fill="${secondaryAccent}" font-family="monospace" font-size="12" font-weight="bold">12-DOF HEXAPOD SPIDER</text>
      <text x="38" y="66" fill="%2394a3b8" font-family="sans-serif" font-size="10">MCU: ${mcu}</text>
      <text x="38" y="82" fill="${primaryAccent}" font-family="sans-serif" font-size="10">CHASSIS: ${chassisMaterial.substring(0, 24)}</text>
      <text x="38" y="98" fill="%23f59e0b" font-family="sans-serif" font-size="9">PALETTE: ${accentColor.substring(0, 26)}</text>
      <text x="38" y="114" fill="%2310b981" font-family="sans-serif" font-size="9">Tripod Wave Dynamic Balancing</text>
    </svg>`;
  }

  // Default Wheeled Rover CAD render
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" fill="none">
    <rect width="600" height="450" rx="16" fill="%23090f1d"/>
    <!-- Grid -->
    <g stroke="%231e293b" stroke-width="1" stroke-dasharray="4 4">
      <line x1="100" y1="0" x2="100" y2="450"/><line x1="200" y1="0" x2="200" y2="450"/><line x1="300" y1="0" x2="300" y2="450"/><line x1="400" y1="0" x2="400" y2="450"/><line x1="500" y1="0" x2="500" y2="450"/>
      <line x1="0" y1="100" x2="600" y2="100"/><line x1="0" y1="200" x2="600" y2="200"/><line x1="0" y1="300" x2="600" y2="300"/><line x1="0" y1="400" x2="600" y2="400"/>
    </g>
    <!-- Heavy Duty Wheels (Left & Right Treaded) -->
    <rect x="110" y="160" width="55" height="150" rx="12" fill="%23020617" stroke="%2364748b" stroke-width="3"/>
    <line x1="110" y1="190" x2="165" y2="190" stroke="%23334155" stroke-width="4"/>
    <line x1="110" y1="235" x2="165" y2="235" stroke="%23334155" stroke-width="4"/>
    <line x1="110" y1="280" x2="165" y2="280" stroke="%23334155" stroke-width="4"/>
    <rect x="435" y="160" width="55" height="150" rx="12" fill="%23020617" stroke="%2364748b" stroke-width="3"/>
    <line x1="435" y1="190" x2="490" y2="190" stroke="%23334155" stroke-width="4"/>
    <line x1="435" y1="235" x2="490" y2="235" stroke="%23334155" stroke-width="4"/>
    <line x1="435" y1="280" x2="490" y2="280" stroke="%23334155" stroke-width="4"/>
    <!-- Main Chassis Deck with Selected Material Fill & Accent Outline -->
    <rect x="180" y="140" width="240" height="190" rx="16" fill="${chassisFill}" stroke="${primaryAccent}" stroke-width="3"/>
    <!-- Top Component Deck: Microcontroller + LiDAR Turret -->
    <rect x="210" y="170" width="180" height="80" rx="8" fill="%230f172a" stroke="${secondaryAccent}" stroke-width="1.5"/>
    <text x="300" y="195" fill="${secondaryAccent}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">MCU: ${mcu}</text>
    <text x="300" y="215" fill="%2394a3b8" font-family="monospace" font-size="9" text-anchor="middle">ROS 2 Telemetry & SLAM</text>
    <circle cx="300" cy="270" r="30" fill="%23020617" stroke="%23f43f5e" stroke-width="3"/>
    <circle cx="300" cy="270" r="14" fill="%23f43f5e"/>
    <text x="300" y="274" fill="%23ffffff" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">LiDAR</text>
    <!-- Forward Ultrasonic Eyes with Accent glow -->
    <circle cx="250" cy="120" r="14" fill="%231e293b" stroke="${primaryAccent}" stroke-width="2.5"/>
    <circle cx="350" cy="120" r="14" fill="%231e293b" stroke="${primaryAccent}" stroke-width="2.5"/>
    <line x1="250" y1="120" x2="250" y2="140" stroke="${primaryAccent}" stroke-width="4"/>
    <line x1="350" y1="120" x2="350" y2="140" stroke="${primaryAccent}" stroke-width="4"/>
    <!-- Laser Cone -->
    <path d="M 300 270 L 150 40 L 450 40 Z" fill="%23f43f5e" fill-opacity="0.12"/>
    <!-- Spec Label Callout Card -->
    <rect x="25" y="25" width="240" height="105" rx="8" fill="%23020617" fill-opacity="0.90" stroke="${primaryAccent}" stroke-width="1.5"/>
    <text x="38" y="48" fill="${secondaryAccent}" font-family="monospace" font-size="12" font-weight="bold">AUTONOMOUS FIELD ROVER</text>
    <text x="38" y="66" fill="%2394a3b8" font-family="sans-serif" font-size="10">MCU: ${mcu}</text>
    <text x="38" y="82" fill="${primaryAccent}" font-family="sans-serif" font-size="10">CHASSIS: ${chassisMaterial.substring(0, 24)}</text>
    <text x="38" y="98" fill="%23f59e0b" font-family="sans-serif" font-size="9">PALETTE: ${accentColor.substring(0, 26)}</text>
    <text x="38" y="114" fill="%2310b981" font-family="sans-serif" font-size="9">STYLE: ${style.substring(0, 26)}</text>
  </svg>`;
}

void startServer();
