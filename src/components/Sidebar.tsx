import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  Trophy,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { toggleSidebar } from "../store/slices/uiSlice";
import { logout } from "../store/slices/authSlice";
import { ROUTES } from "../utils/routes";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  activeColor: string;
  activeBg: string;
  iconBg: string;
  iconColor: string;
  activeIconBg: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: ROUTES.dashboard,
    icon: <LayoutDashboard size={16} />,
    activeColor: "text-indigo-700",
    activeBg: "bg-indigo-50/70 border-l-[3px] border-indigo-600",
    iconBg: "bg-indigo-100",
    activeIconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    label: "Quantum Lab",
    to: ROUTES.quantumLab,
    icon: <FlaskConical size={16} />,
    activeColor: "text-blue-700",
    activeBg: "bg-blue-50/70 border-l-[3px] border-blue-600",
    iconBg: "bg-blue-100/70",
    activeIconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Modules",
    to: ROUTES.courses,
    icon: <BookOpen size={16} />,
    activeColor: "text-purple-700",
    activeBg: "bg-purple-50/70 border-l-[3px] border-purple-600",
    iconBg: "bg-purple-100/70",
    activeIconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    label: "Challenges",
    to: ROUTES.challenges,
    icon: <Trophy size={16} />,
    activeColor: "text-amber-700",
    activeBg: "bg-amber-50/70 border-l-[3px] border-amber-600",
    iconBg: "bg-amber-100/70",
    activeIconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    label: "Progress",
    to: ROUTES.progress,
    icon: <TrendingUp size={16} />,
    activeColor: "text-emerald-700",
    activeBg: "bg-emerald-50/70 border-l-[3px] border-emerald-600",
    iconBg: "bg-emerald-100/70",
    activeIconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    label: "Community",
    to: ROUTES.community,
    icon: <Users size={16} />,
    activeColor: "text-rose-700",
    activeBg: "bg-rose-50/70 border-l-[3px] border-rose-600",
    iconBg: "bg-rose-100/70",
    activeIconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
];

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
}

function SidebarNavItem({ item, collapsed }: SidebarNavItemProps) {
  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl transition-all duration-200",
          collapsed ? "justify-center px-0 py-2 mx-1" : "px-2.5 py-2",
          isActive
            ? `${item.activeBg} ${item.activeColor} font-semibold`
            : "text-slate-600 hover:bg-slate-100/80",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={[
              "flex items-center justify-center rounded-lg transition-colors duration-200 shrink-0",
              collapsed ? "w-8 h-8" : "w-8 h-8",
              isActive ? item.activeIconBg : item.iconBg,
              item.iconColor,
            ].join(" ")}
          >
            {item.icon}
          </span>
          {!collapsed && (
            <span className="text-[15px] leading-none">{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.landing);
  };

  return (
    <aside
      className={[
        "h-full flex flex-col border-r border-slate-200 bg-[#FAFAFF] transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-[62px]" : "w-56",
      ].join(" ")}
      aria-label="Main navigation"
    >
      {/* ── Logo + collapse toggle ─────────────────────────────────── */}
      <div
        className={[
          "flex items-center pt-6 pb-5 px-3 shrink-0",
          collapsed ? "justify-center" : "justify-between gap-2",
        ].join(" ")}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#0B1C30] flex items-center justify-center shrink-0">
            <svg width="15" height="12" viewBox="0 0 18 14" fill="none">
              <rect x="0" y="0" width="7" height="14" rx="3.5" fill="white" />
              <rect x="11" y="0" width="7" height="14" rx="3.5" fill="white" />
              <rect x="4" y="5" width="10" height="4" rx="2" fill="white" />
            </svg>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[18px] font-bold text-slate-900 leading-tight">
                QubitX
              </p>
              <p className="text-[11px] text-slate-400 font-medium leading-tight">
                Quantum Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* ── Nav items ─────────────────────────────────────────────── */}
      <nav className="flex-1 flex flex-col gap-0.5 px-1.5 overflow-y-auto min-h-0">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* ── Bottom section ────────────────────────────────────────── */}
      <div className="shrink-0 flex flex-col gap-0 pb-3 pt-2">
        <div className="border-t border-slate-200 mx-2 pt-2 flex flex-col gap-0.5">
          <button
            onClick={() => navigate(ROUTES.profile)}
            title={collapsed ? "Settings" : undefined}
            aria-label="Settings"
            className={[
              "flex items-center gap-3 rounded-lg px-2.5 py-2 text-slate-500 hover:bg-slate-100 transition-colors",
              collapsed && "justify-center",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Settings size={16} className="shrink-0" />
            {!collapsed && (
              <span className="text-[14px] font-medium">Settings</span>
            )}
          </button>
          <button
            onClick={handleLogout}
            title={collapsed ? "Log out" : undefined}
            aria-label="Log out"
            className={[
              "flex items-center gap-3 rounded-lg px-2.5 py-2 text-slate-400 hover:bg-slate-100 transition-colors",
              collapsed && "justify-center",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && (
              <span className="text-[14px] font-medium">Log out</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
