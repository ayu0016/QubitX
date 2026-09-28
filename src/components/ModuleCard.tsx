import { useNavigate } from "react-router-dom";
import type { ModuleCardData } from "../types";
import { ROUTES } from "../utils/routes";

const ACCENT: Record<
  ModuleCardData["accentColor"],
  { bar: string; text: string; icon: string; bg: string; card: string; border: string }
> = {
  indigo: {
    bar: "bg-indigo-600",
    text: "text-indigo-600",
    icon: "text-indigo-600",
    bg: "bg-[#EEF2FF]",
    card: "bg-[#F6F7FE] border-indigo-100/80",
    border: "",
  },
  blue: {
    bar: "bg-blue-600",
    text: "text-blue-600",
    icon: "text-sky-600",
    bg: "bg-[#F0F9FF]",
    card: "bg-[#F1F8FE] border-blue-100/80",
    border: "",
  },
  amber: {
    bar: "bg-amber-400",
    text: "text-amber-600",
    icon: "text-amber-600",
    bg: "bg-[#FFFBEB]",
    card: "bg-[#FFFCF5] border-amber-100/80",
    border: "",
  },
};

// Simple quantum gate icons per module
const MODULE_ICONS: Record<ModuleCardData["accentColor"], React.ReactNode> = {
  indigo: (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect x="5" y="5" width="12" height="12" rx="2" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
      <text x="11" y="15" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4F46E5" fontFamily="monospace">H</text>
      <rect x="21" y="21" width="10" height="10" rx="2" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
      <circle cx="25" cy="12" r="3" fill="#4F46E5" />
    </svg>
  ),
  blue: (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect x="5" y="8" width="10" height="20" rx="2" fill="white" stroke="#0284C7" strokeWidth="1.5" />
      <text x="10" y="21" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0284C7" fontFamily="monospace">H</text>
      <rect x="19" y="4" width="12" height="28" rx="2" fill="white" stroke="#0284C7" strokeWidth="1.5" />
      <text x="25" y="21" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0284C7" fontFamily="monospace">Uf</text>
    </svg>
  ),
  amber: (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect x="5" y="5" width="11" height="26" rx="2" fill="white" stroke="#D97706" strokeWidth="1.5" />
      <text x="10.5" y="21" textAnchor="middle" fontSize="8" fontWeight="700" fill="#D97706" fontFamily="monospace">O</text>
      <rect x="20" y="5" width="11" height="26" rx="2" fill="white" stroke="#D97706" strokeWidth="1.5" />
      <text x="25.5" y="21" textAnchor="middle" fontSize="8" fontWeight="700" fill="#D97706" fontFamily="monospace">D</text>
    </svg>
  ),
};

interface ModuleCardProps {
  data: ModuleCardData;
}

export default function ModuleCard({ data }: ModuleCardProps) {
  const navigate = useNavigate();
  const accent = ACCENT[data.accentColor];

  const handleNavigate = () => navigate(ROUTES.courses);
  const handleContinueClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(ROUTES.courses);
  };

  return (
    <div
      onClick={handleNavigate}
      className={`flex-1 p-5 rounded-2xl border ${accent.card} flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow duration-200 group`}
    >
      {/* Top section */}
      <div className="flex flex-col gap-3">
        {/* Icon row */}
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 p-1 ${accent.bg} rounded-xl flex items-center justify-center`}>
            {MODULE_ICONS[data.accentColor]}
          </div>
          <span className="text-[12px] text-slate-500 font-medium">
            {data.progress}% complete
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[17px] font-bold text-slate-900 leading-tight">
            {data.title}
          </h3>
          <p className="text-[13px] text-slate-500 leading-snug">
            {data.description}
          </p>
        </div>
      </div>

      {/* Bottom section: progress bar + footer */}
      <div className="flex flex-col gap-2 mt-3.5">
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className={`h-full ${accent.bar} rounded-full`}
            style={{ width: `${data.progress}%` }}
          />
        </div>

        {/* Module label + Continue */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[12px] text-slate-400 font-medium">
            {data.moduleNumber}
          </span>
          <button
            onClick={handleContinueClick}
            className={`flex items-center gap-1.5 ${accent.text} text-[13px] font-semibold hover:opacity-70 transition-opacity`}
          >
            Continue
            <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor">
              <path d="M0 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
