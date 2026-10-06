import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  onSnapshot,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ShowcaseComment {
  user: string;
  text: string;
  time: string;
}

export interface ShowcaseHardwareRef {
  name: string;
  category: string;
  estimatedPriceUSD: number;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  builder: string;
  authorUid?: string;
  description: string;
  hardware: ShowcaseHardwareRef[];
  llmSpec?: string;
  image: string;
  workTimeDays: number;
  totalCost: number;
  likes: number;
  likedBy?: string[];
  comments: ShowcaseComment[];
  publishedAt?: string;
  version?: string;
}

export const SEED_SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "proj_1",
    title: "OmniDrive Delivery Sentinel",
    builder: "Roxie_88",
    authorUid: "seed_builder_1",
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
    ],
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    version: "1.0.0"
  },
  {
    id: "proj_2",
    title: "6-DOF Precision Hand Gripper",
    builder: "Volt_Arch",
    authorUid: "seed_builder_2",
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
    ],
    publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    version: "1.0.0"
  },
  {
    id: "proj_3",
    title: "Self-Stabilizing Insect Hexapod",
    builder: "Hex_Slinger",
    authorUid: "seed_builder_3",
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
    ],
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    version: "1.0.0"
  }
];

let memoryShowcaseCache: ShowcaseProject[] = [...SEED_SHOWCASE_PROJECTS];
let isShowcaseSeeded = false;

/**
 * Fetches showcase projects with Firestore synchronization
 */
export async function fetchShowcaseProjects(): Promise<ShowcaseProject[]> {
  try {
    const projectsColl = collection(db, "showcaseProjects");
    const snapshot = await getDocs(query(projectsColl, limit(50)));

    if (!snapshot.empty) {
      const items: ShowcaseProject[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as ShowcaseProject);
      });
      if (items.length > 0) {
        memoryShowcaseCache = items;
        return items;
      }
    }
  } catch (err) {
    console.info("Showcase projects loaded from local curated cache:", err);
  }

  return memoryShowcaseCache;
}

/**
 * Subscribes to real-time showcase project updates
 */
export function subscribeToShowcaseProjects(
  callback: (projects: ShowcaseProject[]) => void
): () => void {
  try {
    const projectsColl = collection(db, "showcaseProjects");
    const unsubscribe = onSnapshot(
      projectsColl,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: ShowcaseProject[] = [];
          snapshot.forEach((docSnap) => {
            items.push(docSnap.data() as ShowcaseProject);
          });
          if (items.length > 0) {
            memoryShowcaseCache = items;
            callback(items);
            return;
          }
        }
        callback(memoryShowcaseCache);
      },
      (error) => {
        console.warn("Showcase subscription error, falling back to cache:", error);
        callback(memoryShowcaseCache);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Failed to subscribe to showcase projects:", err);
    callback(memoryShowcaseCache);
    return () => {};
  }
}

/**
 * Seeds initial showcase projects to Firestore if collection is empty
 */
export async function seedShowcaseProjectsToFirestore(): Promise<void> {
  if (isShowcaseSeeded) return;
  try {
    const projectsColl = collection(db, "showcaseProjects");
    const snapshot = await getDocs(query(projectsColl, limit(2)));
    if (snapshot.size === 0) {
      const promises = SEED_SHOWCASE_PROJECTS.map((proj) => {
        return setDoc(doc(projectsColl, proj.id), proj, { merge: true });
      });
      await Promise.all(promises);
      isShowcaseSeeded = true;
      console.log(`Seeded ${SEED_SHOWCASE_PROJECTS.length} showcase projects to Firestore.`);
    } else {
      isShowcaseSeeded = true;
    }
  } catch (err) {
    console.warn("Error seeding showcase projects:", err);
  }
}

/**
 * Publishes a new robot build to durable Firestore storage
 */
export async function publishShowcaseProject(data: {
  title: string;
  builder: string;
  description: string;
  hardware: ShowcaseHardwareRef[];
  authorUid?: string;
  llmSpec?: string;
  image?: string;
  workTimeDays?: number;
  totalCost: number;
}): Promise<ShowcaseProject> {
  const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newProject: ShowcaseProject = {
    id: newId,
    title: data.title,
    builder: data.builder,
    authorUid: data.authorUid || "anonymous_maker",
    description: data.description,
    hardware: data.hardware,
    llmSpec: data.llmSpec || "Open-source robotics control node.",
    image: data.image || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400",
    workTimeDays: data.workTimeDays || 7,
    totalCost: data.totalCost,
    likes: 1,
    likedBy: data.authorUid ? [data.authorUid] : [],
    comments: [],
    publishedAt: new Date().toISOString(),
    version: "1.0.0"
  };

  try {
    const projDoc = doc(db, "showcaseProjects", newId);
    await setDoc(projDoc, newProject);
  } catch (err) {
    console.warn("Failed to persist showcase project to Firestore, stored locally in memory:", err);
  }

  // Update memory cache
  memoryShowcaseCache = [newProject, ...memoryShowcaseCache];
  return newProject;
}

/**
 * Increments like count on a showcase project
 */
export async function likeShowcaseProject(projectId: string, userUid?: string): Promise<void> {
  // Update memory cache immediately for optimistic UI
  memoryShowcaseCache = memoryShowcaseCache.map((p) =>
    p.id === projectId ? { ...p, likes: p.likes + 1 } : p
  );

  try {
    const projDoc = doc(db, "showcaseProjects", projectId);
    await updateDoc(projDoc, {
      likes: increment(1),
      ...(userUid ? { likedBy: arrayUnion(userUid) } : {})
    });
  } catch (err) {
    console.warn("Failed to update project likes in Firestore:", err);
  }
}

/**
 * Adds a comment to a showcase project in Firestore
 */
export async function addShowcaseComment(
  projectId: string,
  comment: ShowcaseComment
): Promise<void> {
  memoryShowcaseCache = memoryShowcaseCache.map((p) =>
    p.id === projectId ? { ...p, comments: [...p.comments, comment] } : p
  );

  try {
    const projDoc = doc(db, "showcaseProjects", projectId);
    await updateDoc(projDoc, {
      comments: arrayUnion(comment)
    });
  } catch (err) {
    console.warn("Failed to persist comment to Firestore:", err);
  }
}

export const subscribeShowcaseProjects = subscribeToShowcaseProjects;
export const toggleLikeShowcaseProject = likeShowcaseProject;
export const addCommentToShowcaseProject = addShowcaseComment;
export async function publishProjectToCommons(project: ShowcaseProject): Promise<ShowcaseProject> {
  return publishShowcaseProject(project);
}

