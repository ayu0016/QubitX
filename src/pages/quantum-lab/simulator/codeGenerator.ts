import type { CircuitState, Framework, Language } from "../types";

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  numQubits: number;
  circuit: CircuitState;
}

export const QUANTUM_PRESETS: CodeTemplate[] = [
  {
    id: "bell_state",
    name: "Bell State |Φ+⟩",
    description: "2-Qubit maximally entangled state (|00⟩ + |11⟩)",
    numQubits: 2,
    circuit: {
      numQubits: 2,
      maxColumns: 6,
      gates: [
        { id: "g-h0", type: "H", qubit: 0, column: 0 },
        { id: "g-cx01", type: "CNOT", qubit: 0, targetQubit: 1, column: 1 },
        { id: "g-m0", type: "M", qubit: 0, column: 2 },
        { id: "g-m1", type: "M", qubit: 1, column: 2 },
      ],
    },
  },
  {
    id: "ghz_state",
    name: "GHZ 3-Qubit State",
    description: "Tripartite Greenberger-Horne-Zeilinger entanglement (|000⟩ + |111⟩)",
    numQubits: 3,
    circuit: {
      numQubits: 3,
      maxColumns: 6,
      gates: [
        { id: "g-ghz-h0", type: "H", qubit: 0, column: 0 },
        { id: "g-ghz-cx01", type: "CNOT", qubit: 0, targetQubit: 1, column: 1 },
        { id: "g-ghz-cx12", type: "CNOT", qubit: 1, targetQubit: 2, column: 2 },
        { id: "g-ghz-m0", type: "M", qubit: 0, column: 3 },
        { id: "g-ghz-m1", type: "M", qubit: 1, column: 3 },
        { id: "g-ghz-m2", type: "M", qubit: 2, column: 3 },
      ],
    },
  },
  {
    id: "superposition",
    name: "Single Qubit Superposition",
    description: "Equal superposition |+⟩ = (|0⟩ + |1⟩)/√2",
    numQubits: 1,
    circuit: {
      numQubits: 1,
      maxColumns: 6,
      gates: [
        { id: "g-sup-h0", type: "H", qubit: 0, column: 0 },
        { id: "g-sup-m0", type: "M", qubit: 0, column: 1 },
      ],
    },
  },
  {
    id: "teleportation",
    name: "Quantum Teleportation",
    description: "Teleport unknown qubit state using shared EPR entanglement",
    numQubits: 3,
    circuit: {
      numQubits: 3,
      maxColumns: 6,
      gates: [
        { id: "g-tel-h1", type: "H", qubit: 1, column: 0 },
        { id: "g-tel-cx12", type: "CNOT", qubit: 1, targetQubit: 2, column: 1 },
        { id: "g-tel-cx01", type: "CNOT", qubit: 0, targetQubit: 1, column: 2 },
        { id: "g-tel-h0", type: "H", qubit: 0, column: 3 },
        { id: "g-tel-m0", type: "M", qubit: 0, column: 4 },
        { id: "g-tel-m1", type: "M", qubit: 1, column: 4 },
      ],
    },
  },
  {
    id: "grover_search",
    name: "Grover 2-Qubit Search",
    description: "Amplitude amplification search for target state |11⟩",
    numQubits: 2,
    circuit: {
      numQubits: 2,
      maxColumns: 6,
      gates: [
        { id: "g-grv-h0", type: "H", qubit: 0, column: 0 },
        { id: "g-grv-h1", type: "H", qubit: 1, column: 0 },
        { id: "g-grv-cz", type: "Z", qubit: 1, column: 1 },
        { id: "g-grv-dh0", type: "H", qubit: 0, column: 2 },
        { id: "g-grv-dh1", type: "H", qubit: 1, column: 2 },
        { id: "g-grv-m0", type: "M", qubit: 0, column: 3 },
        { id: "g-grv-m1", type: "M", qubit: 1, column: 3 },
      ],
    },
  },
];

