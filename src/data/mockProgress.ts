// ─── Progress Page Mock Data ──────────────────────────────────────────────────

export interface MasteryMetric {
  mastered: number;
  total: number;
}

export interface CourseProgressData {
  percent: number;
  moduleName: string;
}

export interface ConceptMastery {
  id: string;
  name: string;
  percent: number;
  status: "Mastered" | "In progress" | "Just started" | "Locked";
}

export interface SkillNode {
  id: string;
  label: string;
  status: "mastered" | "in-progress" | "locked";
  percent?: number;
  /** grid col/row position (1-indexed) in a 7-col × 3-row grid */
  col: number;
  row: number;
}

export interface Misconception {
  id: string;
  text: string;
  seenTimes: number;
}

export interface ActivityDay {
  intensity: 0 | 1 | 2 | 3 | 4; // 0 = rest, 4 = max
}

export interface QubitState {
  noviceAmplitude: number; // e.g. 0.57
  expertAmplitude: number; // e.g. 0.82
  expertPercent: number;   // e.g. 68
}

export interface RecommendedNext {
  topic: string;
  reason: string;
}

// ── Stat summary ──────────────────────────────────────────────────────────────
export const masteryMetric: MasteryMetric = { mastered: 4, total: 12 };

export const courseProgress: CourseProgressData = {
  percent: 68,
  moduleName: "Entanglement module",
};

export const simulatorJobs = 27;
export const dayStreak = 5;

// ── Cognitive mastery vector ──────────────────────────────────────────────────
export const conceptMasteries: ConceptMastery[] = [
  { id: "superposition",  name: "Superposition",         percent: 82, status: "Mastered"     },
  { id: "entanglement",   name: "Entanglement",           percent: 61, status: "In progress"  },
  { id: "measurement",    name: "Measurement dynamics",   percent: 45, status: "In progress"  },
  { id: "grovers",        name: "Grover's algorithm",     percent: 12, status: "Just started" },
];

// ── Qubit state banner ────────────────────────────────────────────────────────
export const qubitState: QubitState = {
  noviceAmplitude: 0.57,
  expertAmplitude: 0.82,
  expertPercent: 68,
};

// ── Skill constellation ───────────────────────────────────────────────────────
export const skillNodes: SkillNode[] = [
  { id: "qubits-bloch",       label: "Qubits & Bloch",      status: "mastered",     percent: 100, col: 1, row: 2 },
  { id: "single-qubit-gates", label: "Single-qubit gates",  status: "mastered",     percent: 95,  col: 2, row: 1 },
  { id: "superposition-node", label: "Superposition",        status: "mastered",     percent: 82,  col: 2, row: 3 },
  { id: "cnot-multi",         label: "CNOT & multi-qubit",  status: "mastered",     percent: 90,  col: 3, row: 1 },
  { id: "measurement-node",   label: "Measurement",          status: "in-progress",  percent: 45,  col: 3, row: 3 },
  { id: "entanglement-node",  label: "Entanglement",         status: "in-progress",  percent: 61,  col: 4, row: 2 },
  { id: "bell-states",        label: "Bell states",          status: "in-progress",  percent: 55,  col: 5, row: 1 },
  { id: "deutsch-jozsa",      label: "Deutsch–Jozsa",        status: "in-progress",  percent: 40,  col: 5, row: 2 },
  { id: "grovers-node",       label: "Grover's",             status: "in-progress",  percent: 12,  col: 6, row: 1 },
  { id: "amplitude-amp",      label: "Amplitude amp.",       status: "locked",       col: 7, row: 1 },
  { id: "phase-kickback",     label: "Phase kickback",       status: "locked",       col: 6, row: 3 },
  { id: "phase-estimation",   label: "Phase estimation",     status: "locked",       col: 7, row: 3 },
];

// ── Prediction accuracy ───────────────────────────────────────────────────────
export const predictionAccuracy = {
  percent: 72,
  matched: 36,
  total: 50,
  pointsGain: 14,
  weeksSpan: 5,
};

export const misconceptions: Misconception[] = [
  { id: "cnot-roles",    text: "CNOT control vs target roles",       seenTimes: 4 },
  { id: "global-phase",  text: "Global vs relative phase",           seenTimes: 3 },
  { id: "superpos-myth", text: "Superposition means both at once",   seenTimes: 2 },
];

// ── Qubit lattice (84 days = 12 weeks × 7 days) ───────────────────────────────
// Intensity: 0=rest, 1=low, 2=med, 3=high, 4=max
export const activityGrid: ActivityDay[] = [
  {intensity:0},{intensity:1},{intensity:2},{intensity:3},{intensity:3},
  {intensity:0},{intensity:1},{intensity:0},{intensity:2},{intensity:0},
  {intensity:3},{intensity:3},{intensity:1},{intensity:0},{intensity:0},
  {intensity:1},{intensity:2},{intensity:0},{intensity:1},{intensity:2},
  {intensity:3},{intensity:1},{intensity:2},{intensity:3},{intensity:1},
  {intensity:0},{intensity:2},{intensity:3},{intensity:2},{intensity:0},
  {intensity:3},{intensity:2},{intensity:1},{intensity:0},{intensity:2},
  {intensity:0},{intensity:1},{intensity:2},{intensity:3},{intensity:2},
  {intensity:1},{intensity:3},{intensity:3},{intensity:2},{intensity:1},
  {intensity:0},{intensity:1},{intensity:2},{intensity:3},{intensity:1},
  {intensity:2},{intensity:0},{intensity:3},{intensity:1},{intensity:0},
  {intensity:2},{intensity:3},{intensity:2},{intensity:0},{intensity:1},
  {intensity:3},{intensity:3},{intensity:3},{intensity:3},{intensity:3},
  {intensity:1},{intensity:2},{intensity:3},{intensity:3},{intensity:3},
  {intensity:3},{intensity:3},{intensity:3},{intensity:4},{intensity:0},
  {intensity:0},{intensity:0},{intensity:0},{intensity:0},{intensity:0},
  {intensity:0},{intensity:0},{intensity:0},{intensity:0},
];

// ── Recommended next ──────────────────────────────────────────────────────────
export const recommendedNext: RecommendedNext = {
  topic: "Phase kickback",
  reason: "Your Deutsch–Jozsa score just crossed the threshold for it.",
};
