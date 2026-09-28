import { useState } from "react";
import {
  Users,
  MessageSquare,
  Flame,
  Atom,
  ArrowRight,
  Play,
  Copy,
  Bookmark,
  Heart,
  CheckCircle2,
  Plus,
  MessageCircle,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type {
  DiscussionItem,
  TrendingTopic,
  LearnerItem,
  CommunityTab,
} from "../types";
import { ROUTES } from "../../../utils/routes";

interface Props {
  discussions: DiscussionItem[];
  topics: TrendingTopic[];
  learners: LearnerItem[];
  onSelectDiscussion: (disc: DiscussionItem) => void;
  onSelectTopic: (topic: TrendingTopic) => void;
  onSelectLearner: (learner: LearnerItem) => void;
  onToggleBookmark: (id: string) => void;
  onToggleLike: (id: string) => void;
  onStartDM: (learner: LearnerItem) => void;
  onSwitchTab: (tab: CommunityTab) => void;
  onStartNewChat: () => void;
}

type FeedFilter = "all" | "questions" | "projects" | "discussions";

export default function CommunityAllFeedView({
  discussions,
  topics,
  learners,
  onSelectDiscussion,
  onSelectTopic,
  onSelectLearner,
  onToggleBookmark,
  onToggleLike,
  onStartDM,
  onSwitchTab,
  onStartNewChat,
}: Props) {
  const navigate = useNavigate();
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter feed items
  const filteredDiscussions = discussions.filter((item) => {
    if (feedFilter === "questions") return item.type === "question";
    if (feedFilter === "projects") return item.type === "project";
    if (feedFilter === "discussions") return item.type === "discussion";
    return true;
  });

  const topTopics = topics.slice(0, 4);
  const onlineLearners = learners.filter((l) => l.isOnline).slice(0, 4);

  const handleFork = (e: React.MouseEvent, id: string, code?: string) => {
    e.stopPropagation();
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleOpenLab = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(ROUTES.quantumLab);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-200">
      {/* ── 1. Community Hero & Live Pulse ────────────────────────────────── */}
      <div
        className="relative p-8 rounded-[24px] overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{
          background: "#F6F8FF",
          boxShadow: "0 5px 30px -5px rgba(79,70,229,0.06)",
          border: "1px solid rgba(224,231,255,0.70)",
        }}
      >
        {/* Left gradient accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{
            background:
              "linear-gradient(180deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)",
          }}
        />

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold text-indigo-700 select-none"
              style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Quantum Community Feed
            </span>
          </div>

          <h1 className="text-[26px] font-extrabold text-slate-900 leading-tight">
            Explore All Community Activity
          </h1>
          <p className="text-[14px] text-slate-600 mt-1 leading-relaxed">
            See the latest discussions, trending quantum algorithms, runnable community circuits, and active learners from around the world.
          </p>

          {/* Quick Stats Pill Row */}
          <div className="flex items-center gap-4 mt-4 text-[12px] text-slate-600 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium">
              <Users size={14} className="text-indigo-600" />
              <span><strong>14,280</strong> learners</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <MessageSquare size={14} className="text-purple-600" />
              <span><strong>{discussions.length * 28}+</strong> discussions</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Atom size={14} className="text-sky-600" />
              <span><strong>1,420</strong> circuits shared</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartNewChat}
            className="flex items-center gap-2 px-5 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-[13px] font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Plus size={15} />
            <span>Start a new chat</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchTab("chat")}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-[13px] font-semibold transition-all shadow-2xs cursor-pointer"
          >
            <MessageCircle size={15} className="text-indigo-600" />
            <span>Open Live Rooms</span>
          </button>
        </div>
      </div>

      {/* ── 2. Main Two-Column Community Layout ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left 2 Columns: Main Community Feed ─────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Feed Filter Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-slate-900">
                Community Activity Stream
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: "all", label: "All Updates" },
                  { id: "questions", label: "Questions" },
                  { id: "projects", label: "Projects" },
                  { id: "discussions", label: "Discussions" },
                ] as { id: FeedFilter; label: string }[]
              ).map((f) => {
                const isActive = feedFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFeedFilter(f.id)}
                    className={[
                      "px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer",
                      isActive
                        ? "bg-[#0B1C30] text-white font-semibold shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feed Items List */}
          <div className="flex flex-col gap-4">
            {filteredDiscussions.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectDiscussion(item)}
                className="p-6 rounded-[24px] border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col gap-4 cursor-pointer group"
              >
                {/* Author row & badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-[13px] flex items-center justify-center shrink-0">
                      {item.avatarInitials}
                    </div>

                    <div className="flex items-center gap-1.5 text-[13px] flex-wrap">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.author}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400 font-medium">
                        {item.level}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400">{item.timeAgo}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.type === "question" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F0F7FF] text-[#0284C7] border border-sky-200 text-[11px] font-bold">
                        QUESTION
                      </span>
                    )}
                    {item.type === "project" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#D97706] border border-amber-200 text-[11px] font-bold">
                        PROJECT
                      </span>
                    )}
                    {item.type === "discussion" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5FF] text-[#9333EA] border border-purple-200 text-[11px] font-bold">
                        DISCUSSION
                      </span>
                    )}
                    {item.isSolved && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>Solved</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Title & Snippet */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-bold text-[17px] text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed line-clamp-2">
                    {item.snippet}
                  </p>
                </div>

                {/* Embedded Runnable Quantum Circuit */}
                {item.embeddedCircuit && (
                  <div className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-sky-100 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <Atom size={16} className="text-sky-600" />
                      <span className="font-mono text-[13px] font-bold text-slate-900">
                        {item.embeddedCircuit.title}
                      </span>
                      {item.embeddedCircuit.gates && (
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-500 font-medium">
                          Gates: {item.embeddedCircuit.gates}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) =>
                          handleFork(e, item.id, item.embeddedCircuit?.circuitCode)
                        }
                        className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[12px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Copy size={12} className="text-slate-500" />
                        <span>{copiedId === item.id ? "Copied" : "Fork"}</span>
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

                {/* Footer Row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-medium">
                      {item.category}
                    </span>

                    <span className="text-[12px] text-slate-400">
                      {item.repliesCount} Replies • {item.viewsCount} Views
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(item.id);
                      }}
                      className={[
                        "flex items-center gap-1 text-[12px] transition-colors",
                        item.isLiked
                          ? "text-rose-600 font-semibold"
                          : "text-slate-400 hover:text-rose-600",
                      ].join(" ")}
                    >
                      <Heart
                        size={14}
                        className={
                          item.isLiked ? "fill-rose-500 text-rose-500" : ""
                        }
                      />
                      <span>{item.likesCount}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(item.id);
                      }}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                      title="Bookmark"
                    >
                      <Bookmark
                        size={15}
                        className={
                          item.isBookmarked ? "text-amber-500 fill-amber-500" : ""
                        }
                      />
                    </button>

                    <span className="text-[13px] font-semibold text-[#6366F1] group-hover:text-indigo-800 transition-colors flex items-center gap-1">
                      <span>Reply</span>
                      <ArrowRight
                        size={13}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: Community Highlights & Online Hub ─────────────── */}
        <div className="flex flex-col gap-6">
          {/* Trending Topics Sidebar Box */}
          <div className="p-6 rounded-[24px] border border-slate-200/90 bg-white flex flex-col gap-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-[16px] text-slate-900">
                  Trending Topics
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSwitchTab("trending")}
                className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                See all →
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {topTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => onSelectTopic(topic)}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-[13px] text-slate-900 group-hover:text-indigo-600 truncate">
                      {topic.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      {topic.learnersCount.toLocaleString()} learners •{" "}
                      <span className="text-emerald-600 font-bold">
                        +{topic.growthRate}%
                      </span>
                    </p>
                  </div>
                  <ArrowRight
                    size={13}
                    className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Active Online Learners Box */}
          <div className="p-6 rounded-[24px] border border-slate-200/90 bg-white flex flex-col gap-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                <h3 className="font-bold text-[16px] text-slate-900">
                  Online Learners
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSwitchTab("learners")}
                className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                View all →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {onlineLearners.map((learner) => (
                <div
                  key={learner.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div
                    onClick={() => onSelectLearner(learner)}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px] flex items-center justify-center">
                        {learner.avatarInitials}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-[13px] text-slate-900 truncate hover:text-indigo-600">
                        {learner.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {learner.currentTopic}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartDM(learner)}
                    className="px-3 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-[#0B1C30] hover:text-white hover:border-transparent transition-all shrink-0 cursor-pointer"
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Chat Channels Box */}
          <div className="p-6 rounded-[24px] border border-slate-200/90 bg-white flex flex-col gap-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-purple-600" />
                <h3 className="font-bold text-[16px] text-slate-900">
                  Live Rooms
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSwitchTab("chat")}
                className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Open chat →
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { name: "general-quantum", members: 42, active: "Bell State verified" },
                { name: "circuit-debugging", members: 19, active: "H gate before CX" },
                { name: "algorithms-study", members: 27, active: "Grover oracle 2D" },
              ].map((chan) => (
                <div
                  key={chan.name}
                  onClick={() => onSwitchTab("chat")}
                  className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/60 hover:bg-indigo-50/20 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-mono font-bold text-[13px] text-slate-800 truncate">
                      #{chan.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {chan.active}
                    </p>
                  </div>
                  <span className="text-[11px] text-indigo-600 font-semibold shrink-0">
                    Join
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
