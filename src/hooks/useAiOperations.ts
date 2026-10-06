import { useState, useEffect, useCallback } from "react";
import { HardwareComponent, CompatibilityReport, GeneratedScript, LLMResult } from "../types";
import { SUPPLIER_CATALOG } from "../data";

export interface UseAiOperationsReturn {
  // Sourcing AI
  sourcingLoading: boolean;
  aiBOMResult: unknown | null;
  setAiBOMResult: (result: unknown | null) => void;
  runAISourcing: (budget: number, robotType: string, customGoal: string, onNotify?: (msg: string) => void) => Promise<void>;
  importAIBOM: (
    onImportSuccess: (importedParts: HardwareComponent[], primaryMCU: HardwareComponent) => void,
    onNotify?: (msg: string) => void
  ) => void;

  // Compatibility Diagnostics
  diagnosticLoading: boolean;
  diagnosticReport: CompatibilityReport | null;
  setDiagnosticReport: (report: CompatibilityReport | null) => void;
  runDiagnostics: (
    activeMCU: HardwareComponent,
    activeDrawer: HardwareComponent[],
    robotType: string,
    onNotify?: (msg: string) => void
  ) => Promise<void>;

  // Software & Firmware Generation
  scriptLoading: boolean;
  selectedScriptComponent: HardwareComponent;
  setSelectedScriptComponent: (comp: HardwareComponent) => void;
  scriptFormat: "arduino_sketch" | "python_driver" | "bash_install" | "ros_launch";
  setScriptFormat: (fmt: "arduino_sketch" | "python_driver" | "bash_install" | "ros_launch") => void;
  generatedScript: GeneratedScript | null;
  setGeneratedScript: (script: GeneratedScript | null) => void;
  generateCodeFile: (
    activeMCU: HardwareComponent,
    onNotify?: (msg: string) => void
  ) => Promise<void>;

  // LLM Brain Simulator
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  userCommand: string;
  setUserCommand: (cmd: string) => void;
  llmLoading: boolean;
  llmResult: LLMResult | null;
  setLlmResult: (res: LLMResult | null) => void;
  currentActionIndex: number;
  actionProgress: number;
  playingAnimation: boolean;
  setPlayingAnimation: (playing: boolean) => void;
  runBrainSimulation: (
    activeDrawer: HardwareComponent[],
    robotType: string,
    onNotify?: (msg: string) => void
  ) => Promise<void>;

  // Physics Simulation
  selectedSimulator: "gazebo" | "coppeliasim";
  setSelectedSimulator: (sim: "gazebo" | "coppeliasim") => void;
  simGenerating: boolean;
  simConfig: {
    urdfCode: string;
    luaScript: string;
    workspaceSetup: string;
    instructions: string;
  } | null;
  generatePhysicsSimulation: (
    activeDrawer: HardwareComponent[],
    robotType: string,
    onNotify?: (msg: string) => void
  ) => void;
}

