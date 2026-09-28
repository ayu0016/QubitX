import { useState } from "react";
import { X, Search, ChevronDown, Check, ArrowRight } from "lucide-react";
import type { ModuleItem } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  modules: ModuleItem[];
  onSelectModule: (module: ModuleItem) => void;
}

type FilterType = "all" | "in_progress" | "completed" | "not_started";
type SortType = "progress" | "recent" | "difficulty";

export default function AllModulesModal({
  isOpen,
  onClose,
  modules,
  onSelectModule,
}: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("progress");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  if (!isOpen) return null;

  // Filter
  let filtered = modules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "completed") return m.progress === 100;
    if (filter === "in_progress") return m.progress > 0 && m.progress < 100;
    if (filter === "not_started") return m.progress === 0;
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === "progress") return b.progress - a.progress;
    if (sort === "difficulty") {
      const rank: Record<string, number> = {
        Beginner: 1,
        "Beginner → Intermediate": 2,
        Intermediate: 3,
        Advanced: 4,
      };
      return (rank[b.difficulty] || 0) - (rank[a.difficulty] || 0);
    }
    // Recently added (default order in array)
    return 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[20px] font-bold text-slate-900">
              Quantum Curriculum Catalog
            </h2>
            <p className="text-[12px] text-slate-500">
              Browse all 8 interactive modules and lab assignments
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-5 border-b border-slate-100 bg-[#FAFBFD] flex items-center justify-between gap-3 flex-wrap shrink-0">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules..."
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(
              [
                { id: "all", label: "All" },
                { id: "in_progress", label: "In Progress" },
                { id: "completed", label: "Completed" },
                { id: "not_started", label: "Not Started" },
              ] as { id: FilterType; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={[
                  "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer",
                  filter === item.id
                    ? "bg-[#0B1C30] text-white font-semibold"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-[12px] text-slate-600 font-medium hover:border-slate-300 transition-colors"
            >
              <span>Sort: {sort === "progress" ? "Progress" : sort === "difficulty" ? "Difficulty" : "Recent"}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {sortMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50 text-[12px]">
                {[
                  { id: "progress", label: "Progress" },
                  { id: "difficulty", label: "Difficulty" },
                  { id: "recent", label: "Recently Added" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSort(s.id as SortType);
                      setSortMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>{s.label}</span>
                    {sort === s.id && <Check size={12} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Module List */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-[14px]">
              No modules found matching your criteria.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectModule(item);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-indigo-200 bg-white hover:bg-indigo-50/20 transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
              >
                <div className="flex flex-col gap-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {item.moduleNumber}
                    </span>
                    <span className="font-bold text-slate-900 text-[15px] group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {item.difficulty}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-24 flex flex-col gap-1 text-right">
                    <span className="text-[12px] font-bold text-indigo-600">
                      {item.progress}%
                    </span>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
