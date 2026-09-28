// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export type Role = "student" | "educator" | "researcher" | "curious";
export type Familiarity = "new" | "basics" | "circuits";
export type LearningPace = "relaxed" | "steady" | "intensive";

export interface OnboardingState {
  currentStep: number;       // 0-indexed, 0–4
  role: Role | null;
  familiarity: Familiarity | null;
  goals: string[];
  learningPace: LearningPace | null; // slide 4
  isCompleted: boolean;
}

// ─── Root Store ───────────────────────────────────────────────────────────────

export interface RootState {
  auth: AuthState;
  onboarding: OnboardingState;
  ui: UiState;
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export interface UiState {
  sidebarCollapsed: boolean;
  tutorOpen: boolean;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface ResumeBanner {
  title: string;
  description: string;
  ctaLabel: string;
}

export type StatTint = "indigo" | "blue" | "amber";

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  subLabel: string;
  tint: StatTint;
  sparkline?: number[];
}

export type ModuleAccent = "indigo" | "blue" | "amber";

export interface ModuleCardData {
  id: string;
  moduleNumber: string;
  title: string;
  description: string;
  progress: number; // 0–100
  accentColor: ModuleAccent;
}

export interface RecommendationRowData {
  id: string;
  title: string;
  description: string;
  dotColor: string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "challenge" | "simulator" | "badge" | "tutor";
  unread: boolean;
  linkText?: string;
  linkTo?: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type ChatSender = "tutor" | "user";

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
}
