import type { CircuitState, GateItem } from "../types";

export interface ParseResult {
  success: boolean;
  circuit?: CircuitState;
  error?: string;
}

/**
 * Parses code back into a structured CircuitState.
 * Robust, fault-tolerant parser covering Qiskit, Cirq, PennyLane, JS/TS patterns.
 * Never crashes on extra non-quantum code lines (e.g. imports, prints, comments).
 */
export function parseCodeToCircuit(code: string): ParseResult {
  try {
    const lines = code.split("\n");
    let numQubits = 2;
    const gates: GateItem[] = [];
    let columnCounter = 0;
    let maxSeenQubit = 1;

    // Detect explicit number of qubits
    for (const line of lines) {
      const qkMatch = line.match(/QuantumCircuit\((\d+)/i);
      if (qkMatch) {
        numQubits = Math.max(1, Math.min(4, parseInt(qkMatch[1], 10)));
      }
      const cirqMatch = line.match(/LineQubit\.range\((\d+)\)/i);
      if (cirqMatch) {
        numQubits = Math.max(1, Math.min(4, parseInt(cirqMatch[1], 10)));
      }
      const plMatch = line.match(/wires=(\d+)/i);
      if (plMatch) {
        numQubits = Math.max(1, Math.min(4, parseInt(plMatch[1], 10)));
      }
    }

    // Parse gates line by line
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || line.startsWith("//")) continue;

      // ── H Gate ─────────────────────────────────────────────────────────────
      const hMatch =
        line.match(/\.h\((\d+)\)/i) ||
        line.match(/cirq\.H\(q?(\d+)\)/i) ||
        line.match(/Hadamard\((?:wires=)?(\d+)\)/i);
      if (hMatch) {
        const q = parseInt(hMatch[1], 10);
        maxSeenQubit = Math.max(maxSeenQubit, q);
        gates.push({
          id: `gate-h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "H",
          qubit: q,
          column: columnCounter++,
        });
        continue;
      }

      // ── X Gate ─────────────────────────────────────────────────────────────
      const xMatch =
        line.match(/\.x\((\d+)\)/i) ||
        line.match(/cirq\.X\(q?(\d+)\)/i) ||
        line.match(/PauliX\((?:wires=)?(\d+)\)/i);
      if (xMatch) {
        const q = parseInt(xMatch[1], 10);
        maxSeenQubit = Math.max(maxSeenQubit, q);
        gates.push({
          id: `gate-x-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "X",
          qubit: q,
          column: columnCounter++,
        });
        continue;
      }

      // ── Y Gate ─────────────────────────────────────────────────────────────
      const yMatch =
        line.match(/\.y\((\d+)\)/i) ||
        line.match(/cirq\.Y\(q?(\d+)\)/i) ||
        line.match(/PauliY\((?:wires=)?(\d+)\)/i);
      if (yMatch) {
        const q = parseInt(yMatch[1], 10);
        maxSeenQubit = Math.max(maxSeenQubit, q);
        gates.push({
          id: `gate-y-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "Y",
          qubit: q,
          column: columnCounter++,
        });
        continue;
      }

      // ── Z Gate ─────────────────────────────────────────────────────────────
      const zMatch =
        line.match(/\.z\((\d+)\)/i) ||
        line.match(/cirq\.Z\(q?(\d+)\)/i) ||
        line.match(/PauliZ\((?:wires=)?(\d+)\)/i);
      if (zMatch) {
        const q = parseInt(zMatch[1], 10);
        maxSeenQubit = Math.max(maxSeenQubit, q);
        gates.push({
          id: `gate-z-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "Z",
          qubit: q,
          column: columnCounter++,
        });
        continue;
      }

      // ── S Gate ─────────────────────────────────────────────────────────────
      const sMatch = line.match(/\.s\((\d+)\)/i) || line.match(/cirq\.S\(q?(\d+)\)/i);
      if (sMatch) {
        const q = parseInt(sMatch[1], 10);
        maxSeenQubit = Math.max(maxSeenQubit, q);
        gates.push({
          id: `gate-s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "S",
          qubit: q,
          column: columnCounter++,
        });
        continue;
      }

      // ── T Gate ─────────────────────────────────────────────────────────────
      const tMatch = line.match(/\.t\((\d+)\)/i) || line.match(/cirq\.T\(q?(\d+)\)/i);
      if (tMatch) {
        const q = parseInt(tMatch[1], 10);
        maxSeenQubit = Math.max(maxSeenQubit, q);
        gates.push({
          id: `gate-t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "T",
          qubit: q,
          column: columnCounter++,
        });
        continue;
      }

      // ── CNOT / CX Gate ─────────────────────────────────────────────────────
      const cxMatch =
        line.match(/\.(?:cx|cnot)\((\d+)\s*,\s*(\d+)\)/i) ||
        line.match(/cirq\.CNOT\(q?(\d+)\s*,\s*q?(\d+)\)/i) ||
        line.match(/CNOT\((?:wires=)?\[(\d+)\s*,\s*(\d+)\]\)/i);
      if (cxMatch) {
        const c = parseInt(cxMatch[1], 10);
        const t = parseInt(cxMatch[2], 10);
        maxSeenQubit = Math.max(maxSeenQubit, c, t);
        gates.push({
          id: `gate-cx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "CNOT",
          qubit: c,
          targetQubit: t,
          column: columnCounter++,
        });
        continue;
      }

      // ── Measurement Gate ───────────────────────────────────────────────────
      if (line.includes("measure_all()") || line.includes("measureAll()")) {
        const col = columnCounter++;
        for (let q = 0; q < numQubits; q++) {
          gates.push({
            id: `gate-m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${q}`,
            type: "M",
            qubit: q,
            column: col,
          });
        }
        continue;
      }

      const mMatch =
        line.match(/\.measure\((\d+)(?:\s*,\s*\d+)?\)/i) ||
        line.match(/cirq\.measure\(q?(\d+)/i);
      if (mMatch) {
        const q = parseInt(mMatch[1], 10);
        maxSeenQubit = Math.max(maxSeenQubit, q);
        gates.push({
          id: `gate-m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "M",
          qubit: q,
          column: columnCounter++,
        });
        continue;
      }
    }

    // Adjust numQubits if gates addressed higher qubits (up to max 4)
    numQubits = Math.max(numQubits, Math.min(4, maxSeenQubit + 1));

    // Filter any gates exceeding max supported qubits (4)
    const validGates = gates.filter(
      (g) => g.qubit < numQubits && (g.targetQubit === undefined || g.targetQubit < numQubits)
    );

    // Compact columns
    const uniqueCols = Array.from(new Set(validGates.map((g) => g.column))).sort((a, b) => a - b);
    const colMap = new Map<number, number>();
    uniqueCols.forEach((c, idx) => colMap.set(c, idx));
    for (const g of validGates) {
      g.column = colMap.get(g.column) ?? g.column;
    }

    return {
      success: true,
      circuit: {
        numQubits,
        gates: validGates,
        maxColumns: Math.max(6, uniqueCols.length + 2),
      },
    };
  } catch (err) {
    return {
      success: true,
      circuit: {
        numQubits: 2,
        gates: [],
        maxColumns: 6,
      },
      error: err instanceof Error ? err.message : undefined,
    };
  }
}
