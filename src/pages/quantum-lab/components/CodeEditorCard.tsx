import { useState, useRef, useEffect } from "react";
import {
  Code2,
  Play,
  RotateCw,
  Copy,
  Check,
  Terminal,
  Trash2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import type { Framework, Language, SyncStatus } from "../types";
import { QUANTUM_PRESETS } from "../simulator/codeGenerator";

interface Props {
  code: string;
  onCodeChange: (newCode: string) => void;
  framework: Framework;
  language: Language;
  syncStatus: SyncStatus;
  numQubits: number;
  gateCount: number;
  parseError?: string;
  onRun?: () => void;
  isSimulating?: boolean;
  onSelectPreset?: (presetId: string) => void;
  editorMode?: "split" | "ide" | "circuit";
}

interface ConsoleLog {
  id: string;
  timestamp: string;
  text: string;
  type: "info" | "success" | "output" | "warn";
}

export default function CodeEditorCard({
  code,
  onCodeChange,
  framework,
  language,
  syncStatus,
  numQubits,
  gateCount,
  parseError,
  onRun,
  isSimulating = false,
  onSelectPreset,
  editorMode = "split",
}: Props) {
  const [copied, setCopied] = useState(false);
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      id: "log-init-1",
      timestamp: "Ready",
      text: `Initialized ${framework.toUpperCase()} workspace with ${numQubits} qubits.`,
      type: "info",
    },
    {
      id: "log-init-2",
      timestamp: "Ready",
      text: "Press 'Run Code' or Ctrl+Enter to execute circuit simulation.",
      type: "success",
    },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const templateMenuRef = useRef<HTMLDivElement>(null);

  // Close template menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (templateMenuRef.current && !templateMenuRef.current.contains(e.target as Node)) {
        setTemplateMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When simulated run starts/finishes, append realistic execution logs
  useEffect(() => {
    if (!isSimulating) return;

    const now = new Date().toLocaleTimeString();
    const nextLogs: ConsoleLog[] = [
      {
        id: `log-${Date.now()}-1`,
        timestamp: now,
        text: `> python main.py --backend=${framework}_aer --shots=1024`,
        type: "info",
      },
      {
        id: `log-${Date.now()}-2`,
        timestamp: now,
        text: `[AerSimulator] Transpiling circuit (${numQubits} qubits, ${gateCount} gates)...`,
        type: "info",
      },
    ];

    const timer = window.setTimeout(() => {
      setLogs((prev) => [...prev, ...nextLogs]);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isSimulating, framework, numQubits, gateCount]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run shortcut: Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun?.();
      return;
    }

    // Tab key indent (4 spaces)
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextCode = code.substring(0, start) + "    " + code.substring(end);
      onCodeChange(nextCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onCodeChange(code + "\n" + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextCode = code.substring(0, start) + snippet + code.substring(end);
    onCodeChange(nextCode);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    }, 0);
  };

  const lines = code.split("\n");
  const fileName = language === "python" ? "main.py" : language === "javascript" ? "circuit.js" : "circuit.ts";
  const frameworkLabel = framework === "qiskit" ? "Qiskit" : framework === "cirq" ? "Cirq" : "PennyLane";
  const languageLabel = language === "python" ? "Python" : language === "javascript" ? "JavaScript" : "TypeScript";

  return (
    <div
      className={[
        "bg-[#0D1525] rounded-[24px] border border-slate-800 shadow-md overflow-hidden flex flex-col transition-all",
        editorMode === "ide" ? "min-h-[580px]" : "min-h-[460px]",
      ].join(" ")}
    >
      {/* ── 1. Editor Header Toolbar ────────────────────────────────────── */}
      <div className="px-5 py-3 border-b border-slate-800/90 flex items-center justify-between bg-[#0B1320] flex-wrap gap-3 shrink-0">
        {/* Left: Tab badge + Preset selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 text-[12px] font-mono font-medium shadow-xs">
            <Code2 size={14} className="text-indigo-400" />
            <span>{fileName}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-[11px]">{frameworkLabel} ({languageLabel})</span>
          </div>

          {/* Templates Menu */}
          <div className="relative" ref={templateMenuRef}>
            <button
              type="button"
              onClick={() => setTemplateMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[12px] font-medium transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>Templates</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {templateMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#111C30] rounded-2xl border border-slate-700 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quantum Algorithms &amp; States
                </div>
                {QUANTUM_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectPreset?.(p.id);
                      setTemplateMenuOpen(false);
                      setLogs((prev) => [
                        ...prev,
                        {
                          id: `log-${Date.now()}`,
                          timestamp: new Date().toLocaleTimeString(),
                          text: `Loaded template: ${p.name}`,
                          type: "info",
                        },
                      ]);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-slate-800/80 flex flex-col transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-200">{p.name}</span>
                    <span className="text-[11px] text-slate-400">{p.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions (Copy, Snippets, Run) */}
        <div className="flex items-center gap-2">
          {/* Quick Snippet Pills */}
          <div className="hidden xl:flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertSnippet("qc.h(0)\n")}
              title="Insert Hadamard gate on q0"
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-slate-700 text-[11px] font-mono cursor-pointer transition-colors"
            >
              +H(0)
            </button>
            <button
              type="button"
              onClick={() => insertSnippet("qc.cx(0, 1)\n")}
              title="Insert CNOT gate"
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-slate-700 text-[11px] font-mono cursor-pointer transition-colors"
            >
              +CX(0,1)
            </button>
            <button
              type="button"
              onClick={() => insertSnippet("qc.measure_all()\n")}
              title="Insert Measure All"
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700 text-[11px] font-mono cursor-pointer transition-colors"
            >
              +Measure
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            title="Copy code to clipboard"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-[12px] font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          {/* Prominent Run Button */}
          <button
            type="button"
            onClick={onRun}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Execute circuit simulation (Ctrl + Enter)"
          >
            <Play size={13} className="fill-white" />
            <span>{isSimulating ? "Running..." : "Run Code"}</span>
            <span className="hidden sm:inline text-[10px] text-emerald-200/80 font-mono bg-emerald-700/60 px-1.5 py-0.5 rounded">
              Ctrl+↵
            </span>
          </button>
        </div>
      </div>

      {/* ── 2. Editor Body: Line numbers + Monospace Textarea ───────────── */}
      <div
        className="relative flex-1 flex overflow-hidden bg-[#0D1525]"
        style={{ minHeight: `${Math.max(280, lines.length * 24 + 64)}px` }}
      >
        {/* Line numbers gutter */}
        <div className="w-12 py-4 select-none bg-[#090F1A] text-right pr-4 text-slate-600 font-mono text-[13px] leading-6 shrink-0 border-r border-slate-800/60">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Editable Textarea with direct visible styling */}
        <div className="relative flex-1 min-w-0 h-full p-4 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="block w-full font-mono text-[13.5px] leading-6 bg-transparent text-[#E2E8F0] caret-emerald-400 resize-none outline-none overflow-x-auto overflow-y-hidden whitespace-pre selection:bg-indigo-600 selection:text-white"
            style={{ height: `${Math.max(248, lines.length * 24)}px` }}
            placeholder="# Write your quantum circuit here..."
            aria-label="Quantum Circuit Code Editor"
          />
        </div>
      </div>

      {/* ── 3. Parse Error Banner (if any) ──────────────────────────────── */}
      {parseError && (
        <div className="px-5 py-2 bg-amber-950/80 border-t border-amber-800 text-amber-300 text-[12px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Note: {parseError} (Free-form code mode active)</span>
          </div>
          <button
            type="button"
            onClick={() => onCodeChange(code)}
            className="text-[11px] underline hover:text-white"
          >
            Refresh
          </button>
        </div>
      )}

      {/* ── 4. Integrated Output Terminal ───────────────────────────────── */}
      <div className="border-t border-slate-800 bg-[#080D18] flex flex-col shrink-0">
        {/* Terminal Header Bar */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-slate-800/60 text-[12px] text-slate-400 select-none">
          <button
            type="button"
            onClick={() => setTerminalOpen((v) => !v)}
            className="flex items-center gap-2 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Terminal size={14} className="text-emerald-400" />
            <span className="font-mono font-semibold text-slate-300">Terminal / Output</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 font-mono">
              {numQubits} qubit{numQubits > 1 ? "s" : ""} · {gateCount} op{gateCount !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={() => setLogs([])}
              title="Clear terminal logs"
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        {terminalOpen && (
          <div className="p-3.5 max-h-[140px] overflow-y-auto font-mono text-[12px] flex flex-col gap-1 text-slate-300">
            {logs.length === 0 ? (
              <span className="text-slate-600 italic">Terminal output cleared.</span>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                  <span
                    className={
                      log.type === "success"
                        ? "text-emerald-400"
                        : log.type === "warn"
                        ? "text-amber-400"
                        : log.type === "output"
                        ? "text-sky-300 font-semibold"
                        : "text-slate-300"
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── 5. Status Footer ────────────────────────────────────────────── */}
      <div className="px-5 py-2.5 border-t border-slate-800/80 bg-[#060A12] flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <RotateCw
            size={12}
            className={[
              "text-indigo-400 transition-transform",
              syncStatus === "syncing" && "animate-spin",
            ].join(" ")}
          />
          <span className="font-mono">
            {syncStatus === "syncing"
              ? "Synchronizing workspace..."
              : "Continuous matrix & circuit sync active"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-semibold">● Simulator Ready</span>
          <span className="text-slate-600">UTF-8</span>
        </div>
      </div>
    </div>
  );
}
