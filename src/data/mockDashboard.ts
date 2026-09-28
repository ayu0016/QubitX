import type {
  ResumeBanner,
  StatCardData,
  ModuleCardData,
  RecommendationRowData,
  DashboardNotification,
} from "../types";
import { ROUTES } from "../utils/routes";

export const resumeBanner: ResumeBanner = {
  title: "Pick up where you left off",
  description:
    "Entanglement — you're 61% through. Your tutor already has a hint ready if you get stuck.",
  ctaLabel: "Resume lesson",
};

export const statCards: StatCardData[] = [
  {
    id: "mastery",
    label: "MASTERY STATUS",
    value: "4",
    suffix: "/ 12",
    subLabel: "Concepts mastered",
    tint: "indigo",
  },
  {
    id: "simulator",
    label: "SIMULATOR JOBS",
    value: "27",
    subLabel: "Circuits run",
    tint: "blue",
    sparkline: [7.82, 18.25, 10.43, 23.47, 13.04, 28.68, 20.86],
  },
  {
    id: "consistency",
    label: "CONSISTENCY",
    value: "5",
    subLabel: "Day streak",
    tint: "amber",
  },
];

export const moduleCards: ModuleCardData[] = [
  {
    id: "bell-state",
    moduleNumber: "Module 03",
    title: "Bell State",
    description: "Entanglement, from first principles.",
    progress: 82,
    accentColor: "indigo",
  },
  {
    id: "deutsch-jozsa",
    moduleNumber: "Module 04",
    title: "Deutsch–Jozsa",
    description: "Your first taste of quantum speedup.",
    progress: 45,
    accentColor: "blue",
  },
  {
    id: "grovers",
    moduleNumber: "Module 05",
    title: "Grover's Algorithm",
    description: "Search a haystack, quantum-fast.",
    progress: 12,
    accentColor: "amber",
  },
];

export const recommendations: RecommendationRowData[] = [
  {
    id: "phase-kickback",
    title: "Phase kickback",
    description: "Your Deutsch–Jozsa score just crossed the threshold for it.",
    dotColor: "#4F46E5",
  },
  {
    id: "amplitude-amplification",
    title: "Amplitude amplification",
    description: "Builds directly on what you learned in Bell State.",
    dotColor: "#F59E0B",
  },
];

export const dashboardNotifications: DashboardNotification[] = [
  {
    id: "notif-1",
    title: "Weekly Challenge: Entanglement Gauntlet is live!",
    message: "Route 2-qubit Bell states through CNOT barriers to claim +200 XP and the Weekly Warrior badge.",
    time: "10m ago",
    type: "challenge",
    unread: true,
    linkText: "Start Challenge",
    linkTo: ROUTES.challenges,
  },
  {
    id: "notif-2",
    title: "Aer Simulator: Job #2841 Completed",
    message: "1,024 shots on 3-qubit Grover oracle completed with 99.2% state fidelity.",
    time: "42m ago",
    type: "simulator",
    unread: true,
    linkText: "View in Quantum Lab",
    linkTo: ROUTES.quantumLab,
  },
  {
    id: "notif-3",
    title: "Achievement Unlocked: Bell Master 🔔",
    message: "You constructed all 4 maximally entangled Bell basis states with zero phase error.",
    time: "2h ago",
    type: "badge",
    unread: false,
    linkText: "View Badges",
    linkTo: ROUTES.challenges,
  },
  {
    id: "notif-4",
    title: "AI Tutor: New Study Hint Ready",
    message: "Phase Kickback concept breakdown generated based on your last 3 circuit runs.",
    time: "5h ago",
    type: "tutor",
    unread: false,
    linkText: "Ask Tutor",
  },
];
