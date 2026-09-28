import { X, Flame, Users, BookOpen, MessageSquare, ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TrendingTopic } from "../../types";
import { ROUTES } from "../../../../utils/routes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  topic: TrendingTopic | null;
  onOpenDiscussionsTab?: () => void;
}

export default function TopicDetailModal({
  isOpen,
  onClose,
  topic,
  onOpenDiscussionsTab,
}: Props) {
  const navigate = useNavigate();

  if (!isOpen || !topic) return null;

  const handleStartLearning = () => {
    onClose();
    navigate(ROUTES.quantumLab);
  };

  const handleJoinDiscussion = () => {
    onClose();
    onOpenDiscussionsTab?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
              {topic.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
              {topic.difficulty}
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
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-[13px]">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-[13px] font-mono font-medium">
              <span>{topic.tag}</span>
            </div>
            <h2 className="text-[26px] font-bold text-slate-900 mt-1 leading-tight">
              {topic.title}
            </h2>

            {/* Metrics Row */}
            <div className="flex items-center gap-4 mt-3 text-[13px]">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Users size={16} className="text-slate-400" />
                <span>{topic.learnersCount.toLocaleString()} learners</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <Flame size={14} className="fill-emerald-500" />
                <span>+{topic.growthRate}% this week</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              About this Topic
            </p>
            <p className="text-[14px] text-slate-700 leading-relaxed">
              {topic.description}
            </p>
          </div>

          {/* Popular Lessons */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-slate-900 text-[14px] flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600" />
              <span>Popular Lessons &amp; Circuits</span>
            </h3>
            <div className="flex flex-col gap-1.5">
              {topic.popularLessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 flex items-center justify-between text-[13px] transition-colors"
                >
                  <span className="font-medium text-slate-800">{lesson}</span>
                  <span className="text-[11px] text-indigo-600 font-medium">
                    Explore →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Discussions */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-slate-900 text-[14px] flex items-center gap-2">
              <MessageSquare size={16} className="text-purple-600" />
              <span>Trending Community Discussions</span>
            </h3>
            <div className="flex flex-col gap-1.5">
              {topic.activeDiscussions.map((disc, idx) => (
                <div
                  key={idx}
                  onClick={handleJoinDiscussion}
                  className="p-3 rounded-xl border border-slate-200/90 bg-white hover:bg-indigo-50/30 flex items-center justify-between text-[13px] cursor-pointer transition-colors group"
                >
                  <span className="font-medium text-slate-700 group-hover:text-indigo-600">
                    "{disc}"
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#FAFCFF] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleJoinDiscussion}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <MessageSquare size={14} className="text-purple-600" />
            <span>Join Discussion</span>
          </button>

          <button
            type="button"
            onClick={handleStartLearning}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm"
          >
            <Play size={13} className="fill-white" />
            <span>Start Learning</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
