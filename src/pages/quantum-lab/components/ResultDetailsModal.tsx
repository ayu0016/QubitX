import { useState } from "react";
import { X, Copy, Check, Clock, Cpu, Layers, BarChart2 } from "lucide-react";
import type { SimulationResult, CircuitState } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: SimulationResult | null;
  circuit: CircuitState;
}

export default function ResultDetailsModal({
  isOpen,
  onClose,
  result,
  circuit,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* ── Modal Header ──────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 id="modal-title" className="text-[18px] font-bold text-[#0B1C30]">
              Simulation Result Details
            </h2>
            <p className="text-[12px] text-slate-500">
              Verified statevector execution · Seed #{result.seed}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Modal Body ────────────────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-[13px]">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-indigo-600 text-[11px] font-semibold uppercase">
                <Layers size={13} />
                <span>Depth</span>
              </div>
              <p className="text-[20px] font-bold text-[#0B1C30]">
                {result.depth} <span className="text-[12px] font-normal text-slate-500">layers</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-sky-600 text-[11px] font-semibold uppercase">
                <BarChart2 size={13} />
                <span>Gates</span>
              </div>
              <p className="text-[20px] font-bold text-[#0B1C30]">
                {result.gateCount} <span className="text-[12px] font-normal text-slate-500">ops</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-semibold uppercase">
                <Cpu size={13} />
                <span>Shots</span>
              </div>
              <p className="text-[20px] font-bold text-[#0B1C30]">
                {result.shots}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold uppercase">
                <Clock size={13} />
                <span>Sim Time</span>
              </div>
              <p className="text-[20px] font-bold text-[#0B1C30]">
                {result.executionTimeMs} <span className="text-[12px] font-normal text-slate-500">ms</span>
              </p>
            </div>
          </div>

          {/* Probabilities & Sampled Counts Table */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-slate-900 text-[14px]">
              Measurement Distribution
            </h3>
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Basis State</th>
                    <th className="px-4 py-2.5">Theory P(|ψ⟩)</th>
                    <th className="px-4 py-2.5">Sampled Count</th>
                    <th className="px-4 py-2.5">Observed Freq</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[12px]">
                  {result.statevector.map((sv) => {
                    const count = result.counts[sv.state] || 0;
                    const freqPct = ((count / result.shots) * 100).toFixed(1);
                    return (
                      <tr key={sv.state} className="hover:bg-slate-50/80">
                        <td className="px-4 py-2 font-bold text-slate-800">
                          {sv.state}
                        </td>
                        <td className="px-4 py-2 text-slate-600">
                          {sv.probability.toFixed(4)}
                        </td>
                        <td className="px-4 py-2 text-slate-600">
                          {count}
                        </td>
                        <td className="px-4 py-2 text-indigo-600 font-semibold">
                          {freqPct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statevector Complex Amplitudes */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-slate-900 text-[14px]">
              Quantum State Amplitudes &amp; Phase
            </h3>
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">State</th>
                    <th className="px-4 py-2.5">Real (Re)</th>
                    <th className="px-4 py-2.5">Imag (Im)</th>
                    <th className="px-4 py-2.5">Magnitude |α|</th>
                    <th className="px-4 py-2.5">Phase (rad)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[12px]">
                  {result.statevector.map((sv) => (
                    <tr key={sv.state} className="hover:bg-slate-50/80">
                      <td className="px-4 py-2 font-bold text-slate-800">
                        {sv.state}
                      </td>
                      <td className="px-4 py-2 text-slate-600">
                        {sv.real.toFixed(3)}
                      </td>
                      <td className="px-4 py-2 text-slate-600">
                        {sv.imag.toFixed(3)}
                      </td>
                      <td className="px-4 py-2 text-slate-800 font-semibold">
                        {sv.magnitude.toFixed(3)}
                      </td>
                      <td className="px-4 py-2 text-slate-500">
                        {sv.phaseRad.toFixed(3)} rad
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Circuit Operations List */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-slate-900 text-[14px]">
              Circuit Operations Timeline
            </h3>
            <div className="flex flex-wrap gap-2">
              {circuit.gates.length === 0 ? (
                <span className="text-slate-400 italic">No gates placed</span>
              ) : (
                [...circuit.gates]
                  .sort((a, b) => a.column - b.column)
                  .map((g) => (
                    <div
                      key={g.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[12px] font-mono flex items-center gap-1.5"
                    >
                      <span className="font-bold text-indigo-700">{g.type}</span>
                      <span className="text-slate-500">
                        q{g.qubit}
                        {g.targetQubit !== undefined ? ` → q${g.targetQubit}` : ""}
                      </span>
                      <span className="text-slate-400 text-[10px]">col {g.column}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* ── Modal Footer ──────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-slate-100 bg-[#FAFCFF] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleCopyJSON}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-medium text-slate-700 transition-colors shadow-2xs"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? "Copied JSON" : "Copy Raw JSON"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[13px] font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
