import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { Framework, Language, EditorMode, SaveStatus } from "../types";

interface Props {
  framework: Framework;
  onFrameworkChange: (f: Framework) => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
  editorMode: EditorMode;
  onEditorModeChange: (m: EditorMode) => void;
  saveStatus: SaveStatus;
}

const FRAMEWORKS: { id: Framework; label: string; tag: string }[] = [
  { id: "qiskit", label: "Qiskit", tag: "IBM Quantum standard" },
  { id: "cirq", label: "Cirq", tag: "Google Quantum AI" },
  { id: "pennylane", label: "PennyLane", tag: "Xanadu QML engine" },
];

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
];

export default function WorkspaceHeader({
  framework,
  onFrameworkChange,
  language,
  onLanguageChange,
  editorMode,
  onEditorModeChange,
  saveStatus,
}: Props) {
  const [frameworkMenuOpen, setFrameworkMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const frameworkRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (frameworkRef.current && !frameworkRef.current.contains(e.target as Node)) {
        setFrameworkMenuOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setLanguageMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentFrameworkLabel = FRAMEWORKS.find((f) => f.id === framework)?.label || "Qiskit";
  const currentLanguageLabel = LANGUAGES.find((l) => l.id === language)?.label || "Python";

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      {/* ── Left: Title + Badges + Selectors ─────────────────────────────── */}
      <div className="flex items-center gap-5 flex-wrap">
        {/* Title: 2 lines stacked */}
        <div className="flex flex-col leading-[1.08] select-none">
          <span className="text-[24px] font-extrabold text-[#0B1C30] tracking-tight">
            Bell
          </span>
          <span className="text-[24px] font-extrabold text-[#0B1C30] tracking-tight">
            State
          </span>
        </div>

        {/* Saved badge */}
        <div
          className={[
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium transition-colors select-none",
            saveStatus === "saved"
              ? "bg-[#ECFDF5] text-emerald-700 border border-emerald-200/80"
              : saveStatus === "saving"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-slate-100 text-slate-600 border border-slate-200",
          ].join(" ") }
        >
          <span
            className={[
              "w-2 h-2 rounded-full",
              saveStatus === "saved"
                ? "bg-emerald-500"
                : saveStatus === "saving"
                ? "bg-amber-500 animate-pulse"
                : "bg-slate-400",
            ].join(" ")}
          />
          <span>
            {saveStatus === "saved"
              ? "Saved"
              : saveStatus === "saving"
              ? "Saving..."
              : "Unsaved"}
          </span>
        </div>

        {/* Framework Dropdown */}
        <div className="relative" ref={frameworkRef}>
          <button
            type="button"
            onClick={() => setFrameworkMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-[13px] text-slate-500 transition-colors shadow-xs"
            aria-expanded={frameworkMenuOpen}
            aria-label="Select framework"
          >
            <span>Framework:</span>
            <span className="font-semibold text-slate-800">
              {currentFrameworkLabel}
            </span>
            <ChevronDown size={14} className="text-slate-400 ml-0.5" />
          </button>

          {frameworkMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-white rounded-2xl border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Quantum Framework
              </div>
              {FRAMEWORKS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onFrameworkChange(f.id);
                    setFrameworkMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{f.label}</p>
                    <p className="text-[11px] text-slate-400">{f.tag}</p>
                  </div>
                  {framework === f.id && <Check size={14} className="text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Dropdown */}
        <div className="relative" ref={languageRef}>
          <button
            type="button"
            onClick={() => setLanguageMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-[13px] text-slate-500 transition-colors shadow-xs"
            aria-expanded={languageMenuOpen}
            aria-label="Select language"
          >
            <span>Language:</span>
            <span className="font-semibold text-slate-800">
              {currentLanguageLabel}
            </span>
            <ChevronDown size={14} className="text-slate-400 ml-0.5" />
          </button>

          {languageMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-2xl border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Syntax / Target
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    onLanguageChange(l.id);
                    setLanguageMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold text-slate-800">{l.label}</span>
                  {language === l.id && <Check size={14} className="text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: IDE / Circuit / Split Segmented Control ────────────────── */}
      <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-500">
        {(["ide", "circuit", "split"] as EditorMode[]).map((mode) => {
          const isActive = editorMode === mode;
          const label = mode === "ide" ? "IDE" : mode === "circuit" ? "Circuit" : "Split";
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onEditorModeChange(mode)}
              className={[
                "px-3.5 py-1.5 rounded-lg transition-all capitalize",
                isActive
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
