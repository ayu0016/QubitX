import {
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import type { DiscussionItem } from "../types";

interface PostCardProps {
  post: DiscussionItem;
  onSelect: () => void;
  onLike: (e: React.MouseEvent) => void;
  onBookmark: (e: React.MouseEvent) => void;
}

const TYPE_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  question: {
    label: "Question",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  discussion: {
    label: "Discussion",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  project: {
    label: "Project",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
};

const LEVEL_STYLES: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-blue-50 text-blue-700 border-blue-200",
  Learner: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Researcher: "bg-violet-50 text-violet-700 border-violet-200",
  Advanced: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function PostCard({ post, onSelect, onLike, onBookmark }: PostCardProps) {
  const typeStyle = TYPE_STYLES[post.type] ?? TYPE_STYLES.discussion;
  const levelStyle = LEVEL_STYLES[post.level] ?? LEVEL_STYLES.Beginner;

  return (
    <article
      onClick={onSelect}
      className="p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group"
    >
      {/* ── Author Row ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[13px] flex items-center justify-center shrink-0">
          {post.avatarInitials}
        </div>

        <div className="flex items-center gap-2 text-[13px] flex-wrap">
          <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {post.author}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${levelStyle}`}
          >
            {post.level}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-400">{post.timeAgo}</span>
        </div>
      </div>

      {/* ── Title ───────────────────────────────────────────────────── */}
      <div className="flex items-start gap-2 mb-2">
        <h3 className="text-[17px] font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors flex-1">
          {post.title}
        </h3>

        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
          >
            {typeStyle.label}
          </span>
          {post.isSolved && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-bold">
              <CheckCircle2 size={12} />
              Solved
            </span>
          )}
        </div>
      </div>

      {/* ── Body Preview ────────────────────────────────────────────── */}
      <p className="text-[14px] text-slate-600 leading-relaxed line-clamp-2 mb-3">
        {post.snippet}
      </p>

      {/* ── Category Tag ────────────────────────────────────────────── */}
      <div className="mb-4">
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[12px] font-medium">
          {post.category}
        </span>
      </div>

      {/* ── Engagement Footer ───────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={onLike}
            className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
              post.isLiked
                ? "text-rose-500"
                : "text-slate-400 hover:text-rose-500"
            }`}
          >
            <Heart size={15} fill={post.isLiked ? "currentColor" : "none"} />
            {post.likesCount}
          </button>

          <span className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400">
            <MessageCircle size={15} />
            {post.repliesCount}
          </span>

          <span className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400">
            <Eye size={15} />
            {post.viewsCount}
          </span>
        </div>

        <button
          type="button"
          onClick={onBookmark}
          className={`transition-colors cursor-pointer ${
            post.isBookmarked
              ? "text-indigo-500"
              : "text-slate-300 hover:text-indigo-500"
          }`}
        >
          <Bookmark
            size={16}
            fill={post.isBookmarked ? "currentColor" : "none"}
          />
        </button>
      </div>
    </article>
  );
}
