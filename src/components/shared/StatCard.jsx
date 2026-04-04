import { motion } from "framer-motion";
import { fadeInUp } from "@/components/animations/PageTransition";

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "up",
  gradient,
}) {
  return (
    <motion.div variants={fadeInUp} className="stat-card group">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-full h-full" />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm text-muted-foreground font-medium">
            {title}
          </p>

          <p className="text-3xl font-display font-bold text-foreground mt-1">
            {value}
          </p>

          {change && (
            <p
              className={`text-xs mt-2 font-medium ${
                changeType === "up"
                  ? "text-success"
                  : changeType === "down"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {changeType === "up"
                ? "↑"
                : changeType === "down"
                ? "↓"
                : "→"}{" "}
              {change}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-xl ${gradient || "bg-primary/10"}`}>
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}