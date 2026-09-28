import { useState } from "react";
import { Search, Flame, Users, ArrowRight } from "lucide-react";
import type { TrendingTopic } from "../types";

interface Props {
  topics: TrendingTopic[];
  onSelectTopic: (topic: TrendingTopic) => void;
}

type CategoryFilter =
  | "All"
  | "Quantum Computing"
  | "AI / ML"
  | "Programming"
  | "Backend"
  | "GenAI";

export default function TrendingTopicsView({ topics, onSelectTopic }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const categories: CategoryFilter[] = [
    "All",
    "Quantum Computing",
    "AI / ML",
    "Backend",
    "GenAI",
  ];

  // Filtering
  const filtered = topics.filter((t) => {
    if (activeCategory !== "All" && t.category !== activeCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* ── Subtitle / Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">
            Trending Topics
          </h2>
          <p className="text-[14px] text-slate-500 mt-0.5">
            Explore what learners are studying, simulating, and building right now.
          </p>
        </div>
      </div>

      {/* ── Search & Category Filter ────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={[
                  "px-4 py-1.5 rounded-full text-[13px] font-medium transition-all select-none cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-[#0B1C30] text-white font-semibold shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[260px] sm:min-w-[320px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="w-full h-9 pl-9 pr-4 rounded-full bg-white border border-slate-200 text-[13px] outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ── Topics Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-[24px] border border-slate-200/90 p-8 flex flex-col items-center justify-center gap-2">
            <p className="text-[16px] font-semibold text-slate-800">
              No trending topics found
            </p>
            <p className="text-[13px] text-slate-400">
              Try switching your category filter or search terms.
            </p>
          </div>
        ) : (
          filtered.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="p-6 rounded-[24px] border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group min-h-[220px]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-mono font-bold text-indigo-600">
                    {topic.tag}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    {topic.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-[19px] font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Users size={14} className="text-slate-400" />
                    <span>{topic.learnersCount.toLocaleString()} learners</span>
                  </span>

                  <span className="flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <Flame size={12} className="fill-emerald-500" />
                    <span>+{topic.growthRate}% this week</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTopic(topic);
                  }}
                  className="w-full py-2 bg-slate-50 group-hover:bg-[#0B1C30] text-slate-700 group-hover:text-white rounded-xl text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Explore</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
