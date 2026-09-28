import { X, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../utils/routes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_JOBS = [
  { name: "Bell State", shots: 1024, qubits: 2, depth: 3, date: "10 mins ago", status: "Completed" },
  { name: "Superposition", shots: 512, qubits: 1, depth: 2, date: "1 hour ago", status: "Completed" },
  { name: "CNOT experiment", shots: 1024, qubits: 2, depth: 3, date: "Yesterday", status: "Completed" },
  { name: "Grover search", shots: 2048, qubits: 2, depth: 5, date: "2 days ago", status: "Completed" },
];

export default function SimulatorJobsModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLaunchLab = () => {
    onClose();
    navigate(ROUTES.quantumLab);
  };

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
              Simulator Jobs History
            </h2>
            <p className="text-[12px] text-slate-500">
              27 total circuit jobs executed this month
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
        <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-4 text-[13px]">
          <div className="flex flex-col gap-2.5">
            {RECENT_JOBS.map((job) => (
              <div
                key={job.name}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-[14px]">
                      {job.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <span>{job.shots} shots</span>
                    <span>•</span>
                    <span>{job.qubits} qubits</span>
                    <span>•</span>
                    <span>Depth {job.depth}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[11px] text-slate-400">{job.date}</span>
                  <button
                    type="button"
                    onClick={handleLaunchLab}
                    className="flex items-center gap-1 text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Play size={11} className="fill-indigo-600" />
                    <span>Rerun in Lab</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#FAFCFF] flex items-center justify-between">
          <span className="text-[12px] text-slate-500">
            Backend: Qiskit Aer Statevector
          </span>
          <button
            type="button"
            onClick={handleLaunchLab}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[13px] font-medium transition-colors"
          >
            Open Quantum Lab
          </button>
        </div>
      </div>
    </div>
  );
}
