import { useState, useEffect, useCallback, useRef } from "react";
import type {
  Framework,
  Language,
  EditorMode,
  Backend,
  ResultMode,
  CircuitState,
  SimulationResult,
  SaveStatus,
  SyncStatus,
} from "./quantum-lab/types";
import { simulateCircuit } from "./quantum-lab/simulator/quantumEngine";
import { generateCodeFromCircuit, QUANTUM_PRESETS } from "./quantum-lab/simulator/codeGenerator";
import { parseCodeToCircuit } from "./quantum-lab/simulator/codeParser";

import WorkspaceHeader from "./quantum-lab/components/WorkspaceHeader";
import CodeEditorCard from "./quantum-lab/components/CodeEditorCard";
import CircuitEditorCard from "./quantum-lab/components/CircuitEditorCard";
import SimulationControlsBar from "./quantum-lab/components/SimulationControlsBar";
import ResultsPanel from "./quantum-lab/components/ResultsPanel";
import ResultDetailsModal from "./quantum-lab/components/ResultDetailsModal";

const LOCAL_STORAGE_KEY = "qubitx_quantum_lab_workspace_v1";

const DEFAULT_BELL_CIRCUIT: CircuitState = {
  numQubits: 2,
  maxColumns: 6,
  gates: [
    { id: "gate-h-0", type: "H", qubit: 0, column: 0 },
    { id: "gate-cx-0-1", type: "CNOT", qubit: 0, targetQubit: 1, column: 1 },
    { id: "gate-m-0", type: "M", qubit: 0, column: 2 },
    { id: "gate-m-1", type: "M", qubit: 1, column: 2 },
  ],
};

type InitialWorkspaceState = {
  framework: Framework;
  language: Language;
  editorMode: EditorMode;
  backend: Backend;
  shots: number;
  resultMode: ResultMode;
  circuit: CircuitState;
  code: string;
  simulationResult: SimulationResult | null;
};

function getInitialWorkspaceState(): InitialWorkspaceState {
  const fallbackCircuit = DEFAULT_BELL_CIRCUIT;
  const fallback = {
    framework: "qiskit" as Framework,
    language: "python" as Language,
    editorMode: "split" as EditorMode,
    backend: "qiskit_aer" as Backend,
    shots: 1024,
    resultMode: "counts" as ResultMode,
    circuit: fallbackCircuit,
    code: generateCodeFromCircuit(fallbackCircuit, "qiskit", "python"),
    simulationResult: simulateCircuit(fallbackCircuit, 1024, "Qiskit Aer"),
  };

  try {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedData) return fallback;

    const parsed = JSON.parse(savedData) as Partial<InitialWorkspaceState>;
    const circuit = parsed.circuit ?? fallbackCircuit;
    const framework = parsed.framework ?? "qiskit";
    const language = parsed.language ?? "python";
    const editorMode = parsed.editorMode ?? "split";
    const backend = parsed.backend ?? "qiskit_aer";
    const shots = parsed.shots ?? 1024;
    const resultMode = parsed.resultMode ?? "counts";

    return {
      framework,
      language,
      editorMode,
      backend,
      shots,
      resultMode,
      circuit,
      code: generateCodeFromCircuit(circuit, framework, language),
      simulationResult: simulateCircuit(
        circuit,
        shots,
        backend === "local_sim" ? "Local Simulator" : "Qiskit Aer"
      ),
    };
  } catch {
    return fallback;
  }
}

