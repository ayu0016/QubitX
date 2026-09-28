import { useState, useRef, useEffect } from "react";
import { Cpu, ChevronDown, Check, Play, Loader2 } from "lucide-react";
import type { Backend, ResultMode } from "../types";

interface Props {
  backend: Backend;
  onBackendChange: (b: Backend) => void;
  shots: number;
  onShotsChange: (s: number) => void;
  resultMode: ResultMode;
  onResultModeChange: (m: ResultMode) => void;
  onRunCircuit: () => void;
  isSimulating: boolean;
}

const BACKENDS: { id: Backend; label: string; desc: string; isRealCloud?: boolean }[] = [
  { id: "qiskit_aer", label: "Qiskit Aer", desc: "High-performance statevector simulator" },
  { id: "local_sim", label: "Local Simulator", desc: "In-browser pure matrix simulator" },
  { id: "ibm_quantum", label: "IBM Quantum", desc: "Real cloud QPU (Queued: coming soon)", isRealCloud: true },
];

const SHOT_OPTIONS = [128, 256, 512, 1024, 2048, 4096, 8192];

const MODES: { id: ResultMode; label: string }[] = [
  { id: "counts", label: "Counts" },
  { id: "probabilities", label: "Probabilities" },
  { id: "statevector", label: "Statevector" },
];

export default function SimulationControlsBar({
  backend,
  onBackendChange,
  shots,
  onShotsChange,
  resultMode,
  onResultModeChange,
  onRunCircuit,
  isSimulating,
}: Props) {
  const [backendMenuOpen, setBackendMenuOpen] = useState(false);
  const [shotsMenuOpen, setShotsMenuOpen] = useState(false);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);

  const backendRef = useRef<HTMLDivElement>(null);
  const shotsRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (backendRef.current && !backendRef.current.contains(e.target as Node)) {
        setBackendMenuOpen(false);
      }
      if (shotsRef.current && !shotsRef.current.contains(e.target as Node)) {
        setShotsMenuOpen(false);
      }
      if (modeRef.current && !modeRef.current.contains(e.target as Node)) {
        setModeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentBackend = BACKENDS.find((b) => b.id === backend) || BACKENDS[0];
  const currentMode = MODES.find((m) => m.id === resultMode) || MODES[0];

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm px-6 py-4 flex items-center justify-between gap-6 flex-wrap">
      {/* ── Left: Controls Grid ─────────────────────────────────────────── */}
      <div className="flex items-center gap-6 flex-wrap">
        {/* 1. Backend */}
        <div className="flex flex-col gap-1.5" ref={backendRef}>
          <span className="text-[12px] font-semibold text-slate-500 select-none">
            Backend
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setBackendMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-[13px] font-medium text-slate-800 transition-colors shadow-2xs"
            >
              <Cpu size={14} className="text-cyan-600 shrink-0" />
              <span>{currentBackend.label}</span>
              <ChevronDown size={14} className="text-slate-400 ml-1" />
            </button>

            {backendMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Backend
                </div>
                {BACKENDS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      onBackendChange(b.id);
                      setBackendMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{b.label}</span>
                        {b.isRealCloud && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-600 font-semibold">
                            Cloud
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{b.desc}</p>
                    </div>
                    {backend === b.id && <Check size={14} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. Shots */}
        <div className="flex flex-col gap-1.5" ref={shotsRef}>
          <span className="text-[12px] font-semibold text-slate-500 select-none">
            Shots
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShotsMenuOpen((v) => !v)}
              className="w-28 flex items-center justify-between px-3.5 py-2 bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-[13px] font-medium text-slate-800 transition-colors shadow-2xs font-mono"
            >
              <span>{shots}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {shotsMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-32 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {SHOT_OPTIONS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onShotsChange(val);
                      setShotsMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-[13px] font-mono hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <span className={shots === val ? "font-bold text-indigo-600" : "text-slate-700"}>
                      {val}
                    </span>
                    {shots === val && <Check size={13} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Mode */}
        <div className="flex flex-col gap-1.5" ref={modeRef}>
          <span className="text-[12px] font-semibold text-slate-500 select-none">
            Mode
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setModeMenuOpen((v) => !v)}
              className="w-32 flex items-center justify-between px-3.5 py-2 bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-[13px] font-medium text-slate-800 transition-colors shadow-2xs"
            >
              <span>{currentMode.label}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {modeMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-40 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onResultModeChange(m.id);
                      setModeMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <span className={resultMode === m.id ? "font-semibold text-indigo-600" : "text-slate-700"}>
                      {m.label}
                    </span>
                    {resultMode === m.id && <Check size={13} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Run Button */}
        <div className="flex flex-col gap-1.5 justify-end">
          <span className="text-[12px] font-semibold text-transparent select-none">
            Run
          </span>
          <button
            type="button"
            onClick={onRunCircuit}
            disabled={isSimulating}
            className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-[13px] font-medium transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSimulating ? (
              <Loader2 size={14} className="animate-spin text-white" />
            ) : (
              <Play size={13} className="fill-white" />
            )}
            <span>{isSimulating ? "Simulating..." : "Run Circuit"}</span>
          </button>
        </div>
      </div>

      {/* ── Right: Status ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 select-none">
        <span
          className={[
            "w-2 h-2 rounded-full",
            isSimulating ? "bg-amber-500 animate-ping" : "bg-emerald-500",
          ].join(" ")}
        />
        <span>
          {isSimulating
            ? "Executing statevector job..."
            : "Ready. Results come from the simulator"}
        </span>
      </div>
    </div>
  );
}
