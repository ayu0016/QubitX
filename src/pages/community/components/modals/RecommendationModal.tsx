import { X, Sparkles, ArrowRight, Play, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RecommendationItem } from "../../types";
import { ROUTES } from "../../../../utils/routes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recommendation: RecommendationItem | null;
}

export default function RecommendationModal({
  isOpen,
  onClose,
  recommendation,
}: Props) {
  const navigate = useNavigate();

  if (!isOpen || !recommendation) return null;

  const handleStartLesson = () => {
    onClose();
    navigate(ROUTES.quantumLab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: recommendation.dotColor }}
            />
            <span className="text-[12px] font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={13} />
              <span>AI Personalized Recommendation</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 text-[13px]">
          <div>
            <h2 className="text-[24px] font-bold text-slate-900 leading-tight">
              {recommendation.title}
            </h2>
            <p className="text-[14px] text-slate-600 mt-1 leading-relaxed">
              {recommendation.description}
            </p>
          </div>

          {/* Why Recommended Callout */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col gap-1">
            <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              Why this was recommended:
            </p>
            <p className="text-slate-700 text-[13px] leading-relaxed">
              {recommendation.whyRecommended}
            </p>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-0.5">
              <span className="text-[11px] text-slate-400 font-medium">Difficulty</span>
              <p className="text-[14px] font-bold text-slate-800">
                {recommendation.difficulty}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-0.5">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Clock size={11} />
                <span>Estimated Time</span>
              </span>
              <p className="text-[14px] font-bold text-slate-800">
                {recommendation.estimatedTime}
              </p>
            </div>
          </div>

          {/* Prerequisite */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-2.5">
            <Award size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-slate-400 font-medium uppercase">
                Prerequisite
              </span>
              <p className="text-[13px] font-medium text-slate-700">
                {recommendation.prerequisite}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#FAFCFF] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartLesson}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm"
          >
            <Play size={13} className="fill-white" />
            <span>Start Lesson</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
