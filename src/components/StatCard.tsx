import { useNavigate } from "react-router-dom";
import type { StatCardData } from "../types";
import { ROUTES } from "../utils/routes";

const SPARKLINE_COLORS = ["#BAE6FD", "#7DD3FC", "#BAE6FD", "#38BDF8", "#7DD3FC", "#0EA5E9", "#0284C7"] as const;

const TINT_STYLES: Record<
  StatCardData["tint"],
  { card: string; badge: string; icon: string }
> = {
  indigo: {
    card: "bg-[#F5F7FF] border-indigo-100/80",
    badge: "bg-[#EEF2FF]",
    icon: "text-indigo-600",
  },
  blue: {
    card: "bg-[#F0F7FF] border-blue-100/80",
    badge: "bg-[#F0F9FF]",
    icon: "text-sky-600",
  },
  amber: {
    card: "bg-[#FFFBF2] border-amber-100/80",
    badge: "bg-[#FFFBEB]",
    icon: "text-amber-600",
  },
};

const ICONS: Record<StatCardData["tint"], React.ReactNode> = {
  indigo: (
    <svg width="16" height="18" viewBox="0 0 18 20" fill="none">
      <rect x="0" y="8" width="4" height="12" rx="2" fill="currentColor" />
      <rect x="7" y="4" width="4" height="16" rx="2" fill="currentColor" />
      <rect x="14" y="0" width="4" height="20" rx="2" fill="currentColor" />
    </svg>
  ),
  blue: (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="7" width="4" height="4" fill="currentColor" />
      <line x1="0" y1="6" x2="4" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="0" x2="6" y2="4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="0" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="14" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="14" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  amber: (
    <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
      <path d="M8 0C8 0 14 6 14 11a6 6 0 01-12 0C2 8 5 5 5 5S4 9 7 10C7 8 8 4 8 0z" fill="currentColor" />
    </svg>
  ),
};

interface StatCardProps {
  data: StatCardData;
}

export default function StatCard({ data }: StatCardProps) {
  const navigate = useNavigate();
  const tint = TINT_STYLES[data.tint];
  const maxSparkline = data.sparkline
    ? Math.max(...data.sparkline)
    : 1;

  return (
    <div
      className={`flex-1 p-5 rounded-2xl border ${tint.card} flex flex-col gap-3`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {data.label}
        </span>
        <div
          className={`w-10 h-10 ${tint.badge} rounded-xl flex items-center justify-center ${tint.icon}`}
        >
          {ICONS[data.tint]}
        </div>
      </div>

      {/* Value + sparkline row */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-extrabold text-slate-900 leading-none">
              {data.value}
            </span>
            {data.suffix && (
              <span className="text-[18px] font-normal text-slate-400 leading-none">
                {data.suffix}
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 mt-1">{data.subLabel}</p>
        </div>

        {/* Sparkline bars */}
        {data.sparkline && (
          <div className="flex items-end gap-1 pb-4">
            {data.sparkline.map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full"
                style={{
                  height: `${(h / maxSparkline) * 26}px`,
                  background: SPARKLINE_COLORS[i % SPARKLINE_COLORS.length],
                }}
              />
            ))}
          </div>
        )}
      </div>

      <span className="sr-only" onClick={() => navigate(ROUTES.progress)}>
        View progress
      </span>
    </div>
  );
}
