import React, { useState, useRef, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  X, 
  HelpCircle, 
  Cpu, 
  Zap, 
  Activity, 
  Layers, 
  ShieldAlert, 
  Compass, 
  Sliders, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Send,
  MessageSquare,
  User,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Terminal
} from "lucide-react";
import { NeuralBrainIcon } from "./NeuralBrainIcon";

export interface GlossaryTerm {
  id: string;
  term: string;
  category: "General Robotics" | "Electronics & Power" | "Communication & Logic" | "Motors & Actuators" | "Sensors & AI";
  simpleDefinition: string;
  detailedExplanation: string;
  whyItMatters: string;
  highSchoolAnalogy: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "mcu-vs-sbc",
    term: "Microcontroller (MCU) vs. Single-Board Computer (SBC)",
    category: "General Robotics",
    simpleDefinition: "MCUs run quick, real-time single tasks (like driving motors). SBCs run a full operating system (like Linux for AI/vision).",
    detailedExplanation: "A Microcontroller (e.g., ESP32, Arduino, STM32) executes code instantly without boot times, ideal for precise sensor reading and motor pulsing. A Single-Board Computer (e.g., Raspberry Pi 5) has a CPU, RAM, and graphics processor capable of computer vision, ROS 2, and neural networks.",
    whyItMatters: "Using an SBC alone for tight motor loops causes lag. Using an MCU alone limits you if you want camera AI. The best bots use BOTH!",
    highSchoolAnalogy: "An MCU is like your reflexes (instant muscle reaction), while an SBC is like your brain (calculating complex strategy)."
  },
  {
    id: "logic-voltage",
    term: "Logic Voltage (3.3V vs. 5V) & Level Shifting",
    category: "Electronics & Power",
    simpleDefinition: "The voltage level representing a digital '1' (HIGH) signal between chips.",
    detailedExplanation: "Modern MCUs like ESP32 and Raspberry Pi operate at 3.3V logic. Older modules like standard 5V Arduino components send 5V signals. Connecting a 5V signal directly into a 3.3V pin will permanently fry the input channel.",
    whyItMatters: "You need a bidirectional Logic Level Converter (3.3V ↔ 5V shifter) whenever connecting 5V sensors or drivers to 3.3V mainboards.",
    highSchoolAnalogy: "It's like plugging a 120V household lamp into a 240V industrial outlet—without a step-down converter, it blows up."
  },
  {
    id: "pwm",
    term: "PWM (Pulse Width Modulation)",
    category: "Motors & Actuators",
    simpleDefinition: "Flickering a digital pin ON and OFF thousands of times per second to simulate variable analog voltage.",
    detailedExplanation: "Digital pins can only output 0V or 3.3V/5V. To make a motor spin at half speed or a LED glow at 50% brightness, PWM rapidly turns the signal ON for 50% of the time and OFF for 50% of the time (50% Duty Cycle).",
    whyItMatters: "PWM controls servo angles (0° to 180° via pulse duration) and motor speed.",
    highSchoolAnalogy: "Like tapping light switches on and off so quickly that the room feels dimly lit instead of fully bright or dark."
  },
  {
    id: "i2c-spi-uart",
    term: "Serial Protocols (I2C, SPI, UART)",
    category: "Communication & Logic",
    simpleDefinition: "The digital 'languages' and wire configurations chips use to talk to each other.",
    detailedExplanation: "• I2C (Inter-Integrated Circuit): Uses only 2 wires (SDA data, SCL clock) to connect up to 127 sensors using unique hex addresses.\n• SPI (Serial Peripheral Interface): Uses 4 wires (MOSI, MISO, SCK, CS) for super high-speed screen or SD card data.\n• UART (Universal Asynchronous RX/TX): Uses 2 cross-wired pins (TX→RX, RX→TX) for long serial cable communications.",
    whyItMatters: "I2C saves GPIO pins because multiple sensors share the same 2 wires!",
    highSchoolAnalogy: "I2C is like a group chat with named mentions; SPI is a high-speed direct highway; UART is a walkie-talkie between two people."
  },
  {
    id: "lipo-c-rating",
    term: "LiPo Batteries & C-Rating",
    category: "Electronics & Power",
    simpleDefinition: "Rechargeable Lithium Polymer batteries rated by cell voltage (S) and max discharge current (C).",
    detailedExplanation: "Each LiPo cell is 3.7V nominal (4.2V fully charged). 2S = 7.4V, 3S = 11.1V. The 'C' rating multiplied by capacity (Ah) calculates maximum peak current output (e.g. 2200mAh x 30C = 66 Amps!).",
    whyItMatters: "Heavy motors draw huge current bursts. If your battery C-rating is too low, the battery swells or drops voltage causing MCU brownouts.",
    highSchoolAnalogy: "Voltage is the height of a water dam, while C-rating determines how wide the floodgate opens for heavy flow."
  },
  {
    id: "h-bridge",
    term: "H-Bridge Motor Driver (e.g., L298N, TB6612FNG)",
    category: "Motors & Actuators",
    simpleDefinition: "A power-switching circuit that lets microcontrollers safely control high-current DC motor speed & direction.",
    detailedExplanation: "Microcontroller GPIO pins output at most 20mA to 40mA—not enough to turn even a small motor. An H-Bridge uses MOSFETs arranged like an 'H' to route high battery current through the motor forwards or backwards based on tiny control signals.",
    whyItMatters: "Never connect a DC motor directly to an Arduino/ESP32 pin! You will fry the processor instantly. Always use a motor driver.",
    highSchoolAnalogy: "It's like a relay switch box: your tiny finger flips a switch that controls a massive electrical circuit safely."
  },
  {
    id: "lidar-vs-sonar",
    term: "LiDAR vs. Ultrasonic (Sonar) vs. ToF Distance Sensing",
    category: "Sensors & AI",
    simpleDefinition: "Technologies used to detect obstacles and map distances around the robot.",
    detailedExplanation: "• Ultrasonic (HC-SR04): Sends 40kHz sound waves; cheap ($3) and works well up to 3m, but narrow cone and reflections on soft fabrics.\n• Time-of-Flight (VL53L0X): Emits invisible laser light; millimeter-level precision up to 2m, immune to acoustic echo.\n• 360° LiDAR (RPLIDAR): Spins a laser 10 times a second to map thousands of points around the room in 2D for SLAM navigation.",
    whyItMatters: "Ultrasonic is great for simple forward bumper avoidance; LiDAR is required for full indoor autonomous SLAM mapping.",
    highSchoolAnalogy: "Ultrasonic is shouting and timing the echo (like a bat); ToF is a laser stopwatch; LiDAR is a spinning lighthouse mapping the harbor."
  },
  {
    id: "imu-kalman",
    term: "IMU (Inertial Measurement Unit) & Sensor Fusion",
    category: "Sensors & AI",
    simpleDefinition: "A sensor chip combining accelerometers and gyroscopes to track 3D tilt, roll, and orientation.",
    detailedExplanation: "Accelerometers measure gravity (tilt) but are noisy during vibration. Gyroscopes measure angular spin rate but drift over time. Sensor Fusion (Complementary or Kalman filters) combines both to give a rock-steady pitch/roll/yaw angle.",
    whyItMatters: "Essential for balancing 2-wheeled robots, stabilizing hexapod walking gaits, and drone flight controllers.",
    highSchoolAnalogy: "Like the inner ear fluid in your head that lets you know if you are standing upright even with your eyes closed."
  },
  {
    id: "ros2-nodes",
    term: "ROS 2 (Robot Operating System) & DDS Topics",
    category: "Communication & Logic",
    simpleDefinition: "An open-source software framework where robot programs run as modular 'nodes' talking via pub/sub topics.",
    detailedExplanation: "Instead of writing one massive 5,000-line script, ROS 2 breaks code into independent programs: a camera node publishes images to '/camera/image', an AI node subscribes and finds faces, and a motor node listens to '/cmd_vel' to drive.",
    whyItMatters: "Industry-standard architecture for autonomous robots, enabling simulation in Gazebo and off-the-shelf navigation stacks (Nav2).",
    highSchoolAnalogy: "Like an orchestra where musicians (nodes) communicate by reading sheet music and listening to each other's instruments."
  },
  {
    id: "ubec-step-down",
    term: "UBEC (Universal Battery Elimination Circuit) / Buck Converter",
    category: "Electronics & Power",
    simpleDefinition: "A high-efficiency switching voltage regulator that steps high battery voltage down to clean 5V.",
    detailedExplanation: "Linear regulators (like 7805) burn off excess voltage as pure heat ($P = V_{drop} \\times I$). A switching Buck Converter / UBEC converts 7.4V-14.8V down to 5.0V with >90% efficiency without melting.",
    whyItMatters: "Supplies clean, high-amperage current (3A-5A) to servos and single-board computers without overheating.",
    highSchoolAnalogy: "Linear regulators are like letting water boil off to reduce pressure; UBECs are like precision gears that step down speed with no lost energy."
  }
];

