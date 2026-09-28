import { useState, useEffect, useMemo } from "react";
import {
  Search,
  PenLine,
  Flame,
  Users,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import type {
  DiscussionItem,
  DiscussionType,
  TrendingTopic,
  LearnerItem,
} from "./community/types";
import {
  INITIAL_DISCUSSIONS,
  TRENDING_TOPICS,
  ACTIVE_LEARNERS,
} from "./community/data/communityData";

import PostCard from "./community/components/PostCard";
import PostDetailView from "./community/components/PostDetailView";
import WritePostModal from "./community/components/WritePostModal";

// ═══════════════════════════════════════════════════════════════════════════
//  Constants
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "qubitx_community_v3";
type PostFilter = "all" | "question" | "discussion" | "project";

const FILTER_TABS: { id: PostFilter; label: string }[] = [
  { id: "all", label: "All Posts" },
  { id: "question", label: "Questions" },
  { id: "discussion", label: "Discussions" },
  { id: "project", label: "Projects" },
];

// ═══════════════════════════════════════════════════════════════════════════
//  Component
// ═══════════════════════════════════════════════════════════════════════════

export default function CommunityPage() {
  // ── Posts with localStorage persistence ───────────────────────────────
  const [posts, setPosts] = useState<DiscussionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_posts");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DISCUSSIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "_posts", JSON.stringify(posts));
    } catch {
      // silent
    }
  }, [posts]);

  // ── Static data (no persistence needed) ───────────────────────────────
  const topics: TrendingTopic[] = TRENDING_TOPICS;
  const learners: LearnerItem[] = ACTIVE_LEARNERS;

  // ── UI State ──────────────────────────────────────────────────────────
  const [filter, setFilter] = useState<PostFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<DiscussionItem | null>(null);
  const [writeModalOpen, setWriteModalOpen] = useState(false);

  // ── Derived: filtered + searched posts ────────────────────────────────
  const filteredPosts = useMemo(() => {
    let result = posts;

    // Category filter
    if (filter !== "all") {
      result = result.filter((p) => p.type === filter);
    }

    // Search
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.snippet.toLowerCase().includes(query) ||
          p.author.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [posts, filter, searchQuery]);

  // ── Sidebar data ──────────────────────────────────────────────────────
  const trendingTags = useMemo(
    () =>
      topics.slice(0, 5).map((t) => ({
        tag: t.tag,
        count: t.learnersCount,
        growth: t.growthRate,
      })),
    [topics]
  );

  const topContributors = useMemo(
    () =>
      [...learners]
        .sort((a, b) => b.discussionsCount - a.discussionsCount)
        .slice(0, 5),
    [learners]
  );

  // ═══════════════════════════════════════════════════════════════════════
  //  Actions
  // ═══════════════════════════════════════════════════════════════════════

  const handleLikePost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const isLiked = !p.isLiked;
        const updated = {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
        if (selectedPost?.id === id) setSelectedPost(updated);
        return updated;
      })
    );
  };

  const handleBookmarkPost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, isBookmarked: !p.isBookmarked };
        if (selectedPost?.id === id) setSelectedPost(updated);
        return updated;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const newReply = {
      id: `reply-${Date.now()}`,
      author: "You",
      avatarInitials: "ME",
      timeAgo: "Just now",
      content: text,
      likes: 0,
      isLiked: false,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const updated = {
          ...p,
          repliesCount: p.repliesCount + 1,
          replies: [...p.replies, newReply],
        };
        if (selectedPost?.id === postId) setSelectedPost(updated);
        return updated;
      })
    );
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const updatedReplies = p.replies.map((r) => {
          if (r.id !== commentId) return r;
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likes: isLiked ? r.likes + 1 : Math.max(0, r.likes - 1),
          };
        });
        const updated = { ...p, replies: updatedReplies };
        if (selectedPost?.id === postId) setSelectedPost(updated);
        return updated;
      })
    );
  };

  const handleCreatePost = (data: {
    title: string;
    body: string;
    category: DiscussionType;
    codeSnippet?: string;
  }) => {
    const newPost: DiscussionItem = {
      id: `post-${Date.now()}`,
      author: "You",
      avatarInitials: "ME",
      level: "Learner",
      timeAgo: "Just now",
      type: data.category,
      title: data.title,
      snippet: data.body,
      embeddedCircuit: data.codeSnippet
        ? { title: "Code Snippet", circuitCode: data.codeSnippet }
        : undefined,
      category: data.category === "question"
        ? "General Question"
        : data.category === "project"
          ? "Community Project"
          : "Open Discussion",
      repliesCount: 0,
      viewsCount: 1,
      likesCount: 0,
      isLiked: false,
      isBookmarked: false,
      replies: [],
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  const handleSelectPost = (post: DiscussionItem) => {
    // Increment view count
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== post.id) return p;
        return { ...p, viewsCount: p.viewsCount + 1 };
      })
    );
    setSelectedPost({ ...post, viewsCount: post.viewsCount + 1 });
  };

  const handleBackToFeed = () => {
    setSelectedPost(null);
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  Render
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="p-6 sm:p-8 lg:p-10 flex flex-col gap-6 min-h-full max-w-[1200px] mx-auto">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">
            Community
          </h1>
          <p className="text-[15px] text-slate-500 mt-1">
            Ask questions, share projects, and learn together.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setWriteModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[14px] font-semibold transition-all shadow-sm cursor-pointer active:scale-[0.98] shrink-0"
        >
          <PenLine size={16} />
          Write a Post
        </button>
      </div>

      {/* ── Content: Detail View OR Feed ─────────────────────────────── */}
      {selectedPost ? (
        <PostDetailView
          post={selectedPost}
          onBack={handleBackToFeed}
          onLikePost={() => handleLikePost(selectedPost.id)}
          onBookmarkPost={() => handleBookmarkPost(selectedPost.id)}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      ) : (
        <>
          {/* ── Filter Tabs + Search ──────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              {FILTER_TABS.map((tab) => {
                const isActive = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={[
                      "px-4 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer",
                      isActive
                        ? "bg-slate-900 text-white font-semibold shadow-sm"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-[240px] pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
              />
            </div>
          </div>

          {/* ── Two-Column Layout: Feed + Sidebar ────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left: Post Feed ────────────────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <MessageCircle size={40} className="text-slate-300 mb-3" />
                  <p className="text-[16px] font-semibold text-slate-500">
                    {searchQuery
                      ? "No posts match your search"
                      : "No posts in this category yet"}
                  </p>
                  <p className="text-[14px] text-slate-400 mt-1">
                    {searchQuery
                      ? "Try different keywords"
                      : "Be the first to start a conversation!"}
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelect={() => handleSelectPost(post)}
                    onLike={(e) => {
                      e.stopPropagation();
                      handleLikePost(post.id);
                    }}
                    onBookmark={(e) => {
                      e.stopPropagation();
                      handleBookmarkPost(post.id);
                    }}
                  />
                ))
              )}
            </div>

            {/* ── Right: Sidebar ─────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              {/* Quick Stats */}
              <div className="p-5 rounded-2xl border border-slate-200/80 bg-white">
                <h3 className="text-[15px] font-bold text-slate-900 mb-4">
                  Community Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50/60">
                    <MessageCircle size={16} className="text-indigo-600" />
                    <div>
                      <div className="text-[16px] font-bold text-slate-900">
                        {posts.length}
                      </div>
                      <div className="text-[11px] text-slate-500">Posts</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-50/60">
                    <Users size={16} className="text-purple-600" />
                    <div>
                      <div className="text-[16px] font-bold text-slate-900">
                        {learners.length}
                      </div>
                      <div className="text-[11px] text-slate-500">Members</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trending Tags */}
              <div className="p-5 rounded-2xl border border-slate-200/80 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Flame size={16} className="text-orange-500" />
                  <h3 className="text-[15px] font-bold text-slate-900">
                    Trending Topics
                  </h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {trendingTags.map((t) => (
                    <div
                      key={t.tag}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[13px] font-medium text-indigo-700">
                        {t.tag}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <TrendingUp size={11} />
                        +{t.growth}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="p-5 rounded-2xl border border-slate-200/80 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-indigo-600" />
                  <h3 className="text-[15px] font-bold text-slate-900">
                    Top Contributors
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {topContributors.map((learner, i) => (
                    <div
                      key={learner.id}
                      className="flex items-center gap-3"
                    >
                      <span className="w-5 text-[12px] font-bold text-slate-400 text-right">
                        {i + 1}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {learner.avatarInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-slate-800 truncate">
                          {learner.name}
                        </div>
                      </div>
                      <span className="text-[12px] text-slate-400 font-medium shrink-0">
                        {learner.discussionsCount} posts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Write Post Modal ─────────────────────────────────────────── */}
      <WritePostModal
        isOpen={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
