import { useState, useEffect, useCallback, useMemo } from "react";
import { HardwareComponent } from "../types";
import {
  ShowcaseProject,
  SEED_SHOWCASE_PROJECTS,
  subscribeShowcaseProjects,
  toggleLikeShowcaseProject,
  addCommentToShowcaseProject,
  publishProjectToCommons
} from "../services/projectCollaborationService";

export interface UseShowcaseProjectsReturn {
  showcaseProjects: ShowcaseProject[];
  showcaseSearch: string;
  setShowcaseSearch: (search: string) => void;
  showcaseCategoryFilter: string;
  setShowcaseCategoryFilter: (filter: string) => void;
  filteredProjects: ShowcaseProject[];
  selectedShowcaseProject: ShowcaseProject | null;
  setSelectedShowcaseProject: (project: ShowcaseProject | null) => void;
  showcaseCommentInput: string;
  setShowcaseCommentInput: (comment: string) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  userShareTitle: string;
  setUserShareTitle: (title: string) => void;
  userShareDescription: string;
  setUserShareDescription: (desc: string) => void;
  userShareBuilder: string;
  setUserShareBuilder: (builder: string) => void;
  handleLike: (projectId: string, uid?: string, onNotify?: (msg: string) => void) => Promise<void>;
  handleAddComment: (
    projectId: string,
    authorName: string,
    text: string,
    onNotify?: (msg: string) => void
  ) => Promise<void>;
  handlePublishCurrentBuild: (
    activeDrawer: HardwareComponent[],
    grandTotalCost: number,
    uid?: string,
    onNotify?: (msg: string) => void
  ) => Promise<void>;
}

export function useShowcaseProjects(): UseShowcaseProjectsReturn {
  const [showcaseProjects, setShowcaseProjects] = useState<ShowcaseProject[]>(SEED_SHOWCASE_PROJECTS);
  const [showcaseSearch, setShowcaseSearch] = useState("");
  const [showcaseCategoryFilter, setShowcaseCategoryFilter] = useState<string>("all");
  const [selectedShowcaseProject, setSelectedShowcaseProject] = useState<ShowcaseProject | null>(null);
  const [showcaseCommentInput, setShowcaseCommentInput] = useState("");

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [userShareTitle, setUserShareTitle] = useState("");
  const [userShareDescription, setUserShareDescription] = useState("");
  const [userShareBuilder, setUserShareBuilder] = useState("RoboMaker_1");

  // Subscribe to real-time showcase projects if Firestore is active, falling back to seeds
  useEffect(() => {
    const unsub = subscribeShowcaseProjects((projects) => {
      if (projects && projects.length > 0) {
        setShowcaseProjects(projects);
      }
    });
    return () => { unsub(); };
  }, []);

  // Filtered showcase list
  const filteredProjects = useMemo(() => {
    return showcaseProjects.filter((proj) => {
      const matchesSearch =
        proj.title.toLowerCase().includes(showcaseSearch.toLowerCase()) ||
        proj.description.toLowerCase().includes(showcaseSearch.toLowerCase()) ||
        proj.builder.toLowerCase().includes(showcaseSearch.toLowerCase()) ||
        proj.hardware.some((h) => h.name.toLowerCase().includes(showcaseSearch.toLowerCase()));

      const matchesCat =
        showcaseCategoryFilter === "all" ||
        proj.hardware.some((h) => h.category.toLowerCase().includes(showcaseCategoryFilter.toLowerCase()));

      return matchesSearch && matchesCat;
    });
  }, [showcaseProjects, showcaseSearch, showcaseCategoryFilter]);

  // Like project
  const handleLike = useCallback(
    async (projectId: string, uid?: string, onNotify?: (msg: string) => void) => {
      try {
        await toggleLikeShowcaseProject(projectId, uid);
        // Optimistic local update
        setShowcaseProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, likes: p.likes + 1 } : p))
        );
        if (selectedShowcaseProject && selectedShowcaseProject.id === projectId) {
          setSelectedShowcaseProject((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
        }
        onNotify?.("Thank you for supporting this open-source build!");
      } catch (err) {
        console.warn("Error liking project:", err);
      }
    },
    [selectedShowcaseProject]
  );

  // Add comment
  const handleAddComment = useCallback(
    async (
      projectId: string,
      authorName: string,
      text: string,
      onNotify?: (msg: string) => void
    ) => {
      if (!text.trim()) return;
      const newComment = {
        user: authorName.trim() || "Anonymous Maker",
        text: text.trim(),
        time: "Just now"
      };

      try {
        await addCommentToShowcaseProject(projectId, newComment);
        setShowcaseProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, comments: [...p.comments, newComment] } : p))
        );
        if (selectedShowcaseProject && selectedShowcaseProject.id === projectId) {
          setSelectedShowcaseProject((prev) =>
            prev ? { ...prev, comments: [...prev.comments, newComment] } : null
          );
        }
        setShowcaseCommentInput("");
        onNotify?.("Added feedback to project thread!");
      } catch (err) {
        console.warn("Error adding comment:", err);
      }
    },
    [selectedShowcaseProject]
  );

  // Publish project
  const handlePublishCurrentBuild = useCallback(
    async (
      activeDrawer: HardwareComponent[],
      grandTotalCost: number,
      uid?: string,
      onNotify?: (msg: string) => void
    ) => {
      if (!userShareTitle.trim()) {
        onNotify?.("Please provide a title for your robot project.");
        return;
      }

      const newProj: ShowcaseProject = {
        id: `proj_${Date.now()}`,
        title: userShareTitle.trim(),
        builder: userShareBuilder.trim() || "RoboMaker_1",
        authorUid: uid,
        description:
          userShareDescription.trim() ||
          "Custom autonomous build designed and verified with AI RoboPet.",
        hardware: activeDrawer.map((c) => ({
          name: c.name,
          category: c.category,
          estimatedPriceUSD: c.estimatedPriceUSD
        })),
        llmSpec: "Gemini 2.5 Flash / ROS 2 autonomous control profile.",
        image:
          "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=400",
        workTimeDays: 7,
        totalCost: grandTotalCost,
        likes: 1,
        comments: []
      };

      try {
        await publishProjectToCommons(newProj);
        setShowcaseProjects((prev) => [newProj, ...prev]);
        setIsShareModalOpen(false);
        setUserShareTitle("");
        setUserShareDescription("");
        onNotify?.("Successfully shared your robot design to Community Showcase!");
      } catch (err) {
        console.error("Publishing error:", err);
        onNotify?.("Failed to publish project to community.");
      }
    },
    [userShareTitle, userShareBuilder, userShareDescription]
  );

  return {
    showcaseProjects,
    showcaseSearch,
    setShowcaseSearch,
    showcaseCategoryFilter,
    setShowcaseCategoryFilter,
    filteredProjects,
    selectedShowcaseProject,
    setSelectedShowcaseProject,
    showcaseCommentInput,
    setShowcaseCommentInput,
    isShareModalOpen,
    setIsShareModalOpen,
    userShareTitle,
    setUserShareTitle,
    userShareDescription,
    setUserShareDescription,
    userShareBuilder,
    setUserShareBuilder,
    handleLike,
    handleAddComment,
    handlePublishCurrentBuild
  };
}
