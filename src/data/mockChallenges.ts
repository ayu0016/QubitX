// ─── Challenges & Badges Shared Data ─────────────────────────────────────────
// This is the single source of truth for challenge badges.
// Both ChallengesPage and ProgressPage read from here.

export type ChallengeStatus = "open" | "completed" | "locked";
export type ChallengeMode = "lab" | "mcq" | "code";
export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced";

export interface ChallengeItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  mode: ChallengeMode;
  difficulty: ChallengeDifficulty;
  xp: number;
  status: ChallengeStatus;
  timeEstimate: string;
}

export interface ChallengeBadge {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  border: string;
  textColor: string;
  color: string; // hex, used by ProgressPage for tinted backgrounds
  earned: boolean;
  requirement: string;
  requiresChallenges: number;
  progress: number; // 0-100
  daysLeft?: number;
}

// ── Challenges ────────────────────────────────────────────────────────────────

export const CHALLENGES: ChallengeItem[] = [
  // Weekly challenges
  {
    id: "wc-1",
    title: "Superposition Sprint",
    subtitle: "Weekly Challenge",
    category: "weekly",
    mode: "lab",
    difficulty: "beginner",
    xp: 120,
    status: "completed",
    timeEstimate: "15 min",
  },
  {
    id: "wc-2",
    title: "Entanglement Gauntlet",
    subtitle: "Weekly Challenge",
    category: "weekly",
    mode: "lab",
    difficulty: "intermediate",
    xp: 200,
    status: "open",
    timeEstimate: "25 min",
  },
  {
    id: "wc-3",
    title: "Phase Kickback Race",
    subtitle: "Weekly Challenge",
    category: "weekly",
    mode: "mcq",
    difficulty: "advanced",
    xp: 280,
    status: "locked",
    timeEstimate: "30 min",
  },

  // Circuit Design
  {
    id: "cd-1",
    title: "Bell State Constructor",
    subtitle: "Circuit Design Challenge",
    category: "circuit",
    mode: "lab",
    difficulty: "beginner",
    xp: 90,
    status: "completed",
    timeEstimate: "10 min",
  },
  {
    id: "cd-2",
    title: "Toffoli Gate Simulator",
    subtitle: "Circuit Design Challenge",
    category: "circuit",
    mode: "lab",
    difficulty: "intermediate",
    xp: 175,
    status: "open",
    timeEstimate: "20 min",
  },
  {
    id: "cd-3",
    title: "Quantum Teleportation Circuit",
    subtitle: "Circuit Design Challenge",
    category: "circuit",
    mode: "lab",
    difficulty: "advanced",
    xp: 320,
    status: "open",
    timeEstimate: "40 min",
  },
  {
    id: "cd-4",
    title: "QFT Circuit Builder",
    subtitle: "Circuit Design Challenge",
    category: "circuit",
    mode: "lab",
    difficulty: "advanced",
    xp: 350,
    status: "locked",
    timeEstimate: "45 min",
  },

  // Algorithm Challenges
  {
    id: "alg-1",
    title: "Deutsch–Jozsa Problem",
    subtitle: "Algorithm Challenge",
    category: "algorithm",
    mode: "mcq",
    difficulty: "beginner",
    xp: 80,
    status: "completed",
    timeEstimate: "12 min",
  },
  {
    id: "alg-2",
    title: "Grover's Search Oracle",
    subtitle: "Algorithm Challenge",
    category: "algorithm",
    mode: "lab",
    difficulty: "intermediate",
    xp: 210,
    status: "open",
    timeEstimate: "35 min",
  },
  {
    id: "alg-3",
    title: "Quantum Fourier Transform",
    subtitle: "Algorithm Challenge",
    category: "algorithm",
    mode: "lab",
    difficulty: "advanced",
    xp: 300,
    status: "locked",
    timeEstimate: "50 min",
  },

  // Concept MCQ
  {
    id: "mcq-1",
    title: "Qubit Fundamentals Quiz",
    subtitle: "Topic Challenge",
    category: "topic",
    mode: "mcq",
    difficulty: "beginner",
    xp: 50,
    status: "completed",
    timeEstimate: "8 min",
  },
  {
    id: "mcq-2",
    title: "Measurement Dynamics MCQ",
    subtitle: "Topic Challenge",
    category: "topic",
    mode: "mcq",
    difficulty: "intermediate",
    xp: 100,
    status: "open",
    timeEstimate: "10 min",
  },
  {
    id: "mcq-3",
    title: "Error Correction Concepts",
    subtitle: "Topic Challenge",
    category: "topic",
    mode: "mcq",
    difficulty: "advanced",
    xp: 150,
    status: "locked",
    timeEstimate: "15 min",
  },

  // Noise & Error
  {
    id: "nr-1",
    title: "Bit-Flip Error Channel",
    subtitle: "Noise & Error Challenge",
    category: "noise",
    mode: "lab",
    difficulty: "intermediate",
    xp: 190,
    status: "open",
    timeEstimate: "25 min",
  },
  {
    id: "nr-2",
    title: "Surface Code Decoder",
    subtitle: "Noise & Error Challenge",
    category: "noise",
    mode: "lab",
    difficulty: "advanced",
    xp: 380,
    status: "locked",
    timeEstimate: "60 min",
  },
];

