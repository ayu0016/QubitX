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

export default function QuantumLabPage() {
  // ── Workspace State ─────────────────────────────────────────────────────────
  const [framework, setFramework] = useState<Framework>("qiskit");
  const [language, setLanguage] = useState<Language>("python");
  const [editorMode, setEditorMode] = useState<EditorMode>("split");
  const [backend, setBackend] = useState<Backend>("qiskit_aer");
  const [shots, setShots] = useState<number>(1024);
  const [resultMode, setResultMode] = useState<ResultMode>("counts");

  const [circuit, setCircuit] = useState<CircuitState>(DEFAULT_BELL_CIRCUIT);
  const [code, setCode] = useState<string>(() =>
    generateCodeFromCircuit(DEFAULT_BELL_CIRCUIT, "qiskit", "python")
  );

  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("synchronized");
  const [parseError, setParseError] = useState<string | undefined>(undefined);
  const [isSimulating, setIsSimulating] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Simulation result derived from circuit state
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(() =>
    simulateCircuit(DEFAULT_BELL_CIRCUIT, 1024, "Qiskit Aer")
  );

  const parseTimerRef = useRef<number | null>(null);
  const saveTimerRef = useRef<number | null>(null);

  // ── LocalStorage Initialization ───────────────────────────────────────────
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.circuit) setCircuit(parsed.circuit);
        if (parsed.framework) setFramework(parsed.framework);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.editorMode) setEditorMode(parsed.editorMode);
        if (parsed.backend) setBackend(parsed.backend);
        if (parsed.shots) setShots(parsed.shots);
        if (parsed.resultMode) setResultMode(parsed.resultMode);

        const initialCode = generateCodeFromCircuit(
          parsed.circuit || DEFAULT_BELL_CIRCUIT,
          parsed.framework || "qiskit",
          parsed.language || "python"
        );
        setCode(initialCode);

        const initialSim = simulateCircuit(
          parsed.circuit || DEFAULT_BELL_CIRCUIT,
          parsed.shots || 1024,
          parsed.backend === "local_sim" ? "Local Simulator" : "Qiskit Aer"
        );
        setSimulationResult(initialSim);
      }
    } catch {
      // Fallback to default
    }
  }, []);

  // ── Auto-Save to LocalStorage ──────────────────────────────────────────────
  const triggerAutoSave = useCallback(() => {
    setSaveStatus("saving");
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(() => {
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
  }, [circuit, framework, language, editorMode, backend, shots, resultMode]);

  useEffect(() => {
    triggerAutoSave();
  }, [triggerAutoSave]);

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
