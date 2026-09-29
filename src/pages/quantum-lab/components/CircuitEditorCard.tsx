import { useState } from "react";
import {
  Trash2,
  RotateCcw,
  Info,
  Plus,
  Minus,
  Play,
  Sparkles,
  ChevronDown,
  Layers,
} from "lucide-react";
import type { CircuitState, GateItem, GateType, SyncStatus } from "../types";
import { QUANTUM_PRESETS } from "../simulator/codeGenerator";

interface Props {
  circuit: CircuitState;
  onCircuitChange: (newCircuit: CircuitState) => void;
  selectedGateId: string | null;
  onSelectGate: (id: string | null) => void;
  syncStatus: SyncStatus;
  depth: number;
  entangledStateStr: string;
  onResetBellState: () => void;
  onClearCircuit: () => void;
  onRun?: () => void;
  isSimulating?: boolean;
  onSelectPreset?: (presetId: string) => void;
  editorMode?: "split" | "ide" | "circuit";
}

const createGateId = (type: GateType) => {
  const uniquePart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `gate-${type.toLowerCase()}-${uniquePart}`;
};

const GATE_METAS: {
  type: GateType;
  label: string;
  desc: string;
  bg: string;
  border: string;
  textColor: string;
}[] = [
  {
    type: "H",
    label: "H",
    desc: "Hadamard: creates superposition |0⟩ → (|0⟩+|1⟩)/√2",
    bg: "bg-[#EEF2FF] hover:bg-[#E0E7FF]",
    border: "border-[#C7D2FE]",
    textColor: "text-[#6366F1]",
  },
  {
    type: "X",
    label: "X",
    desc: "Pauli-X: quantum NOT bit-flip |0⟩ ↔ |1⟩",
    bg: "bg-[#F0F9FF] hover:bg-[#E0F2FE]",
    border: "border-[#BAE6FD]",
    textColor: "text-[#0284C7]",
  },
  {
    type: "Y",
    label: "Y",
    desc: "Pauli-Y: bit-and-phase flip",
    bg: "bg-[#F5F3FF] hover:bg-[#EDE9FE]",
    border: "border-[#DDD6FE]",
    textColor: "text-[#8B5CF6]",
  },
  {
    type: "Z",
    label: "Z",
    desc: "Pauli-Z: phase flip |1⟩ → -|1⟩",
    bg: "bg-[#FAF5FF] hover:bg-[#F3E8FF]",
    border: "border-[#E9D5FF]",
    textColor: "text-[#9333EA]",
  },
  {
    type: "S",
    label: "S",
    desc: "S Gate: π/2 phase rotation",
    bg: "bg-[#FDF4FF] hover:bg-[#FAE8FF]",
    border: "border-[#F5D0FE]",
    textColor: "text-[#C026D3]",
  },
  {
    type: "T",
    label: "T",
    desc: "T Gate: π/4 phase rotation",
    bg: "bg-[#FFF1F2] hover:bg-[#FFE4E6]",
    border: "border-[#FECDD3]",
    textColor: "text-[#E11D48]",
  },
  {
    type: "CNOT",
    label: "CNOT",
    desc: "Controlled-NOT: flips target if control is |1⟩",
    bg: "bg-[#EEF2FF] hover:bg-[#E0E7FF]",
    border: "border-[#C7D2FE]",
    textColor: "text-[#4F46E5]",
  },
  {
    type: "M",
    label: "M",
    desc: "Measurement: collapses state to classical bit",
    bg: "bg-[#FEF3C7]/90 hover:bg-[#FDE68A]",
    border: "border-[#FDE68A]",
    textColor: "text-[#D97706]",
  },
];