const completedCount = CHALLENGES.filter((c) => c.status === "completed").length;

// ── Badges ────────────────────────────────────────────────────────────────────

export const CHALLENGE_BADGES: ChallengeBadge[] = [
  {
    id: "first-solve",
    name: "First Solve",
    emoji: "⚡",
    bg: "#FFF7ED",
    border: "#FED7AA",
    textColor: "#C2410C",
    color: "#F97316",
    earned: true,
    requirement: "Complete your first challenge",
    requiresChallenges: 1,
    progress: 100,
  },
  {
    id: "circuit-apprentice",
    name: "Circuit Apprentice",
    emoji: "🔌",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    textColor: "#1D4ED8",
    color: "#3B82F6",
    earned: true,
    requirement: "Complete 3 circuit challenges",
    requiresChallenges: 3,
    progress: 100,
  },
  {
    id: "bell-master",
    name: "Bell Master",
    emoji: "🔔",
    bg: "#FFFBEB",
    border: "#FDE68A",
    textColor: "#B45309",
    color: "#F59E0B",
    earned: true,
    requirement: "Complete the Bell State Constructor",
    requiresChallenges: 1,
    progress: 100,
  },
  {
    id: "algorithm-hunter",
    name: "Algorithm Hunter",
    emoji: "🔍",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    textColor: "#6D28D9",
    color: "#8B5CF6",
    earned: false,
    requirement: "Complete 3 algorithm challenges",
    requiresChallenges: 3,
    progress: 33,
  },
  {
    id: "weekly-warrior",
    name: "Weekly Warrior",
    emoji: "🏹",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    textColor: "#065F46",
    color: "#10B981",
    earned: false,
    requirement: "Complete 3 weekly challenges",
    requiresChallenges: 3,
    progress: 67,
  },
  {
    id: "noise-buster",
    name: "Noise Buster",
    emoji: "🛡️",
    bg: "#F0F9FF",
    border: "#BAE6FD",
    textColor: "#0369A1",
    color: "#0EA5E9",
    earned: false,
    requirement: "Complete 2 noise & error challenges",
    requiresChallenges: 2,
    progress: 0,
  },
  {
    id: "quantum-grandmaster",
    name: "Quantum Grandmaster",
    emoji: "👑",
    bg: "#F9F5FF",
    border: "#E9D5FF",
    textColor: "#7E22CE",
    color: "#A855F7",
    earned: false,
    requirement: "Complete all challenges",
    requiresChallenges: CHALLENGES.length,
    progress: Math.round((completedCount / CHALLENGES.length) * 100),
  },
  {
    id: "speed-runner",
    name: "Speed Runner",
    emoji: "💨",
    bg: "#FEFCE8",
    border: "#FEF08A",
    textColor: "#854D0E",
    color: "#EAB308",
    earned: false,
    requirement: "Complete 5 challenges in one day",
    requiresChallenges: 5,
    progress: 40,
  },
];
