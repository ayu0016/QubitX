import { useState } from "react";
import { Search, ChevronDown, Check, Flame, CheckCircle2, User } from "lucide-react";
import type { LearnerItem } from "../types";

interface Props {
  learners: LearnerItem[];
  onSelectLearner: (learner: LearnerItem) => void;
}

type LearnerFilter =
  | "All Learners"
  | "Online Now"
  | "Top Streaks"
  | "Most Active";
type LearnerSort = "activity" | "streak" | "modules" | "recent";

export default function ActiveLearnersView({
  learners,
  onSelectLearner,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<LearnerFilter>("All Learners");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<LearnerSort>("streak");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const filters: LearnerFilter[] = [
    "All Learners",
    "Online Now",
    "Top Streaks",
    "Most Active",
  ];

  // Filter
  let filtered = learners.filter((l) => {
    if (activeFilter === "Online Now" && !l.isOnline) return false;
    if (activeFilter === "Top Streaks" && l.streakDays < 10) return false;
    if (activeFilter === "Most Active" && l.discussionsCount < 15) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.currentTopic.toLowerCase().includes(q) ||
        l.recentActivity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortOption === "streak") return b.streakDays - a.streakDays;
    if (sortOption === "modules") return b.modulesCompleted - a.modulesCompleted;
    if (sortOption === "activity") return b.discussionsCount - a.discussionsCount;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* ── Subtitle / Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">
            Active Learners
          </h2>
          <p className="text-[14px] text-slate-500 mt-0.5">
            See who's learning, building, and contributing right now across the platform.
          </p>
        </div>
      </div>

      {/* ── Filter / Search / Sort Bar ──────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {filters.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={[
                  "px-4 py-1.5 rounded-full text-[13px] font-medium transition-all select-none cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-[#0B1C30] text-white font-semibold shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Center & Right: Search + Sort */}
        <div className="flex items-center gap-3 flex-1 sm:flex-initial justify-end">
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search learners or topics..."
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
                  {sortOption === "streak"
                    ? "Streak"
                    : sortOption === "modules"
                    ? "Modules"
                    : sortOption === "activity"
                    ? "Activity"
                    : "Recent"}
                </span>
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-2xl border border-slate-200 shadow-lg py-1 z-50 text-[13px] animate-in fade-in zoom-in-95 duration-100">
                {[
                  { id: "streak", label: "Streak" },
                  { id: "modules", label: "Modules" },
                  { id: "activity", label: "Activity" },
                  { id: "recent", label: "Recent" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSortOption(s.id as LearnerSort);
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

      {/* ── Learners Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-[24px] border border-slate-200/90 p-8 flex flex-col items-center justify-center gap-2">
            <p className="text-[16px] font-semibold text-slate-800">
              No learners found
            </p>
            <p className="text-[13px] text-slate-400">
              Try adjusting your search query or selecting a different filter.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectLearner(item)}
              className="p-6 rounded-[24px] border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group min-h-[260px]"
            >
              {/* Header with Avatar & Online Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[15px] flex items-center justify-center select-none">
                      {item.avatarInitials}
                    </div>
                    {item.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-[16px] text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      {item.isOnline && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="text-[12px] text-slate-400">
                      Learning:{" "}
                      <span className="font-semibold text-slate-700">
                        {item.currentTopic}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Streak Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[12px]">
                  <Flame size={13} className="fill-amber-500 text-amber-500" />
                  <span>{item.streakDays}d</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-2 my-2 text-[12px]">
                <div>
                  <span className="text-slate-400 text-[11px]">Modules done</span>
                  <p className="font-bold text-slate-900 text-[14px]">
                    {item.modulesCompleted} modules
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Simulator runs</span>
                  <p className="font-bold text-slate-900 text-[14px]">
                    {item.simulatorRuns} runs
                  </p>
                </div>
              </div>

              {/* Recent Activity & CTA */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span className="truncate">
                    Recently: <strong className="text-slate-800">{item.recentActivity}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLearner(item);
                  }}
                  className="w-full py-2 bg-white group-hover:bg-[#0B1C30] text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-transparent rounded-xl text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <User size={13} />
                  <span>View Profile</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
