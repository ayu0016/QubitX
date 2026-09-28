import { ArrowRight, Flame } from "lucide-react";
import type { ModuleItem, RecommendationItem } from "../types";

interface Props {
  onResumeLesson: () => void;
  onOpenMastery: () => void;
  onOpenJobs: () => void;
  onOpenConsistency: () => void;
  modules: ModuleItem[];
  onSelectModule: (module: ModuleItem) => void;
  onSeeAllModules: () => void;
  recommendations: RecommendationItem[];
  onSelectRecommendation: (rec: RecommendationItem) => void;
}

const MODULE_ACCENTS: Record<
  string,
  { bg: string; border: string; bar: string; text: string }
> = {
  indigo: {
    bg: "bg-[#F6F7FE]",
    border: "border-indigo-100/80",
    bar: "bg-indigo-600",
    text: "text-indigo-600",
  },
  blue: {
    bg: "bg-[#F1F8FE]",
    border: "border-blue-100/80",
    bar: "bg-blue-600",
    text: "text-blue-600",
  },
  amber: {
    bg: "bg-[#FFFCF5]",
    border: "border-amber-100/80",
    bar: "bg-amber-500",
    text: "text-amber-600",
  },
};

export default function CommunityDashboardView({
  onResumeLesson,
  onOpenMastery,
  onOpenJobs,
  onOpenConsistency,
  modules,
  onSelectModule,
  onSeeAllModules,
  recommendations,
  onSelectRecommendation,
}: Props) {
  // Grab 3 main modules
  const topModules = modules.slice(0, 3);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-200">
      {/* ── 1. Resume Learning Hero ──────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-between p-8 rounded-[24px] overflow-hidden"
        style={{
          background: "#F6F8FF",
          boxShadow: "0 5px 30px -5px rgba(79,70,229,0.06)",
          border: "1px solid rgba(224,231,255,0.70)",
        }}
      >
        {/* Left gradient accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{
            background:
              "linear-gradient(180deg, #EC4899 0%, #A855F7 50%, #6366F1 100%)",
          }}
        />

        {/* Faint circuit decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-[420px] opacity-20 pointer-events-none overflow-hidden">
          <svg width="420" height="220" viewBox="0 0 420 220" fill="none" className="absolute top-0 right-0">
            <rect x="160" y="100" width="225" height="95" rx="2" stroke="#6366F1" strokeWidth="1.5" transform="rotate(-20 160 100)" />
            <rect x="218" y="3" width="225" height="95" rx="2" stroke="#6366F1" strokeWidth="1.5" transform="rotate(35 218 3)" />
            <rect x="340" y="-6" width="232" height="95" rx="2" stroke="#6366F1" strokeWidth="1.5" transform="rotate(90 340 -6)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[540px]">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="flex items-center gap-2 px-3 py-1 rounded-full text-[13px] font-medium text-purple-800"
              style={{ background: "#FAF5FF", border: "1px solid #E9D5FF" }}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              AI recommended
            </span>
          </div>

          <h2 className="text-[28px] font-bold text-slate-900 leading-tight mb-2">
            Pick up where you left off
          </h2>
          <p className="text-[15px] text-slate-600 leading-relaxed">
            Entanglement — you're 61% through. Your tutor already has a hint ready if you get stuck.
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={onResumeLesson}
          className="relative z-10 flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-full text-[15px] font-semibold hover:bg-slate-700 transition-colors shrink-0 ml-6 cursor-pointer shadow-sm active:scale-98"
        >
          <span>Resume lesson</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── 2. Statistics Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Mastery Status */}
        <div
          onClick={onOpenMastery}
          className="p-6 rounded-2xl border bg-[#F5F7FF] border-indigo-100/80 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
              MASTERY STATUS
            </span>
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center text-indigo-600">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                <rect x="0" y="8" width="4" height="12" rx="2" fill="currentColor" />
                <rect x="7" y="4" width="4" height="16" rx="2" fill="currentColor" />
                <rect x="14" y="0" width="4" height="20" rx="2" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-[38px] font-extrabold text-slate-900 leading-none">
                4
              </span>
              <span className="text-[20px] font-normal text-slate-400">/ 12</span>
            </div>
            <p className="text-[14px] text-slate-500 mt-1.5 flex items-center justify-between">
              <span>Concepts mastered</span>
              <span className="text-[12px] font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                View breakdown →
              </span>
            </p>
          </div>
        </div>

        {/* Card 2: Simulator Jobs */}
        <div
          onClick={onOpenJobs}
          className="p-6 rounded-2xl border bg-[#F0F7FF] border-blue-100/80 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
              SIMULATOR JOBS
            </span>
            <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center text-sky-600">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="7" y="7" width="4" height="4" fill="currentColor" />
                <line x1="0" y1="6" x2="4" y2="6" stroke="currentColor" strokeWidth="1.5" />
                <line x1="0" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.5" />
                <line x1="14" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" />
                <line x1="14" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-[38px] font-extrabold text-slate-900 leading-none">
                27
              </span>
              <p className="text-[14px] text-slate-500 mt-1.5">Circuits to run</p>
            </div>
            {/* Sparkline */}
            <div className="flex items-end gap-1.5 pb-2">
              {[8, 18, 11, 24, 14, 28, 21].map((h, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full bg-sky-400"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Consistency */}
        <div
          onClick={onOpenConsistency}
          className="p-6 rounded-2xl border bg-[#FFFBF2] border-amber-100/80 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
              CONSISTENCY
            </span>
            <div className="w-12 h-12 bg-[#FFFBEB] rounded-xl flex items-center justify-center text-amber-600">
              <Flame size={22} className="fill-amber-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-[38px] font-extrabold text-slate-900 leading-none">
                5
              </span>
              <span className="text-[20px] font-normal text-slate-400">days</span>
            </div>
            <p className="text-[14px] text-slate-500 mt-1.5 flex items-center justify-between">
              <span>Day streak</span>
              <span className="text-[12px] font-semibold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                View history →
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Your Modules ──────────────────────────────────────────────── */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-slate-900">Your modules</h2>
          <button
            type="button"
            onClick={onSeeAllModules}
            className="text-[14px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topModules.map((item) => {
            const acc = MODULE_ACCENTS[item.accentColor] || MODULE_ACCENTS.indigo;
            return (
              <div
                key={item.id}
                onClick={() => onSelectModule(item)}
                className={`p-6 rounded-2xl border ${acc.bg} ${acc.border} flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow group min-h-[200px]`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-mono text-slate-400 font-semibold">
                      {item.moduleNumber}
                    </span>
                    <span className="text-[13px] font-bold text-slate-600">
                      {item.progress}% complete
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[19px] font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mt-4">
                  <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${acc.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[13px]">
                    <span className="text-slate-400 font-medium">Continue lesson</span>
                    <span className={`font-semibold ${acc.text} flex items-center gap-1`}>
                      Open →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Recommended Next ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[22px] font-bold text-slate-900">Recommended next</h2>
          <span
            className="flex items-center gap-2 px-3 py-1 rounded-full text-[13px] font-medium text-emerald-800"
            style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            AI personalized
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectRecommendation(rec)}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: rec.dotColor }}
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-[16px]">
                    {rec.title}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    {rec.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRecommendation(rec);
                }}
                className="px-5 py-2 bg-white rounded-full border border-slate-300 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
