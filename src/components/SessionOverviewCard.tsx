import { Sun } from "lucide-react";
import ProgressRing from "./ProgressRing";

export default function SessionOverviewCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Session Overview
        </span>
        <Sun size={16} className="text-slate-400" />
      </div>

      {/* Ring + greeting */}
      <div className="flex items-center gap-3.5">
        <ProgressRing
          percent={68}
          size={58}
          strokeWidth={5}
          color="#4F46E5"
          trackColor="#F1F5F9"
          label="68%"
          labelClassName="text-[10px] font-bold fill-slate-800"
        />
        <div>
          <p className="text-[15px] font-bold text-slate-900 leading-tight">
            Good morning
          </p>
          <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">
            You're 68% through
            <br />
            Entanglement
          </p>
        </div>
      </div>
    </div>
  );
}