export default function QuantumLabPage() {
  const [workspace] = useState(() => getInitialWorkspaceState());

  // ── Workspace State ─────────────────────────────────────────────────────────
  const [framework, setFramework] = useState<Framework>(workspace.framework);
  const [language, setLanguage] = useState<Language>(workspace.language);
  const [editorMode, setEditorMode] = useState<EditorMode>(workspace.editorMode);
  const [backend, setBackend] = useState<Backend>(workspace.backend);
  const [shots, setShots] = useState<number>(workspace.shots);
  const [resultMode, setResultMode] = useState<ResultMode>(workspace.resultMode);

  const [circuit, setCircuit] = useState<CircuitState>(workspace.circuit);
  const [code, setCode] = useState<string>(workspace.code);

  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("synchronized");
  const [parseError, setParseError] = useState<string | undefined>(undefined);
  const [isSimulating, setIsSimulating] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Simulation result derived from circuit state
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(workspace.simulationResult);

  const parseTimerRef = useRef<number | null>(null);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(() => {
      setSaveStatus("saving");

      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            circuit,
            framework,
            language,
            editorMode,
            backend,
            shots,
            resultMode,
          })
        );
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 600);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [circuit, framework, language, editorMode, backend, shots, resultMode]);

  // ── Run / Simulate Action ──────────────────────────────────────────────────
  const handleRunCircuit = useCallback(() => {
    setIsSimulating(true);
    const backendName =
      backend === "local_sim"
        ? "Local Simulator"
        : backend === "ibm_quantum"
        ? "IBM Quantum Cloud"
        : "Qiskit Aer";

    setTimeout(() => {
      // If code was edited in IDE mode, parse code to get the active circuit
      const parsed = parseCodeToCircuit(code);
      const activeCircuit =
        parsed.success && parsed.circuit && parsed.circuit.gates.length > 0
          ? parsed.circuit
          : circuit;

      const newResult = simulateCircuit(activeCircuit, shots, backendName);
      setSimulationResult(newResult);
      if (parsed.success && parsed.circuit) {
        setCircuit(parsed.circuit);
      }
      setIsSimulating(false);
    }, 350);
  }, [circuit, code, shots, backend]);

  // ── Load Preset Circuit & Code ─────────────────────────────────────────────
  const handleSelectPreset = (presetId: string) => {
    const preset = QUANTUM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setCircuit(preset.circuit);
    const updatedCode = generateCodeFromCircuit(preset.circuit, framework, language);
    setCode(updatedCode);
    const backendName =
      backend === "local_sim"
        ? "Local Simulator"
        : backend === "ibm_quantum"
        ? "IBM Quantum Cloud"
        : "Qiskit Aer";
    const newResult = simulateCircuit(preset.circuit, shots, backendName);
    setSimulationResult(newResult);
    setSelectedGateId(null);
  };

  // ── Circuit Change -> Update Code & Simulation ─────────────────────────────
  const handleCircuitChange = useCallback(
    (newCircuit: CircuitState) => {
      setCircuit(newCircuit);
      setSyncStatus("syncing");
      setParseError(undefined);

      // Generate new code matching the new circuit
      const updatedCode = generateCodeFromCircuit(newCircuit, framework, language);
      setCode(updatedCode);

      // Re-run simulation
      const backendName =
        backend === "local_sim"
          ? "Local Simulator"
          : backend === "ibm_quantum"
          ? "IBM Quantum Cloud"
          : "Qiskit Aer";
      const newResult = simulateCircuit(newCircuit, shots, backendName);
      setSimulationResult(newResult);

      setTimeout(() => {
        setSyncStatus("synchronized");
      }, 150);
    },
    [framework, language, backend, shots]
  );

  // ── Code Change -> Parse & Update Circuit ──────────────────────────────────
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      setSyncStatus("syncing");

      if (parseTimerRef.current) window.clearTimeout(parseTimerRef.current);

      parseTimerRef.current = window.setTimeout(() => {
        const parseResult = parseCodeToCircuit(newCode);
        if (parseResult.success && parseResult.circuit) {
          setCircuit(parseResult.circuit);
          setParseError(undefined);

          const backendName =
            backend === "local_sim"
              ? "Local Simulator"
              : backend === "ibm_quantum"
              ? "IBM Quantum Cloud"
              : "Qiskit Aer";
          const newResult = simulateCircuit(parseResult.circuit, shots, backendName);
          setSimulationResult(newResult);
          setSyncStatus("synchronized");
        } else {
          setParseError(parseResult.error || "Unable to parse circuit from code");
          setSyncStatus("error");
        }
      }, 350);
    },
    [shots, backend]
  );

  // ── Framework Change ───────────────────────────────────────────────────────
  const handleFrameworkChange = (newFramework: Framework) => {
    setFramework(newFramework);
    const updatedCode = generateCodeFromCircuit(circuit, newFramework, language);
    setCode(updatedCode);
  };

  // ── Language Change ────────────────────────────────────────────────────────
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    const updatedCode = generateCodeFromCircuit(circuit, framework, newLanguage);
    setCode(updatedCode);
  };

  // ── Reset to Bell State ────────────────────────────────────────────────────
  const handleResetBellState = () => {
    handleCircuitChange(DEFAULT_BELL_CIRCUIT);
    setSelectedGateId(null);
  };

  // ── Clear Circuit ──────────────────────────────────────────────────────────
  const handleClearCircuit = () => {
    const emptyCircuit: CircuitState = {
      numQubits: circuit.numQubits,
      maxColumns: 6,
      gates: [],
    };
    handleCircuitChange(emptyCircuit);
    setSelectedGateId(null);
  };

  const backendDisplayName =
    backend === "local_sim"
      ? "Local Simulator"
      : backend === "ibm_quantum"
      ? "IBM Quantum"
      : "Qiskit Aer";

  return (
    <div className="p-8 sm:p-10 flex flex-col gap-6 min-h-full max-w-[1400px] mx-auto">
      {/* ── 1. Workspace Header ──────────────────────────────────────────── */}
      <WorkspaceHeader
        framework={framework}
        onFrameworkChange={handleFrameworkChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        editorMode={editorMode}
        onEditorModeChange={setEditorMode}
        saveStatus={saveStatus}
      />

      {/* ── 2. Main Workspace (IDE / Circuit / Split) ────────────────────── */}
      <div
        className={[
          "w-full transition-all duration-300",
          editorMode === "split"
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
            : "flex flex-col gap-6",
        ].join(" ")}
      >
        {/* Left: Code Editor Card */}
        {(editorMode === "split" || editorMode === "ide") && (
          <div className={editorMode === "ide" ? "w-full" : ""}>
            <CodeEditorCard
              code={code}
              onCodeChange={handleCodeChange}
              framework={framework}
              language={language}
              syncStatus={syncStatus}
              numQubits={circuit.numQubits}
              gateCount={circuit.gates.length}
              parseError={parseError}
              onRun={handleRunCircuit}
              isSimulating={isSimulating}
              onSelectPreset={handleSelectPreset}
              editorMode={editorMode}
            />
          </div>
        )}

        {/* Right: Circuit Editor Card */}
        {(editorMode === "split" || editorMode === "circuit") && (
          <div className={editorMode === "circuit" ? "w-full" : ""}>
            <CircuitEditorCard
              circuit={circuit}
              onCircuitChange={handleCircuitChange}
              selectedGateId={selectedGateId}
              onSelectGate={setSelectedGateId}
              syncStatus={syncStatus}
              depth={simulationResult?.depth ?? 0}
              entangledStateStr={simulationResult?.entangledStateStr ?? "|00⟩"}
              onResetBellState={handleResetBellState}
              onClearCircuit={handleClearCircuit}
              onRun={handleRunCircuit}
              isSimulating={isSimulating}
              onSelectPreset={handleSelectPreset}
              editorMode={editorMode}
            />
          </div>
        )}
      </div>

      {/* ── 3. Simulation Controls Bar ───────────────────────────────────── */}
      <SimulationControlsBar
        backend={backend}
        onBackendChange={(b) => {
          setBackend(b);
          handleRunCircuit();
        }}
        shots={shots}
        onShotsChange={(s) => {
          setShots(s);
          const newResult = simulateCircuit(circuit, s, backendDisplayName);
          setSimulationResult(newResult);
        }}
        resultMode={resultMode}
        onResultModeChange={setResultMode}
        onRunCircuit={handleRunCircuit}
        isSimulating={isSimulating}
      />

      {/* ── 4. Results Section ───────────────────────────────────────────── */}
      <ResultsPanel
        result={simulationResult}
        resultMode={resultMode}
        backendName={backendDisplayName}
        onViewDetails={() => setDetailsModalOpen(true)}
      />

      {/* ── 5. Detailed Inspection Modal ─────────────────────────────────── */}
      <ResultDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        result={simulationResult}
        circuit={circuit}
      />
    </div>
  );
}
