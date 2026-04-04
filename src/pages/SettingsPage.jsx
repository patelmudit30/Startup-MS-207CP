import { PageTransition } from "@/components/animations/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { User, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="page-container max-w-2xl">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>

        <div className="glass-card p-6 mt-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Profile Information
          </h3>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>

            <div>
              <p className="text-lg font-semibold text-foreground">
                {user?.username || "Admin"}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                {user?.role || "Admin"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Username
              </label>
              <input
                defaultValue={user?.username}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                readOnly
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Role
              </label>
              <input
                defaultValue={user?.role}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            System Info
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Version: 1.0.0</p>
            <p>Frontend: React + JavaScript + Tailwind CSS</p>
            <p>Animations: Framer Motion</p>
            <p>Charts: Recharts</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}