import { useAuth } from "@/context/AuthContext";
import { Search, Bell, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button className="relative p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.username || "Admin"}</p>
              <p className="text-[11px] text-muted-foreground">{user?.role || "Admin"}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </button>

          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-48 glass-card p-1.5 shadow-xl"
            >
              <button
                onClick={() => { navigate("/settings"); setProfileOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground rounded-md hover:bg-secondary transition-colors"
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive rounded-md hover:bg-secondary transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
