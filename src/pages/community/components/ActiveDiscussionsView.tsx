import { useState } from "react";
import {
  Search,
  ChevronDown,
  Check,
  Bookmark,
  ArrowRight,
  Play,
  Copy,
  CheckCircle2,
  Atom,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DiscussionItem } from "../types";
import { ROUTES } from "../../../utils/routes";

interface Props {
  discussions: DiscussionItem[];
  onSelectDiscussion: (disc: DiscussionItem) => void;
  onToggleBookmark: (id: string) => void;
  onNewDiscussion?: () => void;
}

type FilterCategory = "All" | "Questions" | "Discussions" | "Projects";
type SortOption = "latest" | "active" | "likes" | "views";

export default function ActiveDiscussionsView({
  discussions,
  onSelectDiscussion,
  onToggleBookmark,
}: Props) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [forkNotification, setForkNotification] = useState<string | null>(null);

  // Filter items
  let filtered = discussions.filter((item) => {
    // Category filter
    if (activeFilter === "Questions" && item.type !== "question") return false;
    if (activeFilter === "Discussions" && item.type !== "discussion") return false;
    if (activeFilter === "Projects" && item.type !== "project") return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });

  // Sort items
  filtered = [...filtered].sort((a, b) => {
    if (sortOption === "active") return b.repliesCount - a.repliesCount;
    if (sortOption === "likes") return b.likesCount - a.likesCount;
    if (sortOption === "views") return b.viewsCount - a.viewsCount;
    // Default latest (by array position)
    return 0;
  });

  const handleOpenLab = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(ROUTES.quantumLab);
  };

  const handleFork = (e: React.MouseEvent, circuitCode?: string) => {
    e.stopPropagation();
    if (circuitCode) {
      navigator.clipboard.writeText(circuitCode);
      setForkNotification("Circuit copied to clipboard! Ready to paste in Lab.");
      setTimeout(() => setForkNotification(null), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {forkNotification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-[13px] font-medium shadow-lg animate-in slide-in-from-top-2 duration-150 flex items-center gap-2">
          <Check size={14} className="text-emerald-400" />
          <span>{forkNotification}</span>
        </div>
      )}

      {/* ── Subtitle / Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">
            Active Discussions
          </h2>
          <p className="text-[14px] text-slate-500 mt-0.5">
            Join conversations, ask questions, and share quantum circuits with the community.
          </p>
        </div>
      </div>

      {/* ── Filter / Search / Sort Bar (Exactly matching screenshot) ────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left Filter Pills */}
        <div className="flex items-center gap-2">
          {(["All", "Questions", "Discussions", "Projects"] as FilterCategory[]).map(
            (category) => {
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveFilter(category)}
                  className={[
                    "px-4 py-1.5 rounded-full text-[13px] font-medium transition-all select-none cursor-pointer",
                    isActive
                      ? "bg-[#6366F1] text-white font-semibold shadow-xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {category}
                </button>
              );
            }
          )}
        </div>

        {/* Center & Right: Search + Sort */}
        <div className="flex items-center gap-3 flex-1 sm:flex-initial justify-end">
          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[320px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, questions, projects..."
              className="w-full h-9 pl-9 pr-4 rounded-full bg-white border border-slate-200 text-[13px] outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[13px] text-slate-700 font-medium hover:border-slate-300 transition-colors cursor-pointer select-none"
            >
              <span>
                Sort:{" "}
                <span className="font-semibold">
                  {sortOption === "latest"
                    ? "Latest"
                    : sortOption === "active"
                    ? "Most Active"
                    : sortOption === "likes"
                    ? "Most Liked"
                    : "Most Viewed"}
                </span>
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-2xl border border-slate-200 shadow-lg py-1 z-50 text-[13px] animate-in fade-in zoom-in-95 duration-100">
                {[
                  { id: "latest", label: "Latest" },
                  { id: "active", label: "Most Active" },
                  { id: "likes", label: "Most Liked" },
                  { id: "views", label: "Most Viewed" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSortOption(s.id as SortOption);
                      setSortDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>{s.label}</span>
                    {sortOption === s.id && (
                      <Check size={14} className="text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Discussion Cards List ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-[24px] border border-slate-200/90 p-8 flex flex-col items-center justify-center gap-3">
            <p className="text-[16px] font-semibold text-slate-800">
              No discussions found
            </p>
            <p className="text-[13px] text-slate-400 max-w-sm">
              Try adjusting your search query or switching the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-[13px] font-semibold hover:bg-slate-200 transition-colors mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectDiscussion(item)}
              className="p-6 rounded-[24px] border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col gap-4 cursor-pointer group"
            >
              {/* Top row: Avatar + Author + Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar Initials */}
                  <div className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-[13px] flex items-center justify-center select-none shrink-0">
                    {item.avatarInitials}
                  </div>

                  <div className="flex items-center gap-1.5 text-[13px] flex-wrap">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.author}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400 font-medium">{item.level}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">{item.timeAgo}</span>
                  </div>
                </div>

                {/* Right Badges */}
                <div className="flex items-center gap-2">
                  {item.type === "question" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F0F7FF] text-[#0284C7] border border-sky-200 text-[11px] font-bold tracking-wide">
                      QUESTION
                    </span>
                  )}
                  {item.type === "project" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#D97706] border border-amber-200 text-[11px] font-bold tracking-wide">
                      PROJECT
                    </span>
                  )}
                  {item.type === "discussion" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5FF] text-[#9333EA] border border-purple-200 text-[11px] font-bold tracking-wide">
                      DISCUSSION
                    </span>
                  )}
                  {item.isSolved && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-emerald-200 text-[11px] font-bold tracking-wide flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      <span>Solved</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Snippet */}
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-[17px] text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[14px] text-slate-600 leading-relaxed line-clamp-2">
                  {item.snippet}
                </p>
              </div>

              {/* Embedded Circuit Box (if provided) */}
              {item.embeddedCircuit && (
                <div className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-sky-100 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <Atom size={16} className="text-sky-600" />
                    <span className="font-mono text-[13px] font-bold text-slate-900">
                      {item.embeddedCircuit.title}
                    </span>
                    {item.embeddedCircuit.gates && (
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-500 font-medium">
                        Gates: {item.embeddedCircuit.gates}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleFork(e, item.embeddedCircuit?.circuitCode)}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[12px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Copy size={12} className="text-slate-500" />
                      <span>Fork</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenLab}
                      className="px-4 py-1.5 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[12px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Play size={11} className="fill-white" />
                      <span>Open in Lab →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Footer: Category + Metrics + Actions */}
              <div className="flex items-center justify-between pt-1">
                {/* Left: Category Pill */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-medium">
                    {item.category}
                  </span>

                  <span className="text-[12px] text-slate-400">
                    {item.repliesCount} Replies • {item.viewsCount} Views
                  </span>
                </div>

                {/* Right: Bookmark + Reply */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(item.id);
                    }}
                    className="text-slate-400 hover:text-slate-700 p-1 transition-colors"
                    title="Bookmark discussion"
                  >
                    <Bookmark
                      size={16}
                      className={item.isBookmarked ? "text-amber-500 fill-amber-500" : ""}
                    />
                  </button>

                  <span className="text-[13px] font-semibold text-[#6366F1] group-hover:text-indigo-800 transition-colors flex items-center gap-1">
                    <span>Reply</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
