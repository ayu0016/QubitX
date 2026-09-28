import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Bot, Trophy, FlaskConical, Award, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { setTutorOpen } from "../store/slices/uiSlice";
import { dashboardNotifications } from "../data/mockDashboard";
import type { DashboardNotification } from "../types";

export default function TopBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tutorOpen = useAppSelector((s) => s.ui.tutorOpen);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<DashboardNotification[]>(dashboardNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (notif: DashboardNotification) => {
    setNotificationsOpen(false);
    if (notif.linkTo) {
      navigate(notif.linkTo);
    } else if (notif.type === "tutor") {
      dispatch(setTutorOpen(true));
    }
  };

  const getIcon = (type: DashboardNotification["type"]) => {
    switch (type) {
      case "challenge":
        return <Trophy size={13} className="text-amber-600" />;
      case "simulator":
        return <FlaskConical size={13} className="text-blue-600" />;
      case "badge":
        return <Award size={13} className="text-emerald-600" />;
      case "tutor":
        return <Bot size={13} className="text-indigo-600" />;
    }
  };

  return (
    <header className="h-14 shrink-0 flex items-center gap-3.5 px-5 bg-[#FAFAFA] border-b border-slate-200 relative z-30">
      {/* Search */}
      <div className="flex-1 relative max-w-[620px]">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="search"
          placeholder="Search modules, circuits, challenges..."
          className="w-full h-9 pl-9 pr-4 bg-white rounded-xl border border-slate-200 text-[14px] text-slate-600 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
          aria-label="Search"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5 ml-auto relative">
        {/* Bell + Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            className={`w-9 h-9 rounded-full bg-white border flex items-center justify-center transition-colors relative ${
              notificationsOpen
                ? "border-indigo-400 text-indigo-600 shadow-sm"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {notificationsOpen && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                  >
                    <Check size={12} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      notif.unread ? "bg-indigo-50/20" : ""
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-[12px] truncate ${notif.unread ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Re-open tutor button — only when panel is closed */}
        {!tutorOpen && (
          <button
            onClick={() => dispatch(setTutorOpen(true))}
            aria-label="Open AI Tutor"
            className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            <Bot size={16} />
          </button>
        )}

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
          <span className="text-[12px] font-semibold text-slate-700 select-none">
            AR
          </span>
        </div>
      </div>
    </header>
  );
}
