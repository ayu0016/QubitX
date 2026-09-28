import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  CheckCircle2,
  Send,
  Code2,
} from "lucide-react";
import type { DiscussionItem } from "../types";

interface PostDetailViewProps {
  post: DiscussionItem;
  onBack: () => void;
  onLikePost: () => void;
  onBookmarkPost: () => void;
  onAddComment: (postId: string, text: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
}

const TYPE_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  question: { label: "Question", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  discussion: { label: "Discussion", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  project: { label: "Project", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export default function PostDetailView({
  post,
  onBack,
  onLikePost,
  onBookmarkPost,
  onAddComment,
  onLikeComment,
}: PostDetailViewProps) {
  const [commentText, setCommentText] = useState("");
  const typeStyle = TYPE_STYLES[post.type] ?? TYPE_STYLES.discussion;

  const handleSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onAddComment(post.id, trimmed);
    setCommentText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* ── Back Button ──────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-[14px] text-slate-500 hover:text-indigo-600 transition-colors w-fit cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to feed
      </button>

      {/* ── Post Content Card ────────────────────────────────────────── */}
      <div className="p-8 rounded-2xl border border-slate-200/80 bg-white">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[15px] flex items-center justify-center shrink-0">
            {post.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-slate-900">
                {post.author}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium border border-slate-200">
                {post.level}
              </span>
            </div>
            <span className="text-[13px] text-slate-400">{post.timeAgo}</span>
          </div>
        </div>

        {/* Title + type badge */}
        <div className="flex items-start gap-3 mb-4">
          <h1 className="text-[22px] font-bold text-slate-900 leading-snug flex-1">
            {post.title}
          </h1>
          <div className="flex items-center gap-1.5 shrink-0 mt-1">
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-bold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
            >
              {typeStyle.label}
            </span>
            {post.isSolved && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[12px] font-bold">
                <CheckCircle2 size={13} />
                Solved
              </span>
            )}
          </div>
        </div>

        {/* Full body */}
        <p className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap mb-5">
          {post.snippet}
        </p>

        {/* Embedded code snippet (if any) */}
        {post.embeddedCircuit?.circuitCode && (
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border-b border-slate-200">
              <Code2 size={14} className="text-slate-500" />
              <span className="text-[13px] font-semibold text-slate-700">
                {post.embeddedCircuit.title}
              </span>
              {post.embeddedCircuit.gates && (
                <span className="text-[12px] text-slate-400 ml-auto">
                  Gates: {post.embeddedCircuit.gates}
                </span>
              )}
            </div>
            <pre className="px-4 py-3 text-[13px] text-slate-800 font-mono leading-relaxed overflow-x-auto">
              {post.embeddedCircuit.circuitCode}
            </pre>
          </div>
        )}

        {/* Category */}
        <div className="mb-5">
          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[13px] font-medium">
            {post.category}
          </span>
        </div>

        {/* Engagement bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onLikePost}
              className={`flex items-center gap-2 text-[14px] font-medium transition-colors cursor-pointer ${
                post.isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
              }`}
            >
              <Heart size={17} fill={post.isLiked ? "currentColor" : "none"} />
              {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
            </button>

            <span className="flex items-center gap-2 text-[14px] font-medium text-slate-400">
              <MessageCircle size={17} />
              {post.repliesCount} {post.repliesCount === 1 ? "comment" : "comments"}
            </span>

            <span className="flex items-center gap-2 text-[14px] font-medium text-slate-400">
              <Eye size={17} />
              {post.viewsCount} views
            </span>
          </div>

          <button
            type="button"
            onClick={onBookmarkPost}
            className={`transition-colors cursor-pointer ${
              post.isBookmarked ? "text-indigo-500" : "text-slate-300 hover:text-indigo-500"
            }`}
          >
            <Bookmark size={18} fill={post.isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* ── Comments Section ─────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl border border-slate-200/80 bg-white">
        <h2 className="text-[17px] font-bold text-slate-900 mb-5">
          Comments ({post.replies.length})
        </h2>

        {post.replies.length === 0 ? (
          <p className="text-[14px] text-slate-400 py-6 text-center">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="flex flex-col gap-4 mb-6">
            {post.replies.map((reply) => (
              <div
                key={reply.id}
                className="flex gap-3 p-4 rounded-xl bg-slate-50/80 border border-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-[12px] flex items-center justify-center shrink-0 mt-0.5">
                  {reply.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-slate-800">
                      {reply.author}
                    </span>
                    <span className="text-[12px] text-slate-400">
                      {reply.timeAgo}
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-600 leading-relaxed">
                    {reply.content}
                  </p>
                  <button
                    type="button"
                    onClick={() => onLikeComment(post.id, reply.id)}
                    className={`mt-2 flex items-center gap-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                      reply.isLiked
                        ? "text-rose-500"
                        : "text-slate-400 hover:text-rose-500"
                    }`}
                  >
                    <Heart
                      size={13}
                      fill={reply.isLiked ? "currentColor" : "none"}
                    />
                    {reply.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Write a Comment ────────────────────────────────────────── */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[12px] flex items-center justify-center shrink-0 mt-1">
            You
          </div>
          <div className="flex-1 flex gap-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment..."
              rows={2}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all"
            />
            <button
              type="button"
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              className="self-end px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