export default function CircuitEditorCard({
  circuit,
  onCircuitChange,
  selectedGateId,
  onSelectGate,
  syncStatus,
  depth,
  entangledStateStr,
  onResetBellState,
  onClearCircuit,
  onRun,
  isSimulating = false,
  onSelectPreset,
  editorMode = "split",
}: Props) {
  const [activeBrush, setActiveBrush] = useState<GateType | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<{ qubit: number; column: number } | null>(null);
  const [hoveredGateMeta, setHoveredGateMeta] = useState<string | null>(null);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);
  const [draggedGateType, setDraggedGateType] = useState<GateType | null>(null);
  const [movingGateId, setMovingGateId] = useState<string | null>(null);

  const numCols = Math.max(6, circuit.gates.reduce((max, g) => Math.max(max, g.column + 2), 5));

  // ── Drag & Drop Handlers ──────────────────────────────────────────────────
  const handlePaletteDragStart = (e: React.DragEvent, type: GateType) => {
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "copy";
    setDraggedGateType(type);
  };

  const handleGateDragStart = (e: React.DragEvent, gateId: string) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", gateId);
    e.dataTransfer.effectAllowed = "move";
    setMovingGateId(gateId);
  };

  const handleDragOver = (e: React.DragEvent, qubit: number, column: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setHoveredSlot({ qubit, column });
  };

  const handleDrop = (e: React.DragEvent, qubit: number, column: number) => {
    e.preventDefault();
    setHoveredSlot(null);

    const data = e.dataTransfer.getData("text/plain");

    if (movingGateId || circuit.gates.some((g) => g.id === data)) {
      // Reposition existing gate
      const targetId = movingGateId || data;
      const targetGate = circuit.gates.find((g) => g.id === targetId);
      if (!targetGate) return;

      const otherGates = circuit.gates.filter((g) => g.id !== targetId);
      const updated: GateItem = {
        ...targetGate,
        qubit,
        column,
        targetQubit:
          targetGate.type === "CNOT"
            ? qubit === 0
              ? 1
              : 0
            : targetGate.targetQubit,
      };

      onCircuitChange({ ...circuit, gates: [...otherGates, updated] });
      onSelectGate(updated.id);
      setMovingGateId(null);
      return;
    }

    // Dropping from palette
    const gateType = (draggedGateType || data) as GateType;
    if (gateType) {
      placeGateAt(gateType, qubit, column);
      setDraggedGateType(null);
    }
  };

  // ── Click to Place or Select ──────────────────────────────────────────────
  const placeGateAt = (type: GateType, qubit: number, column: number) => {
    // Remove any existing gate at this exact slot
    const filtered = circuit.gates.filter(
      (g) => !(g.qubit === qubit && g.column === column)
    );

    const newGate: GateItem = {
      id: createGateId(type),
      type,
      qubit,
      column,
      targetQubit:
        type === "CNOT"
          ? qubit + 1 < circuit.numQubits
            ? qubit + 1
            : qubit - 1 >= 0
            ? qubit - 1
            : 1
          : undefined,
    };

    onCircuitChange({
      ...circuit,
      gates: [...filtered, newGate],
    });
    onSelectGate(newGate.id);
  };

  const handleSlotClick = (qubit: number, column: number) => {
    if (activeBrush) {
      placeGateAt(activeBrush, qubit, column);
    } else {
      // Default to Hadamard or open quick picker
      placeGateAt("H", qubit, column);
    }
  };

  // ── Qubit Controls (+ / -) ────────────────────────────────────────────────
  const handleAddQubit = () => {
    if (circuit.numQubits >= 4) return;
    onCircuitChange({
      ...circuit,
      numQubits: circuit.numQubits + 1,
    });
  };

  const handleRemoveQubit = () => {
    if (circuit.numQubits <= 1) return;
    const newNum = circuit.numQubits - 1;
    const remainingGates = circuit.gates.filter(
      (g) => g.qubit < newNum && (g.targetQubit === undefined || g.targetQubit < newNum)
    );
    onCircuitChange({
      ...circuit,
      numQubits: newNum,
      gates: remainingGates,
    });
  };

  const handleDeleteSelected = () => {
    if (!selectedGateId) return;
    const remaining = circuit.gates.filter((g) => g.id !== selectedGateId);
    onCircuitChange({ ...circuit, gates: remaining });
    onSelectGate(null);
  };

  return (
    <div
      className={[
        "bg-white rounded-[24px] border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all",
        editorMode === "circuit" ? "min-h-[580px]" : "min-h-[460px]",
      ].join(" ")}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Delete" || e.key === "Backspace") && selectedGateId) {
          handleDeleteSelected();
        }
      }}
      aria-label="Quantum Circuit Editor"
    >
      {/* ── 1. Top Header ──────────────────────────────────────────────── */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white flex-wrap gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[16px] text-[#0B1C30]">
              Circuit Canvas
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-mono font-semibold">
              {circuit.numQubits} Qubit{circuit.numQubits > 1 ? "s" : ""}
            </span>
          </div>

          {/* Preset Circuits Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPresetMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[12px] font-medium transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Circuit Presets</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {presetMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Load Standard Circuit
                </div>
                {QUANTUM_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectPreset?.(p.id);
                      setPresetMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-slate-50 flex flex-col transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800">{p.name}</span>
                    <span className="text-[11px] text-slate-400">{p.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right header actions */}
        <div className="flex items-center gap-2">
          {/* Synchronized status badge */}
          <div
            className={[
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors select-none",
              syncStatus === "synchronized"
                ? "bg-[#ECFDF5] text-emerald-700 border border-emerald-200/80"
                : "bg-amber-50 text-amber-700 border border-amber-200",
            ].join(" ")}
          >
            <span
              className={[
                "w-2 h-2 rounded-full",
                syncStatus === "synchronized" ? "bg-emerald-500" : "bg-amber-500 animate-pulse",
              ].join(" ")}
            />
            <span>{syncStatus === "synchronized" ? "Synchronized" : "Syncing..."}</span>
          </div>

          {/* Prominent Run Button */}
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#0B1C30] hover:bg-slate-800 active:scale-98 text-white rounded-xl text-[13px] font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Play size={13} className="fill-white" />
              <span>{isSimulating ? "Simulating..." : "Run Circuit"}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Gate Palette & Wire Controls Bar ─────────────────────────── */}
      <div className="px-5 py-2.5 bg-[#FAFBFD] border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 flex-wrap">
        {/* Palette with Click-to-Select Brush AND Drag-Drop */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] text-slate-500 font-semibold select-none mr-1">
            Gate Palette:
          </span>

          {GATE_METAS.map((gate) => {
            const isBrushActive = activeBrush === gate.type;
            return (
              <button
                key={gate.type}
                type="button"
                draggable
                onDragStart={(e) => handlePaletteDragStart(e, gate.type)}
                onDragEnd={() => setDraggedGateType(null)}
                onClick={() => {
                  if (activeBrush === gate.type) {
                    setActiveBrush(null); // toggle off
                  } else {
                    setActiveBrush(gate.type); // select as active brush
                  }
                }}
                onMouseEnter={() => setHoveredGateMeta(gate.desc)}
                onMouseLeave={() => setHoveredGateMeta(null)}
                title={gate.desc}
                className={[
                  "w-8 h-8 rounded-lg font-bold text-[13px] flex items-center justify-center transition-all cursor-grab active:cursor-grabbing shadow-2xs select-none",
                  gate.bg,
                  gate.border,
                  gate.textColor,
                  isBrushActive
                    ? "ring-2 ring-indigo-600 ring-offset-1 scale-110 shadow-sm"
                    : "border",
                ].join(" ")}
              >
                {gate.label}
              </button>
            );
          })}

          {activeBrush ? (
            <span className="text-[12px] text-indigo-600 font-semibold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full ml-2 animate-in fade-in">
              Tool active: {activeBrush} (click wire slot to place)
            </span>
          ) : (
            <span className="text-[12px] text-slate-400 select-none ml-2 hidden sm:inline">
              Click tool or drag onto wires
            </span>
          )}
        </div>

        {/* Qubit Count Controls & Reset Buttons */}
        <div className="flex items-center gap-2">
          {/* Add / Remove Qubits */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleRemoveQubit}
              disabled={circuit.numQubits <= 1}
              title="Remove bottom qubit"
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
            >
              <Minus size={13} />
            </button>
            <span className="px-2 text-[12px] font-mono font-bold text-slate-700">
              {circuit.numQubits}Q
            </span>
            <button
              type="button"
              onClick={handleAddQubit}
              disabled={circuit.numQubits >= 4}
              title="Add another qubit wire"
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>

          {selectedGateId && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              title="Delete selected gate"
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          )}

          <button
            type="button"
            onClick={onResetBellState}
            title="Reset to Bell State"
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onClearCircuit}
            title="Clear all gates"
            className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Info tooltip banner */}
      {hoveredGateMeta && (
        <div className="px-5 py-1.5 bg-indigo-50/70 border-b border-indigo-100 text-[12px] text-indigo-900 flex items-center gap-1.5 animate-in fade-in duration-100">
          <Info size={13} className="text-indigo-600 shrink-0" />
          <span>{hoveredGateMeta}</span>
        </div>
      )}

      {/* ── 3. Circuit Canvas & Interactive Wires ───────────────────────── */}
      <div
        className="flex-1 p-8 relative overflow-x-auto flex flex-col justify-center select-none min-h-[260px] bg-white"
        onClick={() => onSelectGate(null)}
      >
        <div className="min-w-[480px] flex flex-col gap-14 relative my-auto">
          {Array.from({ length: circuit.numQubits }).map((_, qIdx) => {
            return (
              <div key={qIdx} className="relative flex items-center h-12">
                {/* Qubit state badge |0⟩ */}
                <div className="w-14 flex items-center gap-1 shrink-0">
                  <span className="text-[15px] font-mono font-bold text-[#0B1C30]">
                    q{qIdx}
                  </span>
                  <span className="text-[12px] font-mono text-slate-400">|0⟩</span>
                </div>

                {/* Horizontal wire line */}
                <div className="absolute left-14 right-4 h-[2px] bg-[#E2E8F0] z-0" />

                {/* Column slots */}
                <div className="flex items-center gap-7 ml-4 z-10">
                  {Array.from({ length: numCols }).map((__, colIdx) => {
                    const gate = circuit.gates.find(
                      (g) => g.qubit === qIdx && g.column === colIdx
                    );
                    const cnotSource = circuit.gates.find(
                      (g) =>
                        g.type === "CNOT" &&
                        g.column === colIdx &&
                        g.targetQubit === qIdx
                    );

                    const isHovered =
                      hoveredSlot?.qubit === qIdx && hoveredSlot?.column === colIdx;

                    return (
                      <div
                        key={colIdx}
                        onDragOver={(e) => handleDragOver(e, qIdx, colIdx)}
                        onDrop={(e) => handleDrop(e, qIdx, colIdx)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!gate && !cnotSource) {
                            handleSlotClick(qIdx, colIdx);
                          }
                        }}
                        className={[
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all relative cursor-pointer group",
                          isHovered && "bg-indigo-50 border-2 border-dashed border-indigo-400 scale-105",
                        ].join(" ")}
                        title={
                          gate
                            ? `${gate.type} Gate on q${qIdx}`
                            : `Click to place ${activeBrush || "H"} gate on q${qIdx}`
                        }
                      >
                        {/* ── Case 1: Primary Gate on wire ────────────────── */}
                        {gate && (
                          <div
                            draggable
                            onDragStart={(e) => handleGateDragStart(e, gate.id)}
                            onDragEnd={() => setMovingGateId(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectGate(gate.id);
                            }}
                            className={[
                              "cursor-grab active:cursor-grabbing transition-all select-none",
                              selectedGateId === gate.id &&
                                "ring-2 ring-indigo-600 ring-offset-2 scale-105 shadow-md",
                            ].join(" ")}
                          >
                            {/* H Gate */}
                            {gate.type === "H" && (
                              <div className="w-10 h-10 rounded-xl bg-[#6366F1] text-white font-bold text-[15px] flex items-center justify-center shadow-xs">
                                H
                              </div>
                            )}

                            {/* X Gate */}
                            {gate.type === "X" && (
                              <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white font-bold text-[15px] flex items-center justify-center shadow-xs">
                                X
                              </div>
                            )}

                            {/* Y Gate */}
                            {gate.type === "Y" && (
                              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] text-white font-bold text-[15px] flex items-center justify-center shadow-xs">
                                Y
                              </div>
                            )}

                            {/* Z Gate */}
                            {gate.type === "Z" && (
                              <div className="w-10 h-10 rounded-xl bg-[#9333EA] text-white font-bold text-[15px] flex items-center justify-center shadow-xs">
                                Z
                              </div>
                            )}

                            {/* S Gate */}
                            {gate.type === "S" && (
                              <div className="w-10 h-10 rounded-xl bg-[#C026D3] text-white font-bold text-[14px] flex items-center justify-center shadow-xs">
                                S
                              </div>
                            )}

                            {/* T Gate */}
                            {gate.type === "T" && (
                              <div className="w-10 h-10 rounded-xl bg-[#E11D48] text-white font-bold text-[14px] flex items-center justify-center shadow-xs">
                                T
                              </div>
                            )}

                            {/* CNOT Control Dot */}
                            {gate.type === "CNOT" && (
                              <div className="relative flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-[#4F46E5] shadow-sm ring-2 ring-white" />
                                <div
                                  className="absolute w-[2px] bg-[#4F46E5] pointer-events-none"
                                  style={{
                                    top: (gate.targetQubit ?? 1) > qIdx ? "8px" : "auto",
                                    bottom: (gate.targetQubit ?? 1) < qIdx ? "8px" : "auto",
                                    height: `${Math.abs((gate.targetQubit ?? 1) - qIdx) * 104}px`,
                                    left: "7px",
                                  }}
                                />
                              </div>
                            )}

                            {/* Measurement Gate */}
                            {gate.type === "M" && (
                              <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] border-2 border-[#F59E0B] text-[#D97706] flex flex-col items-center justify-center shadow-xs">
                                <span className="text-[12px] font-bold leading-none">M</span>
                                <svg width="14" height="6" viewBox="0 0 14 6" fill="none" className="mt-0.5">
                                  <path d="M1 5C1 5 3.5 1 7 1C10.5 1 13 5 13 5" stroke="#D97706" strokeWidth="1.2" />
                                  <path d="M7 5L9.5 1.5" stroke="#D97706" strokeWidth="1.2" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── Case 2: CNOT Target ⊕ on wire ──────────────── */}
                        {!gate && cnotSource && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectGate(cnotSource.id);
                            }}
                            className={[
                              "cursor-pointer transition-all",
                              selectedGateId === cnotSource.id &&
                                "ring-2 ring-indigo-600 ring-offset-2 scale-105",
                            ].join(" ")}
                          >
                            <div className="w-8 h-8 rounded-full border-2 border-[#4F46E5] bg-white flex items-center justify-center text-[#4F46E5] font-bold text-[18px] leading-none shadow-xs">
                              ⊕
                            </div>
                          </div>
                        )}

                        {/* ── Case 3: Empty Slot Dot with Hover Target ───── */}
                        {!gate && !cnotSource && (
                          <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-indigo-400 group-hover:scale-150 transition-all flex items-center justify-center">
                            <span className="text-[8px] text-white opacity-0 group-hover:opacity-100 font-bold">
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Circuit Stats Footer ─────────────────────────────────────── */}
      <div className="px-5 py-3 border-t border-slate-100 bg-[#FAFCFF] flex items-center justify-between text-[12px] text-slate-600 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Layers size={14} className="text-indigo-600" />
            <span>Circuit Depth: </span>
            <span className="font-bold text-slate-900 font-mono">{depth} layers</span>
          </div>

          <span className="text-slate-300">•</span>

          <div className="text-slate-500">
            Total Gates: <strong className="text-slate-800 font-mono">{circuit.gates.length}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Current Statevector:</span>
          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg text-[12px]">
            {entangledStateStr}
          </span>
        </div>
      </div>
    </div>
  );
}
