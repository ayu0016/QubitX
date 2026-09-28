export interface DiscussionReply {
  id: string;
  author: string;
  avatarInitials: string;
  timeAgo: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

export type DiscussionType = "question" | "discussion" | "project";

export interface EmbeddedCircuit {
  title: string;
  gates?: string;
  circuitCode?: string;
}

export interface DiscussionItem {
  id: string;
  author: string;
  avatarInitials: string;
  level: "Beginner" | "Intermediate" | "Learner" | "Researcher" | "Advanced";
  timeAgo: string;
  type: DiscussionType;
  isSolved?: boolean;
  title: string;
  snippet: string;
  embeddedCircuit?: EmbeddedCircuit;
  category: string;
  repliesCount: number;
  viewsCount: number;
  likesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isFollowing?: boolean;
  replies: DiscussionReply[];
}

export interface TrendingTopic {
  id: string;
  tag: string;
  title: string;
  learnersCount: number;
  growthRate: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner → Intermediate";
  category: "Quantum Computing" | "AI / ML" | "Programming" | "Backend" | "GenAI";
  description: string;
  popularLessons: string[];
  activeDiscussions: string[];
}

export interface LearnerItem {
  id: string;
  name: string;
  avatarInitials: string;
  currentTopic: string;
  streakDays: number;
  modulesCompleted: number;
  recentActivity: string;
  isOnline: boolean;
  simulatorRuns: number;
  discussionsCount: number;
  badges: string[];
  joinedDate: string;
}