interface ChatMessage {
  id: string;
  sender: "user" | "gemini";
  text: string;
  timestamp: string;
}

interface TechHelpGlossaryProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearch?: string;
  context?: {
    robotType?: string;
    activeMCU?: string;
    hardware?: string[];
    goal?: string;
  };
}

export const TechHelpGlossary: React.FC<TechHelpGlossaryProps> = ({
  isOpen,
  onClose,
  initialSearch = "",
  context
}) => {
  const [activeTab, setActiveTab] = useState<"glossary" | "gemini_chat">("glossary");
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("mcu-vs-sbc");

  // Gemini Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      sender: "gemini",
      text: `Hello! I am your **Gemini Robotics Architect & Electronics Assistant**. 

I can help you calculate power budgets, design wiring schematics, configure 3.3V ↔ 5.0V level shifters, write ROS 2 telemetry nodes, or select optimal microcontrollers for your build.

What would you like to explore or debug today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "gemini_chat") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  if (!isOpen) return null;

  const categories = ["All", "General Robotics", "Electronics & Power", "Communication & Logic", "Motors & Actuators", "Sensors & AI"];

  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = 
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.simpleDefinition.toLowerCase().includes(search.toLowerCase()) ||
      item.detailedExplanation.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = promptToSend || chatInput;
    if (!text.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!promptToSend) setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/gemini/architect-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          context: context || {
            robotType: "Wheeled Rover / Arm",
            activeMCU: "ESP32-WROOM-32",
            hardware: ["MG996R Servo", "HC-SR04", "L298N", "MPU6050"],
            goal: "Autonomous obstacle avoidance"
          }
        })
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        sender: "gemini",
        text: data.reply || "I encountered an issue generating a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, botMsg]);
    } catch (err: unknown) {
      const fallbackMsg: ChatMessage = {
        id: "bot-err-" + Date.now(),
        sender: "gemini",
        text: `### 🛠️ Circuit & Robotics Architecture Guidance

Here is actionable engineering advice for: **"${text.trim()}"**

- **Logic Levels**: Ensure 3.3V microcontrollers (ESP32/RPi) are isolated from 5V sensors via a TXS0108E bidirectional level shifter or a 1kΩ/2kΩ voltage divider.
- **Power Distribution**: Always separate logic 5V rail (UBEC buck converter) from high-torque motor inductive surge rails.
- **Micro-ROS**: Publish IMU, wheel ticks, and laser scan packets to ROS 2 topics over 115200 baud serial UART.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => { setCopiedId(null); }, 2000);
  };

  const quickPrompts = [
    "How do I wire a 5V sensor to a 3.3V ESP32 pin safely?",
    "Calculate LiPo battery runtime for 4x servos and a Raspberry Pi",
    "Explain TB6612FNG motor driver vs L298N power efficiency",
    "How to set up a Micro-ROS publisher in Arduino C++?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <BookOpen className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold font-mono text-white tracking-tight uppercase">
                  Robotics Tech Help & AI Co-Pilot
                </h2>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded border border-cyan-800/60 hidden sm:inline">
                  Interactive Advisor
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Technical glossary, circuit calculators, and live Gemini prompt portal.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODE SELECTOR TABS */}
        <div className="grid grid-cols-2 bg-slate-950 p-1.5 border-b border-slate-800 shrink-0 font-mono text-xs">
          <button
            onClick={() => { setActiveTab("glossary"); }}
            className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "glossary"
                ? "bg-slate-900 text-cyan-300 border border-cyan-800/60 shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>📖 Tech Glossary & Engineering Concepts</span>
          </button>

          <button
            onClick={() => { setActiveTab("gemini_chat"); }}
            className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "gemini_chat"
                ? "bg-cyan-950 text-cyan-200 border border-cyan-600 shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <NeuralBrainIcon className="w-4 h-4" />
            <span>Gemini Robotics Architect Chat</span>
          </button>
        </div>

        {/* TAB 1: TECH GLOSSARY ENCYCLOPEDIA */}
        {activeTab === "glossary" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search & Category Filter Bar */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col gap-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); }}
                  placeholder="Search engineering terms (e.g., Level Shifting, PWM, LiPo, I2C, ROS 2, H-Bridge)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); }}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Glossary Term List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredTerms.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-mono text-xs flex flex-col items-center gap-2">
                  <Sliders className="w-8 h-8 text-slate-600 mb-1" />
                  <p>No glossary terms match your search query.</p>
                  <button
                    onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                    className="text-cyan-400 hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredTerms.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => { setExpandedId(isExpanded ? null : item.id); }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isExpanded 
                          ? "bg-slate-900/90 border-cyan-800/80 shadow-lg" 
                          : "bg-slate-950/50 border-slate-850 hover:border-slate-700 hover:bg-slate-900/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              {item.term}
                            </h3>
                            <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-cyan-300 font-medium leading-relaxed">
                            {item.simpleDefinition}
                          </p>
                        </div>

                        <div className="p-1 rounded bg-slate-800/50 text-slate-400 shrink-0">
                          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90 text-cyan-400" : ""}`} />
                        </div>
                      </div>

                      {/* Detailed expanded panel */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fadeIn">
                          
                          {/* High School Analogy */}
                          <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl text-xs flex items-start gap-2.5">
                            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                                Intuitive Tech Analogy
                              </span>
                              <p className="text-amber-200/90 text-xs mt-0.5 leading-relaxed">
                                {item.highSchoolAnalogy}
                              </p>
                            </div>
                          </div>

                          {/* Detailed explanation */}
                          <div className="text-xs text-slate-300 space-y-1 font-sans leading-relaxed">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                              Technical Deep Dive
                            </span>
                            <div className="whitespace-pre-line text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
                              {item.detailedExplanation}
                            </div>
                          </div>

                          {/* Why it matters */}
                          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs flex items-start gap-2.5">
                            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                                Why It Matters for Your Build
                              </span>
                              <p className="text-cyan-200/90 text-xs mt-0.5 leading-relaxed">
                                {item.whyItMatters}
                              </p>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GEMINI ROBOTICS ARCHITECT CONVERSATION PORTAL */}
        {activeTab === "gemini_chat" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Quick suggestions pills */}
            <div className="p-3 bg-slate-950/70 border-b border-slate-800 shrink-0 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
              <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Prompt Ideas:
              </span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(q)}
                  disabled={chatLoading}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-800 rounded-md whitespace-nowrap transition cursor-pointer text-[10px]"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
              {chatMessages.map((msg) => {
                const isBot = msg.sender === "gemini";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isBot ? "" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isBot 
                          ? "bg-cyan-950 text-cyan-400 border border-cyan-800" 
                          : "bg-indigo-950 text-indigo-300 border border-indigo-800"
                      }`}
                    >
                      {isBot ? <NeuralBrainIcon className="w-5 h-5" /> : <User className="w-4 h-4" />}
                    </div>

                    <div
                      className={`relative max-w-[85%] rounded-xl p-3.5 shadow-md ${
                        isBot
                          ? "bg-slate-950 border border-slate-800 text-slate-200"
                          : "bg-cyan-900/60 border border-cyan-700/60 text-white"
                      }`}
                    >
                      {/* Message meta */}
                      <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-slate-800/60 text-[10px] font-mono text-slate-400">
                        <span className="font-bold text-cyan-300">{isBot ? "Gemini Senior Architect" : "You (Maker)"}</span>
                        <div className="flex items-center gap-2">
                          <span>{msg.timestamp}</span>
                          {isBot && (
                            <button
                              onClick={() => { handleCopyText(msg.id, msg.text); }}
                              className="text-slate-400 hover:text-white transition"
                              title="Copy message"
                            >
                              {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content rendering */}
                      <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-400 font-mono flex items-center gap-2">
                    <span className="animate-pulse">Gemini Architect is formulating recommendations...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Portal Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSendPrompt();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => { setChatInput(e.target.value); }}
                  placeholder="Ask Gemini anything: e.g. 'How to connect HC-SR04 to ESP32 without frying 3.3V GPIO?'..."
                  disabled={chatLoading}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />

                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Prompt</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500 shrink-0">
          <span>AI RoboPet Assistant • Grounded Hardware Engineering</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
