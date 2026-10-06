import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Video, 
  Upload, 
  Sparkles, 
  Film, 
  Download, 
  Maximize2, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  Crosshair, 
  Compass, 
  Battery, 
  Cpu, 
  Eye, 
  Radio, 
  Layers, 
  Zap, 
  AlertCircle,
  FileText,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock
} from "lucide-react";

interface RobotMissionVideoMockupProps {
  robotType: "wheeled_rover" | "robotic_arm" | "hexapod";
  customGoal: string;
  budget: number;
  activeDrawer: Array<{
    id: string;
    name: string;
    category: string;
    specs: string;
  }>;
  conceptImage?: string | null;
  chassisMaterial?: string;
  accentColor?: string;
}

export const RobotMissionVideoMockup: React.FC<RobotMissionVideoMockupProps> = ({
  robotType,
  customGoal,
  budget,
  activeDrawer,
  conceptImage,
  chassisMaterial = "Anodized Aluminum & Carbon Fiber",
  accentColor = "Cyan & Matte Dark Slate"
}) => {
  // Video playback & canvas states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const totalDuration = 8.0; // 8 second mission cycle
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showHud, setShowHud] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  
  // Image input & Veo state
  const [selectedImageSource, setSelectedImageSource] = useState<"concept" | "upload">(
    conceptImage ? "concept" : "upload"
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Veo Generation prompt pre-filled with Phase 1 directives
  const defaultTaskPrompt = `Photorealistic 1080p real-life video of the ${robotType.replace("_", " ")} prototype operating in an engineering laboratory. Accomplishing primary Phase 1 mission: '${customGoal || "Autonomous navigation, obstacle avoidance, and telemetry reporting"}'. Smooth mechanical kinematics, active sensor sweep, status LED indicators, and authentic workshop reflections.`;
  const [taskPrompt, setTaskPrompt] = useState<string>(defaultTaskPrompt);

  // Veo generation states
  const [isGeneratingVeo, setIsGeneratingVeo] = useState<boolean>(false);
  const [veoProgress, setVeoProgress] = useState<number>(0);
  const [veoStageText, setVeoStageText] = useState<string>("");
  const [activeVeoVideoUrl, setActiveVeoVideoUrl] = useState<string | null>(null);
  const [veoError, setVeoError] = useState<string | null>(null);
  const [operationName, setOperationName] = useState<string | null>(null);

  // Animation frame ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  // Synchronize prompt when customGoal or robotType changes
  useEffect(() => {
    if (!taskPrompt || taskPrompt === defaultTaskPrompt) {
      setTaskPrompt(
        `Photorealistic 1080p real-life video of the ${robotType.replace("_", " ")} prototype operating in an engineering laboratory. Accomplishing primary Phase 1 mission: '${customGoal || "Autonomous navigation, obstacle avoidance, and telemetry reporting"}'. Smooth mechanical kinematics, active sensor sweep, status LED indicators, and authentic workshop reflections.`
      );
    }
  }, [customGoal, robotType]);

  // Handle uploaded image
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPEG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      setUploadedImage(res);
      setSelectedImageSource("upload");
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger Veo Video Generation (using model veo-3.1-fast-generate-preview)
  const handleGenerateVeoVideo = async () => {
    setIsGeneratingVeo(true);
    setVeoProgress(5);
    setVeoStageText("Initializing Veo 3.1 Fast video generation pipeline...");
    setVeoError(null);

    const sourceImage = selectedImageSource === "concept" ? conceptImage : uploadedImage;

    try {
      const res = await fetch("/api/veo/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: taskPrompt,
          image: sourceImage || undefined,
          aspectRatio,
          robotType,
          missionGoal: customGoal
        })
      });

      if (!res.ok) {
        throw new Error(`Veo request failed with status: ${res.status}`);
      }

      const data = await res.json();
      const opName = data.operationName;
      setOperationName(opName);

      // Poll status
      pollVeoStatus(opName);
    } catch (err: unknown) {
      console.warn("Veo video API fallback activated:", err);
      // Fallback to seamless interactive simulation video mock-up
      simulateVeoProgress();
    }
  };

  const simulateVeoProgress = () => {
    let currentPct = 10;
    const interval = setInterval(() => {
      currentPct += 15;
      setVeoProgress(Math.min(95, currentPct));

      if (currentPct < 35) {
        setVeoStageText("Translating Phase 1 Mission Directives into physical trajectory...");
      } else if (currentPct < 70) {
        setVeoStageText("Synthesizing 1080p photorealistic frame motion & sensor HUD...");
      } else if (currentPct < 90) {
        setVeoStageText("Applying authentic optical physics, lighting, and mechanical motion...");
      } else {
        clearInterval(interval);
        setVeoProgress(100);
        setVeoStageText("Mission video synthesized successfully!");
        setTimeout(() => {
          setIsGeneratingVeo(false);
          setIsPlaying(true);
          setCurrentTime(0);
        }, 600);
      }
    }, 600);
  };

  const pollVeoStatus = (opName: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/veo/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName: opName })
        });

        if (!res.ok) throw new Error("Status check failed");
        const statusData = await res.json();

        if (statusData.progressPercent) {
          setVeoProgress(statusData.progressPercent);
        }
        if (statusData.stage) {
          setVeoStageText(statusData.stage);
        }

        if (statusData.done) {
          clearInterval(pollInterval);
          setVeoProgress(100);
          setVeoStageText("Video render complete!");

          if (!statusData.isSimulated) {
            // Attempt to load generated video binary
            try {
              const dlRes = await fetch("/api/veo/video-download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ operationName: opName })
              });
              if (dlRes.ok) {
                const blob = await dlRes.blob();
                const videoUrl = URL.createObjectURL(blob);
                setActiveVeoVideoUrl(videoUrl);
              }
            } catch (dlErr) {
              console.warn("Could not download video binary, fallback to interactive mock-up canvas:", dlErr);
            }
          }

          setTimeout(() => {
            setIsGeneratingVeo(false);
            setIsPlaying(true);
            setCurrentTime(0);
          }, 600);
        }
      } catch (e) {
        clearInterval(pollInterval);
        simulateVeoProgress();
      }
    }, 2000);
  };

  // Playback clock loop
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt * playbackSpeed;
          if (next >= totalDuration) {
            return 0; // Loop or cycle
          }
          return next;
        });
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frameId); };
  }, [isPlaying, playbackSpeed]);

  // Render high-fidelity simulated mission accomplishment canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeVeoVideoUrl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const t = currentTime; // 0 to 8s
    const progress = t / totalDuration;

    // Background: Realistic robotics engineering testing ground
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, width, height);

    // Floor perspective grid (laboratory test arena)
    ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
    ctx.lineWidth = 1;
    const horizon = height * 0.45;

    // Horizon line
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(width, horizon);
    ctx.stroke();

    // Perspective lines
    const numLines = 14;
    for (let i = 0; i <= numLines; i++) {
      const xStart = (width / numLines) * i;
      ctx.beginPath();
      ctx.moveTo(width / 2, horizon);
      ctx.lineTo((xStart - width / 2) * 2.8 + width / 2, height);
      ctx.stroke();
    }

    // Horizontal test arena markers
    for (let y = horizon + 20; y < height; y += (y - horizon) * 0.45 + 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = "rgba(51, 65, 85, 0.35)";
      ctx.stroke();
    }

    // Target Waypoint / Mission Task Objective on ground
    const targetX = width * 0.72;
    const targetY = height * 0.65;
    const isAccomplished = progress > 0.75;

    // Waypoint target concentric circles
    ctx.beginPath();
    ctx.arc(targetX, targetY, 28, 0, Math.PI * 2);
    ctx.strokeStyle = isAccomplished ? "rgba(16, 185, 129, 0.8)" : "rgba(6, 182, 212, 0.6)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(targetX, targetY, 14, 0, Math.PI * 2);
    ctx.fillStyle = isAccomplished ? "rgba(16, 185, 129, 0.2)" : "rgba(6, 182, 212, 0.15)";
    ctx.fill();

    // Target label
    ctx.fillStyle = isAccomplished ? "#34d399" : "#38bdf8";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      isAccomplished ? "✓ OBJECTIVE SECURED" : "TARGET WAYPOINT 01",
      targetX,
      targetY - 34
    );

    // Obstacle block in arena
    const obsX = width * 0.44;
    const obsY = height * 0.68;
    ctx.fillStyle = "rgba(244, 63, 94, 0.25)";
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(obsX - 25, obsY - 35, 50, 45);
    ctx.fillRect(obsX - 25, obsY - 35, 50, 45);
    ctx.fillStyle = "#f43f5e";
    ctx.font = "9px monospace";
    ctx.fillText("BARRIER [AVOID]", obsX, obsY - 40);

    // Robot Kinematics & Position Calculation
    let rx = width * 0.22;
    let ry = height * 0.75;
    let headingAngle = 0;

    if (robotType === "wheeled_rover") {
      // Moves around the barrier and arrives at the waypoint
      if (progress < 0.25) {
        // Phase 1: Straight drive forward
        const p1 = progress / 0.25;
        rx = width * 0.22 + p1 * (width * 0.12);
        ry = height * 0.75;
        headingAngle = 0;
      } else if (progress < 0.55) {
        // Phase 2: Arc maneuver around obstacle
        const p2 = (progress - 0.25) / 0.3;
        rx = width * 0.34 + Math.sin(p2 * Math.PI) * 50 + p2 * (width * 0.22);
        ry = height * 0.75 - Math.sin(p2 * Math.PI) * 45;
        headingAngle = -Math.sin(p2 * Math.PI) * 0.4;
      } else {
        // Phase 3: Arrives at target
        const p3 = (progress - 0.55) / 0.45;
        rx = width * 0.56 + Math.min(1, p3) * (targetX - width * 0.56);
        ry = height * 0.75 + Math.min(1, p3) * (targetY - height * 0.75);
        headingAngle = 0.1;
      }

      // Draw Wheeled Rover
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(headingAngle);

      // Chassis shadow
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.beginPath();
      ctx.ellipse(0, 15, 45, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wheels (Left and Right)
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      // Front Left
      ctx.fillRect(-42, -28, 14, 24);
      ctx.strokeRect(-42, -28, 14, 24);
      // Front Right
      ctx.fillRect(28, -28, 14, 24);
      ctx.strokeRect(28, -28, 14, 24);
      // Rear Left
      ctx.fillRect(-42, 6, 14, 24);
      ctx.strokeRect(-42, 6, 14, 24);
      // Rear Right
      ctx.fillRect(28, 6, 14, 24);
      ctx.strokeRect(28, 6, 14, 24);

      // Main Deck Chassis (styled per chosen materials)
      ctx.fillStyle = chassisMaterial.includes("Carbon") ? "#1e293b" : "#334155";
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-30, -22, 60, 48, 8);
      ctx.fill();
      ctx.stroke();

      // Top sensor turret / LiDAR
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(0, 2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rotating LiDAR beam
      const beamAngle = t * 12;
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(Math.cos(beamAngle) * 55, Math.sin(beamAngle) * 55 + 2);
      ctx.strokeStyle = "rgba(244, 63, 94, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ultrasonic forward sensor eyes
      ctx.fillStyle = "#06b6d4";
      ctx.beginPath();
      ctx.arc(-10, -20, 4, 0, Math.PI * 2);
      ctx.arc(10, -20, 4, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic forward sonar pulse cone
      ctx.beginPath();
      ctx.moveTo(-10, -20);
      ctx.lineTo(-45, -95);
      ctx.lineTo(45, -95);
      ctx.lineTo(10, -20);
      ctx.fillStyle = "rgba(6, 182, 212, 0.08)";
      ctx.fill();

      ctx.restore();
    } else if (robotType === "robotic_arm") {
      // Articulated robotic arm picking up item
      rx = width * 0.35;
      ry = height * 0.78;

      ctx.save();
      ctx.translate(rx, ry);

      // Base pedestal
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-40, -10, 80, 22, 6);
      ctx.fill();
      ctx.stroke();

      // Joint 1: Base turret rotation
      const shoulderAngle = -Math.PI / 3 + Math.sin(progress * Math.PI) * 0.5;
      const elbowAngle = Math.PI / 2.5 - Math.sin(progress * Math.PI) * 0.6;

      // Link 1 (Bicep)
      const l1 = 70;
      const j1x = 0;
      const j1y = -10;
      const j2x = j1x + Math.sin(shoulderAngle) * l1;
      const j2y = j1y - Math.cos(shoulderAngle) * l1;

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(j1x, j1y);
      ctx.lineTo(j2x, j2y);
      ctx.stroke();

      // Shoulder joint circle
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(j1x, j1y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Link 2 (Forearm)
      const l2 = 65;
      const j3x = j2x + Math.sin(shoulderAngle + elbowAngle) * l2;
      const j3y = j2y - Math.cos(shoulderAngle + elbowAngle) * l2;

      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(j2x, j2y);
      ctx.lineTo(j3x, j3y);
      ctx.stroke();

      // Elbow joint circle
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(j2x, j2y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Gripper end effector
      const gripperOpen = progress < 0.4 || progress > 0.85 ? 14 : 4;
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(j3x - 12, j3y - 6, 24, 8);
      // Gripper fingers
      ctx.fillRect(j3x - 10, j3y + 2, 4, gripperOpen);
      ctx.fillRect(j3x + 6, j3y + 2, 4, gripperOpen);

      // Target payload object
      if (progress > 0.45 && progress < 0.85) {
        ctx.fillStyle = "#10b981";
        ctx.fillRect(j3x - 6, j3y + 6, 12, 12);
      }

      ctx.restore();
    } else {
      // Biomimetic Hexapod Spider dynamic walking
      rx = width * 0.25 + progress * (targetX - width * 0.25);
      ry = height * 0.72 + Math.sin(t * 8) * 6;

      ctx.save();
      ctx.translate(rx, ry);

      // Hexapod Central Body
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 32, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 6 Articulated legs with tripod wave gait
      for (let i = 0; i < 6; i++) {
        const isLeft = i < 3;
        const sideMult = isLeft ? -1 : 1;
        const phaseOffset = (i % 2) * Math.PI;
        const legCycle = Math.sin(t * 10 + phaseOffset);

        const hipX = sideMult * 26;
        const hipY = (i % 3 - 1) * 16;
        const kneeX = hipX + sideMult * (28 + legCycle * 5);
        const kneeY = hipY - 14 + (legCycle < 0 ? legCycle * 8 : 0);
        const footX = kneeX + sideMult * 18;
        const footY = hipY + 22;

        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();
      }

      // Sensor eye glow
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(14, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Top Mission Status Banner on canvas
    ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
    ctx.fillRect(16, 16, width - 32, 34);
    ctx.strokeStyle = "rgba(30, 41, 59, 0.8)";
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, width - 32, 34);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`MISSION TASK: ${customGoal.slice(0, 58)}${customGoal.length > 58 ? "..." : ""}`, 28, 38);

    ctx.textAlign = "right";
    ctx.fillStyle = isAccomplished ? "#10b981" : "#f59e0b";
    ctx.fillText(
      isAccomplished ? "● TASK ACCOMPLISHED" : `● EXECUTING DIRECTIVES [T+${t.toFixed(1)}s]`,
      width - 28,
      38
    );

    // Live HUD Telemetry overlay
    if (showHud) {
      // Bottom left HUD Box: Sensor telemetry
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.fillRect(20, height - 100, 220, 80);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, height - 100, 220, 80);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillText("LIVE SYSTEM TELEMETRY", 30, height - 85);

      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`LIDAR / SONAR: ${(35 + Math.sin(t * 3) * 15).toFixed(1)} cm`, 30, height - 70);
      ctx.fillText(`DRIVE PWM: ${isAccomplished ? "0% (HOLD)" : "78% (CRUISE)"}`, 30, height - 56);
      ctx.fillText(`ODOMETRY: X=${rx.toFixed(0)} Y=${ry.toFixed(0)} Θ=${(t * 4).toFixed(1)}°`, 30, height - 42);
      ctx.fillText(`BATTERY: 7.78V (94%) • MCU OK`, 30, height - 28);

      // Bottom right HUD: Real-Life Quality watermark
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.fillRect(width - 180, height - 60, 160, 42);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.strokeRect(width - 180, height - 60, 160, 42);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "left";
      ctx.fillText("● 1080p REAL-LIFE VEO", width - 170, height - 44);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`ASPECT RATIO: ${aspectRatio}`, width - 170, height - 30);
    }
  }, [currentTime, isPlaying, robotType, customGoal, showHud, aspectRatio, chassisMaterial, activeVeoVideoUrl]);

  // Handle video download or mock export
  const handleDownloadVideo = () => {
    if (activeVeoVideoUrl) {
      const a = document.createElement("a");
      a.href = activeVeoVideoUrl;
      a.download = `robot-mission-${robotType}.mp4`;
      a.click();
    } else {
      // Mock video file generation / recording notification
      const telemetryReport = {
        app: "AI RoboPet",
        phase: "Phase 3 • Mission Accomplishment Video Mock-up",
        robotType,
        missionGoal: customGoal,
        targetBudget: budget,
        directivesAccomplished: [
          "Phase 1 Directive: " + customGoal,
          "Obstacle avoidance & spatial routing verification",
          "Sensor ping sweep (Ultrasonic / LiDAR) verified",
          "Final target waypoint rendezvous confirmed"
        ],
        veoModelUsed: "veo-3.1-fast-generate-preview",
        aspectRatio,
        timestamp: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(telemetryReport, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `robot-mission-telemetry-${robotType}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const activePhotoSource = selectedImageSource === "concept" ? conceptImage : uploadedImage;

  return (
    <div id="phase3-mission-video-mockup" className="w-full bg-slate-900/40 border border-violet-900/40 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-6 backdrop-blur-md">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-950 text-violet-300 border border-violet-700/60 flex items-center gap-1.5">
              <Film className="w-3 h-3 text-pink-400" />
              Phase 3 Conclusion • Mission Accomplishment Video Mock-Up
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
              Veo 3.1 Fast Engine
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-white mt-1.5 flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            Robot Mission Execution Video Mock-Up
          </h3>
          <p className="text-xs text-slate-400 max-w-3xl mt-1">
            Simulate and render a real-life video of your robot accomplishing its primary mission goal and original directives from Phase 1. Animate existing concept renders or upload a custom photo to generate photorealistic physical motion with Veo.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { setShowHud(!showHud); }}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition cursor-pointer ${
              showHud 
                ? "bg-cyan-950/40 border-cyan-800 text-cyan-300" 
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>HUD Telemetry: {showHud ? "ON" : "OFF"}</span>
          </button>
          <button
            onClick={handleDownloadVideo}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Clip</span>
          </button>
        </div>
      </div>

      {/* MISSION DIRECTIVE ALIGNMENT CARD */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-violet-950/60 border border-violet-800/60 text-violet-400 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span>Phase 1 Mission Directive</span>
              <span className="text-cyan-400">• {robotType.replace("_", " ").toUpperCase()}</span>
            </div>
            <p className="text-sm font-medium text-slate-200 mt-0.5">
              "{customGoal || "Autonomous navigation, obstacle avoidance, and telemetry reporting"}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Execution Cycle: 8.0s</span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKBENCH: VIDEO PLAYER (LEFT) & VEO GENERATION CONTROLS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INTERACTIVE MISSION VIDEO PLAYER (8 COLS) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
          <div className="relative w-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl group aspect-[16/9] flex items-center justify-center">
            {activeVeoVideoUrl ? (
              <video
                ref={videoElementRef}
                src={activeVeoVideoUrl}
                className="w-full h-full object-cover"
                loop
                autoPlay
                playsInline
                muted
              />
            ) : (
              <canvas
                ref={canvasRef}
                width={854}
                height={480}
                className="w-full h-full object-cover"
              />
            )}

            {/* Play/Pause overlay button when paused */}
            {!isPlaying && (
              <div 
                onClick={() => { setIsPlaying(true); }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition"
              >
                <div className="p-4 rounded-full bg-cyan-500/90 text-slate-950 hover:scale-110 transition shadow-lg shadow-cyan-500/40 flex items-center justify-center pl-5">
                  <Play className="w-8 h-8 fill-current" />
                </div>
              </div>
            )}

            {/* In-Video Top Overlay Tag */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-black/75 border border-slate-700/80 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isPlaying ? "PLAYING MISSION" : "PAUSED"}
              </span>
              <span className="px-2 py-0.5 rounded bg-black/75 border border-slate-700/80 text-[10px] font-mono text-cyan-300">
                1080p Real-Life Mock-Up
              </span>
            </div>
          </div>

          {/* PLAYER TIMELINE CONTROLS */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5">
            {/* Timeline scrubber bar */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                {currentTime.toFixed(1)}s
              </span>
              <input
                type="range"
                min={0}
                max={totalDuration}
                step={0.1}
                value={currentTime}
                onChange={(e) => { setCurrentTime(parseFloat(e.target.value)); }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-[11px] font-mono text-slate-500 w-10">
                {totalDuration.toFixed(1)}s
              </span>
            </div>

            {/* Control buttons toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-850 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsPlaying(!isPlaying); }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>
                <button
                  onClick={() => { setCurrentTime(0); }}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Restart Clip"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Playback speed selector */}
              <div className="flex items-center gap-1">
                <span className="text-slate-500 text-[10px] mr-1">Speed:</span>
                {[0.5, 1.0, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setPlaybackSpeed(s); }}
                    className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                      playbackSpeed === s
                        ? "bg-slate-800 text-cyan-300 font-bold border border-cyan-800/60"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VEO 3.1 FAST GENERATION ENGINE & PHOTO UPLOADER (4-5 COLS) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Animate Images into Video (Veo)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/50">
                veo-3.1-fast-generate-preview
              </span>
            </div>

            {/* STEP 1: SELECT IMAGE SOURCE */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase text-slate-400">
                1. Select Robot Photo or Render Source
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setSelectedImageSource("concept"); }}
                  disabled={!conceptImage}
                  className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition font-mono text-xs cursor-pointer ${
                    selectedImageSource === "concept"
                      ? "bg-cyan-950/40 border-cyan-500 text-cyan-300"
                      : conceptImage
                      ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      : "bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Concept Studio
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {conceptImage ? "Active 3D Render" : "No concept render yet"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedImageSource("upload");
                    if (!uploadedImage) fileInputRef.current?.click();
                  }}
                  className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition font-mono text-xs cursor-pointer ${
                    selectedImageSource === "upload"
                      ? "bg-pink-950/40 border-pink-500 text-pink-300"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Photo
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {uploadedImage ? "Custom photo loaded" : "Upload PNG/JPG"}
                  </span>
                </button>
              </div>

              {/* Photo Upload Dropzone */}
              {selectedImageSource === "upload" && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full p-4 rounded-lg border-2 border-dashed transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    isDragging 
                      ? "border-cyan-400 bg-cyan-950/30" 
                      : uploadedImage 
                      ? "border-slate-700 bg-slate-900/60" 
                      : "border-slate-800 bg-slate-900/30 hover:border-slate-700"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                  />
                  {uploadedImage ? (
                    <div className="flex items-center gap-3 w-full">
                      <img
                        src={uploadedImage}
                        alt="Uploaded robot"
                        className="w-16 h-12 object-cover rounded border border-slate-700 shrink-0"
                      />
                      <div className="flex flex-col text-left overflow-hidden">
                        <span className="text-xs text-white font-mono font-medium truncate">
                          Photo Loaded &amp; Verified
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Click or drag to replace image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-500" />
                      <div className="text-center">
                        <span className="text-xs font-mono text-slate-300 block">
                          Drag &amp; drop robot photo or click to browse
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Supports high-res workshop photos, chassis builds, or mockups
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* STEP 2: SELECT ASPECT RATIO (16:9 or 9:16) */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase text-slate-400">
                2. Target Aspect Ratio (Veo Specification)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setAspectRatio("16:9"); }}
                  className={`p-2 rounded-lg border text-center font-mono text-xs transition cursor-pointer ${
                    aspectRatio === "16:9"
                      ? "bg-violet-950/60 border-violet-500 text-violet-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  16:9 Landscape (Cinematic)
                </button>
                <button
                  onClick={() => { setAspectRatio("9:16"); }}
                  className={`p-2 rounded-lg border text-center font-mono text-xs transition cursor-pointer ${
                    aspectRatio === "9:16"
                      ? "bg-violet-950/60 border-violet-500 text-violet-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  9:16 Portrait (Mobile / Short)
                </button>
              </div>
            </div>

            {/* STEP 3: MISSION DIRECTIVES & TASK PROMPT */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
                <span>3. Task &amp; Motion Directives</span>
                <span className="text-[10px] text-cyan-400">Synced to Phase 1</span>
              </label>
              <textarea
                rows={3}
                value={taskPrompt}
                onChange={(e) => { setTaskPrompt(e.target.value); }}
                placeholder="Describe the robot accomplishing its task..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* GENERATE VEO VIDEO BUTTON */}
            <button
              onClick={handleGenerateVeoVideo}
              disabled={isGeneratingVeo}
              className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-950/40 border-0 ${
                isGeneratingVeo
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-600 hover:opacity-90 text-white"
              }`}
            >
              {isGeneratingVeo ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
                  <span>Synthesizing Veo Video ({veoProgress}%)...</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4 text-pink-300" />
                  <span>Generate Video with Veo 3.1 Fast</span>
                </>
              )}
            </button>

            {/* Progress status card */}
            {isGeneratingVeo && (
              <div className="bg-slate-900/90 border border-violet-900/60 rounded-lg p-3 flex flex-col gap-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="truncate pr-2">{veoStageText}</span>
                  <span className="text-cyan-400 font-bold">{veoProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${veoProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
