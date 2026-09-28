import { X, Flame, BookOpen, Cpu, MessageSquare, CheckCircle2 } from "lucide-react";
import type { LearnerItem } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  learner: LearnerItem | null;
}

export default function LearnerProfileModal({
  isOpen,
  onClose,
  learner,
}: Props) {
  if (!isOpen || !learner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
            Learner Profile · Member since {learner.joinedDate}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-[13px]">
          {/* Top Profile Card */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-[20px]">
                {learner.avatarInitials}
              </div>
              {learner.isOnline && (
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-[22px] font-bold text-slate-900 leading-tight">
                  {learner.name}
                </h2>
                {learner.isOnline && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                    online
                  </span>
                )}
              </div>
              <p className="text-[13px] text-slate-500">
                Learning: <span className="font-semibold text-slate-800">{learner.currentTopic}</span>
              </p>
            </div>
          </div>

          {/* Stats 4-Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col items-center text-center">
              <Flame size={16} className="text-amber-500 fill-amber-500 mb-1" />
              <span className="text-[18px] font-extrabold text-slate-900">
                {learner.streakDays}d
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Streak</span>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col items-center text-center">
              <BookOpen size={16} className="text-indigo-600 mb-1" />
              <span className="text-[18px] font-extrabold text-slate-900">
                {learner.modulesCompleted}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Modules</span>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-col items-center text-center">
              <Cpu size={16} className="text-sky-600 mb-1" />
              <span className="text-[18px] font-extrabold text-slate-900">
                {learner.simulatorRuns}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Sim Runs</span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col items-center text-center">
              <MessageSquare size={16} className="text-purple-600 mb-1" />
              <span className="text-[18px] font-extrabold text-slate-900">
                {learner.discussionsCount}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Discussions</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-slate-900 text-[14px]">
              Recent Activity
            </h3>
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-2 text-[13px]">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Completed <strong className="text-slate-900">{learner.recentActivity}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Executed 1024-shot circuit benchmark in Qiskit Aer</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Contributed 3 verified answers to community questions</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-slate-900 text-[14px]">
              Earned Badges ({learner.badges.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {learner.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs font-medium text-slate-700 text-[12px] flex items-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#FAFCFF] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[13px] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
