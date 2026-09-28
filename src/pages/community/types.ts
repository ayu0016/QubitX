export type CommunityTab = "all" | "trending" | "discussions" | "learners" | "chat";

export interface ChatMessage {
  id: string;
  senderName: string;
  senderInitials: string;
  senderColor?: string;
  isCurrentUser: boolean;
  time: string;
  text: string;
  circuitSnippet?: {
    title: string;
    code: string;
  };
}

export interface ChatChannel {
  id: string;
  name: string;
  type: "channel" | "dm";
  description?: string;
  avatarInitials?: string;
  isOnline?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  messages: ChatMessage[];
}

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

export interface LessonStep {
  title: string;
  completed: boolean;
  current?: boolean;
}

export interface ModuleItem {
  id: string;
  moduleNumber: string;
  title: string;
  progress: number;
  description: string;
  accentColor: "indigo" | "blue" | "amber";
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner → Intermediate";
  category: string;
  lessons: LessonStep[];
}

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  dotColor: string;
  whyRecommended: string;
  difficulty: string;
  estimatedTime: string;
  prerequisite: string;
  currentProgress: number;
}
