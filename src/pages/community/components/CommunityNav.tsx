import {
  LayoutGrid,
  Flame,
  MessageSquare,
  Users,
  MessageCircle,
  Plus,
} from "lucide-react";
import type { CommunityTab } from "../types";

interface Props {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
  discussionsCount?: number;
  trendingCount?: number;
  learnersCount?: number;
  chatUnreadCount?: number;
  onStartNewChat: () => void;
}

export default function CommunityNav({
  activeTab,
  onTabChange,
  discussionsCount = 6,
  trendingCount = 6,
  learnersCount = 8,
  chatUnreadCount = 3,
  onStartNewChat,
}: Props) {
  const tabs: {
    id: CommunityTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: "all",
      label: "All",
      icon: <LayoutGrid size={16} />,
    },
    {
      id: "trending",
      label: "Trending Topics",
      icon: <Flame size={16} />,
      badge: trendingCount,
    },
    {
      id: "discussions",
      label: "Active Discussions",
      icon: <MessageSquare size={16} />,
      badge: discussionsCount,
    },
    {
      id: "learners",
      label: "Active Learners",
      icon: <Users size={16} />,
      badge: learnersCount,
    },
    {
      id: "chat",
      label: "Community Chat",
      icon: <MessageCircle size={16} />,
      badge: chatUnreadCount,
    },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
      {/* ── Nav Tabs ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-medium transition-all select-none whitespace-nowrap cursor-pointer",
                isActive
                  ? "bg-[#0B1C30] text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80",
              ].join(" ")}
            >
              <span className={isActive ? "text-indigo-400" : "text-slate-400"}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={[
                    "px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ml-0.5",
                    isActive
                      ? "bg-slate-800 text-indigo-300"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Start a new chat action button ──────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onStartNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] active:scale-98 text-white rounded-xl text-[13px] font-semibold transition-all shadow-xs cursor-pointer select-none"
        >
          <Plus size={15} />
          <span>Start a new chat</span>
        </button>

        <div className="hidden lg:flex items-center gap-2 text-[12px] text-slate-400 font-medium pl-2 border-l border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Hub</span>
        </div>
      </div>
    </div>
  );
}
