import React from "react";
import {
  Users,
  Search,
  ArrowRight,
  Heart,
  Upload,
  MessageSquare,
  Send
} from "lucide-react";
import { HardwareComponent } from "../../types";
import { ShowcaseProject } from "../../services/projectCollaborationService";

interface CommunityShowcaseTabProps {
  showcaseSearch: string;
  setShowcaseSearch: (search: string) => void;
  showcaseProjects: ShowcaseProject[];
  selectedShowcaseProject: ShowcaseProject | null;
  setSelectedShowcaseProject: (proj: ShowcaseProject | null) => void;
  showcaseCommentInput: string;
  setShowcaseCommentInput: (input: string) => void;
  activeDrawer: HardwareComponent[];
  onLikeProject: (id: string) => void;
  onAddComment: (e: React.FormEvent) => void;
  onImportMissingParts: (parts: unknown[]) => void;
  onOpenCommons?: () => void;
}

export const CommunityShowcaseTab: React.FC<CommunityShowcaseTabProps> = ({
  showcaseSearch,
  setShowcaseSearch,
  showcaseProjects,
  selectedShowcaseProject,
  setSelectedShowcaseProject,
  showcaseCommentInput,
  setShowcaseCommentInput,
  activeDrawer,
  onLikeProject,
  onAddComment,
  onImportMissingParts,
  onOpenCommons
}) => {
  return (
    <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-6 shadow-2xl flex flex-col gap-6">
      <div className="pb-3 border-b border-slate-800/60 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <Users className="w-5 h-5 text-rose-400" />
            DIY Robotics Community Showcase
          </h3>
          <p className="text-xs text-slate-400">
            Browse completed robot projects, comment on configurations, and calculate adaptation requirements.
          </p>
        </div>
        <div className="relative shrink-0 max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search shared robots..."
            value={showcaseSearch}
            onChange={(e) => setShowcaseSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded px-9 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono"
          />
        </div>
      </div>

      {/* Dedicated Community Commons Jump Banner */}
      {onOpenCommons && (
        <div className="bg-gradient-to-r from-pink-950/40 via-violet-950/30 to-slate-900/60 border border-pink-700/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                Community Commons: Photos, 3D CAD Designs &amp; Spare Inventory Hub
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-pink-900/60 text-pink-300 border border-pink-700/50">
                  Dedicated Phase 4
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Explore real community build photos, download printable 3D CAD STLs, and swap or adopt spare sensor inventory directly into your active BOM drawer.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenCommons}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-mono font-bold text-xs rounded-lg shadow-md transition flex items-center gap-1.5 shrink-0 cursor-pointer border-0"
          >
            <span>Open Community Commons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Showcase list & side detail comparator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Projects list (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {showcaseProjects
            .filter(
              (p) =>
                p.title.toLowerCase().includes(showcaseSearch.toLowerCase()) ||
                p.description.toLowerCase().includes(showcaseSearch.toLowerCase())
            )
            .map((proj) => {
              const isSelected = selectedShowcaseProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedShowcaseProject(proj);
                    setShowcaseCommentInput("");
                  }}
                  className={`rounded border overflow-hidden cursor-pointer transition flex flex-col bg-slate-950 ${
                    isSelected
                      ? "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                      : "border-slate-850 hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Project Photo */}
                    <img
                      src={proj.image}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="w-full md:w-36 h-36 md:h-auto object-cover shrink-0 filter brightness-90 border-b md:border-b-0 md:border-r border-slate-850"
                    />
                    <div className="p-4 flex flex-col justify-between w-full">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold text-white hover:text-rose-400 font-mono">{proj.title}</h4>
                          <span className="text-[10px] bg-rose-950/40 text-rose-400 font-mono border border-rose-900/30 px-2 py-0.5 rounded shrink-0">
                            By @{proj.builder}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal mt-1 mb-2.5 line-clamp-2">
                          {proj.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                        <div className="flex gap-4">
                          <span>
                            Cost: <strong className="text-rose-400">${proj.totalCost}</strong>
                          </span>
                          <span>
                            Time: <strong className="text-slate-400">{proj.workTimeDays}d</strong>
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-1.5 hover:text-rose-400 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLikeProject(proj.id);
                          }}
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                          <span>{proj.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Right: Cost & Alteration Calculator Detail Panel (5 columns) */}
        <div className="lg:col-span-5">
          {selectedShowcaseProject ? (
            <div className="p-5 rounded-xl border border-rose-900/40 bg-rose-950/5 flex flex-col gap-5 text-xs shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-5 pointer-events-none"></div>

              <div className="relative flex flex-col gap-4">
                <div>
                  <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest font-bold block mb-1">
                    ALTERATION ESTIMATE ENGINE
                  </span>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                    Adapt to match: {selectedShowcaseProject.title}
                  </h4>
                </div>

                {/* Calculations */}
                {(() => {
                  const activeNames = activeDrawer.map((item) => item.name.toLowerCase());
                  const missingParts: any[] = [];
                  let matchingPartsCount = 0;

                  selectedShowcaseProject.hardware.forEach((item: any) => {
                    const isNameMatched = activeNames.some(
                      (n) => n.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(n)
                    );
                    if (isNameMatched) {
                      matchingPartsCount++;
                    } else {
                      missingParts.push(item);
                    }
                  });

                  const additionalCost = missingParts.reduce((sum, p) => sum + (p.estimatedPriceUSD || 0), 0);

                  let additionalWorkHours = 4;
                  missingParts.forEach((p) => {
                    if (p.category === "SBC") {
                      additionalWorkHours += 6;
                    } else if (p.category === "Microcontroller") {
                      additionalWorkHours += 3;
                    } else if (p.category === "Sensor" || p.category === "Actuator") {
                      additionalWorkHours += 2;
                    } else {
                      additionalWorkHours += 1.5;
                    }
                  });

                  const roundedWorkHours = Math.round(additionalWorkHours * 10) / 10;
                  const savedCost = selectedShowcaseProject.totalCost - additionalCost;

                  return (
                    <div className="flex flex-col gap-4">
                      {/* Numbers Card Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-950 rounded border border-slate-850 font-mono text-center">
                          <div className="text-[9px] uppercase text-slate-500 mb-0.5">Adaptation Cost</div>
                          <div className="text-base font-bold text-rose-400">${additionalCost}</div>
                        </div>
                        <div className="p-3 bg-slate-950 rounded border border-slate-850 font-mono text-center">
                          <div className="text-[9px] uppercase text-slate-500 mb-0.5">Integration Time</div>
                          <div className="text-base font-bold text-amber-400">{roundedWorkHours} hrs</div>
                        </div>
                      </div>

                      {/* Saved / Matched bar */}
                      <div className="p-3.5 bg-slate-950/60 rounded border border-slate-850 font-mono flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500">Compatibility Index</span>
                          <span className="text-emerald-400 font-bold">
                            {matchingPartsCount} / {selectedShowcaseProject.hardware.length} matched
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all"
                            style={{
                              width: `${(matchingPartsCount / selectedShowcaseProject.hardware.length) * 100}%`
                            }}
                          ></div>
                        </div>
                        <div className="text-[9px] text-slate-500 mt-1 leading-normal">
                          Saves you <strong className="text-emerald-400">${savedCost > 0 ? savedCost : 0}</strong>{" "}
                          because those modules exist in your current setup!
                        </div>
                      </div>

                      {/* Part Details list */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          Required Sourced Modules to Add:
                        </div>
                        {missingParts.length > 0 ? (
                          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                            {missingParts.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="p-2 bg-slate-950 rounded border border-slate-900 flex justify-between items-center text-[10px] font-mono"
                              >
                                <span className="text-slate-300 leading-none truncate max-w-[70%]">
                                  {item.name}
                                </span>
                                <span className="text-rose-400 font-bold shrink-0">${item.estimatedPriceUSD}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-950/10 border border-emerald-900/30 rounded text-center text-[10px] text-emerald-400 font-mono">
                            ✓ Perfect match! You already have all the necessary modules in your build drawer!
                          </div>
                        )}
                      </div>

                      {/* Quick Import Button */}
                      {missingParts.length > 0 && (
                        <button
                          onClick={() => onImportMissingParts(missingParts)}
                          className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono rounded border-0 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/20 text-xs"
                        >
                          <Upload className="w-3.5 h-3.5 rotate-180" />
                          IMPORT MISSING MODULES TO DRAWER
                        </button>
                      )}

                      {/* Showcase comments */}
                      <div className="border-t border-slate-900 pt-4 flex flex-col gap-3">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                          Builder Forum ({selectedShowcaseProject.comments.length})
                        </span>

                        <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                          {selectedShowcaseProject.comments.map((comm: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-slate-950 rounded border border-slate-900 text-[10.5px]"
                            >
                              <div className="flex justify-between font-mono text-slate-500 text-[9px] mb-1">
                                <span className="font-bold text-rose-400">@{comm.user}</span>
                                <span>{comm.time}</span>
                              </div>
                              <p className="text-slate-300 leading-normal font-sans">{comm.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Write Comment form */}
                        <form onSubmit={onAddComment} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ask the builder a question..."
                            value={showcaseCommentInput}
                            onChange={(e) => setShowcaseCommentInput(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-850 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono"
                          />
                          <button
                            type="submit"
                            className="px-3 bg-rose-600 hover:bg-rose-500 rounded border-0 text-white font-mono text-xs font-bold flex items-center justify-center transition cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-900/5 text-center text-slate-500 font-mono text-xs h-64 flex flex-col items-center justify-center gap-2">
              <Users className="w-8 h-8 text-slate-700 animate-pulse" />
              <span>Select a showcase project on the left to run the visual comparison calculator.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
