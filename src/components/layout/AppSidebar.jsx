import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Rocket,
  UserCog,
  DollarSign,
  Calendar,
  ClipboardCheck,
  ChevronLeft,
  GraduationCap,
  BarChart3,
  Settings,
  Link2,
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: BarChart3, label: "Analytics", path: "/analytics" },
    ],
  },
  {
    label: "Core Modules",
    items: [
      { icon: Building2, label: "Departments", path: "/departments" },
      { icon: GraduationCap, label: "Students", path: "/students" },
      { icon: Rocket, label: "Startups", path: "/startups" },
      { icon: Users, label: "Teams", path: "/teams" },
      { icon: UserCog, label: "Instructors", path: "/instructors" },
      { icon: DollarSign, label: "Funds", path: "/funds" },
      { icon: Calendar, label: "Exhibitions", path: "/exhibitions" },
      { icon: ClipboardCheck, label: "Evaluations", path: "/evaluations" },
    ],
  },
  {
    label: "Mappings",
    items: [{ icon: Link2, label: "Assignments", path: "/assignments" }],
  },
  {
    label: "System",
    items: [{ icon: Settings, label: "Settings", path: "/settings" }],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col border-r border-border bg-sidebar overflow-hidden z-40"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
            <img src="/logo.png" className="w-7 h-7 object-cover p-0.5" alt="App Logo" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display font-bold text-foreground whitespace-nowrap overflow-hidden"
              >
                StartupMS
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
                      ${isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    <item.icon
                      className={`w-[18px] h-[18px] flex-shrink-0 ${isActive
                          ? "text-primary"
                          : "group-hover:text-foreground"
                        }`}
                    />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        <motion.div
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.div>
      </button>
    </motion.aside>
  );
}