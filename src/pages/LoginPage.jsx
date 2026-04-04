import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || (mode === "register" && !confirmPassword.trim())) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (mode === "register" && !userId.trim()) {
      toast.error("Please provide a valid Student ID");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const success = await login(username, password);
      setLoading(false);
      if (success) {
        toast.success("Welcome back!");
        navigate("/");
      } else {
        toast.error("Invalid credentials");
      }
    } else {
      const res = await register(username, password, userId);
      setLoading(false);
      if (res.success) {
        toast.success("Student account created securely!");
        navigate("/");
      } else {
        toast.error(res.error || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-secondary/20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-xl border border-primary/30 p-1 bg-black/40 backdrop-blur-xl">
              <img src="/logo.png" className="w-full h-full object-cover rounded-lg" alt="App Logo" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Sign in to StartupMS" : "Register a new Student profile"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Student ID
                </label>
                <input
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. 1001"
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {mode === "login" ? "Password" : "Create Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "login" ? "Enter password" : "Create a strong password"}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Processing..." : mode === "login" ? "Sign In" : "Register"}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm text-primary hover:underline font-medium transition-all"
            >
              {mode === "login"
                ? "Don't have an account? Sign up as Student"
                : "Already an enrolled student? Sign in here"}
            </button>
            <p className="text-xs text-muted-foreground">
              Demo logins: admin / admin123 • aarav / pass123 • drkirti / pass123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}