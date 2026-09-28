import { useState } from "react";
import {
  X,
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Send,
  Play,
  Copy,
  Check,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DiscussionItem } from "../../types";
import { ROUTES } from "../../../../utils/routes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  discussion: DiscussionItem | null;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onAddReply: (discussionId: string, replyText: string) => void;
  onLikeReply: (discussionId: string, replyId: string) => void;
}

export default function DiscussionDetailModal({
  isOpen,
  onClose,
  discussion,
  onToggleLike,
  onToggleBookmark,
  onAddReply,
  onLikeReply,
}: Props) {
  const navigate = useNavigate();
  const [replyInput, setReplyInput] = useState("");
  const [copiedCircuit, setCopiedCircuit] = useState(false);

  if (!isOpen || !discussion) return null;

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    onAddReply(discussion.id, replyInput.trim());
    setReplyInput("");
  };

  const handleOpenLab = () => {
    onClose();
    navigate(ROUTES.quantumLab);
  };

  const handleCopyCircuit = () => {
    if (discussion.embeddedCircuit?.circuitCode) {
      navigator.clipboard.writeText(discussion.embeddedCircuit.circuitCode);
      setCopiedCircuit(true);
      setTimeout(() => setCopiedCircuit(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
              {discussion.category}
            </span>
            {discussion.type === "question" && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                QUESTION
              </span>
            )}
            {discussion.type === "project" && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                PROJECT
              </span>
            )}
            {discussion.type === "discussion" && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200">
                DISCUSSION
              </span>
            )}
            {discussion.isSolved && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span>Solved</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleBookmark(discussion.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Bookmark"
            >
              <Bookmark
                size={17}
                className={discussion.isBookmarked ? "text-amber-500 fill-amber-500" : ""}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-[14px]">
          {/* Author Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-[14px] flex items-center justify-center">
              {discussion.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-[15px]">
                  {discussion.author}
                </span>
                <span className="text-[12px] text-slate-400 font-medium">
                  • {discussion.level}
                </span>
                <span className="text-[12px] text-slate-400">
                  • {discussion.timeAgo}
                </span>
              </div>
            </div>
          </div>

          {/* Question Title & Body */}
          <div className="flex flex-col gap-2">
            <h2 className="text-[20px] font-bold text-slate-900 leading-snug">
              {discussion.title}
            </h2>
            <p className="text-[14px] text-slate-600 leading-relaxed">
              {discussion.snippet}
            </p>
          </div>

          {/* Embedded Circuit Box (if provided) */}
          {discussion.embeddedCircuit && (
            <div className="p-4 rounded-2xl bg-[#F0F9FF] border border-sky-100 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className="font-mono text-[14px] font-bold text-slate-900">
                  {discussion.embeddedCircuit.title}
                </span>
                {discussion.embeddedCircuit.gates && (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-500 font-medium">
                    Gates: {discussion.embeddedCircuit.gates}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCircuit}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  {copiedCircuit ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedCircuit ? "Copied" : "Fork"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenLab}
                  className="px-4 py-1.5 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[12px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Play size={11} className="fill-white" />
                  <span>Open in Lab →</span>
                </button>
              </div>
            </div>
          )}

          {/* Discussion Actions / Stats Bar */}
          <div className="flex items-center justify-between py-2 border-y border-slate-100 text-[13px] text-slate-500">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onToggleLike(discussion.id)}
                className={[
                  "flex items-center gap-1.5 font-medium transition-colors cursor-pointer",
                  discussion.isLiked ? "text-rose-600 font-semibold" : "hover:text-rose-600",
                ].join(" ")}
              >
                <Heart
                  size={16}
                  className={discussion.isLiked ? "fill-rose-500 text-rose-500" : ""}
                />
                <span>{discussion.likesCount} Likes</span>
              </button>

              <span className="flex items-center gap-1.5">
                <MessageSquare size={16} />
                <span>{discussion.replies.length} Replies</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Eye size={16} />
                <span>{discussion.viewsCount} Views</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Replies Thread */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-slate-900 text-[15px]">
              Discussion Replies ({discussion.replies.length})
            </h3>

            <div className="flex flex-col gap-3">
              {discussion.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center">
                        {reply.avatarInitials}
                      </div>
                      <span className="font-semibold text-slate-800 text-[13px]">
                        {reply.author}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {reply.timeAgo}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onLikeReply(discussion.id, reply.id)}
                      className={[
                        "flex items-center gap-1 text-[11px] font-medium transition-colors",
                        reply.isLiked ? "text-rose-600" : "text-slate-400 hover:text-slate-700",
                      ].join(" ")}
                    >
                      <Heart
                        size={12}
                        className={reply.isLiked ? "fill-rose-500 text-rose-500" : ""}
                      />
                      <span>{reply.likes}</span>
                    </button>
                  </div>

                  <p className="text-[13px] text-slate-700 leading-relaxed">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reply Input Form */}
        <form
          onSubmit={handlePostReply}
          className="p-4 border-t border-slate-100 bg-[#FAFCFF] flex items-center gap-3 shrink-0"
        >
          <input
            type="text"
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            placeholder="Write your answer or question..."
            className="flex-1 h-11 px-4 rounded-xl bg-white border border-slate-200 text-[14px] outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!replyInput.trim()}
            className="px-5 h-11 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Send size={13} />
            <span>Post Reply</span>
          </button>
        </form>
      </div>
    </div>
  );
}
