import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function FormModal({ open, onClose, title, children }) {
  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="relative w-full max-w-lg glass-card p-6 shadow-2xl z-[150] max-h-[85vh] overflow-y-auto scrollbar-thin rounded-xl bg-card border-border"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <h3 className="text-xl font-semibold text-foreground tracking-tight">
                {title}
              </h3>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}

export function FormField({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

export function FormInput({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-3 rounded-lg bg-secondary/70 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-secondary transition-all ${className}`}
      {...props}
    />
  );
}

export function FormSelect({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full px-4 py-3 rounded-lg bg-secondary/70 border border-white/10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-secondary transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function FormButton({
  children,
  variant = "primary",
  ...props
}) {
  return (
    <button
      className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
        }`}
      {...props}
    >
      {children}
    </button>
  );
}

export function FormIdField({ idKey = "id", tableName, value, onChange }) {
  const [mode, setMode] = useState("auto");
  const [autoId, setAutoId] = useState("");

  useEffect(() => {
    if (mode === "auto" && tableName) {
      supabase
        .from(tableName)
        .select(idKey)
        .order(idKey, { ascending: false })
        .limit(1)
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setAutoId(parseInt(data[0][idKey] || 0, 10) + 1);
          } else {
            setAutoId(1);
          }
        });
    }
  }, [mode, tableName, idKey]);

  return (
    <div className="space-y-3 py-3 my-3 border-y border-border/50">
      <div className="flex items-center gap-6">
        <label className="text-sm font-medium text-foreground flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={`idMode-${idKey}`}
            checked={mode === "auto"}
            onChange={() => {
              setMode("auto");
              onChange("");
            }}
            className="accent-primary w-4 h-4"
          />
          Auto Generate
        </label>
        <label className="text-sm font-medium text-foreground flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={`idMode-${idKey}`}
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
            className="accent-primary w-4 h-4"
          />
          Manual ID
        </label>
      </div>

      <div className="pt-2">
        <FormField label={`Identifier (${idKey.toUpperCase()})`}>
          <FormInput
            type={mode === "auto" ? "text" : "number"}
            value={mode === "auto" ? (autoId ? autoId : "Fetching...") : (value || "")}
            onChange={(e) => mode === "manual" && onChange(e.target.value)}
            disabled={mode === "auto"}
            placeholder="Enter custom number"
            min="1"
            required={mode === "manual"}
          />
        </FormField>
      </div>
    </div>
  );
}