import { X, CheckCircle2, ArrowRight, Play, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ModuleItem } from "../../types";
import { ROUTES } from "../../../../utils/routes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  module: ModuleItem | null;
  onUpdateProgress?: (moduleId: string, newProgress: number) => void;
}

export default function ModuleDetailModal({
  isOpen,
  onClose,
  module,
  onUpdateProgress,
}: Props) {
  const navigate = useNavigate();

  if (!isOpen || !module) return null;

  const handleOpenSimulator = () => {
    onClose();
    navigate(ROUTES.quantumLab);
  };

  const handleAdvanceLesson = () => {
    if (onUpdateProgress) {
      const nextProgress = Math.min(100, module.progress + 10);
      onUpdateProgress(module.id, nextProgress);
    }
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
            <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
              {module.moduleNumber} · {module.category}
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
        <div className="p-6 flex flex-col gap-6 text-[13px]">
          <div>
            <h2 className="text-[24px] font-bold text-slate-900 leading-tight">
              {module.title}
            </h2>
            <p className="text-[14px] text-slate-600 mt-1 leading-relaxed">
              {module.description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
            <div className="flex items-center justify-between text-[13px] font-medium">
              <span className="text-slate-500">Curriculum Progress</span>
              <span className="font-bold text-indigo-600">{module.progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>

          {/* Lessons List */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-slate-900 text-[14px] flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600" />
              <span>Module Syllabus &amp; Tasks</span>
            </h3>

            <div className="flex flex-col gap-2">
              {module.lessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className={[
                    "p-3 rounded-xl border flex items-center justify-between transition-colors",
                    lesson.completed
                      ? "bg-emerald-50/30 border-emerald-200/70"
                      : lesson.current
                      ? "bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200"
                      : "bg-white border-slate-200 text-slate-400",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2.5">
                    {lesson.completed ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : lesson.current ? (
                      <span className="text-indigo-600 font-bold">→</span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 inline-block shrink-0" />
                    )}
                    <span
                      className={[
                        "font-medium",
                        lesson.completed
                          ? "text-slate-800"
                          : lesson.current
                          ? "text-indigo-900 font-bold"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      {lesson.title}
                    </span>
                  </div>

                  {lesson.current && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-[#FAFCFF] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleOpenSimulator}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Play size={13} className="text-indigo-600" />
            <span>Open Simulator</span>
          </button>

          <button
            type="button"
            onClick={handleAdvanceLesson}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm"
          >
            <span>Continue Lesson</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
