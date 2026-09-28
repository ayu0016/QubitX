import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Trophy,
  FlaskConical,
  Award,
  Bot,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { dashboardNotifications } from "../data/mockDashboard";
import type { DashboardNotification } from "../types";
import { useAppDispatch } from "../hooks/useRedux";
import { setTutorOpen } from "../store/slices/uiSlice";

const TYPE_CONFIG: Record<
  DashboardNotification["type"],
  { icon: React.ReactNode; bg: string; text: string; border: string; label: string }
> = {
  challenge: {
    icon: <Trophy size={14} className="text-amber-600" />,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    label: "Challenge",
  },
  simulator: {
    icon: <FlaskConical size={14} className="text-blue-600" />,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    label: "Simulator",
  },
  badge: {
    icon: <Award size={14} className="text-emerald-600" />,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    label: "Achievement",
  },
  tutor: {
    icon: <Bot size={14} className="text-indigo-600" />,
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    label: "AI Tutor",
  },
};

export default function DashboardNotificationBanner() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [notifications, setNotifications] = useState<DashboardNotification[]>(dashboardNotifications);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || notifications.length === 0) return null;

  const active = notifications[0];
  const unreadCount = notifications.filter((n) => n.unread).length;
  const config = TYPE_CONFIG[active.type];

  const handleAction = (notif: DashboardNotification) => {
    if (notif.linkTo) {
      navigate(notif.linkTo);
    } else if (notif.type === "tutor") {
      dispatch(setTutorOpen(true));
    }
  };

  const handleDismissOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200">
      {/* ── Highlight Bar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-white">
        <div className="flex items-center gap-3 min-w-0">
          {/* Bell Icon with ping */}
          <div className="relative shrink-0 w-8 h-8 rounded-xl bg-indigo-100/80 flex items-center justify-center text-indigo-600">
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
            )}
          </div>

          {/* Type Badge */}
          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.bg} ${config.text} ${config.border}`}
          >
            {config.icon}
            {config.label}
          </span>

          {/* Message snippet */}
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-[13px] font-semibold text-slate-800 truncate">
              {active.title}
            </p>
            <span className="hidden md:inline-block text-[12px] text-slate-500 truncate max-w-[280px]">
              — {active.message}
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 shrink-0">
          {active.linkText && (
            <button
              onClick={() => handleAction(active)}
              className="flex items-center gap-1 px-3 py-1 bg-slate-900 text-white rounded-full text-[12px] font-semibold hover:bg-indigo-600 transition-colors"
            >
              <span>{active.linkText}</span>
              <ChevronRight size={12} />
            </button>
          )}

          {/* Expand / View all */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-[12px] font-medium transition-colors"
          >
            <span>{notifications.length} updates</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dismiss entire banner */}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Expanded Drawer List ── */}
      {expanded && (
        <div className="flex flex-col divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/50 p-2">
          {notifications.map((notif) => {
            const itemConfig = TYPE_CONFIG[notif.type];
            return (
              <div
                key={notif.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-white transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${itemConfig.bg} ${itemConfig.border}`}
                  >
                    {itemConfig.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-bold text-slate-800 leading-tight">
                        {notif.title}
                      </p>
                      {notif.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                      )}
                      <span className="text-[11px] text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-[12px] text-slate-600 mt-0.5 leading-snug">
                      {notif.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.linkText && (
                    <button
                      onClick={() => handleAction(notif)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      {notif.linkText} →
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDismissOne(notif.id, e)}
                    aria-label="Dismiss notification"
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
