import { useNavigate } from "react-router-dom";
import type { RecommendationRowData } from "../types";
import { ROUTES } from "../utils/routes";

interface RecommendationRowProps {
  data: RecommendationRowData;
}

export default function RecommendationRow({ data }: RecommendationRowProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-200">
      <div className="flex items-center gap-3">
        {/* Colored dot */}
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: data.dotColor }}
        />
        <div>
          <p className="text-[15px] font-semibold text-slate-900 leading-tight">
            {data.title}
          </p>
          <p className="text-[12px] text-slate-500 mt-0.5">{data.description}</p>
        </div>
      </div>

      <button
        onClick={() => navigate(ROUTES.courses)}
        className="ml-4 shrink-0 px-4 py-1.5 bg-white rounded-full border border-slate-300 text-[13px] font-medium text-slate-800 hover:bg-slate-50 transition-colors"
      >
        Start
      </button>
    </div>
  );
}
