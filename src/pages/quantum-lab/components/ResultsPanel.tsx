import { ShieldCheck, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { SimulationResult, ResultMode } from "../types";

interface Props {
  result: SimulationResult | null;
  resultMode: ResultMode;
  backendName: string;
  onViewDetails: () => void;
}

export default function ResultsPanel({
  result,
  resultMode,
  backendName,
  onViewDetails,
}: Props) {
  if (!result) return null;

  const {
    probabilities,
    counts,
    shots,
    seed,
    isBellState,
    matchesTheory,
  } = result;

  // Filter significant states (>0.01) to keep the display clean and beautiful
  const activeEntries = Object.entries(probabilities)
    .filter(([, prob]) => prob > 0.01 || Object.keys(probabilities).length <= 4)
    .slice(0, 4);

  const zeroStates = Object.entries(probabilities)
    .filter(([, prob]) => prob <= 0.01)
    .map(([state]) => state);

  // Maximum probability for bar scaling (normalized to 120px max height)
  const maxProb = Math.max(...Object.values(probabilities), 0.01);
  const maxCount = Math.max(...Object.values(counts), 1);

  // Format footer note for theoretical distribution
  const zeroStateNote =
    zeroStates.length > 0
      ? `Zero probability expected for ${zeroStates.join(" and ")}`
      : "Uniform distribution across basis states";

  // Benchmark line values
  const theoreticalBenchmarkVal = isBellState ? "0.50" : maxProb.toFixed(2);
  const sampledBenchmarkVal = isBellState ? `${Math.round(shots / 2)}` : `${Math.round(maxCount)}`;

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm p-6 flex flex-col gap-5">
      {/* ── Header Row ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[22px] font-bold text-[#0B1C30] tracking-tight">
            Results
          </h2>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/80 text-emerald-700 text-[12px] font-medium select-none shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Verified simulation · {backendName}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className="text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer group"
        >
          <span>View result details</span>
          <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* ── Two Result Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Card 1: Theoretical Distribution ─────────────────────────── */}
        <div className="bg-[#F8FAFF] rounded-[24px] border border-indigo-100/80 p-6 flex flex-col justify-between shadow-2xs min-h-[260px]">
          {/* Card Top */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[17px] text-[#0B1C30]">
              Theoretical distribution
            </h3>
            <span className="text-[12px] font-mono text-slate-400">
              {isBellState ? "|Φ+⟩ expectation" : "Expected state"}
            </span>
          </div>

          {/* Visualization Bars Area */}
          <div className="relative h-[150px] flex items-end justify-around px-8 pb-7">
            {/* Dotted benchmark reference line */}
            <div
              className="absolute left-6 right-6 border-b border-dashed border-indigo-300 pointer-events-none"
              style={{ bottom: "85px" }}
            >
              <span className="absolute -left-6 -top-3 text-[11px] font-mono text-indigo-400 font-medium">
                {theoreticalBenchmarkVal}
              </span>
            </div>

            {activeEntries.map(([state, prob]) => {
              const barHeightPx = Math.max(12, (prob / Math.max(maxProb, 1)) * 95);
              return (
                <div key={state} className="flex flex-col items-center gap-2 z-10">
                  {/* Probability label */}
                  <span className="font-bold text-[15px] text-[#0B1C30] font-mono">
                    {prob.toFixed(2)}
                  </span>

                  {/* Vertical bar */}
                  <div
                    className="w-16 rounded-xl bg-[#6366F1] shadow-xs transition-all duration-500"
                    style={{ height: `${barHeightPx}px` }}
                  />

                  {/* Basis State X-Axis Label */}
                  <span className="text-[14px] font-mono font-medium text-slate-600 mt-1">
                    {state}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-100/90 pt-3">
            <p className="text-[13px] text-slate-500 leading-snug">
              {zeroStateNote}
            </p>
          </div>
        </div>

        {/* ── Card 2: Sampled Counts · Shots ──────────────────────────── */}
        <div className="bg-[#F6FCF9] rounded-[24px] border border-emerald-100/80 p-6 flex flex-col justify-between shadow-2xs min-h-[260px]">
          {/* Card Top */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[17px] text-[#0B1C30]">
              {resultMode === "probabilities"
                ? `Sampled probabilities · ${shots} shots`
                : resultMode === "statevector"
                ? `State amplitudes · ${shots} shots`
                : `Sampled counts · ${shots} shots`}
            </h3>
            <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-500 font-mono text-[11px] shadow-2xs">
              Seed #{seed}
            </span>
          </div>

          {/* Visualization Bars Area */}
          <div className="relative h-[150px] flex items-end justify-around px-8 pb-7">
            {/* Dotted benchmark reference line */}
            <div
              className="absolute left-6 right-6 border-b border-dashed border-emerald-300 pointer-events-none"
              style={{ bottom: "85px" }}
            >
              <span className="absolute -left-6 -top-3 text-[11px] font-mono text-emerald-500 font-medium">
                {sampledBenchmarkVal}
              </span>
            </div>

            {activeEntries.map(([state], idx) => {
              const countVal = counts[state] ?? 0;
              const pct = Math.round((countVal / (shots || 1)) * 100);
              const barHeightPx = Math.max(12, (countVal / Math.max(maxCount, 1)) * 95);
              // In the reference image: first bar is purple (#6366F1), second bar is bright cyan (#0EA5E9)
              const barColor = idx === 0 ? "bg-[#6366F1]" : "bg-[#0EA5E9]";

              return (
                <div key={state} className="flex flex-col items-center gap-1 z-10">
                  {/* Count & Percentage label */}
                  <div className="flex flex-col items-center leading-tight">
                    <span className="font-bold text-[15px] text-[#0B1C30] font-mono">
                      {countVal}
                    </span>
                    <span className="text-[12px] text-slate-500 font-medium">
                      ({pct}%)
                    </span>
                  </div>

                  {/* Vertical bar */}
                  <div
                    className={`w-16 rounded-xl ${barColor} shadow-xs transition-all duration-500`}
                    style={{ height: `${barHeightPx}px` }}
                  />

                  {/* Basis State X-Axis Label */}
                  <span className="text-[14px] font-mono font-medium text-slate-600 mt-1">
                    {state}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-100/90 pt-3">
            <div className="flex items-center gap-1.5 text-[13px] text-emerald-700 font-medium">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>
                {matchesTheory
                  ? "Matches theory within simulator noise"
                  : "Variance exceeds typical threshold"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
