import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  auth,
  onAuthStateChanged,
  subscribeUserData,
  saveUserDataToFirestore,
  User,
  UserProfileDoc
} from "./lib/firebase";
import { AuthModal } from "./components/AuthModal";
import { UserProfileBadge } from "./components/UserProfileBadge";
import { TechHelpGlossary } from "./components/TechHelpGlossary";
import { DatasheetModal } from "./components/DatasheetModal";
import { GoalBudgetSection } from "./components/GoalBudgetSection";
import { BOMAndComponentsSection } from "./components/BOMAndComponentsSection";
import { ProjectRunningTab } from "./components/ProjectRunningTab";
import { ConceptAndSketchStudio } from "./components/ConceptAndSketchStudio";
import { CommunityCommons } from "./components/CommunityCommons";
import { DiagnosticsTab } from "./components/EngineeringLabTabs/DiagnosticsTab";
import { CodeGeneratorTab } from "./components/EngineeringLabTabs/CodeGeneratorTab";
import { LLMBrainTab } from "./components/EngineeringLabTabs/LLMBrainTab";
import { AssemblyGuideTab } from "./components/EngineeringLabTabs/AssemblyGuideTab";
import { PhysicsSimulationTab } from "./components/EngineeringLabTabs/PhysicsSimulationTab";
import { CommunityShowcaseTab } from "./components/EngineeringLabTabs/CommunityShowcaseTab";
import { CompletedProductSpecs } from "./components/CompletedProductSpecs";
import { RobotMissionVideoMockup } from "./components/RobotMissionVideoMockup";
import { CreatorSupportSection } from "./components/CreatorSupportSection";
import { WorkshopQRModal } from "./components/modals/WorkshopQRModal";
import { VendorDirectoryModal } from "./components/modals/VendorDirectoryModal";
import { GithubWorkflowModal } from "./components/modals/GithubWorkflowModal";
import { NavigationHeader } from "./components/NavigationHeader";
import { PhaseStepper } from "./components/PhaseStepper";
import { generateSimulation } from "./services/simulationService";
import {
  exportDrawerToPDF as exportDrawerToPDFService,
  exportProjectToJSON,
  parseProjectJSON
} from "./services/exportService";
import { generateHardwareSvg } from "./lib/hardwareThumbnails";
import {
  Cpu,
  ShoppingBag,
  Wrench,
  Brain,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Terminal,
  Play,
  Copy,
  Camera,
  Box,
  Check,
  FileCode,
  Sliders,
  DollarSign,
  Coins,
  HelpCircle,
  Lightbulb,
  Workflow,
  Sparkles,
  Layers,
  BatteryCharging,
  Code,
  Users,
  MessageSquare,
  Heart,
  Send,
  Upload,
  MonitorPlay,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  FileSpreadsheet,
  ExternalLink,
  Truck,
  GraduationCap,
  Calculator,
  Link2,
  PackageCheck,
  BookOpen,
  ShieldCheck,
  Flag,
  Globe,
  Building2,
  Shield,
  QrCode,
  Smartphone,
  Share2,
  Edit3,
  X
} from "lucide-react";
import { useCreatorSupport } from "./hooks/useCreatorSupport";
import { useWorkshopSync } from "./hooks/useWorkshopSync";
import { SUPPLIER_CATALOG, PRESET_PROJECTS } from "./data";
import { HardwareComponent, RobotProfile, CompatibilityReport, LLMResult, GeneratedScript } from "./types";

