import { X, CheckCircle2, Clock } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MASTERED = [
  { name: "Bell State", desc: "Two-qubit maximally entangled states", date: "Mastered 2d ago" },
  { name: "Superposition", desc: "Hadamard gate and linear combinations", date: "Mastered 5d ago" },
  { name: "Quantum Measurement", desc: "Wavefunction collapse & Born rule", date: "Mastered 1w ago" },
  { name: "Qubits", desc: "Bloch sphere statevector representation", date: "Mastered 2w ago" },
];

const STILL_LEARNING = [
  { name: "Deutsch-Jozsa", desc: "Quantum oracle and balanced function testing", progress: 45 },
  { name: "Grover's Algorithm", desc: "Unstructured search and diffusion operator", progress: 12 },
  { name: "Quantum Teleportation", desc: "State transfer via EPR pair feedforward", progress: 31 },
  { name: "Phase Kickback", desc: "Controlled unitary phase eigenvalue transfer", progress: 0 },
];

export default function MasteryDetailsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-slate-900">
              Quantum Mastery Status
            </h2>
            <p className="text-[12px] text-slate-500">
              4 of 12 core quantum computing concepts mastered
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6 text-[13px]">
          {/* Progress Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                Overall Progress
              </p>
              <p className="text-[22px] font-extrabold text-slate-900 mt-0.5">
                33.3% <span className="text-[13px] font-medium text-slate-500">Completed</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[14px]">
              4/12
            </div>
          </div>

          {/* Concepts Mastered */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-slate-900 text-[14px] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Concepts Mastered ({MASTERED.length})</span>
            </h3>
            <div className="flex flex-col gap-2">
              {MASTERED.map((item) => (
                <div
                  key={item.name}
                  className="p-3 rounded-xl border border-slate-200/90 bg-emerald-50/20 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Still Learning */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-slate-900 text-[14px] flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              <span>Still Learning ({STILL_LEARNING.length})</span>
            </h3>
            <div className="flex flex-col gap-2">
              {STILL_LEARNING.map((item) => (
                <div
                  key={item.name}
                  className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <span className="text-[12px] font-bold text-indigo-600">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#FAFCFF] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[13px] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
