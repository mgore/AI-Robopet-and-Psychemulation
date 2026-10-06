import React, { useState } from "react";
import { 
  Users, 
  Camera, 
  Layers, 
  Box, 
  Heart, 
  MessageSquare, 
  Download, 
  Plus, 
  Send, 
  Search, 
  Tag, 
  Check, 
  X, 
  Sliders, 
  Eye, 
  Upload, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Cpu,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CommunityPost, HardwareComponent, ComponentCategory, CommunityInventoryItem } from "../types";

interface CommunityCommonsProps {
  activeDrawer: HardwareComponent[];
  addToDrawer: (component: HardwareComponent) => void;
  triggerNotification: (msg: string) => void;
  onNavigatePhase?: (phase: 1 | 2 | 3 | 4) => void;
}

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    title: "Dual-Track Rover V3: Rugged Chassis & Sensor Rig",
    builder: "AeroBotics_Elena",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    category: "complete",
    description: "Final field test after completing the obstacle-avoiding chassis. Laser-cut acrylic base with dual 18650 power cells, front-mounted HC-SR04 sonar array, and Raspberry Pi 4 brain. Completed 14 obstacle courses without collision.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
    createdAt: "2 hours ago",
    likes: 42,
    tags: ["Rover", "Ultrasonic", "Field-Tested", "Dual-Cell 18650"],
    designFiles: [
      { name: "rover_v3_lower_chassis.stl", format: "STL", size: "4.2 MB" },
      { name: "sensor_bracket_mount.step", format: "STEP", size: "1.1 MB" },
      { name: "power_distribution_schematic.dxf", format: "DXF", size: "650 KB" }
    ],
    inventoryItems: [
      {
        id: "inv-1-1",
        name: "Raspberry Pi 4 Model B (4GB)",
        category: "SBC",
        quantity: 1,
        condition: "Bench-Tested",
        estimatedPriceUSD: 55,
        status: "In Active Build",
        voltage: "5V USB-C",
        interface: "GPIO / I2C / UART"
      },
      {
        id: "inv-1-2",
        name: "L298N Dual H-Bridge Motor Driver",
        category: "Motor Driver",
        quantity: 1,
        condition: "New",
        estimatedPriceUSD: 6,
        status: "In Active Build",
        voltage: "5V-35V",
        interface: "PWM / Logic"
      },
      {
        id: "inv-1-3",
        name: "HC-SR04 Ultrasonic Distance Sensor",
        category: "Sensor",
        quantity: 2,
        condition: "New",
        estimatedPriceUSD: 4,
        status: "Available for Swap",
        voltage: "5V",
        interface: "GPIO"
      }
    ],
    comments: [
      { user: "Marcus_Maker", text: "How did you stabilize the ultrasonic sonar from reading tire reflections?", time: "1 hr ago" },
      { user: "AeroBotics_Elena", text: "I angled the mount 4 degrees upward and 3D printed a conical horn hood (included in the STL bundle)!", time: "45 min ago" }
    ]
  },
  {
    id: "post-2",
    title: "Biomimetic Hexapod 3D Print Files & Inverse Kinematics",
    builder: "CyberKinetics",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    category: "design",
    description: "Sharing my optimized 3D printable coxa, femur, and tibia brackets designed specifically for MG996R metal-gear servos. Includes 0.2mm tolerance press-fit screw holes and anti-twist ridges.",
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000",
    createdAt: "5 hours ago",
    likes: 67,
    tags: ["3D-Print", "STL", "Hexapod", "Inverse-Kinematics", "CAD"],
    designFiles: [
      { name: "hexapod_coxa_femur_assembly.stl", format: "STL", size: "8.7 MB" },
      { name: "tibia_silicone_boot_mold.stl", format: "STL", size: "2.4 MB" },
      { name: "hexapod_body_chassis_rev4.step", format: "STEP", size: "14.2 MB" },
      { name: "ik_gait_controller.py", format: "Code", size: "48 KB" }
    ],
    inventoryItems: [
      {
        id: "inv-2-1",
        name: "MG996R Metal Gear High Torque Servo",
        category: "Actuator",
        quantity: 12,
        condition: "New",
        estimatedPriceUSD: 8,
        status: "In Active Build",
        voltage: "4.8V-6.6V",
        interface: "PWM"
      },
      {
        id: "inv-2-2",
        name: "PCA9685 16-Channel 12-Bit PWM Servo Driver",
        category: "Motor Driver",
        quantity: 1,
        condition: "Bench-Tested",
        estimatedPriceUSD: 7,
        status: "In Active Build",
        voltage: "3.3V-5V",
        interface: "I2C"
      },
      {
        id: "inv-2-3",
        name: "Spare PCA9685 I2C Board (Surplus)",
        category: "Motor Driver",
        quantity: 2,
        condition: "Surplus",
        estimatedPriceUSD: 6,
        status: "Available for Swap",
        voltage: "5V",
        interface: "I2C"
      }
    ],
    comments: [
      { user: "HexaFan", text: "These CAD files saved me days of measuring servo splines. Thanks!", time: "3 hrs ago" }
    ]
  },
  {
    id: "post-3",
    title: "Spare Parts Swap: Extra ESP32-S3 Boards & MPU-6050 IMUs",
    builder: "HardwareHacker_Kai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    category: "inventory",
    description: "Ordered wholesale reels for a classroom robotics workshop and have 4 brand new ESP32-S3 DevKit boards and 6 MPU-6050 6-axis IMU modules ready to swap or share with builders who need them!",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    createdAt: "Yesterday",
    likes: 31,
    tags: ["Inventory-Swap", "ESP32-S3", "IMU", "Spare-Parts", "Free-Or-Trade"],
    designFiles: [
      { name: "esp32_s3_pinout_reference.dxf", format: "DXF", size: "820 KB" }
    ],
    inventoryItems: [
      {
        id: "inv-3-1",
        name: "ESP32-S3 DevKit-C (Dual Core Xtensa)",
        category: "Microcontroller",
        quantity: 4,
        condition: "New",
        estimatedPriceUSD: 7,
        status: "Available for Swap",
        voltage: "3.3V / 5V USB",
        interface: "WiFi / BLE / USB-OTG"
      },
      {
        id: "inv-3-2",
        name: "MPU-6050 6-Axis Gyroscope & Accelerometer",
        category: "Sensor",
        quantity: 6,
        condition: "New",
        estimatedPriceUSD: 3,
        status: "Free to Adopt",
        voltage: "3.3V-5V",
        interface: "I2C"
      }
    ],
    comments: [
      { user: "DevRobotics", text: "Would love to swap 2 of your MPU-6050s for a ToF VL53L0X sensor if you have one available!", time: "18 hrs ago" },
      { user: "HardwareHacker_Kai", text: "Deal! Ping me or adopt via the drawer link below.", time: "14 hrs ago" }
    ]
  },
  {
    id: "post-4",
    title: "GrowBot Miniature Companion: 3D CAD Head Assembly & Camera",
    builder: "Brit_CompanionLabs",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    category: "photo",
    description: "High-resolution photos of the custom dual-axis pan/tilt neck joint using SG90 micro-servos paired with the Raspberry Pi Camera Module 3. Notice the internal cable ducting through the spinal column.",
    imageUrl: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=1000",
    createdAt: "2 days ago",
    likes: 89,
    tags: ["GrowBot", "Photos", "Neck-Joint", "PiCamera", "Companion"],
    designFiles: [
      { name: "growbot_pan_tilt_head.stl", format: "STL", size: "6.1 MB" },
      { name: "wire_duct_spinal_column.step", format: "STEP", size: "3.8 MB" }
    ],
    inventoryItems: [
      {
        id: "inv-4-1",
        name: "Raspberry Pi Camera Module 3 (Wide)",
        category: "Sensor",
        quantity: 1,
        condition: "Bench-Tested",
        estimatedPriceUSD: 25,
        status: "In Active Build",
        voltage: "3.3V",
        interface: "MIPI CSI-2"
      },
      {
        id: "inv-4-2",
        name: "SG90 Micro Servo (Pan/Tilt)",
        category: "Actuator",
        quantity: 2,
        condition: "New",
        estimatedPriceUSD: 3,
        status: "In Active Build",
        voltage: "4.8V-6V",
        interface: "PWM"
      }
    ],
    comments: [
      { user: "Sarah_B", text: "The wire duct through the spine is pure genius. No more pinching wires!", time: "1 day ago" }
    ]
  }
];