export default function App() {
  // Profile settings
  const [robotType, setRobotType] = useState<"wheeled_rover" | "robotic_arm" | "hexapod">("wheeled_rover");
  const [customGoal, setCustomGoal] = useState("An autonomous room mapping rover that detects walls and paths.");
  const [budget, setBudget] = useState(250);

  // Active build state
  const [activeMCU, setActiveMCU] = useState<HardwareComponent>(
    SUPPLIER_CATALOG.find((c) => c.id === "esp32_wroom") || SUPPLIER_CATALOG[3]
  );
  const [activeDrawer, setActiveDrawer] = useState<HardwareComponent[]>([
    SUPPLIER_CATALOG.find((c) => c.id === "esp32_wroom")!,
    SUPPLIER_CATALOG.find((c) => c.id === "l298n")!,
    SUPPLIER_CATALOG.find((c) => c.id === "tt_motor")!,
    SUPPLIER_CATALOG.find((c) => c.id === "hcsr04")!,
    SUPPLIER_CATALOG.find((c) => c.id === "mpu6050")!,
    SUPPLIER_CATALOG.find((c) => c.id === "holder_18650")!
  ].filter(Boolean));

  // Supplementary & Contingency components list
  const [contingencyList, setContingencyList] = useState<HardwareComponent[]>([
    SUPPLIER_CATALOG.find((c) => c.id === "rpi4") || SUPPLIER_CATALOG[0],
    SUPPLIER_CATALOG.find((c) => c.id === "pca9685") || SUPPLIER_CATALOG[5]
  ].filter(Boolean));

  // Supplier Search states
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [natoFilterOnly, setNatoFilterOnly] = useState(false);

  // Procedure Phase State (1: Mission & Budget, 2: BOM & Sourcing, 3: Engineering & Lab, 4: Community Showcase)
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3 | 4>(1);

  // Tab State
  const [activeTab, setActiveTab] = useState<"diagnostics" | "code" | "concept" | "brain" | "assembly" | "simulation">("diagnostics");
  const [latestConceptImage, setLatestConceptImage] = useState<string | null>(null);

  // Simulation Lab states
  const [selectedSimulator, setSelectedSimulator] = useState<"gazebo" | "coppelia">("gazebo");
  const [simGenerating, setSimGenerating] = useState(false);
  const [simReport, setSimReport] = useState<{
    workspaceSetup: string;
    urdfCode?: string;
    luaScript?: string;
    instructions: string;
  } | null>(null);

  // Community Project Showcase states
  const [showcaseSearch, setShowcaseSearch] = useState("");
  const [showcaseCategoryFilter, setShowcaseCategoryFilter] = useState<string>("all");
  const [showcaseCommentInput, setShowcaseCommentInput] = useState("");
  const [selectedShowcaseProject, setSelectedShowcaseProject] = useState<unknown | null>(null);
  const [showcaseProjects, setShowcaseProjects] = useState<unknown[]>([
    {
      id: "proj_1",
      title: "OmniDrive Delivery Sentinel",
      builder: "Roxie_88",
      description: "An indoor autonomous delivery rover using a 4WD Mecanum wheel base, RPLIDAR A1 for mapping, and a custom YOLO vision node running on Jetson Nano.",
      hardware: [
        { name: "NVIDIA Jetson Nano Developer Kit", category: "SBC", estimatedPriceUSD: 149 },
        { name: "TB6612FNG Dual DC Motor Driver Board", category: "Motor Driver", estimatedPriceUSD: 6 },
        { name: "RPLIDAR A1M8 360° Laser Range Scanner", category: "Sensor", estimatedPriceUSD: 99 },
        { name: "Double 18650 Battery Holder with Cells", category: "Power Supply", estimatedPriceUSD: 14 }
      ],
      llmSpec: "Gemini 2.5 Flash node analyzing room coordinates to navigate and speak to recipients.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400",
      workTimeDays: 14,
      totalCost: 268,
      likes: 24,
      comments: [
        { user: "CyberKev", text: "Incredible Mecanum wheel setup! How do you handle sliding friction on slick floors?", time: "2 hours ago" },
        { user: "AdaRider", text: "Nice work with the Jetson! YOLO running real time is super smooth here.", time: "1 day ago" }
      ]
    },
    {
      id: "proj_2",
      title: "6-DOF Precision Hand Gripper",
      builder: "Volt_Arch",
      description: "An advanced desktop manipulator arm. Employs 6 premium high torque MG996R servos, an Arduino R4 board, and full inverse kinematics script.",
      hardware: [
        { name: "Arduino Uno R4 Minima", category: "Microcontroller", estimatedPriceUSD: 20 },
        { name: "PCA9685 16-Channel 12-bit PWM Driver", category: "Motor Driver", estimatedPriceUSD: 8 },
        { name: "MG996R High Torque Metal Gear Servo", category: "Actuator", estimatedPriceUSD: 12 },
        { name: "2S 7.4V 2200mAh LiPo Battery Pack", category: "Power Supply", estimatedPriceUSD: 22 }
      ],
      llmSpec: "Gemini 3.5 Flash executing structured joint configurations on user natural language commands.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
      workTimeDays: 8,
      totalCost: 62,
      likes: 18,
      comments: [
        { user: "RoboJane", text: "What angle accuracy do you get on the base pivot?", time: "3 days ago" }
      ]
    },
    {
      id: "proj_3",
      title: "Self-Stabilizing Insect Hexapod",
      builder: "Hex_Slinger",
      description: "A 12-servo biomimetic spider robot. Utilizes an ESP32 for high speed servo PWM loops and an MPU6050 for real-time postural stabilization on slopes.",
      hardware: [
        { name: "ESP32-WROOM-32E (DevKitC)", category: "Microcontroller", estimatedPriceUSD: 6 },
        { name: "PCA9685 16-Channel 12-bit PWM Driver", category: "Motor Driver", estimatedPriceUSD: 8 },
        { name: "SG90 Micro Servo 9g", category: "Actuator", estimatedPriceUSD: 4 },
        { name: "MPU6050 6-Axis Accelerometer/Gyro", category: "Sensor", estimatedPriceUSD: 5 }
      ],
      llmSpec: "Local Micro-ROS gait pattern generator listening to dynamic velocity instructions.",
      image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=400",
      workTimeDays: 10,
      totalCost: 23,
      likes: 31,
      comments: [
        { user: "Sparky_T", text: "Stunning gait control. Did you use standard inverse kinematics or a pre-calculated table?", time: "4 days ago" }
      ]
    }
  ]);

  // API states
  const [sourcingLoading, setSourcingLoading] = useState(false);
  const [aiBOMResult, setAiBOMResult] = useState<unknown | null>(null);

  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<CompatibilityReport | null>(null);

  const [scriptLoading, setScriptLoading] = useState(false);
  const [selectedScriptComponent, setSelectedScriptComponent] = useState<HardwareComponent>(
    SUPPLIER_CATALOG.find((c) => c.id === "hcsr04")!
  );
  const [scriptFormat, setScriptFormat] = useState<"arduino_sketch" | "python_driver" | "bash_install" | "ros_launch">(
    "arduino_sketch"
  );
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);

  // LLM Simulator states
  const [systemPrompt, setSystemPrompt] = useState(
    "You are RoboMind, a safety-oriented autonomous explorer. Prioritize stopping before obstacles and flag findings."
  );
  const [userCommand, setUserCommand] = useState("Do a sweeping scan of the area and sound a warning if you find something close.");
  const [llmResult, setLlmResult] = useState<LLMResult | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [playingAnimation, setPlayingAnimation] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);
  const [actionProgress, setActionProgress] = useState(0);

  // Notification and helpers
  const [copiedText, setCopiedText] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const triggerNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => { setNotification(null); }, 3000);
  }, []);

  // PDF Export view setting
  const [pdfExportView, setPdfExportView] = useState<"budget" | "wiring" | "full">("budget");

  // Firebase Auth & User Firestore states
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserProfileDoc | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialAuthChecked, setInitialAuthChecked] = useState(false);

  // Glossary & Tech Help Guide state
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState("");

  // Creator Support & PayPal Link hook
  const { paypalLink, savePaypalLink } = useCreatorSupport();

  // Master Sensors & SOM Datasheet Modal state
  const [isDatasheetOpen, setIsDatasheetOpen] = useState(false);
  const [datasheetMode, setDatasheetMode] = useState<"datasheet" | "compare">("datasheet");

  // Authorized Hardware Vendors Directory Modal state
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  // GitHub Repository & CI/CD Workflow Hub state
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  // Workshop Mobile QR Code & Sync hook
  const {
    isQRModalOpen,
    setIsQRModalOpen,
    copiedQRLink,
    getWorkshopSyncUrl,
    downloadQRImage,
    copySyncLink
  } = useWorkshopSync({
    robotType,
    setRobotType,
    budget,
    setBudget,
    activeDrawer,
    setActiveDrawer,
    pdfExportView,
    onNotify: triggerNotification
  });

  // Load saved build from local browser storage on initial mount ($0 Cloud Cost)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("ai_robopet_local_project_v1") || localStorage.getItem("roboarchitect_local_project_v1");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.activeDrawer && Array.isArray(parsed.activeDrawer) && parsed.activeDrawer.length > 0) {
          setActiveDrawer(parsed.activeDrawer);
        }
        if (parsed.contingencyList && Array.isArray(parsed.contingencyList)) {
          setContingencyList(parsed.contingencyList);
        }
        if (parsed.robotType) setRobotType(parsed.robotType);
        if (parsed.customGoal) setCustomGoal(parsed.customGoal);
        if (parsed.budget) setBudget(parsed.budget);
      }
    } catch (e) {
      console.warn("Could not load from local browser storage", e);
    }
  }, []);

  // Auto-save build state to local browser storage whenever changed ($0 Cloud Cost)
  useEffect(() => {
    try {
      const payload = {
        activeDrawer,
        contingencyList,
        robotType,
        customGoal,
        budget,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem("ai_robopet_local_project_v1", JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not save to local browser storage", e);
    }
  }, [activeDrawer, contingencyList, robotType, customGoal, budget]);

  // Loop guard & throttling refs to prevent Firestore write stream exhaustion
  const isRemoteUpdateRef = useRef(false);
  const lastSyncedHashRef = useRef("");
  const syncDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Listen to optional Firebase Auth state (No mandatory popup block)
  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }

      if (user) {
        // Subscribe to real-time user document updates from Firestore if logged in
        unsubDoc = subscribeUserData(user.uid, (docData) => {
          if (docData) {
            setUserDoc(docData);
            // Flag as remote update so our local sync effect doesn't write it right back
            isRemoteUpdateRef.current = true;
            lastSyncedHashRef.current = JSON.stringify({
              selectedDrawer: docData.selectedDrawer || [],
              contingencyDrawer: docData.contingencyDrawer || [],
              robotType: docData.robotType || "",
              customGoal: docData.customGoal || "",
              budget: typeof docData.budget === "number" ? docData.budget : null
            });

            if (docData.selectedDrawer && Array.isArray(docData.selectedDrawer) && docData.selectedDrawer.length > 0) {
              setActiveDrawer(docData.selectedDrawer);
            }
            if (docData.contingencyDrawer && Array.isArray(docData.contingencyDrawer)) {
              setContingencyList(docData.contingencyDrawer);
            }
            if (docData.robotType) setRobotType(docData.robotType as any);
            if (docData.customGoal) setCustomGoal(docData.customGoal);
            if (typeof docData.budget === "number") setBudget(docData.budget);
          }
        });
      } else {
        setUserDoc(null);
        lastSyncedHashRef.current = "";
      }
      setInitialAuthChecked(true);
    });

    return () => {
      unsubscribe();
      if (unsubDoc) {
        unsubDoc();
      }
      if (syncDebounceTimerRef.current) {
        clearTimeout(syncDebounceTimerRef.current);
      }
    };
  }, []);

  // Sync hardware components and settings to Firestore ONLY IF logged in (Throttled & Loop-Guarded)
  useEffect(() => {
    if (!authUser || !initialAuthChecked) return;

    // If change was triggered by incoming Firestore snapshot, consume flag and do not write back
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    const currentHash = JSON.stringify({
      selectedDrawer: activeDrawer || [],
      contingencyDrawer: contingencyList || [],
      robotType: robotType || "",
      customGoal: customGoal || "",
      budget: typeof budget === "number" ? budget : null
    });

    // If identical to last confirmed state or snapshot, avoid redundant writes
    if (currentHash === lastSyncedHashRef.current) {
      return;
    }

    // Debounce to stay well within Firestore quotas (1 write/sec/doc limit)
    if (syncDebounceTimerRef.current) {
      clearTimeout(syncDebounceTimerRef.current);
    }

    syncDebounceTimerRef.current = setTimeout(() => {
      lastSyncedHashRef.current = currentHash;
      saveUserDataToFirestore(authUser.uid, {
        uid: authUser.uid,
        selectedDrawer: activeDrawer,
        contingencyDrawer: contingencyList,
        robotType,
        customGoal,
        budget
      }).catch((err) => {
        console.warn("Auto sync to Firestore deferred:", err);
      });
    }, 1200);

    return () => {
      if (syncDebounceTimerRef.current) {
        clearTimeout(syncDebounceTimerRef.current);
      }
    };
  }, [activeDrawer, contingencyList, robotType, customGoal, budget, authUser, initialAuthChecked]);

  // Completed Product Visual states
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const [finishedOpen, setFinishedOpen] = useState(false);
  const [assemblySubTab, setAssemblySubTab] = useState<"ai_robopet" | "growbot">("ai_robopet");

  // Shipping, Tools, and Training Cost estimations
  const [shippingTier, setShippingTier] = useState<"standard" | "express" | "economy">("standard");
  const [includeToolsEst, setIncludeToolsEst] = useState(true);
  const [includeTrainingEst, setIncludeTrainingEst] = useState(true);

  // Helper to retrieve beautiful curated category/component thumbnails (100% reliable high-contrast SVGs)
  const getComponentThumbnail = (item: any): string => {
    return generateHardwareSvg(item?.name || "", item?.category || "", item?.id || "");
  };

  // Preset Project Quick Loader
  const loadPreset = (presetName: string) => {
    const preset = PRESET_PROJECTS.find((p) => p.name === presetName);
    if (preset) {
      setRobotType(preset.type);
      setCustomGoal(preset.goal);
      setBudget(preset.budget);
      
      const mcuComp = preset.components.find(
        (c) =>
          c.category === "Microcontroller" ||
          c.category === "SBC" ||
          c.category === "SOM / Compute" ||
          c.category === "SOM / FPGA & MPSoC" ||
          c.category === "SOM / AI Accelerator" ||
          c.category === "Robot Platform"
      );
      if (mcuComp) {
        setActiveMCU(mcuComp);
      }
      setActiveDrawer(preset.components);
      setGeneratedScript(null);
      setLlmResult(null);
      setDiagnosticReport(null);
      triggerNotification(`Loaded preset: "${presetName}"`);
    }
  };

  // Add parts to drawer
  const isPrimaryControllerCategory = (cat: string) =>
    cat === "Microcontroller" ||
    cat === "SBC" ||
    cat === "SOM / Compute" ||
    cat === "SOM / FPGA & MPSoC" ||
    cat === "SOM / AI Accelerator";

  const addToDrawer = (component: HardwareComponent) => {
    // If component is a controller or SOM, replace active mcu
    if (isPrimaryControllerCategory(component.category)) {
      setActiveMCU(component);
      // Remove any other primary controllers from activeDrawer
      const filtered = activeDrawer.filter((c) => !isPrimaryControllerCategory(c.category));
      setActiveDrawer([...filtered, component]);
      triggerNotification(`Selected ${component.name} as primary controller.`);
    } else {
      if (activeDrawer.some((c) => c.id === component.id)) {
        triggerNotification(`${component.name} is already in your build.`);
        return;
      }
      setActiveDrawer([...activeDrawer, component]);
      triggerNotification(`Added ${component.name} to build drawer.`);
    }
  };

  // Remove parts from drawer
  const removeFromDrawer = (id: string) => {
    const target = activeDrawer.find((c) => c.id === id);
    if (target) {
      // Prevent deleting the primary MCU easily unless replaced
      if (target.id === activeMCU.id) {
        triggerNotification("Primary controller cannot be removed. Select another board to replace it.");
        return;
      }
      setActiveDrawer(activeDrawer.filter((c) => c.id !== id));
      triggerNotification(`Removed ${target.name} from drawer.`);
    }
  };

  // Add parts to contingency list
  const addToContingency = (component: HardwareComponent) => {
    if (contingencyList.some((c) => c.id === component.id)) {
      triggerNotification(`${component.name} is already in your contingency list.`);
      return;
    }
    setContingencyList([...contingencyList, component]);
    triggerNotification(`Saved ${component.name} as supplementary / contingency backup.`);
  };

  // Remove parts from contingency list
  const removeFromContingency = (id: string) => {
    const target = contingencyList.find((c) => c.id === id);
    setContingencyList(contingencyList.filter((c) => c.id !== id));
    if (target) {
      triggerNotification(`Removed ${target.name} from contingency list.`);
    }
  };

  // Swap / Activate contingency component into Active BOM
  const swapContingencyToActive = (component: HardwareComponent) => {
    addToDrawer(component);
  };

  // Calculation total costs
  const baseHardwareCost = activeDrawer.reduce((sum, item) => sum + item.estimatedPriceUSD, 0);
  const shippingCost = shippingTier === "express" ? 32 : shippingTier === "standard" ? 18 : 10;
  const toolsCost = includeToolsEst ? 45 : 0;
  const trainingCost = includeTrainingEst ? 25 : 0;
  const grandTotalCost = baseHardwareCost + shippingCost + toolsCost + trainingCost;
  const totalCost = baseHardwareCost; // kept for compatibility
  const budgetExceeded = grandTotalCost > budget;

  // Export current build configuration, Wiring Schema, or Project Budget to PDF
  const exportDrawerToPDF = async (exportMode: "budget" | "wiring" | "full" = pdfExportView) => {
    try {
      const filename = await exportDrawerToPDFService({
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
      triggerNotification(`Exported ${exportMode === "full" ? "Full Report" : exportMode === "wiring" ? "Wiring Schema" : "Project Budget"} PDF: "${filename}"`);
    } catch (error) {
      console.error("PDF export error:", error);
      triggerNotification("PDF generation error. Please check browser console.");
    }
  };

  // Run Sourcing API
  const runAISourcing = async () => {
    setSourcingLoading(true);
    try {
      const response = await fetch("/api/ai/sourcing-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robotType, customGoal, budget }),
      });
      if (!response.ok) throw new Error("Failed to retrieve recommendations");
      const data = await response.json();
      setAiBOMResult(data);
      triggerNotification("AI Sourcing profile successfully generated!");
    } catch (err: unknown) {
      console.error(err);
      triggerNotification("Sourcing generation failed. Using local advisor.");
    } finally {
      setSourcingLoading(false);
    }
  };

  // Import AI parts list
  const importAIBOM = () => {
    if (!aiBOMResult) return;
    
    // Convert AI parts list into HardwareComponent equivalents or format them cleanly
    const importedParts: HardwareComponent[] = ((aiBOMResult as any).partsList || []).map((p: any, idx: number) => ({
      id: `ai_${idx}_${Date.now()}`,
      name: p.name,
      category: p.category as any,
      estimatedPriceUSD: p.estimatedPriceUSD || 10,
      specs: p.specs || "AI Recommended specs",
      roleInProject: p.roleInProject || "Component",
      voltage: p.voltage || "5V",
      interface: p.interface || "General GPIO"
    }));

    // Find and select primary controller
    const mcuPart = importedParts.find((p) => p.category === "Microcontroller" || p.category === "SBC");
    if (mcuPart) {
      setActiveMCU(mcuPart);
    } else {
      // Create one if none specified in response
      const fallbackMCU: HardwareComponent = {
        id: `ai_mcu_${Date.now()}`,
        name: aiBOMResult.recommendedMicrocontroller.name || "Custom Controller",
        category: "Microcontroller",
        estimatedPriceUSD: 15,
        specs: "Generated board profile",
        roleInProject: aiBOMResult.recommendedMicrocontroller.reason || "Core logic unit",
        voltage: "5V",
        interface: "I2C, SPI, GPIO"
      };
      importedParts.push(fallbackMCU);
      setActiveMCU(fallbackMCU);
    }

    setActiveDrawer(importedParts);
    setAiBOMResult(null); // Clear recommendation panel
    setActiveTab("diagnostics"); // Switch tabs to run diagnostics
    triggerNotification("Imported Custom AI Architecture!");
  };

  // Run Compatibility Check API
  const runDiagnostics = async () => {
    setDiagnosticLoading(true);
    try {
      const response = await fetch("/api/ai/compatibility-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          microcontroller: activeMCU.name,
          components: activeDrawer.filter((c) => c.id !== activeMCU.id),
          powerSource: activeDrawer.find((c) => c.category === "Power Supply")?.name || "USB Port / Default Battery pack"
        }),
      });
      if (!response.ok) throw new Error("Diagnostics failure");
      const data = await response.json();
      setDiagnosticReport(data);
      triggerNotification("Diagnostics Report Generated!");
    } catch (err) {
      console.error(err);
      triggerNotification("Diagnostic run failed.");
    } finally {
      setDiagnosticLoading(false);
    }
  };

  // Generate Code File API
  const generateCodeFile = async () => {
    setScriptLoading(true);
    try {
      const response = await fetch("/api/ai/software-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hardwareName: selectedScriptComponent.name,
          selectedMCU: activeMCU.name,
          codeType: scriptFormat
        }),
      });
      if (!response.ok) throw new Error("Code generation failed");
      const data = await response.json();
      setGeneratedScript(data);
      triggerNotification(`Generated ${data.scriptTitle}!`);
    } catch (err) {
      console.error(err);
      triggerNotification("Failed to generate code.");
    } finally {
      setScriptLoading(false);
    }
  };

  // Generate Physics Simulation Configuration
  const handleGenerateSimulation = async () => {
    setSimGenerating(true);
    try {
      const report = await generateSimulation({
        simulator: selectedSimulator,
        robotType,
        activeComponents: activeDrawer
      });
      setSimReport(report);
      triggerNotification(
        `Simulation configuration generated for ${
          selectedSimulator === "gazebo" ? "Gazebo (URDF)" : "CoppeliaSim (Lua)"
        }!`
      );
    } catch (err) {
      console.error(err);
      triggerNotification("Failed to generate simulation configuration.");
    } finally {
      setSimGenerating(false);
    }
  };

  // Run LLM Simulation API
  const runBrainSimulation = async () => {
    setLlmLoading(true);
    setLlmResult(null);
    setCurrentActionIndex(-1);
    try {
      const response = await fetch("/api/ai/llm-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          userCommand,
          activeHardware: activeDrawer
        }),
      });
      if (!response.ok) throw new Error("Simulation failed");
      const data = await response.json();
      setLlmResult(data);
      triggerNotification("Autonomous Brain calculated action pathways!");
    } catch (err) {
      console.error(err);
      triggerNotification("Brain simulation failed.");
    } finally {
      setLlmLoading(false);
    }
  };

  // Sequential physical action simulation player
  useEffect(() => {
    if (!playingAnimation || !llmResult) return;

    let index = 0;
    setCurrentActionIndex(0);
    setActionProgress(0);

    const runNextAction = () => {
      if (index >= llmResult.actionSequence.length) {
        setPlayingAnimation(false);
        setCurrentActionIndex(-1);
        triggerNotification("Autonomous physical test sequence complete.");
        return;
      }

      const currentAction = llmResult.actionSequence[index];
      const durationMs = (currentAction.durationSeconds || 1.5) * 1000;
      const intervalMs = 50;
      let elapsed = 0;

      const progressTimer = setInterval(() => {
        elapsed += intervalMs;
        setActionProgress(Math.min((elapsed / durationMs) * 10000) / 100);

        if (elapsed >= durationMs) {
          clearInterval(progressTimer);
          index++;
          setCurrentActionIndex(index);
          setActionProgress(0);
          runNextAction();
        }
      }, intervalMs);
    };

    runNextAction();
  }, [playingAnimation, llmResult]);

  // Copy code utility
  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => { setCopiedText(false); }, 2000);
    triggerNotification("Copied to clipboard!");
  };

  const handleLikeProject = (id: string) => {
    setShowcaseProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );
    if (selectedShowcaseProject && (selectedShowcaseProject as any).id === id) {
      setSelectedShowcaseProject((prev: any) =>
        prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null
      );
    }
    triggerNotification("Favorited community build!");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShowcaseProject || !showcaseCommentInput.trim()) return;
    const author = userDoc?.displayName || userDoc?.email.split("@")[0] || "RoboMaker_Architect";
    const newComment = {
      user: author,
      text: showcaseCommentInput.trim(),
      time: "Just now"
    };
    const updated = (showcaseProjects as any[]).map((p) =>
      p.id === (selectedShowcaseProject as any).id
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p
    );
    setShowcaseProjects(updated);
    setSelectedShowcaseProject((prev: any) =>
      prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : null
    );
    setShowcaseCommentInput("");
    triggerNotification("Posted comment to builder forum.");
  };

  const importMissingParts = (missingParts: any[]) => {
    missingParts.forEach((p) => {
      const mockComp: HardwareComponent = {
        id: `sourced_showcase_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: p.name,
        category: (p.category as any) || "Sensor",
        estimatedPriceUSD: p.estimatedPriceUSD || 10,
        specs: "Sourced from Community Showcase project matching specifications.",
        roleInProject: "Imported adaptation component.",
        voltage: "5V",
        interface: "GPIO"
      };
      addToDrawer(mockComp);
    });
    triggerNotification(`Imported ${missingParts.length} missing modules into your active build!`);
  };

  // Supplier filter logic
  const filteredCatalog = SUPPLIER_CATALOG.filter((item) => {
    const searchLower = supplierSearch.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.specs.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      (item.manufacturer && item.manufacturer.toLowerCase().includes(searchLower)) ||
      (item.originCountry && item.originCountry.toLowerCase().includes(searchLower)) ||
      (item.authorizedSuppliers && item.authorizedSuppliers.some(s => s.name.toLowerCase().includes(searchLower) || s.region.toLowerCase().includes(searchLower)));
    const matchesCategory =
      selectedCategoryFilter === "All" || item.category === selectedCategoryFilter;
    const matchesNato = !natoFilterOnly || item.isNatoAligned;
    return matchesSearch && matchesCategory && matchesNato;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 flex flex-col w-full max-w-full overflow-x-hidden">
      {/* AUTHENTICATION CHOICE MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => { setIsAuthModalOpen(false); }}
        onAuthSuccess={(uid) => { triggerNotification("Successfully authenticated & synchronized!"); }}
        currentDrawer={activeDrawer}
        currentRobotType={robotType}
        currentCustomGoal={customGoal}
        currentBudget={budget}
      />

      {/* TECH HELP & GLOSSARY MODAL */}
      <TechHelpGlossary
        isOpen={isGlossaryOpen}
        onClose={() => { setIsGlossaryOpen(false); }}
        initialSearch={glossarySearch}
      />

      {/* MASTER SENSORS & SOM DATASHEET MODAL */}
      <DatasheetModal
        isOpen={isDatasheetOpen}
        onClose={() => { setIsDatasheetOpen(false); }}
        onNotify={triggerNotification}
        activeDrawer={activeDrawer}
        catalog={SUPPLIER_CATALOG}
        initialMode={datasheetMode}
        onAddToDrawer={addToDrawer}
        onRemoveFromDrawer={removeFromDrawer}
        getComponentThumbnail={getComponentThumbnail}
      />

      {/* AUTHORIZED HARDWARE VENDORS & DISTRIBUTORS DIRECTORY MODAL */}
      <VendorDirectoryModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        onSelectVendorFilter={(keyword) => {
          setCurrentPhase(2);
          triggerNotification(`Filtered catalog to ${keyword} components.`);
        }}
      />

      {/* GITHUB WORKFLOW & ROBOTICS CI/CD MODAL */}
      <GithubWorkflowModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        onNotify={triggerNotification}
      />

      {/* HEADER BAR */}
      <NavigationHeader
        paypalLink={paypalLink}
        onOpenGlossary={() => {
          setGlossarySearch("");
          setIsGlossaryOpen(true);
        }}
        onOpenVendorDirectory={() => setIsVendorModalOpen(true)}
        onOpenGithubWorkflow={() => setIsGithubModalOpen(true)}
        userDoc={userDoc}
        onOpenAuthModal={() => { setIsAuthModalOpen(true); }}
        triggerNotification={triggerNotification}
      />

      {/* 4-PHASE PROCEDURE STEPPER NAVIGATION */}
      <PhaseStepper
        currentPhase={currentPhase}
        setCurrentPhase={setCurrentPhase}
        robotType={robotType}
        activeDrawer={activeDrawer}
        grandTotalCost={grandTotalCost}
        budget={budget}
      />

      {/* WORKSPACE AREA */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-4 lg:p-6 flex flex-col gap-6 overflow-x-hidden">

        {/* ========================================================================= */}
        {/* PHASE 1: MISSION GOAL FORMULATION & TARGET BUDGET (CYAN-NAVY COLOR CODED) */}
        {/* ========================================================================= */}
        {currentPhase === 1 && (
          <div className="w-full flex flex-col gap-6">
            <div className="bg-gradient-to-b from-slate-950 via-[#071322] to-slate-950 border border-cyan-900/40 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
              {/* Decorative ambient lighting */}
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Phase Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-cyan-900/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      Phase 01 • Mission Scope &amp; Target Budget
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Step 1 of 4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                    Mission Goal Formulation &amp; Budget Planning
                  </h2>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-8">
                  <GoalBudgetSection
                    robotType={robotType}
                    setRobotType={setRobotType}
                    customGoal={customGoal}
                    setCustomGoal={setCustomGoal}
                    budget={budget}
                    setBudget={setBudget}
                    grandTotalCost={grandTotalCost}
                    baseHardwareCost={baseHardwareCost}
                    sourcingLoading={sourcingLoading}
                    runAISourcing={runAISourcing}
                    aiBOMResult={aiBOMResult}
                    setAiBOMResult={setAiBOMResult}
                    importAIBOM={importAIBOM}
                    getComponentThumbnail={getComponentThumbnail}
                    onOpenGlossary={(term) => {
                      if (term) setGlossarySearch(term);
                      setIsGlossaryOpen(true);
                    }}
                  />
                </div>

                <div className="xl:col-span-4 flex flex-col gap-4">
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                        Robotics Architecture Guidelines
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-850">
                        <strong className="text-cyan-300 font-mono text-[11px] block mb-1">⚡ Power Regulation</strong>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Always isolate logic (3.3V / 5V) from high-current actuator circuits. Use separate buck converters or flyback diodes to avoid MCU brownouts.
                        </p>
                      </div>

                      <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-850">
                        <strong className="text-cyan-300 font-mono text-[11px] block mb-1">🧠 MCU Processing Tiers</strong>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Use microcontrollers (ESP32 / Teensy) for microsecond PWM &amp; IMU loops. Pair with an SBC (Raspberry Pi) only if running SLAM or neural edge models.
                        </p>
                      </div>

                      <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-850">
                        <strong className="text-cyan-300 font-mono text-[11px] block mb-1">💰 Sizing the Buffer</strong>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Reserve roughly 15-20% of your nominal budget for hardware contingencies, connectors, shipping fees, and fastener packs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Procedure Footer */}
              <div className="pt-4 border-t border-cyan-900/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-mono text-slate-400">
                  Step 1 of 3: Mission &amp; Budget Defined
                </span>
                <button
                  onClick={() => {
                    setCurrentPhase(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Phase 2: BOM &amp; Hardware Sourcing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* PHASE 2: HARDWARE BILL OF MATERIALS & CONTINGENCY ICs (EMERALD-TEAL COLOR CODED) */}
        {/* ========================================================================================= */}
        {currentPhase === 2 && (
          <div className="w-full flex flex-col gap-6">
            <div className="bg-gradient-to-b from-slate-950 via-[#041a15] to-slate-950 border border-emerald-900/40 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
              {/* Decorative ambient lighting */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 -left-32 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Phase Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-emerald-900/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      Phase 02 • Bill of Materials &amp; Sourcing
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Step 2 of 4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                    Bill of Materials, Contingency Parts &amp; Sourcing
                  </h2>
                  <p className="text-xs text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
                    An important part of building a robot is picking all the right materials for the job, from the right places, and for the right costs. This section is to help you narrow your field of focus and create an itemized report of the product list or Build Of Materials.
                  </p>
                </div>
              </div>

              {/* Section 2 BOM and Components */}
              <BOMAndComponentsSection
                activeDrawer={activeDrawer}
                contingencyList={contingencyList}
                onAddToDrawer={addToDrawer}
                onRemoveFromDrawer={removeFromDrawer}
                onAddToContingency={addToContingency}
                onRemoveFromContingency={removeFromContingency}
                onSwapContingencyToActive={swapContingencyToActive}
                activeMCU={activeMCU}
                pdfExportView={pdfExportView}
                setPdfExportView={setPdfExportView}
                exportDrawerToPDF={exportDrawerToPDF}
                onOpenQRModal={() => { setIsQRModalOpen(true); }}
                catalog={SUPPLIER_CATALOG}
                getComponentThumbnail={getComponentThumbnail}
                onOpenGlossary={(term) => {
                  if (term) setGlossarySearch(term);
                  setIsGlossaryOpen(true);
                }}
                budget={budget}
                grandTotalCost={grandTotalCost}
                baseHardwareCost={baseHardwareCost}
                triggerNotification={triggerNotification}
                onOpenDatasheet={() => {
                  setDatasheetMode("datasheet");
                  setIsDatasheetOpen(true);
                }}
                onOpenCompare={() => {
                  setDatasheetMode("compare");
                  setIsDatasheetOpen(true);
                }}
                onOpenVendorDirectory={() => setIsVendorModalOpen(true)}
              />

              {/* Full Project Investment Running Tab */}
              <ProjectRunningTab
                budget={budget}
                grandTotalCost={grandTotalCost}
                baseHardwareCost={baseHardwareCost}
                budgetExceeded={budgetExceeded}
                activeDrawer={activeDrawer}
                shippingTier={shippingTier}
                setShippingTier={setShippingTier}
                includeToolsEst={includeToolsEst}
                setIncludeToolsEst={setIncludeToolsEst}
                includeTrainingEst={includeTrainingEst}
                setIncludeTrainingEst={setIncludeTrainingEst}
                exportDrawerToPDF={exportDrawerToPDF}
                onOpenQRModal={() => setIsQRModalOpen(true)}
                getComponentThumbnail={getComponentThumbnail}
              />

              {/* Procedure Footer */}
              <div className="pt-4 border-t border-emerald-900/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setCurrentPhase(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 font-mono text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Back to Phase 1: Mission &amp; Budget</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentPhase(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-400 hover:to-violet-400 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Phase 3: Engineering Workbench &amp; Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* PHASE 3: ENGINEERING WORKBENCH, FIRMWARE & SIMULATION (VIOLET-INDIGO COLOR CODED) */}
        {/* ========================================================================================= */}
        {currentPhase === 3 && (
          <div className="w-full flex flex-col gap-6">
            <div className="bg-gradient-to-b from-slate-950 via-[#0e0928] to-slate-950 border border-violet-900/40 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
              {/* Decorative ambient lighting */}
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Phase Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-violet-900/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-950 text-violet-400 border border-violet-800/60">
                      Phase 03 • Engineering Workbench &amp; Verification Lab
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Step 3 of 4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                    Engineering Studio, Firmware Synthesis &amp; Simulation
                  </h2>
                  <p className="text-xs text-slate-400 max-w-3xl mt-0.5">
                    Perform circuit diagnostics, generate microcontroller C++/Python &amp; ROS 2 code, sketch CAD visuals, configure LLM brain, and inspect CAD schematics.
                  </p>
                </div>
              </div>

              {/* TOP TAB NAVIGATOR */}
              <div className="bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-800 p-1.5 grid grid-cols-3 sm:grid-cols-6 gap-1 shadow-2xl sticky top-20 z-30">
                {[
                  { id: "diagnostics", label: "Diagnostics", shortLabel: "Diag", icon: AlertTriangle, color: "text-amber-400 bg-amber-950/30 border-amber-900/40" },
                  { id: "code", label: "Software & Drivers", shortLabel: "Code", icon: FileCode, color: "text-cyan-400 bg-cyan-950/30 border-cyan-900/40" },
                  { id: "concept", label: "Concept & Sketch", shortLabel: "Vision", icon: Sparkles, color: "text-pink-400 bg-pink-950/30 border-pink-900/40" },
                  { id: "brain", label: "LLM Brain & Neural AI", shortLabel: "Brain & AI", icon: Brain, color: "text-violet-400 bg-violet-950/30 border-violet-900/40" },
                  { id: "assembly", label: "Assembly", shortLabel: "Build", icon: Wrench, color: "text-emerald-400 bg-emerald-950/30 border-emerald-900/40" },
                  { id: "simulation", label: "Simulation", shortLabel: "Sim", icon: MonitorPlay, color: "text-sky-400 bg-sky-950/30 border-sky-900/40" }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as unknown);
                        if (tab.id === "code") {
                          const target = activeDrawer.find((c) => c.category !== "Microcontroller" && c.category !== "SBC") || SUPPLIER_CATALOG[5];
                          setSelectedScriptComponent(target);
                        }
                      }}
                      className={`w-full py-2.5 px-1 sm:px-2 rounded border flex flex-col items-center justify-center gap-1 sm:gap-1.5 transition-all font-mono text-[10px] sm:text-[11px] cursor-pointer ${
                        isActive
                          ? `text-white ${tab.color.split(" ")[1]} border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-bold`
                          : "bg-transparent border-transparent text-slate-400 hover:text-white hover:border-slate-800"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? tab.color.split(" ")[0] : "text-slate-500"}`} />
                      <span className="leading-none text-center hidden md:inline truncate">{tab.label}</span>
                      <span className="leading-none text-center md:hidden truncate">{tab.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB WORKBENCH AREA */}
              <div className="flex flex-col gap-6">

          {/* TAB CONTENT: COMPATIBILITY CHECKER */}
          {activeTab === "diagnostics" && (
            <DiagnosticsTab
              activeMCU={activeMCU}
              activeDrawer={activeDrawer}
              onAddToDrawer={addToDrawer}
              catalog={SUPPLIER_CATALOG}
              diagnosticLoading={diagnosticLoading}
              diagnosticReport={diagnosticReport}
              onRunDiagnostics={runDiagnostics}
            />
          )}

          {/* TAB CONTENT: SOFTWARE STACK & DRIVERS */}
          {activeTab === "code" && (
            <CodeGeneratorTab
              activeDrawer={activeDrawer}
              activeMCU={activeMCU}
              selectedScriptComponent={selectedScriptComponent}
              setSelectedScriptComponent={setSelectedScriptComponent}
              scriptFormat={scriptFormat}
              setScriptFormat={setScriptFormat}
              scriptLoading={scriptLoading}
              generatedScript={generatedScript}
              onGenerateCode={generateCodeFile}
              onCopy={handleCopy}
              copiedText={copiedText}
            />
          )}

          {/* TAB CONTENT: ROBOT CONCEPT STUDIO & SKETCHBOOK GENERATOR (Moved to hidden) */}
          <div className="hidden">
            <ConceptAndSketchStudio
              robotType={robotType}
              customGoal={customGoal}
              budget={budget}
              activeDrawer={activeDrawer.map(d => ({
                id: d.id,
                name: d.name,
                category: d.category,
                specs: d.specs
              }))}
              onImageGenerated={setLatestConceptImage}
            />
          </div>

          {/* TAB CONTENT: LLM INTEGRATION INTERFACE */}
          {activeTab === "brain" && (
            <LLMBrainTab
              systemPrompt={systemPrompt}
              setSystemPrompt={setSystemPrompt}
              userCommand={userCommand}
              setUserCommand={setUserCommand}
              llmLoading={llmLoading}
              playingAnimation={playingAnimation}
              llmResult={llmResult}
              currentActionIndex={currentActionIndex}
              actionProgress={actionProgress}
              onRunBrainSimulation={runBrainSimulation}
              onStartAnimation={() => { setPlayingAnimation(true); }}
              activeRobotType={robotType}
              activeMCU={activeMCU}
            />
          )}

          {/* TAB CONTENT: INTERACTIVE ASSEMBLY ROADMAP & GROWBOT COMPANION GUIDE */}
          {activeTab === "assembly" && (
            <AssemblyGuideTab
              assemblySubTab={assemblySubTab}
              setAssemblySubTab={setAssemblySubTab}
              activeMCU={activeMCU}
              activeDrawer={activeDrawer}
              setCurrentPhase={setCurrentPhase}
            />
          )}

          {/* TAB CONTENT: PHYSICS SIMULATION LAB */}
          {activeTab === "simulation" && (
            <PhysicsSimulationTab
              selectedSimulator={selectedSimulator}
              setSelectedSimulator={setSelectedSimulator}
              setSimReport={setSimReport}
              handleGenerateSimulation={handleGenerateSimulation}
              simGenerating={simGenerating}
              activeDrawer={activeDrawer}
              simReport={simReport}
              triggerNotification={triggerNotification}
            />
          )}


        </div>

        {/* COMPLETED PRODUCT SPECIFICATIONS & PHYSICAL REFERENCES SECTION */}
        <CompletedProductSpecs
          robotType={robotType}
          blueprintOpen={blueprintOpen}
          setBlueprintOpen={setBlueprintOpen}
          finishedOpen={finishedOpen}
          setFinishedOpen={setFinishedOpen}
          onBackToPhase2={() => {
            setCurrentPhase(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRunDiagnostics={runDiagnostics}
          diagnosticLoading={diagnosticLoading}
          onExportPDF={() => exportDrawerToPDF("full")}
          onProceedToPhase4={() => {
            setCurrentPhase(4);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* AT THE BOTTOM OF THE PAGE / END OF PHASE THREE: MISSION ACCOMPLISHMENT VIDEO MOCK-UP */}
        <RobotMissionVideoMockup
          robotType={robotType}
          customGoal={customGoal}
          budget={budget}
          activeDrawer={activeDrawer.map(d => ({
            id: d.id,
            name: d.name,
            category: d.category,
            specs: d.specs
          }))}
          conceptImage={latestConceptImage}
        />
      </div>
    </div>
  )}

  {/* ========================================================================================= */}
  {/* PHASE 4: COMMUNITY COMMONS & SHARED HUB (SEPARATE FROM PHASE 3) */}
  {/* ========================================================================================= */}
  {currentPhase === 4 && (
    <CommunityCommons
      activeDrawer={activeDrawer}
      addToDrawer={addToDrawer}
      triggerNotification={triggerNotification}
      onNavigatePhase={(phase) => {
        setCurrentPhase(phase);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  )}

</main>

      {/* WORKSHOP MOBILE QR CODE & PDF SYNC MODAL */}
      <WorkshopQRModal
        isOpen={isQRModalOpen}
        onClose={() => { setIsQRModalOpen(false); }}
        syncUrl={getWorkshopSyncUrl()}
        copySyncLink={copySyncLink}
        copiedQRLink={copiedQRLink}
        downloadQRImage={downloadQRImage}
        onExportPDF={() => exportDrawerToPDF(pdfExportView)}
        activeDrawer={activeDrawer}
        robotType={robotType}
      />

      {/* FOOTER NOTIFICATION AREA */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-950 border border-cyan-500/40 text-white font-mono text-xs font-semibold px-4 py-3 rounded shadow-[0_4px_25px_rgba(6,182,212,0.3)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATOR SUPPORT & PAYPAL QR CODE SECTION AT THE BOTTOM */}
      <CreatorSupportSection
        paypalLink={paypalLink}
        onSavePaypalLink={savePaypalLink}
        triggerNotification={triggerNotification}
      />

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <p>AI RoboPet • Engineered on a Full-Stack Express + React Sandbox</p>
      </footer>
    </div>
  );
}