/**
 * Generates quantum code from circuit state based on selected framework and language
 */
export function generateCodeFromCircuit(
  circuit: CircuitState,
  framework: Framework,
  language: Language
): string {
  const n = Math.max(1, Math.min(4, circuit.numQubits));
  const sorted = [...circuit.gates].sort((a, b) => a.column - b.column);
  const hasMeasureAll = sorted.some((g) => g.type === "M");

  // ─── Qiskit (Python) ────────────────────────────────────────────────────────
  if (framework === "qiskit" && language === "python") {
    const lines: string[] = [
      "from qiskit import QuantumCircuit, transpile",
      "from qiskit_aer import AerSimulator",
      "",
      `# Initialize ${n}-qubit circuit`,
      `qc = QuantumCircuit(${n})`,
    ];

    for (const g of sorted) {
      if (g.type === "H") lines.push(`qc.h(${g.qubit})`);
      else if (g.type === "X") lines.push(`qc.x(${g.qubit})`);
      else if (g.type === "Y") lines.push(`qc.y(${g.qubit})`);
      else if (g.type === "Z") lines.push(`qc.z(${g.qubit})`);
      else if (g.type === "S") lines.push(`qc.s(${g.qubit})`);
      else if (g.type === "T") lines.push(`qc.t(${g.qubit})`);
      else if (g.type === "CNOT") {
        const c = g.qubit;
        const t = g.targetQubit ?? (c === 0 ? 1 : 0);
        lines.push(`qc.cx(${c}, ${t})`);
      } else if (g.type === "M") {
        lines.push(`qc.measure(${g.qubit}, ${g.qubit})`);
      }
    }

    if (hasMeasureAll) {
      const individualMeasures = sorted.filter((g) => g.type === "M");
      if (individualMeasures.length >= n) {
        const nonM = lines.filter((l) => !l.startsWith("qc.measure("));
        nonM.push("qc.measure_all()");
        return nonM.join("\n");
      }
    }

    return lines.join("\n");
  }

  // ─── Cirq (Python) ──────────────────────────────────────────────────────────
  if (framework === "cirq" && language === "python") {
    const qubitNames = Array.from({ length: n }, (_, i) => `q${i}`).join(", ");
    const lines: string[] = [
      "import cirq",
      "",
      `${qubitNames} = cirq.LineQubit.range(${n})`,
      "circuit = cirq.Circuit(",
    ];

    const ops: string[] = [];
    for (const g of sorted) {
      if (g.type === "H") ops.push(`    cirq.H(q${g.qubit})`);
      else if (g.type === "X") ops.push(`    cirq.X(q${g.qubit})`);
      else if (g.type === "Y") ops.push(`    cirq.Y(q${g.qubit})`);
      else if (g.type === "Z") ops.push(`    cirq.Z(q${g.qubit})`);
      else if (g.type === "S") ops.push(`    cirq.S(q${g.qubit})`);
      else if (g.type === "T") ops.push(`    cirq.T(q${g.qubit})`);
      else if (g.type === "CNOT") {
        const c = g.qubit;
        const t = g.targetQubit ?? (c === 0 ? 1 : 0);
        ops.push(`    cirq.CNOT(q${c}, q${t})`);
      } else if (g.type === "M") {
        ops.push(`    cirq.measure(q${g.qubit}, key='m${g.qubit}')`);
      }
    }

    if (ops.length === 0) {
      lines.push("    # Empty circuit");
    } else {
      lines.push(ops.join(",\n"));
    }
    lines.push(")");
    lines.push("print(circuit)");
    return lines.join("\n");
  }

  // ─── PennyLane (Python) ─────────────────────────────────────────────────────
  if (framework === "pennylane" && language === "python") {
    const lines: string[] = [
      "import pennylane as qml",
      "",
      `dev = qml.device("default.qubit", wires=${n})`,
      "",
      "@qml.qnode(dev)",
      "def circuit():",
    ];

    const ops: string[] = [];
    for (const g of sorted) {
      if (g.type === "H") ops.push(`    qml.Hadamard(wires=${g.qubit})`);
      else if (g.type === "X") ops.push(`    qml.PauliX(wires=${g.qubit})`);
      else if (g.type === "Y") ops.push(`    qml.PauliY(wires=${g.qubit})`);
      else if (g.type === "Z") ops.push(`    qml.PauliZ(wires=${g.qubit})`);
      else if (g.type === "S") ops.push(`    qml.S(wires=${g.qubit})`);
      else if (g.type === "T") ops.push(`    qml.T(wires=${g.qubit})`);
      else if (g.type === "CNOT") {
        const c = g.qubit;
        const t = g.targetQubit ?? (c === 0 ? 1 : 0);
        ops.push(`    qml.CNOT(wires=[${c}, ${t}])`);
      }
    }

    if (ops.length === 0) {
      ops.push("    pass");
    }
    lines.push(...ops);
    lines.push(`    return qml.probs(wires=range(${n}))`);
    return lines.join("\n");
  }

  // ─── JavaScript ─────────────────────────────────────────────────────────────
  if (language === "javascript") {
    const lines: string[] = [
      'import { QuantumCircuit } from "quantum-js";',
      "",
      `const qc = new QuantumCircuit(${n});`,
    ];

    for (const g of sorted) {
      if (g.type === "H") lines.push(`qc.h(${g.qubit});`);
      else if (g.type === "X") lines.push(`qc.x(${g.qubit});`);
      else if (g.type === "Y") lines.push(`qc.y(${g.qubit});`);
      else if (g.type === "Z") lines.push(`qc.z(${g.qubit});`);
      else if (g.type === "S") lines.push(`qc.s(${g.qubit});`);
      else if (g.type === "T") lines.push(`qc.t(${g.qubit});`);
      else if (g.type === "CNOT") {
        const c = g.qubit;
        const t = g.targetQubit ?? (c === 0 ? 1 : 0);
        lines.push(`qc.cx(${c}, ${t});`);
      } else if (g.type === "M") {
        lines.push(`qc.measure(${g.qubit});`);
      }
    }

    if (hasMeasureAll) {
      const individualMeasures = sorted.filter((g) => g.type === "M");
      if (individualMeasures.length >= n) {
        const nonM = lines.filter((l) => !l.startsWith("qc.measure("));
        nonM.push("qc.measureAll();");
        return nonM.join("\n");
      }
    }

    return lines.join("\n");
  }

  // ─── TypeScript ─────────────────────────────────────────────────────────────
  if (language === "typescript") {
    const lines: string[] = [
      'import { QuantumCircuit } from "quantum-js";',
      "",
      `const qc: QuantumCircuit = new QuantumCircuit(${n});`,
    ];

    for (const g of sorted) {
      if (g.type === "H") lines.push(`qc.h(${g.qubit});`);
      else if (g.type === "X") lines.push(`qc.x(${g.qubit});`);
      else if (g.type === "Y") lines.push(`qc.y(${g.qubit});`);
      else if (g.type === "Z") lines.push(`qc.z(${g.qubit});`);
      else if (g.type === "S") lines.push(`qc.s(${g.qubit});`);
      else if (g.type === "T") lines.push(`qc.t(${g.qubit});`);
      else if (g.type === "CNOT") {
        const c = g.qubit;
        const t = g.targetQubit ?? (c === 0 ? 1 : 0);
        lines.push(`qc.cx(${c}, ${t});`);
      } else if (g.type === "M") {
        lines.push(`qc.measure(${g.qubit});`);
      }
    }

    if (hasMeasureAll) {
      const individualMeasures = sorted.filter((g) => g.type === "M");
      if (individualMeasures.length >= n) {
        const nonM = lines.filter((l) => !l.startsWith("qc.measure("));
        nonM.push("qc.measureAll();");
        return nonM.join("\n");
      }
    }

    return lines.join("\n");
  }

  // Fallback default
  return `qc = QuantumCircuit(${n})\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()`;
}
