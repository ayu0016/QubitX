import { X, Flame } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsistencyModal({ isOpen, onClose }: Props) {
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
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-amber-500 fill-amber-500" />
            <h2 className="text-[18px] font-bold text-slate-900">
              Learning Consistency
            </h2>
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
        <div className="p-6 flex flex-col gap-6 text-[13px]">
          {/* Main Streak Highlight */}
          <div className="p-5 rounded-2xl bg-[#FFFBF2] border border-amber-200/80 flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold text-amber-700 uppercase tracking-wider">
                Current Active Streak
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[36px] font-extrabold text-slate-900 leading-none">
                  5
                </span>
                <span className="text-[16px] font-medium text-slate-500">
                  consecutive days
                </span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Flame size={28} className="fill-amber-500" />
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Longest Streak
              </span>
              <p className="text-[20px] font-bold text-slate-800">12 days</p>
              <span className="text-[11px] text-slate-500">Achieved last month</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Lessons This Week
              </span>
              <p className="text-[20px] font-bold text-slate-800">8 completed</p>
              <span className="text-[11px] text-emerald-600 font-medium">+3 vs last week</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Simulations Run
              </span>
              <p className="text-[20px] font-bold text-slate-800">14 runs</p>
              <span className="text-[11px] text-slate-500">Across 3 frameworks</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Badge Level
              </span>
              <p className="text-[20px] font-bold text-indigo-600">Gold Explorer</p>
              <span className="text-[11px] text-slate-500">Next tier at 7 days</span>
            </div>
          </div>

          {/* Weekly Activity Days */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[12px] font-medium text-slate-500">
              <span>This Week's Activity</span>
              <span className="text-emerald-600 font-semibold">On Track</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                const isCompleted = idx < 5; // Mon-Fri active
                const isToday = idx === 4;
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] font-medium text-slate-400">{day}</span>
                    <div
                      className={[
                        "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all",
                        isCompleted
                          ? "bg-amber-400 text-slate-900 shadow-2xs"
                          : "bg-slate-200/70 text-slate-400",
                        isToday ? "ring-2 ring-amber-500 ring-offset-2" : "",
                      ].join(" ")}
                    >
                      {isCompleted ? "✓" : "○"}
                    </div>
                  </div>
                );
              })}
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
