export type GateType = "H" | "X" | "Y" | "Z" | "CNOT" | "M" | "S" | "T";

export interface GateItem {
  id: string;
  type: GateType;
  qubit: number;        // Primary qubit (or control qubit for CNOT)
  targetQubit?: number; // Target qubit for CNOT
  column: number;       // Column index (0, 1, 2, ...)
}

export interface CircuitState {
  numQubits: number;
  gates: GateItem[];
  maxColumns: number;
}

export type Framework = "qiskit" | "cirq" | "pennylane";
export type Language = "python" | "javascript" | "typescript";
export type EditorMode = "split" | "ide" | "circuit";
export type Backend = "qiskit_aer" | "local_sim" | "ibm_quantum";
export type ResultMode = "counts" | "probabilities" | "statevector";
export type SaveStatus = "saved" | "saving" | "unsaved" | "error";
export type SyncStatus = "synchronized" | "syncing" | "error";

export interface StatevectorComponent {
  state: string;       // e.g. "|00⟩"
  real: number;
  imag: number;
  magnitude: number;
  probability: number;
  phaseRad: number;
}

export interface SimulationResult {
  probabilities: Record<string, number>;
  counts: Record<string, number>;
  shots: number;
  seed: number;
  depth: number;
  gateCount: number;
  executionTimeMs: number;
  entangledStateStr: string;
  statevector: StatevectorComponent[];
  isBellState: boolean;
  matchesTheory: boolean;
  backendName: string;
}

export interface WorkspaceState {
  framework: Framework;
  language: Language;
  editorMode: EditorMode;
  backend: Backend;
  shots: number;
  resultMode: ResultMode;
  saveStatus: SaveStatus;
  syncStatus: SyncStatus;
  circuit: CircuitState;
  code: string;
  selectedGateId: string | null;
  result: SimulationResult | null;
}