export const CommunityCommons: React.FC<CommunityCommonsProps> = ({
  activeDrawer,
  addToDrawer,
  triggerNotification,
  onNavigatePhase
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [activeFilter, setActiveFilter] = useState<"all" | "photo" | "design" | "inventory">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  // New post creation form state
  const [shareCategory, setShareCategory] = useState<"photo" | "design" | "inventory">("photo");
  const [postTitle, setPostTitle] = useState("");
  const [postBuilder, setPostBuilder] = useState("Maker_" + Math.floor(100 + Math.random() * 900));
  const [postDescription, setPostDescription] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postDesignFiles, setPostDesignFiles] = useState<{ name: string; format: "STL" | "STEP" | "DXF" | "KiCad" | "Code"; size: string }[]>([
    { name: "custom_robot_part.stl", format: "STL", size: "3.5 MB" }
  ]);
  const [postInventoryItems, setPostInventoryItems] = useState<{
    name: string;
    category: ComponentCategory;
    quantity: number;
    condition: "New" | "Bench-Tested" | "Used - Functional" | "Surplus";
    estimatedPriceUSD: number;
    status: "Available for Swap" | "In Active Build" | "Free to Adopt";
  }[]>([
    {
      name: "Spare High-Torque Servo MG996R",
      category: "Actuator",
      quantity: 1,
      condition: "New",
      estimatedPriceUSD: 8,
      status: "Available for Swap"
    }
  ]);
  const [postTags, setPostTags] = useState("");

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Filtered posts
  const filteredPosts = posts.filter(post => {
    const matchesFilter = activeFilter === "all" || post.category === activeFilter || (activeFilter === "photo" && post.imageUrl) || (activeFilter === "design" && post.designFiles.length > 0) || (activeFilter === "inventory" && post.inventoryItems.length > 0);
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.builder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.inventoryItems.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Calculate totals
  const totalPhotos = posts.filter(p => p.imageUrl).length;
  const totalDesigns = posts.reduce((sum, p) => sum + p.designFiles.length, 0);
  const totalInventoryParts = posts.reduce((sum, p) => sum + p.inventoryItems.length, 0);
  const totalAvailableSwaps = posts.reduce((sum, p) => sum + p.inventoryItems.filter(i => i.status !== "In Active Build").length, 0);

  // Like a post
  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasLiked = (p as any).hasUserLiked;
        return {
          ...p,
          likes: hasLiked ? p.likes - 1 : p.likes + 1,
          hasUserLiked: !hasLiked
        };
      }
      return p;
    }));
    triggerNotification("Updated community post reaction!");
  };

  // Add comment
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId].trim();
    if (!text) return;

    const newComment = {
      user: "You (Architect)",
      text,
      time: "Just now"
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    triggerNotification("Comment published to communal discussion!");
  };

  // Adopt Inventory Item to Active Drawer
  const handleAdoptInventoryItem = (item: CommunityInventoryItem) => {
    const newComponent: HardwareComponent = {
      id: `communal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: item.name,
      category: item.category,
      estimatedPriceUSD: item.status === "Free to Adopt" ? 0 : item.estimatedPriceUSD,
      specs: item.specs || `Adopted from community member. Condition: ${item.condition}`,
      roleInProject: `Community sourced component (${item.status})`,
      voltage: item.voltage || "5V",
      interface: item.interface || "Standard"
    };

    addToDrawer(newComponent);
    triggerNotification(`Added "${item.name}" from community inventory to your active build drawer!`);
  };

  // Handle publish post
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      triggerNotification("Please enter a title for your post.");
      return;
    }

    const defaultImages = [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"
    ];

    const newPost: CommunityPost = {
      id: `comm_${Date.now()}`,
      title: postTitle.trim(),
      builder: postBuilder.trim() || "Maker_Collective",
      category: shareCategory,
      description: postDescription.trim() || "Shared by community member.",
      imageUrl: postImageUrl.trim() || defaultImages[Math.floor(Math.random() * defaultImages.length)],
      designFiles: shareCategory === "design" || shareCategory === "photo" ? postDesignFiles : [],
      inventoryItems: postInventoryItems.map((inv, idx) => ({
        id: `inv-custom-${Date.now()}-${idx}`,
        name: inv.name,
        category: inv.category,
        quantity: inv.quantity,
        condition: inv.condition,
        estimatedPriceUSD: inv.estimatedPriceUSD,
        status: inv.status,
        voltage: "5V",
        interface: "Standard"
      })),
      likes: 1,
      comments: [],
      createdAt: "Just now",
      tags: postTags.split(",").map(t => t.trim()).filter(Boolean)
    };

    setPosts([newPost, ...posts]);
    setIsShareModalOpen(false);
    setPostTitle("");
    setPostDescription("");
    setPostImageUrl("");
    triggerNotification("Your creation was shared to the Community Commons!");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* ========================================================================= */}
      {/* COMMUNAL HUB HEADER & STATS BANNER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-[#140b28] to-slate-950 border border-violet-900/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-violet-900/40 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-950/80 text-violet-300 border border-violet-700/60 shadow-inner flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-violet-400" />
                Robotics Community Commons &amp; Shared Hub
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-pink-950/60 text-pink-300 border border-pink-800/40">
                Designated Solely for Community
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                Active Hardware Swaps
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center gap-2.5">
              <span>Communal Maker Hub: Photos, 3D Designs &amp; Hardware Inventory</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              A dedicated open-source exchange space for makers to showcase physical build photos, share downloadable CAD/3D designs, exchange spare hardware inventory, and collaborate on real robotics projects.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => { setIsShareModalOpen(true); }}
              className="px-5 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-mono font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.35)] transition flex items-center justify-center gap-2 cursor-pointer border-0"
            >
              <Plus className="w-4 h-4" />
              <span>Share Photo, Design or Inventory</span>
            </button>
          </div>
        </div>

        {/* METRICS TICKER BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-violet-950/80 text-violet-400 rounded-lg border border-violet-800/50">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Build Photos</div>
              <div className="text-lg font-bold font-mono text-white">{totalPhotos} Galleries</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-pink-950/80 text-pink-400 rounded-lg border border-pink-800/50">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">CAD &amp; 3D Designs</div>
              <div className="text-lg font-bold font-mono text-white">{totalDesigns} STL / STEP Files</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950/80 text-emerald-400 rounded-lg border border-emerald-800/50">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Inventory Items</div>
              <div className="text-lg font-bold font-mono text-white">{totalInventoryParts} Parts Shared</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950/80 text-cyan-400 rounded-lg border border-cyan-800/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Available Swaps</div>
              <div className="text-lg font-bold font-mono text-cyan-300">{totalAvailableSwaps} Ready to Adopt</div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FILTER TABS & SEARCH BAR */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-800 p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        
        {/* CATEGORY TABS */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850 w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Shares", icon: Users, count: posts.length },
            { id: "photo", label: "Photos & Builds", icon: Camera, count: totalPhotos },
            { id: "design", label: "CAD & 3D Designs", icon: Layers, count: totalDesigns },
            { id: "inventory", label: "Inventory & Swaps", icon: Box, count: totalInventoryParts }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveFilter(tab.id as any); }}
                className={`px-3.5 py-2 rounded font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer border-0 whitespace-nowrap ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "bg-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-violet-950 text-violet-200" : "bg-slate-800 text-slate-400"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search photos, CAD files, parts, builders..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); }}
              className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POSTS GRID */}
      {/* ========================================================================= */}
      {filteredPosts.length === 0 ? (
        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Users className="w-10 h-10 text-slate-700" />
          <h4 className="text-sm font-bold font-mono text-slate-300">No community posts match your criteria</h4>
          <p className="text-xs text-slate-500 max-w-md">Try clearing the search query or be the first maker to share a photo, 3D CAD design, or spare inventory part!</p>
          <button
            onClick={() => {
              setActiveFilter("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-xs rounded-lg transition border border-slate-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map(post => {
            const hasLiked = (post as any).hasUserLiked;
            return (
              <div 
                key={post.id} 
                className="bg-slate-900/40 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl hover:border-violet-800/50 transition flex flex-col"
              >
                
                {/* POST HEADER: BUILDER INFO & TAG */}
                <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"} 
                      alt={post.builder}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-violet-700/60 shadow-inner"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-white">@{post.builder}</span>
                        <span className="text-[10px] text-slate-500 font-mono">• {post.createdAt}</span>
                      </div>
                      <span className="text-[10px] text-violet-400 font-mono">Community Maker</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    post.category === "photo" 
                      ? "bg-violet-950/60 text-violet-300 border-violet-800/50"
                      : post.category === "design"
                      ? "bg-pink-950/60 text-pink-300 border-pink-800/50"
                      : post.category === "inventory"
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                      : "bg-cyan-950/60 text-cyan-300 border-cyan-800/50"
                  }`}>
                    {post.category === "photo" ? "📷 Photo" : post.category === "design" ? "📐 3D Design" : post.category === "inventory" ? "📦 Inventory" : "✨ Complete"}
                  </span>
                </div>

                {/* POST PHOTO / HERO IMAGE */}
                {post.imageUrl && (
                  <div className="relative group overflow-hidden bg-slate-950 border-b border-slate-800/60 aspect-video">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                      onClick={() => { setSelectedPhotoModal(post.imageUrl); }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50" />
                    
                    <button
                      onClick={() => setSelectedPhotoModal(post.imageUrl)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-mono rounded-lg backdrop-blur-sm transition flex items-center gap-1.5 cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Full Photo</span>
                    </button>
                  </div>
                )}

                {/* POST CONTENT */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div>
                    <h3 className="text-base font-bold font-mono text-white leading-snug hover:text-violet-300 transition">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {/* TAGS */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-violet-400" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 3D / CAD DESIGN FILES SECTION */}
                  {post.designFiles && post.designFiles.length > 0 && (
                    <div className="bg-slate-950/80 border border-pink-950/60 rounded-xl p-3.5 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-pink-400 border-b border-slate-900 pb-2">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-pink-400" />
                          <span>Downloadable 3D CAD &amp; Print Files ({post.designFiles.length})</span>
                        </span>
                        <span className="text-[10px] text-slate-500">Open-Source</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {post.designFiles.map((file, fIdx) => (
                          <div 
                            key={fIdx}
                            className="p-2 bg-slate-900/60 rounded border border-slate-850 flex items-center justify-between text-xs font-mono"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-pink-950 text-pink-300 border border-pink-800/40 shrink-0">
                                {file.format}
                              </span>
                              <span className="text-slate-200 truncate">{file.name}</span>
                              <span className="text-[10px] text-slate-500 shrink-0">({file.size})</span>
                            </div>

                            <button
                              onClick={() => triggerNotification(`Downloading CAD asset: ${file.name}`)}
                              className="px-2.5 py-1 bg-pink-950/60 hover:bg-pink-900/60 border border-pink-800/50 text-pink-300 hover:text-white rounded text-[10px] font-mono transition flex items-center gap-1 shrink-0 cursor-pointer ml-2"
                            >
                              <Download className="w-3 h-3" />
                              <span>Get STL</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HARDWARE INVENTORY & PART SWAP SECTION */}
                  {post.inventoryItems && post.inventoryItems.length > 0 && (
                    <div className="bg-slate-950/80 border border-emerald-950/60 rounded-xl p-3.5 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400 border-b border-slate-900 pb-2">
                        <span className="flex items-center gap-1.5">
                          <Box className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Hardware Inventory &amp; Spare Parts ({post.inventoryItems.length})</span>
                        </span>
                        <span className="text-[10px] text-emerald-500/80">Available to Adopt</span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {post.inventoryItems.map((item, iIdx) => (
                          <div 
                            key={iIdx}
                            className="p-2.5 bg-slate-900/60 rounded border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                          >
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-100 font-bold">{item.name}</span>
                                <span className="text-[10px] text-slate-400">x{item.quantity}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <span>Condition: <strong className="text-slate-300">{item.condition}</strong></span>
                                <span>•</span>
                                <span className={item.status === "Free to Adopt" ? "text-emerald-400 font-bold" : "text-cyan-400"}>
                                  {item.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <span className="text-xs font-bold text-emerald-400">
                                {item.status === "Free to Adopt" ? "FREE" : `$${item.estimatedPriceUSD}`}
                              </span>
                              <button
                                onClick={() => { handleAdoptInventoryItem(item); }}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[10px] font-mono transition flex items-center gap-1.5 cursor-pointer shadow border-0"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Adopt to My Drawer</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LIKES & DISCUSSION THREAD */}
                  <div className="border-t border-slate-800/60 pt-4 flex flex-col gap-3">
                    
                    {/* Action Bar */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <button
                        onClick={() => { handleToggleLike(post.id); }}
                        className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                          hasLiked
                            ? "bg-rose-950/80 border-rose-800 text-rose-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-slate-700"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-current text-rose-500" : ""}`} />
                        <span>{post.likes} Likes</span>
                      </button>

                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                        <span>{post.comments.length} Discussion Notes</span>
                      </span>
                    </div>

                    {/* Existing Comments */}
                    {post.comments.length > 0 && (
                      <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-900 flex flex-col gap-2 max-h-36 overflow-y-auto">
                        {post.comments.map((comm, cIdx) => (
                          <div key={cIdx} className="text-xs">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                              <strong className="text-violet-400">@{comm.user}</strong>
                              <span>{comm.time}</span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-snug">{comm.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment or ask for design CAD specs..."
                        value={commentInputs[post.id] || ""}
                        onChange={e => { setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value })); }}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                      />
                      <button
                        onClick={() => { handleAddComment(post.id); }}
                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs rounded-lg transition flex items-center justify-center cursor-pointer border-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROCEDURE NAVIGATION BUTTON (BACK TO LAB / WORKBENCH) */}
      {/* ========================================================================= */}
      {onNavigatePhase && (
        <div className="pt-4 border-t border-violet-900/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onNavigatePhase(3);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 font-mono text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Return to Phase 3: Engineering Workbench &amp; Verification Lab</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-mono font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition flex items-center justify-center gap-2 cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Photo, CAD Design or Hardware Inventory</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SHARE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-950 rounded-lg text-violet-400 border border-violet-800">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-mono text-white">Share with Community Commons</h3>
                    <p className="text-xs text-slate-400">Publish photos, 3D CAD design files, or spare inventory parts</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsShareModalOpen(false); }}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SHARE TYPE TOGGLE */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
                <button
                  type="button"
                  onClick={() => { setShareCategory("photo"); }}
                  className={`py-2 px-3 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
                    shareCategory === "photo" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Photo &amp; Build</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setShareCategory("design"); }}
                  className={`py-2 px-3 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
                    shareCategory === "design" ? "bg-pink-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3D CAD Design</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setShareCategory("inventory"); }}
                  className={`py-2 px-3 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
                    shareCategory === "inventory" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Inventory Swap</span>
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handlePublishPost} className="flex flex-col gap-4 text-xs font-mono">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Creation Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6-DOF Hexapod Chassis with Carbon Fiber Plates"
                    value={postTitle}
                    onChange={e => { setPostTitle(e.target.value); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Builder Handle</label>
                    <input
                      type="text"
                      placeholder="Your handle (e.g. RoboMaker_42)"
                      value={postBuilder}
                      onChange={e => { setPostBuilder(e.target.value); }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Rover, ESP32, 3D-Print"
                      value={postTags}
                      onChange={e => { setPostTags(e.target.value); }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Photo / Image URL</label>
                  <input
                    type="text"
                    placeholder="https://... or leave empty for default verified image"
                    value={postImageUrl}
                    onChange={e => { setPostImageUrl(e.target.value); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Description &amp; Build Advice</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the assembly steps, materials used, obstacle performance, or details on inventory items available for swap..."
                    value={postDescription}
                    onChange={e => { setPostDescription(e.target.value); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-violet-500 focus:outline-none resize-none font-sans text-xs"
                  />
                </div>

                {/* CONDITIONAL: 3D CAD FILES ATTACHMENT */}
                {(shareCategory === "design" || shareCategory === "photo") && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-pink-900/40 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-pink-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Attached 3D CAD / Schematic Files</span>
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. chassis_base_v2.stl"
                        defaultValue="chassis_base_v2.stl"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 text-xs"
                      />
                      <span className="px-3 py-2 bg-pink-950 border border-pink-800 text-pink-300 rounded text-xs font-bold">
                        STL / STEP
                      </span>
                    </div>
                  </div>
                )}

                {/* CONDITIONAL: INVENTORY ITEMS TO SHARE/SWAP */}
                {shareCategory === "inventory" && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/40 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5" />
                      <span>Spare Hardware Inventory Item</span>
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Component name"
                        defaultValue="ESP32-S3 Dev Board"
                        className="col-span-2 bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Price $"
                        defaultValue="7"
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold transition shadow-lg shadow-violet-950/40 border-0 cursor-pointer"
                  >
                    Publish to Commons
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* PHOTO LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPhotoModal && (
          <div 
            onClick={() => { setSelectedPhotoModal(null); }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col cursor-default"
            >
              <div className="flex items-center justify-between p-3.5 bg-slate-950 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-violet-400" />
                  <span>High-Resolution Community Build Photo</span>
                </span>
                <button
                  onClick={() => setSelectedPhotoModal(null)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
                <img 
                  src={selectedPhotoModal} 
                  alt="High Resolution Community Build" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default CommunityCommons;