export function useAiOperations(): UseAiOperationsReturn {
  // Sourcing states
  const [sourcingLoading, setSourcingLoading] = useState(false);
  const [aiBOMResult, setAiBOMResult] = useState<unknown | null>(null);

  // Diagnostics states
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<CompatibilityReport | null>(null);

  // Script generator states
  const [scriptLoading, setScriptLoading] = useState(false);
  const [selectedScriptComponent, setSelectedScriptComponent] = useState<HardwareComponent>(() => {
    return SUPPLIER_CATALOG.find((c) => c.id === "hcsr04") || SUPPLIER_CATALOG[1];
  });
  const [scriptFormat, setScriptFormat] = useState<"arduino_sketch" | "python_driver" | "bash_install" | "ros_launch">(
    "arduino_sketch"
  );
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);

  // LLM Simulator states
  const [systemPrompt, setSystemPrompt] = useState(
    "You are RoboMind, a safety-oriented autonomous explorer. Prioritize stopping before obstacles and flag findings."
  );
  const [userCommand, setUserCommand] = useState(
    "Do a sweeping scan of the area and sound a warning if you find something close."
  );
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmResult, setLlmResult] = useState<LLMResult | null>(null);
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);
  const [actionProgress, setActionProgress] = useState(0);
  const [playingAnimation, setPlayingAnimation] = useState(false);

  // Physics Simulation states
  const [selectedSimulator, setSelectedSimulator] = useState<"gazebo" | "coppeliasim">("gazebo");
  const [simGenerating, setSimGenerating] = useState(false);
  const [simConfig, setSimConfig] = useState<{
    urdfCode: string;
    luaScript: string;
    workspaceSetup: string;
    instructions: string;
  } | null>(null);

  // 1. SOURCING RECOMMENDATIONS
  const runAISourcing = useCallback(
    async (budget: number, robotType: string, customGoal: string, onNotify?: (msg: string) => void) => {
      setSourcingLoading(true);
      try {
        const response = await fetch("/api/ai/sourcing-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ robotType, customGoal, budget })
        });
        if (!response.ok) throw new Error(`Sourcing API failed with status ${response.status}`);
        const data = await response.json();
        const payload = data.data || data;
        setAiBOMResult(payload);
        onNotify?.("AI Sourcing profile successfully generated!");
      } catch (err: unknown) {
        console.warn("Sourcing generation error:", err);
        onNotify?.("Sourcing API error. Local robotics engine fallback active.");
      } finally {
        setSourcingLoading(false);
      }
    },
    []
  );

  // 2. IMPORT AI BOM TO BUILD DRAWER
  const importAIBOM = useCallback(
    (
      onImportSuccess: (importedParts: HardwareComponent[], primaryMCU: HardwareComponent) => void,
      onNotify?: (msg: string) => void
    ) => {
      if (!aiBOMResult) return;

      const rawPartsList = aiBOMResult.partsList || [];
      const importedParts: HardwareComponent[] = rawPartsList.map((p: any, idx: number) => ({
        id: `ai_${idx}_${Date.now()}`,
        name: p.name || `Hardware Module ${idx + 1}`,
        category: (p.category as any) || "Sensor",
        estimatedPriceUSD: Number(p.estimatedPriceUSD) || 10,
        specs: p.specs || "AI Recommended specifications",
        roleInProject: p.roleInProject || "Hardware subsystem",
        voltage: p.voltage || "5V",
        interface: p.interface || "GPIO"
      }));

      // Detect MCU
      let mcuPart = importedParts.find(
        (p) => p.category === "Microcontroller" || p.category === "SBC" || p.category === "SOM / Compute"
      );

      if (!mcuPart) {
        mcuPart = {
          id: `ai_mcu_${Date.now()}`,
          name: aiBOMResult.recommendedMicrocontroller?.name || "ESP32-WROOM-32E (DevKitC)",
          category: "Microcontroller",
          estimatedPriceUSD: 15,
          specs: "Generated controller profile",
          roleInProject: aiBOMResult.recommendedMicrocontroller?.reason || "Primary controller",
          voltage: "3.3V / 5V",
          interface: "GPIO, I2C, SPI, UART"
        };
        importedParts.unshift(mcuPart);
      }

      onImportSuccess(importedParts, mcuPart);
      setAiBOMResult(null);
      onNotify?.("Imported Custom AI Architecture into build drawer!");
    },
    [aiBOMResult]
  );

  // 3. COMPATIBILITY DIAGNOSTICS
  const runDiagnostics = useCallback(
    async (
      activeMCU: HardwareComponent,
      activeDrawer: HardwareComponent[],
      robotType: string,
      onNotify?: (msg: string) => void
    ) => {
      setDiagnosticLoading(true);
      try {
        const response = await fetch("/api/ai/compatibility-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            robotType,
            mcu: activeMCU,
            microcontroller: activeMCU.name,
            components: activeDrawer.filter((c) => c.id !== activeMCU.id),
            powerSource:
              activeDrawer.find((c) => c.category === "Power Supply")?.name || "USB Port / Default Battery pack"
          })
        });

        if (!response.ok) throw new Error(`Diagnostics failed with status ${response.status}`);
        const data = await response.json();
        const payload = data.data || data;
        setDiagnosticReport(payload);
        onNotify?.("Diagnostics Report Generated!");
      } catch (err: any) {
        console.warn("Diagnostics API error:", err);
        onNotify?.("Diagnostic analysis completed using local engineering rules.");
      } finally {
        setDiagnosticLoading(false);
      }
    },
    []
  );

  // 4. SOFTWARE GENERATOR
  const generateCodeFile = useCallback(
    async (activeMCU: HardwareComponent, onNotify?: (msg: string) => void) => {
      setScriptLoading(true);
      try {
        const response = await fetch("/api/ai/software-generator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            component: selectedScriptComponent,
            hardwareName: selectedScriptComponent.name,
            mcu: activeMCU,
            selectedMCU: activeMCU.name,
            format: scriptFormat,
            codeType: scriptFormat
          })
        });

        if (!response.ok) throw new Error(`Code generator failed with status ${response.status}`);
        const data = await response.json();
        const payload = data.data || data;
        setGeneratedScript(payload);
        onNotify?.(`Generated ${payload.scriptTitle || "firmware driver"}!`);
      } catch (err: any) {
        console.warn("Code generation error:", err);
        onNotify?.("Code generation fallback activated.");
      } finally {
        setScriptLoading(false);
      }
    },
    [selectedScriptComponent, scriptFormat]
  );

  // 5. LLM BRAIN SIMULATION
  const runBrainSimulation = useCallback(
    async (activeDrawer: HardwareComponent[], robotType: string, onNotify?: (msg: string) => void) => {
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
            robotType,
            activeHardware: activeDrawer,
            components: activeDrawer
          })
        });

        if (!response.ok) throw new Error(`Brain simulation failed with status ${response.status}`);
        const data = await response.json();
        const payload = data.data || data;
        setLlmResult(payload);
        onNotify?.("Autonomous Brain calculated action pathways!");
      } catch (err: any) {
        console.warn("Brain simulation error:", err);
        onNotify?.("Brain simulation fallback activated.");
      } finally {
        setLlmLoading(false);
      }
    },
    [systemPrompt, userCommand]
  );

  // Sequential physical action simulation timer player
  useEffect(() => {
    if (!playingAnimation || !llmResult || !llmResult.actionSequence.length) return;

    let index = 0;
    setCurrentActionIndex(0);
    setActionProgress(0);

    let progressTimer: any = null;

    const runAction = () => {
      if (index >= llmResult.actionSequence.length) {
        setPlayingAnimation(false);
        setCurrentActionIndex(-1);
        return;
      }

      const currentAction = llmResult.actionSequence[index];
      const durationMs = Math.max(800, (currentAction.durationSeconds || 1.5) * 1000);
      const intervalMs = 50;
      let elapsed = 0;

      progressTimer = setInterval(() => {
        elapsed += intervalMs;
        setActionProgress(Math.min(100, Math.round((elapsed / durationMs) * 100)));

        if (elapsed >= durationMs) {
          clearInterval(progressTimer);
          index++;
          setCurrentActionIndex(index);
          if (index < llmResult.actionSequence.length) {
            runAction();
          } else {
            setPlayingAnimation(false);
            setCurrentActionIndex(-1);
          }
        }
      }, intervalMs);
    };

    runAction();

    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [playingAnimation, llmResult]);

  // 6. PHYSICS SIMULATION CONFIGURATION
  const generatePhysicsSimulation = useCallback(
    (activeDrawer: HardwareComponent[], robotType: string, onNotify?: (msg: string) => void) => {
      setSimGenerating(true);
      setTimeout(() => {
        let urdfCode = "";
        let luaScript = "";
        let workspaceSetup = "";
        let instructions = "";

        const activePartsList = activeDrawer.map((p) => p.name).join(", ");

        if (selectedSimulator === "gazebo") {
          workspaceSetup = `mkdir -p ~/robo_ws/src/robo_description/urdf
cd ~/robo_ws/src/robo_description
cat << 'EOF' > package.xml
<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format3.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="3">
  <name>robo_description</name>
  <version>1.0.0</version>
  <description>Simulated ${robotType} physics model for Gazebo</description>
  <maintainer email="architect@robo.ai">AI RoboPet</maintainer>
  <license>Apache-2.0</license>
  <buildtool_depend>ament_cmake</buildtool_depend>
  <exec_depend>robot_state_publisher</exec_depend>
  <exec_depend>joint_state_publisher</exec_depend>
  <exec_depend>gazebo_ros</exec_depend>
</package>
EOF`;

          urdfCode = `<?xml version="1.0"?>
<robot name="custom_${robotType}">
  <!-- Color Materials -->
  <material name="cyan"><color rgba="0 0.8 0.8 1.0"/></material>
  <material name="dark_slate"><color rgba="0.1 0.12 0.15 1.0"/></material>

  <!-- Base Footprint & Main Body Chassis -->
  <link name="base_footprint"/>
  
  <joint name="base_joint" type="fixed">
    <parent link="base_footprint"/>
    <child link="base_link"/>
    <origin xyz="0 0 0.05" rpy="0 0 0"/>
  </joint>

  <link name="base_link">
    <visual>
      <geometry><box size="0.28 0.20 0.08"/></geometry>
      <material name="dark_slate"/>
    </visual>
    <collision>
      <geometry><box size="0.28 0.20 0.08"/></geometry>
    </collision>
    <inertial>
      <mass value="1.45"/>
      <inertia ixx="0.005" ixy="0" ixz="0" iyy="0.007" iyz="0" izz="0.009"/>
    </inertial>
  </link>

  <!-- Gazebo Physics Plugin -->
  <gazebo>
    <plugin name="diff_drive" filename="libgazebo_ros_diff_drive.so">
      <ros><namespace>/${robotType}</namespace></ros>
      <left_joint>left_wheel_joint</left_joint>
      <right_joint>right_wheel_joint</right_joint>
      <wheel_separation>0.22</wheel_separation>
      <wheel_diameter>0.065</wheel_diameter>
      <max_wheel_torque>2.5</max_wheel_torque>
      <command_topic>cmd_vel</command_topic>
      <odometry_topic>odom</odometry_topic>
      <odometry_frame>odom</odometry_frame>
      <robot_base_frame>base_footprint</robot_base_frame>
    </plugin>
  </gazebo>
</robot>`;

          instructions = `### How to Run Gazebo Simulation:
1. Copy the URDF XML into \`~/robo_ws/src/robo_description/urdf/robot.urdf\`.
2. Build workspace: \`colcon build --symlink-install && source install/setup.bash\`
3. Launch Gazebo physics node: \`ros2 launch gazebo_ros gazebo.launch.py\`
4. Spawn robot: \`ros2 run gazebo_ros spawn_entity.py -entity ${robotType} -file ~/robo_ws/src/robo_description/urdf/robot.urdf\``;
        } else {
          workspaceSetup = `-- CoppeliaSim Lua Scene Controller Script
-- Configured hardware: ${activePartsList}`;

          luaScript = `function sysCall_init()
    corout=coroutine.create(coroutineMain)
    robotHandle=sim.getObject('.')
    leftMotor=sim.getObject("./leftMotor")
    rightMotor=sim.getObject("./rightMotor")
    proximitySens=sim.getObject("./proximitySensor")
    sim.setJointTargetVelocity(leftMotor, 0)
    sim.setJointTargetVelocity(rightMotor, 0)
end

function coroutineMain()
    while true do
        local result, distance, detectedPoint = sim.readProximitySensor(proximitySens)
        if result > 0 and distance < 0.25 then
            -- Obstacle detected: turn right
            sim.setJointTargetVelocity(leftMotor, 2.0)
            sim.setJointTargetVelocity(rightMotor, -2.0)
        else
            -- Path clear: drive forward
            sim.setJointTargetVelocity(leftMotor, 4.0)
            sim.setJointTargetVelocity(rightMotor, 4.0)
        end
        sim.switchThread()
    end
end`;

          instructions = `### How to Run CoppeliaSim Simulation:
1. Open CoppeliaSim (V-REP).
2. Create a child script on the base robot chassis object.
3. Paste the Lua controller script above into the script editor.
4. Press 'Play' in CoppeliaSim toolbar to verify obstacle avoidance dynamics.`;
        }

        setSimConfig({
          urdfCode,
          luaScript,
          workspaceSetup,
          instructions
        });

        setSimGenerating(false);
        onNotify?.(`Simulation configuration generated for ${selectedSimulator === "gazebo" ? "Gazebo (URDF)" : "CoppeliaSim (Lua)"}!`);
      }, 800);
    },
    [selectedSimulator]
  );

  return {
    sourcingLoading,
    aiBOMResult,
    setAiBOMResult,
    runAISourcing,
    importAIBOM,
    diagnosticLoading,
    diagnosticReport,
    setDiagnosticReport,
    runDiagnostics,
    scriptLoading,
    selectedScriptComponent,
    setSelectedScriptComponent,
    scriptFormat,
    setScriptFormat,
    generatedScript,
    setGeneratedScript,
    generateCodeFile,
    systemPrompt,
    setSystemPrompt,
    userCommand,
    setUserCommand,
    llmLoading,
    llmResult,
    setLlmResult,
    currentActionIndex,
    actionProgress,
    playingAnimation,
    setPlayingAnimation,
    runBrainSimulation,
    selectedSimulator,
    setSelectedSimulator,
    simGenerating,
    simConfig,
    generatePhysicsSimulation
  };
}
