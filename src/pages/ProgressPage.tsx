import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  TrendingUp,
  Star,
  Zap,
  ArrowRight,
  ChevronRight,
  Flame,
  Activity,
  Sparkles,
} from "lucide-react";
import {
  masteryMetric,
  courseProgress,
  simulatorJobs,
  dayStreak,
  conceptMasteries,
  qubitState,
  skillNodes,
  predictionAccuracy,
  misconceptions,
  activityGrid,
  badges,
  recommendedNext,
} from "../data/mockProgress";

// ─── Utility ─────────────────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const INTENSITY_COLORS: Record<number, string> = {
  0: "#F1F5F9",
  1: "#C7D2FE",
  2: "#818CF8",
  3: "#4F46E5",
  4: "#4338CA",
};

const QUANTUM_STATES: Record<number, { name: string; desc: string }> = {
  0: { name: "Rest (|0⟩)", desc: "No circuits executed" },
  1: { name: "Ground Run", desc: "1 circuit run · 92.4% fidelity" },
  2: { name: "Superposition", desc: "2 circuits run · 96.8% fidelity" },
  3: { name: "Entangled State", desc: "4 circuits run · 98.7% fidelity" },
  4: { name: "Coherent Peak", desc: "7 circuits run · 99.8% fidelity" },
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── AnimatedNumber ───────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 850;
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

// ─── AnimatedBar ──────────────────────────────────────────────────────────────

function AnimatedBar({
  percent,
  color = "#6366F1",
  delay = 0,
}: {
  percent: number;
  color?: string;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), delay + 80);
    return () => clearTimeout(t);
  }, [percent, delay]);

  return (
    <div className="flex-1 h-2.5 relative bg-slate-100 overflow-hidden rounded-full min-w-[80px]">
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

// ─── AnimatedRing ─────────────────────────────────────────────────────────────

function AnimatedRing({
  percent,
  size = 68,
  strokeWidth = 5.5,
  color = "#10B981",
  trackColor = "#E2E8F0",
  label,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
}) {
  const [p, setP] = useState(0);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (p / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setP(percent), 120);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      </svg>
      {label && (
        <span
          className="absolute inset-0 flex items-center justify-center text-slate-900 font-bold"
          style={{ fontSize: size * 0.22 }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ─── BlochSphere Component ───────────────────────────────────────────────────

function BlochSphere({ expertPercent }: { expertPercent: number }) {
  const [animPercent, setAnimPercent] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimPercent(expertPercent), 150);
    return () => clearTimeout(t);
  }, [expertPercent]);

  const aAngle = ((animPercent / 100) * 180 - 180) * (Math.PI / 180);
  const aX = 64 + 38 * Math.sin(aAngle);
  const aY = 64 - 38 * Math.cos(aAngle);

  return (
    <svg width="130" height="130" viewBox="0 0 128 128" fill="none" className="shrink-0 select-none">
      <circle cx="64" cy="64" r="50" stroke="#CBD5E1" strokeWidth="1.1" />
      <ellipse cx="64" cy="64" rx="50" ry="16" stroke="#94A3B8" strokeWidth="0.9" strokeDasharray="3 2" />
      <line x1="64" y1="14" x2="64" y2="114" stroke="#CBD5E1" strokeWidth="0.9" strokeDasharray="4 3" />
      <circle cx="64" cy="64" r="3" fill="#475569" />
      <text x="68" y="16" fontSize="9" fontFamily="Inter" fontWeight="600" fill="#64748B">
        |Expert⟩
      </text>
      <text x="68" y="121" fontSize="9" fontFamily="Inter" fontWeight="600" fill="#64748B">
        |Novice⟩
      </text>
      <line
        x1="64"
        y1="64"
        x2={aX}
        y2={aY}
        stroke="#4F46E5"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ transition: "x2 850ms ease-out, y2 850ms ease-out" }}
      />
      <rect
        x={aX - 5}
        y={aY - 7}
        width="10"
        height="10"
        fill="#0F172A"
        stroke="#4F46E5"
        strokeWidth="2"
        rx="2"
        style={{ transition: "x 850ms ease-out, y 850ms ease-out" }}
      />
      <rect
        x={aX - 1.5}
        y={aY - 10}
        width="5"
        height="5"
        fill="#6366F1"
        rx="1"
        style={{ transition: "x 850ms ease-out, y 850ms ease-out" }}
      />
    </svg>
  );
}

// ─── Skill Constellation (Wide SVG Canvas) ───────────────────────────────────

