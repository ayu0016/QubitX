import { X, ArrowRight, Lightbulb, Play, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../utils/routes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  progress?: number;
}

export default function LessonResumeModal({
  isOpen,
  onClose,
  progress = 61,
}: Props) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOpenLab = () => {
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
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-[12px] font-semibold text-purple-700 uppercase tracking-wider">
              AI Recommended Lesson
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
        <div className="p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-[22px] font-bold text-slate-900 leading-tight">
              Entanglement &amp; Bell States
            </h2>
            <p className="text-[14px] text-slate-600 mt-1">
              Pick up where you left off — constructing non-separable 2-qubit states and measuring correlated spin pairs.
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[13px] font-medium">
              <span className="text-slate-500">Current Progress</span>
              <span className="font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Hint Ready Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-[13px] text-amber-900">
            <Lightbulb size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Tutor hint ready:</p>
              <p className="text-amber-800 text-[12px] mt-0.5 leading-relaxed">
                "Remember that CNOT flips the target qubit ONLY when the control qubit is in state |1⟩. In superposition, this splits both states into correlated pairs!"
              </p>
            </div>
          </div>

          {/* Lesson Checklist */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
              Upcoming Exercise
            </span>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="font-medium text-slate-800">
                  Step 3: Verify zero probability for |01⟩ and |10⟩
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">~4 mins</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-[#FAFCFF] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Later
          </button>

          <button
            type="button"
            onClick={handleOpenLab}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[14px] font-semibold transition-all shadow-sm"
          >
            <Play size={14} className="fill-white" />
            <span>Continue in Lab</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
