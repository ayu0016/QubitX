import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Zap,
  Clock,
  Target,
  Lock,
  CheckCircle2,
  FlaskConical,
  BookOpen,
  Star,
  Flame,
  Award,
  ChevronRight,
  Sparkles,
  Shield,
  Cpu,
} from "lucide-react";
import {
  CHALLENGES,
  CHALLENGE_BADGES,
  type ChallengeMode,
  type ChallengeDifficulty,
  type ChallengeBadge,
  type ChallengeItem,
} from "../data/mockChallenges";

// ─── Utility ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── AnimatedBar ─────────────────────────────────────────────────────────────

function AnimatedBar({
  percent,
  color = "#6366F1",
  delay = 0,
  thin = false,
}: {
  percent: number;
  color?: string;
  delay?: number;
  thin?: boolean;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), delay + 80);
    return () => clearTimeout(t);
  }, [percent, delay]);

  return (
    <div
      className={cn(
        "flex-1 relative bg-slate-100 overflow-hidden rounded-full",
        thin ? "h-1.5" : "h-2.5"
      )}
    >
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color} 0%, #818CF8 100%)`,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
    </div>
  );
}

// ─── AnimatedNumber ───────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES: Record<
  ChallengeDifficulty,
  { label: string; classes: string }
> = {
  beginner: {
    label: "Beginner",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  intermediate: {
    label: "Intermediate",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  advanced: {
    label: "Advanced",
    classes: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const MODE_CONFIG: Record<
  ChallengeMode,
  { label: string; icon: React.ReactNode; cta: string; color: string; bg: string }
> = {
  lab: {
    label: "Quantum Lab",
    icon: <FlaskConical size={13} />,
    cta: "Open in Quantum Lab",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  mcq: {
    label: "MCQ Quiz",
    icon: <BookOpen size={13} />,
    cta: "Start MCQ",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  code: {
    label: "Code",
    icon: <Cpu size={13} />,
    cta: "Open Code Editor",
    color: "#059669",
    bg: "#ECFDF5",
  },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  weekly: <Flame size={15} className="text-amber-500" />,
  circuit: <Zap size={15} className="text-blue-500" />,
  algorithm: <Target size={15} className="text-violet-500" />,
  topic: <BookOpen size={15} className="text-emerald-500" />,
  noise: <Shield size={15} className="text-rose-500" />,
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "weekly", label: "Weekly" },
  { id: "circuit", label: "Circuits" },
  { id: "algorithm", label: "Algorithms" },
  { id: "topic", label: "Topic MCQ" },
  { id: "noise", label: "Noise & Error" },
];

// ─── ChallengeCard ────────────────────────────────────────────────────────────

function ChallengeCard({ challenge }: { challenge: ChallengeItem }) {
  const diff = DIFFICULTY_STYLES[challenge.difficulty];
  const mode = MODE_CONFIG[challenge.mode];
  const isCompleted = challenge.status === "completed";
  const isLocked = challenge.status === "locked";

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-200",
        isCompleted
          ? "bg-[#F0FDF4] border-emerald-200/70"
          : isLocked
          ? "bg-slate-50 border-slate-200/70 opacity-60"
          : "bg-white border-slate-200/70 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200/60 cursor-pointer"
      )}
      style={
        !isCompleted && !isLocked
          ? { boxShadow: "0 1px 4px rgba(99,102,241,0.05)" }
          : undefined
      }
    >
      {/* Completed ribbon */}
      {isCompleted && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
          <CheckCircle2 size={11} className="text-emerald-600" />
          <span className="text-[10px] font-bold text-emerald-700">Done</span>
        </div>
      )}

      {/* Locked icon */}
      {isLocked && (
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
          <Lock size={12} className="text-slate-400" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 pr-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: mode.bg }}
        >
          <span style={{ color: mode.color }}>{mode.icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            {challenge.subtitle}
          </p>
          <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
            {challenge.title}
          </h3>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border",
            diff.classes
          )}
        >
          {diff.label}
        </span>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border"
          style={{
            background: mode.bg,
            borderColor: `${mode.color}33`,
            color: mode.color,
          }}
        >
          {mode.icon}
          {mode.label}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium ml-auto">
          <Clock size={11} />
          {challenge.timeEstimate}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Star size={13} className="text-amber-500 fill-amber-400" />
          <span className="text-[13px] font-bold text-slate-700">
            +{challenge.xp} XP
          </span>
        </div>
        {!isLocked && (
          <button
            disabled={isCompleted}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all",
              isCompleted
                ? "bg-emerald-100 text-emerald-700 cursor-default"
                : "bg-slate-900 text-white hover:bg-indigo-600 active:scale-95"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={12} />
                Completed
              </>
            ) : (
              <>
                {mode.cta}
                <ChevronRight size={13} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── BadgeCard ────────────────────────────────────────────────────────────────

function BadgeCard({ badge }: { badge: ChallengeBadge }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-200",
        badge.earned
          ? "hover:-translate-y-0.5 hover:shadow-md"
          : "opacity-60 grayscale"
      )}
      style={{
        background: badge.earned ? badge.bg : "#F8FAFC",
        borderColor: badge.earned ? badge.border : "#E2E8F0",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border shadow-sm"
        style={{
          background: badge.earned ? "white" : "#F1F5F9",
          borderColor: badge.earned ? badge.border : "#CBD5E1",
        }}
      >
        {badge.earned ? badge.emoji : <Lock size={16} className="text-slate-400" />}
      </div>

      <p
        className="text-[12px] font-bold leading-tight"
        style={{ color: badge.earned ? badge.textColor : "#94A3B8" }}
      >
        {badge.name}
      </p>

      {!badge.earned && badge.progress > 0 && (
        <div className="w-full">
          <AnimatedBar percent={badge.progress} color="#6366F1" thin delay={200} />
          <p className="text-[10px] text-slate-400 mt-1">{badge.progress}%</p>
        </div>
      )}

      <p className="text-[10px] text-slate-400 leading-snug">{badge.requirement}</p>

      {badge.earned && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border text-[10px] font-bold"
          style={{ borderColor: badge.border, color: badge.textColor }}
        >
          <Award size={9} />
          Earned
        </span>
      )}
    </div>
  );
}

// ─── XP / Level banner ────────────────────────────────────────────────────────

function XPBanner() {
  const totalXP = CHALLENGES.filter((c) => c.status === "completed").reduce(
    (acc, c) => acc + c.xp,
    0
  );
  const completedCount = CHALLENGES.filter((c) => c.status === "completed").length;
  const openCount = CHALLENGES.filter((c) => c.status === "open").length;
  const levelXP = 1500;
  const levelProgress = Math.min(Math.round((totalXP / levelXP) * 100), 100);

  return (
    <div
      className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl overflow-hidden"
      style={{
        background: "#F7F9FF",
        border: "1px solid rgba(224, 231, 255, 0.90)",
        boxShadow: "0 2px 8px rgba(79,70,229,0.04)",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl"
        style={{
          background: "linear-gradient(180deg, #F59E0B 0%, #EC4899 50%, #6366F1 100%)",
        }}
      />

      <div className="absolute right-0 top-0 bottom-0 w-72 opacity-10 pointer-events-none overflow-hidden">
        <svg width="288" height="180" viewBox="0 0 288 180" fill="none" className="absolute top-0 right-0">
          <rect x="60" y="50" width="200" height="90" rx="2" stroke="#6366F1" strokeWidth="1.5" transform="rotate(-15 60 50)" />
          <rect x="160" y="10" width="160" height="80" rx="2" stroke="#A855F7" strokeWidth="1.5" transform="rotate(30 160 10)" />
          <circle cx="220" cy="90" r="20" stroke="#6366F1" strokeWidth="1.2" />
          <circle cx="220" cy="90" r="5" fill="#6366F1" />
        </svg>
      </div>

      <div className="relative z-10 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="flex items-center gap-2 px-3 py-1 rounded-full text-[13px] font-semibold text-amber-800"
            style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
          >
            <Trophy size={13} className="text-amber-500" />
            Level 4 — Circuit Architect
          </span>
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium text-indigo-700 border border-indigo-200"
            style={{ background: "#EEF2FF" }}
          >
            <Sparkles size={11} />
            {completedCount} completed
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
          <AnimatedNumber value={totalXP} /> XP earned
          <span className="text-slate-400 text-lg font-normal ml-2">/ {levelXP} to Level 5</span>
        </h2>

        <div className="flex items-center gap-3">
          <AnimatedBar percent={levelProgress} color="#F59E0B" delay={100} />
          <span className="text-[13px] font-bold text-amber-600 shrink-0">{levelProgress}%</span>
        </div>

        <p className="text-[13px] text-slate-500">
          <span className="font-semibold text-indigo-600">{openCount} challenges</span> available now — keep solving to unlock more!
        </p>
      </div>

      <div className="relative z-10 shrink-0 grid grid-cols-3 gap-3">
        {[
          { label: "Completed", value: completedCount, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
          { label: "Open", value: openCount, color: "#6366F1", bg: "#EEF2FF", border: "#C7D2FE" },
          { label: "Badges", value: CHALLENGE_BADGES.filter((b) => b.earned).length, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border min-w-[72px]"
            style={{ background: stat.bg, borderColor: stat.border }}
          >
            <span className="text-2xl font-extrabold" style={{ color: stat.color }}>
              {stat.value}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 mt-0.5">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ChallengesPage ───────────────────────────────────────────────────────────

export default function ChallengesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("all");

  const filtered = CHALLENGES.filter((c) => {
    const catMatch = activeCategory === "all" || c.category === activeCategory;
    const diffMatch = activeDifficulty === "all" || c.difficulty === activeDifficulty;
    return catMatch && diffMatch;
  });

  const earnedBadges = CHALLENGE_BADGES.filter((b) => b.earned);
  const unearnedBadges = CHALLENGE_BADGES.filter((b) => !b.earned);

  return (
    <div className="p-8 lg:p-10 flex flex-col gap-8 min-h-full w-full max-w-[1400px] mx-auto">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Trophy size={20} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Challenges
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Test your quantum skills — solve challenges to earn XP and unlock badges.
            </p>
          </div>
        </div>
      </div>

      {/* ── XP / Level banner ───────────────────────────────────────── */}
      <XPBanner />

      {/* ── Challenges section ──────────────────────────────────────── */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">All Challenges</h2>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Difficulty
            </span>
            {(["all", "beginner", "intermediate", "advanced"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className={cn(
                  "px-3 py-1 rounded-full text-[12px] font-semibold border transition-all",
                  activeDifficulty === d
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                )}
              >
                {d === "all" ? "All" : DIFFICULTY_STYLES[d].label}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition-all",
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              )}
            >
              {cat.id !== "all" && CATEGORY_ICONS[cat.id]}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Target size={24} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-400 font-medium">No challenges match these filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </section>

      {/* ── Badges section ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-5 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">Badges & Rewards</h2>
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border"
            style={{ background: "#FFFBEB", borderColor: "#FDE68A", color: "#B45309" }}
          >
            <Trophy size={11} />
            {earnedBadges.length} / {CHALLENGE_BADGES.length} earned
          </span>
        </div>

        {/* Overall progress bar */}
        <div
          className="flex items-center gap-4 p-5 rounded-2xl border"
          style={{ background: "#FAFAFA", borderColor: "#E2E8F0" }}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-indigo-600" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-slate-700">
                Complete challenges to unlock more badges
              </p>
              <span className="text-[12px] font-bold text-indigo-600">
                {Math.round((earnedBadges.length / CHALLENGE_BADGES.length) * 100)}%
              </span>
            </div>
            <AnimatedBar
              percent={Math.round((earnedBadges.length / CHALLENGE_BADGES.length) * 100)}
              color="#6366F1"
              delay={300}
            />
          </div>
        </div>

        {/* Earned */}
        {earnedBadges.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Earned — {earnedBadges.length}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {earnedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        )}

        {/* Locked */}
        {unearnedBadges.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Locked — {unearnedBadges.length}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {unearnedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
