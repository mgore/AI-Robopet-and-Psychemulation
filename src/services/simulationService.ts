import { HardwareComponent } from "../types";

export interface SimulationReport {
  workspaceSetup: string;
  urdfCode?: string;
  luaScript?: string;
  instructions: string;
}

export interface GenerateSimulationParams {
  simulator: "gazebo" | "coppelia" | "coppeliasim";
  robotType: string;
  activeComponents?: HardwareComponent[];
  activeDrawer?: HardwareComponent[];
  activeMCU?: HardwareComponent;
}

/**
 * Generates Gazebo URDF or CoppeliaSim Lua workspace scripts
 * based on active MCU, chassis architecture, and connected sensors.
 */
export function generateSimulationSetup(
  activeMCUOrParams: HardwareComponent | GenerateSimulationParams,
  argActiveDrawer?: HardwareComponent[],
  argRobotType?: string,
  argSimulator?: "gazebo" | "coppelia" | "coppeliasim"
): SimulationReport {
  let activeMCU: HardwareComponent | undefined;
  let activeDrawer: HardwareComponent[];
  let robotType: string;
  let simulator: "gazebo" | "coppelia" | "coppeliasim";

  if ("simulator" in activeMCUOrParams) {
    simulator = activeMCUOrParams.simulator;
    robotType = activeMCUOrParams.robotType;
    activeDrawer = activeMCUOrParams.activeComponents || activeMCUOrParams.activeDrawer || [];
    activeMCU = activeMCUOrParams.activeMCU || activeDrawer.find((c) => c.category === "Microcontroller");
  } else {
    activeMCU = activeMCUOrParams;
    activeDrawer = argActiveDrawer || [];
    robotType = argRobotType || "wheeled_rover";
    simulator = argSimulator || "gazebo";
  }

  const activePartsList = activeDrawer.map((p) => p.name).join(", ");
  const isRover = robotType === "wheeled_rover";
  const isArm = robotType === "robotic_arm";

  if (simulator === "gazebo") {
    const urdfCode = `<?xml version="1.0"?>
<robot name="ai_robopet_${robotType}">
  <!-- Base Chassis Geometry for ${robotType} -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.25 0.18 0.08"/>
      </geometry>
      <material name="chassis_mat">
        <color rgba="0.1 0.1 0.15 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.25 0.18 0.08"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.5"/>
      <inertia ixx="0.005" ixy="0" ixz="0" iyy="0.009" iyz="0" izz="0.012"/>
    </inertial>
  </link>

  <!-- Simulated Microcontroller Node: ${activeMCU.name} -->
  <link name="mcu_board">
    <visual>
      <geometry>
        <box size="0.08 0.05 0.015"/>
      </geometry>
      <material name="cyan">
        <color rgba="0.02 0.7 0.8 1.0"/>
      </material>
    </visual>
  </link>

  <joint name="mcu_joint" type="fixed">
    <parent link="base_link"/>
    <child link="mcu_board"/>
    <origin xyz="0 0 0.0475" rpy="0 0 0"/>
  </joint>
  
  <!-- Configured hardware modules: ${activePartsList} -->
  <!-- Gazebo ROS Control Plugins -->
  <gazebo>
    <plugin name="gazebo_ros_control" filename="libgazebo_ros_control.so">
      <robotNamespace>/custom_${robotType}</robotNamespace>
    </plugin>
  </gazebo>
</robot>`;

    const instructions = `1. Setup a clean ROS 2 workspace:
   $ mkdir -p ~/robo_ws/src && cd ~/robo_ws/src
2. Create 'robo_description' directory and save the URDF XML above inside 'urdf/robot.urdf'.
3. Build the workspace using colcon:
   $ cd ~/robo_ws && colcon build --symlink-install
4. Launch the physics simulator with ROS Gazebo bridge:
   $ ros2 launch gazebo_ros gazebo.launch.py
5. Spawn your newly created AI RoboPet model in Gazebo:
   $ ros2 run gazebo_ros spawn_entity.py -entity my_robot -file ~/robo_ws/src/robo_description/urdf/robot.urdf`;

    return {
      workspaceSetup: `# ROS 2 Humble / Iron Gazebo Simulation Environment Setup
# Platform Architecture: ${robotType.toUpperCase()}
# Primary Compute Unit: ${activeMCU.name}
source /opt/ros/humble/setup.bash
export GAZEBO_MODEL_PATH=$GAZEBO_MODEL_PATH:~/robo_ws/src
echo "[OK] Gazebo ROS 2 workspace initialized."`,
      urdfCode,
      instructions
    };
  } else {
    const workspaceSetup = `-- CoppeliaSim Child Python/Lua Integration Script for ${activeMCU.name}
-- Attach this child script to the Base Object of the robot scene

sim = require('sim')

function sysCall_init()
    -- Initialize joint handles and motors for ${robotType}
    jointHandles = {}
    jointHandles[1] = sim.getObject('./LeftWheelMotor')
    jointHandles[2] = sim.getObject('./RightWheelMotor')
    
    -- Setup sockets for Autonomous LLM Brain telemetry communication
    serverPort = 12005
    sim.addLog(sim.verbosity_scriptinfos, "AI RoboPet server starting on port " .. serverPort)
    
    -- Telemetry mapping for: ${activePartsList}
    sensorHandle = sim.getObject('./UltrasonicSensor')
end`;

    const luaScript = `function sysCall_actuation()
    -- Sample reading from distance sensor
    local result, dist = sim.readProximitySensor(sensorHandle)
    local obstacleDetected = (result > 0 and dist < 0.3)
    
    if obstacleDetected then
        -- Stop motors to avoid collision (Simulated safety buffer)
        sim.setJointTargetVelocity(jointHandles[1], 0)
        sim.setJointTargetVelocity(jointHandles[2], 0)
    else
        -- Drive forward with baseline simulated logic
        sim.setJointTargetVelocity(jointHandles[1], 2.0)
        sim.setJointTargetVelocity(jointHandles[2], 2.0)
    end
end

function sysCall_cleanup()
    -- Close open sockets and power off components safely
end`;

    const instructions = `1. Boot CoppeliaSim (formerly V-REP) version 4.6+.
2. Create a primitive shape matching your active ${robotType} chassis dimensions (0.25m x 0.18m x 0.08m).
3. Right click the Shape -> Add -> Associated Child Script -> Non-threaded (Lua or Python).
4. Paste the generated CoppeliaSim script above inside the editor.
5. Create joint objects, name them 'LeftWheelMotor' / 'RightWheelMotor', and align them physically.
6. Press the 'Play' button in CoppeliaSim to execute the physics engine with real gravity and obstacle collision detectors.`;

    return {
      workspaceSetup,
      luaScript,
      instructions
    };
  }
}

export const generateSimulation = generateSimulationSetup;