const COL_X: Record<number, number> = { 1: 65, 2: 175, 3: 285, 4: 395, 5: 505, 6: 615, 7: 715 };
const ROW_Y: Record<number, number> = { 1: 55, 2: 110, 3: 165 };

const STATUS_FILL: Record<string, string> = {
  mastered: "#6366F1",
  "in-progress": "#FFFFFF",
  locked: "#F1F5F9",
};
const STATUS_STROKE: Record<string, string> = {
  mastered: "#4F46E5",
  "in-progress": "#6366F1",
  locked: "#CBD5E1",
};

function SkillConstellation({
  activeNode,
  onNode,
}: {
  activeNode: string | null;
  onNode: (id: string | null) => void;
}) {
  const edges = useMemo(() => {
    const list: Array<{ x1: number; y1: number; x2: number; y2: number; active: boolean }> = [];
    for (let i = 0; i < skillNodes.length; i++) {
      for (let j = i + 1; j < skillNodes.length; j++) {
        const a = skillNodes[i];
        const b = skillNodes[j];
        if (b.col - a.col === 1 && Math.abs(b.row - a.row) <= 1) {
          list.push({
            x1: COL_X[a.col],
            y1: ROW_Y[a.row],
            x2: COL_X[b.col],
            y2: ROW_Y[b.row],
            active: a.status !== "locked" && b.status !== "locked",
          });
        }
      }
    }
    return list;
  }, []);

  return (
    <svg
      viewBox="0 0 780 220"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto overflow-visible select-none py-2"
    >
      {/* Background guide lines */}
      <circle cx="395" cy="110" r="140" fill="none" stroke="#EEF2FF" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="395" cy="110" r="240" fill="none" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 6" />

      {/* Edges */}
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={e.active ? "#6366F1" : "#E2E8F0"}
          strokeWidth={e.active ? 1.8 : 1.2}
          strokeDasharray={e.active ? undefined : "4 3"}
          strokeOpacity={e.active ? 0.8 : 0.6}
        />
      ))}

      {/* Nodes */}
      {skillNodes.map((node) => {
        const cx = COL_X[node.col];
        const cy = ROW_Y[node.row];
        const isActive = activeNode === node.id;
        const r = node.status === "in-progress" ? 11 : node.status === "mastered" ? 10 : 8.5;
        const strokeW = node.status === "in-progress" ? 2.8 : node.status === "mastered" ? 1.5 : 1;
        const labelY = node.row === 1 ? cy - 16 : cy + 22;

        return (
          <g
            key={node.id}
            className="cursor-pointer transition-transform duration-150"
            onClick={() => onNode(isActive ? null : node.id)}
          >
            {/* Halo for in-progress */}
            {node.status === "in-progress" && (
              <circle
                cx={cx}
                cy={cy}
                r={r + 7}
                fill="none"
                stroke="#6366F1"
                strokeWidth="1.2"
                opacity="0.3"
                className="animate-ping"
                style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: "2.4s" }}
              />
            )}
            {/* Active glow */}
            {isActive && (
              <circle cx={cx} cy={cy} r={r + 9} fill="#6366F1" opacity="0.2" />
            )}
            {/* Node circle */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={STATUS_FILL[node.status]}
              stroke={STATUS_STROKE[node.status]}
              strokeWidth={strokeW}
              style={{ filter: node.status === "mastered" ? "drop-shadow(0 2px 5px rgba(99,102,241,0.3))" : undefined }}
            />
            {/* Center dot for in-progress */}
            {node.status === "in-progress" && (
              <circle cx={cx} cy={cy} r={3.5} fill="#6366F1" />
            )}
            {/* Center dot for mastered */}
            {node.status === "mastered" && (
              <circle cx={cx} cy={cy} r={2} fill="#FFFFFF" />
            )}
            {/* Node label */}
            <text
              x={cx}
              y={labelY}
              textAnchor="middle"
              fontSize="9"
              fontFamily="Inter"
              fontWeight={isActive ? "700" : node.status === "in-progress" ? "600" : "500"}
              fill={
                node.status === "locked"
                  ? "#94A3B8"
                  : isActive
                  ? "#4338CA"
                  : "#1E293B"
              }
            >
              {node.label}
            </text>
            {/* Percent */}
            {node.percent !== undefined && (
              <text
                x={cx}
                y={labelY + (node.row === 1 ? -10 : 11)}
                textAnchor="middle"
                fontSize="8"
                fontFamily="Inter"
                fontWeight="700"
                fill={node.status === "mastered" ? "#6366F1" : "#4F46E5"}
              >
                {node.percent}%
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── StatMiniCard ─────────────────────────────────────────────────────────────

function StatMiniCard({
  label,
  value,
  suffix,
  subLabel,
  bg,
  border,
}: {
  label: string;
  value: number;
  suffix?: string;
  subLabel: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl flex flex-col justify-between gap-1 border shadow-sm hover:-translate-y-0.5 transition-all duration-200"
      style={{ background: bg, borderColor: border }}
    >
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 leading-none my-1">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      <p className="text-xs font-medium text-slate-500">{subLabel}</p>
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Mastered: "bg-indigo-50 text-indigo-700 border-indigo-200",
    "In progress": "bg-amber-50 text-amber-700 border-amber-200",
    "Just started": "bg-sky-50 text-sky-700 border-sky-200",
    Locked: "bg-slate-100 text-slate-400 border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
        map[status] ?? "bg-slate-100 text-slate-400"
      )}
    >
      {status}
    </span>
  );
}

// ─── MeasureMeModal ───────────────────────────────────────────────────────────

function MeasureMeModal({
  expertPercent,
  onClose,
}: {
  expertPercent: number;
  onClose: () => void;
}) {
  const outcome = Math.random() > 0.5 ? "Expert" : "Novice";
  const [measured, setMeasured] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCollapsed(false), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className={cn(
          "bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center transition-all duration-300",
          collapsed ? "opacity-0 scale-90" : "opacity-100 scale-100"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!measured ? (
          <>
            <div className="flex justify-center mb-4">
              <BlochSphere expertPercent={expertPercent} />
            </div>
            <p className="text-xs font-mono text-slate-600 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200 inline-block mb-3">
              |ψ⟩ = {(1 - expertPercent / 100).toFixed(2)} |Novice⟩ + {(expertPercent / 100).toFixed(2)} |Expert⟩
            </p>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Collapse Wave Function
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Applying projective measurement along the cognitive basis. Where will your state vector land?
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setMeasured(true)}
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-indigo-600 transition-colors shadow-md shadow-slate-200"
              >
                Measure now
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl bg-indigo-50 border border-indigo-100">
              {outcome === "Expert" ? "✨" : "📈"}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Collapsed to |{outcome}⟩
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {outcome === "Expert"
                ? "State measurement confirms peak coherence! Your circuit telemetry aligns with expert expectations."
                : `Wave function projection confirmed. You are ${expertPercent}% towards |Expert⟩. Each circuit pushes the projection higher.`}
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-full text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              Continue Learning
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ProgressPage ─────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSkillNode, setActiveSkillNode] = useState<string | null>("entanglement-node");
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [expandedMisconception, setExpandedMisconception] = useState<string | null>(null);
  const [activeLatticeFilter, setActiveLatticeFilter] = useState<"all" | "active">("all");

  const activeNode = skillNodes.find((n) => n.id === activeSkillNode);

  // Active qubit hover metadata
  const inspectedQubit = hoveredDay !== null ? {
    day: hoveredDay + 1,
    week: Math.floor(hoveredDay / 7) + 1,
    dayName: DAY_NAMES[hoveredDay % 7],
    intensity: activityGrid[hoveredDay].intensity,
    state: QUANTUM_STATES[activityGrid[hoveredDay].intensity],
  } : null;

  return (
    <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-7 min-h-full w-full max-w-[1400px] mx-auto transition-all duration-300">

      {/* ── 1. Page Header (Full Row) ───────────────────────────────────────── */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Your progress
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Where you stand, concept by concept, and what to tackle next.
          </p>
        </div>

        {/* Dynamic Search / Filter */}
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search modules, circuits, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-8 bg-white rounded-full border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Live Learner Qubit State Banner (Full Row) ────────────────────── */}
      <div
        className="w-full relative flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl overflow-hidden transition-all duration-300"
        style={{
          background: "#F7F9FF",
          border: "1px solid rgba(224, 231, 255, 0.90)",
          boxShadow: "0 2px 8px rgba(79, 70, 229, 0.04)",
        }}
      >
        {/* Left vertical gradient accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{
            background: "linear-gradient(180deg, #6366F1 0%, #A855F7 50%, #4F46E5 100%)",
          }}
        />

        {/* Bloch sphere graphic */}
        <div className="shrink-0 flex items-center justify-center pl-2">
          <BlochSphere expertPercent={qubitState.expertPercent} />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-start gap-2.5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 border border-emerald-200"
            style={{ background: "#ECFDF5" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live learner state
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            You&apos;re a qubit,{" "}
            <span className="text-indigo-600">{qubitState.expertPercent}%</span> of the way to Expert
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Each concept you master tips the arrow toward |Expert⟩. Measure it to see where you&apos;d land today.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <code className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 shadow-sm font-semibold">
              |ψ⟩ = {qubitState.noviceAmplitude} |Novice⟩ + {qubitState.expertAmplitude} |Expert⟩
            </code>
            <button
              onClick={() => setShowMeasureModal(true)}
              className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-indigo-600 transition-all active:scale-95 shadow-md shadow-slate-200"
            >
              Measure me
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Key Metrics Cards (Full Row) ─────────────────────────────────── */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatMiniCard
          label="MASTERY STATUS"
          value={masteryMetric.mastered}
          suffix={` / ${masteryMetric.total}`}
          subLabel="Concepts mastered"
          bg="#F5F7FF"
          border="#E0E7FF"
        />
        <div
          className="p-5 rounded-2xl flex flex-col justify-between gap-1 border shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          style={{ background: "#F0FDF4", borderColor: "#D1FAE5" }}
        >
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">COURSE PROGRESS</p>
          <p className="text-3xl font-extrabold text-slate-900 leading-none my-1">
            <AnimatedNumber value={courseProgress.percent} suffix="%" />
          </p>
          <p className="text-xs font-medium text-slate-500">{courseProgress.moduleName}</p>
        </div>
        <StatMiniCard
          label="SIMULATOR JOBS"
          value={simulatorJobs}
          subLabel="Circuits run"
          bg="#F0F9FF"
          border="#E0F2FE"
        />
        <div
          className="p-5 rounded-2xl flex flex-col justify-between gap-1 border shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          style={{ background: "#FFFBEB", borderColor: "#FEF3C7" }}
        >
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CONSISTENCY</p>
          <div className="flex items-center gap-2 my-1">
            <p className="text-3xl font-extrabold text-slate-900 leading-none">
              <AnimatedNumber value={dayStreak} />
            </p>
            <Flame size={20} className="text-amber-500" />
          </div>
          <p className="text-xs font-medium text-slate-500">Day streak</p>
        </div>
      </div>

      {/* ── 4. Cognitive Mastery Vector (ALWAYS TAKES WHOLE ROW) ─────────────── */}
      <section className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Cognitive mastery vector</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time telemetry and state distribution from your last {simulatorJobs} simulator runs.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 w-fit">
            <Activity size={13} />
            Telemetry active
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {conceptMasteries
            .filter(
              (c) =>
                !searchQuery ||
                c.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((concept, i) => (
              <div
                key={concept.id}
                className="flex items-center gap-4 py-2.5 px-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 rounded-2xl transition-colors"
              >
                <span className="w-48 sm:w-56 text-sm font-semibold text-slate-800 shrink-0">
                  {concept.name}
                </span>
                <AnimatedBar percent={concept.percent} delay={i * 100} />
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-slate-700 w-10 text-right">
                    {concept.percent}%
                  </span>
                  <StatusBadge status={concept.status} />
                </div>
              </div>
            ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Adaptive cognitive assessment confidence: <strong className="text-slate-700">94.8%</strong></span>
          <span className="text-indigo-600 font-medium">Updated 3m ago via Qiskit Aer</span>
        </div>
      </section>

      {/* ── 5. Skill Constellation (ALWAYS TAKES WHOLE ROW) ──────────────────── */}
      <section className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Skill constellation</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Solid stars are mastered. Rings are in progress. Tap any star to inspect its prerequisites.
            </p>
          </div>
          {activeNode && (
            <button
              onClick={() => setActiveSkillNode(null)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
            >
              Reset selection
            </button>
          )}
        </div>

        {/* Wide Constellation Canvas Container */}
        <div
          className="w-full p-5 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            background: "linear-gradient(180deg, #F8F9FF 0%, #FAFBFF 100%)",
            border: "1px solid rgba(224, 231, 255, 0.80)",
          }}
        >
          <SkillConstellation activeNode={activeSkillNode} onNode={setActiveSkillNode} />
        </div>

        {/* Constellation Inspector Ribbon & Legend */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/70 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
            {activeNode ? (
              <p className="text-slate-700">
                <span className="font-bold text-indigo-700">{activeNode.label}</span>
                {activeNode.status === "mastered" && " · Mastered (100% Coherence)"}
                {activeNode.status === "in-progress" && ` · In progress (${activeNode.percent}% completed)`}
                {activeNode.status === "locked" && " · Locked (Prerequisites needed)"}
              </p>
            ) : (
              <p className="text-slate-500">Tap any star in the constellation map to view state.</p>
            )}
          </div>

          <div className="flex items-center gap-5 shrink-0 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm" /> Mastered
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white border-2 border-indigo-600" /> In progress
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" /> Locked
            </span>
          </div>
        </div>
      </section>

      {/* ── 6. Prediction Accuracy & Qubit Lattice (Side-by-Side Row) ───────── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

        {/* Prediction Accuracy */}
        <section className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between gap-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Prediction accuracy</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              How often your guess matched the simulator results
            </p>
          </div>

          {/* Donut & Stats */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100"
            style={{ background: "rgba(248, 250, 252, 0.85)" }}
          >
            <AnimatedRing
              percent={predictionAccuracy.percent}
              size={66}
              strokeWidth={5.5}
              color="#10B981"
              trackColor="#E2E8F0"
              label={`${predictionAccuracy.percent}%`}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {predictionAccuracy.matched} of {predictionAccuracy.total} predictions matched
              </p>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <TrendingUp size={13} />
                +{predictionAccuracy.pointsGain} pts over {predictionAccuracy.weeksSpan} weeks
              </p>
            </div>
          </div>

          {/* Misconceptions detected */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              MISCONCEPTIONS DETECTED
            </span>
            {misconceptions.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-2xl border border-slate-100 hover:border-indigo-100 bg-slate-50/50 transition-colors"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedMisconception((p) => (p === m.id ? null : m.id))
                  }
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{m.text}</p>
                    <p className="text-[11px] text-slate-400">Seen {m.seenTimes} times</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5">
                    {expandedMisconception === m.id ? "Close" : "Review"}
                    <ChevronRight
                      size={13}
                      className={cn(
                        "transition-transform duration-200",
                        expandedMisconception === m.id && "rotate-90"
                      )}
                    />
                  </span>
                </div>
                {expandedMisconception === m.id && (
                  <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-indigo-100 mt-2 leading-relaxed">
                    AI tutor suggestion: CNOT targets only invert when the control qubit is in |1⟩. In Hadamard bases, relative phase kicks back to the control.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Creative & Informative Qubit Lattice ──────────────────────────── */}
        <section className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Qubit lattice</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                84-qubit coherence matrix (12 weeks × 7 days).
              </p>
            </div>

            {/* Quick interactive filter */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-[10px] font-bold">
              <button
                onClick={() => setActiveLatticeFilter("all")}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-colors",
                  activeLatticeFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                )}
              >
                All 84Q
              </button>
              <button
                onClick={() => setActiveLatticeFilter("active")}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-colors",
                  activeLatticeFilter === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                )}
              >
                Active Only
              </button>
            </div>
          </div>

          {/* Lattice Matrix View */}
          <div
            className="p-4 rounded-2xl border border-slate-100 overflow-x-auto"
            style={{ background: "rgba(248, 250, 252, 0.70)" }}
          >
            <div className="min-w-[280px] flex flex-col gap-2">
              {/* Week markers across top */}
              <div className="grid grid-cols-12 gap-1.5 text-center text-[9px] font-mono text-slate-400 pb-0.5">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i}>W{i + 1}</span>
                ))}
              </div>

              {/* 84-Qubit Grid (12 cols x 7 rows) */}
              <div
                className="grid gap-1.5 w-full"
                style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}
              >
                {activityGrid.slice(0, 84).map((day, i) => {
                  const isFilteredOut = activeLatticeFilter === "active" && day.intensity === 0;
                  const isCurrentStreak = i >= 70 && day.intensity >= 3;

                  return (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded-full relative cursor-pointer transition-all duration-150",
                        isFilteredOut ? "opacity-20" : "hover:scale-135",
                        isCurrentStreak && "ring-2 ring-indigo-400 ring-offset-1"
                      )}
                      style={{
                        background: INTENSITY_COLORS[day.intensity],
                        boxShadow:
                          day.intensity >= 3
                            ? `0 0 8px ${INTENSITY_COLORS[day.intensity]}90`
                            : undefined,
                      }}
                      onMouseEnter={() => setHoveredDay(i)}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`Day ${i + 1}: ${QUANTUM_STATES[day.intensity].name}`}
                    >
                      {/* Floating tooltip */}
                      {hoveredDay === i && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900 text-white rounded-md text-[10px] whitespace-nowrap pointer-events-none z-30 shadow-lg">
                          Day {i + 1} (Week {Math.floor(i / 7) + 1}, {DAY_NAMES[i % 7]}) · {QUANTUM_STATES[day.intensity].name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Telemetry Readout Strip */}
          <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/60 text-xs text-slate-600 flex items-center gap-2">
            <Sparkles size={13} className="text-indigo-600 shrink-0" />
            {inspectedQubit ? (
              <span>
                <strong>Day {inspectedQubit.day}</strong> ({inspectedQubit.dayName}, Week {inspectedQubit.week}):{" "}
                <span className="text-indigo-700 font-semibold">{inspectedQubit.state.name}</span> — {inspectedQubit.state.desc}
              </span>
            ) : (
              <span className="text-slate-500">
                Hover any qubit in the lattice to inspect daily quantum circuit execution telemetry.
              </span>
            )}
          </div>

          {/* Informative Quantum Legend */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Coherence:</span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <span
                    key={lvl}
                    className="w-3 h-3 rounded-full border border-slate-200/50"
                    style={{ background: INTENSITY_COLORS[lvl] }}
                    title={QUANTUM_STATES[lvl].name}
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-400">Peak</span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Flame size={14} className="text-amber-500" />
              <span>{dayStreak}-day streak active</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── 7. Badges & Recommended Next (Side-by-Side Row) ─────────────────── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch pb-6">

        {/* Badges */}
        <section className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Badges & Achievements</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {badges.filter((b) => b.earned).length} earned, {badges.filter((b) => !b.earned).length} to unlock
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">
              Tier 2 Scholar
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "flex flex-col items-center text-center justify-between p-3.5 rounded-2xl border transition-all duration-200 gap-2",
                  badge.earned
                    ? "bg-slate-50/80 border-slate-100 hover:-translate-y-0.5 hover:shadow-sm"
                    : "bg-slate-50/30 border-slate-200/70 opacity-70"
                )}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                  style={{
                    background: badge.earned ? `${badge.color}20` : "#F1F5F9",
                  }}
                >
                  {badge.earned ? (
                    badge.emoji
                  ) : (
                    <Star size={16} className="text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className="text-xs font-bold leading-tight"
                    style={{ color: badge.earned ? "#1E293B" : "#475569" }}
                  >
                    {badge.name}
                  </p>
                  {!badge.earned && badge.requirement && (
                    <p className="text-[10px] text-slate-400 mt-1">{badge.requirement}</p>
                  )}
                  {!badge.earned && badge.daysLeft !== undefined && (
                    <p className="text-[10px] text-slate-400 mt-1">{badge.daysLeft} days left</p>
                  )}
                </div>
                {badge.earned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    <Zap size={10} /> Unlocked
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Next */}
        <section className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 border border-emerald-200 w-fit"
              style={{ background: "#ECFDF5" }}
            >
              <Sparkles size={13} className="text-emerald-600" />
              AI personalized recommendation
            </span>

            <h2 className="text-lg font-bold text-slate-900">Recommended next</h2>

            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">{recommendedNext.topic}</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {recommendedNext.reason}
            </p>

            {/* Why? accordion */}
            <button
              className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:text-indigo-800 transition-colors mt-1"
              onClick={() =>
                setExpandedMisconception((p) =>
                  p === "why-rec" ? null : "why-rec"
                )
              }
            >
              <ChevronRight
                size={13}
                className={cn(
                  "transition-transform duration-200",
                  expandedMisconception === "why-rec" && "rotate-90"
                )}
              />
              Why this topic?
            </button>
            {expandedMisconception === "why-rec" && (
              <p className="text-xs text-slate-600 bg-indigo-50/70 rounded-2xl p-3.5 border border-indigo-100 leading-relaxed">
                Your entanglement mastery (61%) and Deutsch–Jozsa progress (40%) put you in the ideal cognitive window. Phase kickback is the connector concept that will unlock three locked nodes in your constellation.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Est. duration: ~25 mins</span>
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-md shadow-slate-200"
            >
              Start Module <ArrowRight size={13} />
            </button>
          </div>
        </section>
      </div>

      {/* ── Measure-me modal ────────────────────────────────────────────────── */}
      {showMeasureModal && (
        <MeasureMeModal
          expertPercent={qubitState.expertPercent}
          onClose={() => setShowMeasureModal(false)}
        />
      )}
    </div>
  );
}
