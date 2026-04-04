import { useState, useEffect } from "react";
import { PageTransition, fadeInUp } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import {
  studentService,
  teamService,
  startupService,
  fundService,
  departmentService,
  exhibitionService,
  evaluationService,
} from "@/services/api";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      studentService.getAll(),
      teamService.getAll(),
      fundService.getAll(),
      evaluationService.getAll(),
      startupService.getAll(),
      departmentService.getAll(),
      exhibitionService.getAll(),
    ]).then(([students, teams, funds, evaluations, startups, departments, exhibitions]) => {
      setData({ students, teams, funds, evaluations, startups, departments, exhibitions });
    });
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading analytics...
      </div>
    );
  }

  const { students, teams, funds, evaluations, startups, departments, exhibitions } = data;

  const teamPerformance = teams
    .map((t) => {
      const evals = evaluations.filter((e) => e.tid === t.tid);
      const teamFunds = funds.filter((f) => f.tid === t.tid);
      return {
        name: t.tname,
        avgScore: evals.length
          ? Math.round(evals.reduce((s, e) => s + e.score, 0) / evals.length)
          : 0,
        funding: teamFunds.reduce((s, f) => s + f.amount, 0),
        members: new Set(evals.map((e) => e.iid)).size, // Just a visual mock approximation since original code reused iid arbitrarily for this demo scatter
      };
    })
    .filter((t) => t.avgScore > 0);

  const radarData = teams.slice(0, 5).map((t) => {
    const evals = evaluations.filter((e) => e.tid === t.tid);
    const teamFunds = funds.filter((f) => f.tid === t.tid);
    return {
      team: t.tname,
      innovation: evals.length ? Math.min(100, evals[0]?.score + 5) : 50,
      execution: evals.length ? evals[0]?.score : 50,
      funding: Math.min(
        100,
        teamFunds.reduce((s, f) => s + f.amount, 0) / 10000
      ),
      teamwork: evals.length ? Math.min(100, evals[0]?.score - 3) : 50,
      presentation: evals.length ? Math.min(100, evals[0]?.score + 2) : 50,
    };
  });

  const MathCount = (arr, cond) => arr.filter(cond).length;

  const yearDist = [1, 2, 3, 4].map((y) => ({
    year: `Year ${y}`,
    count: MathCount(students, (s) => s.year === y),
  }));

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Deep insights into your startup ecosystem.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Team Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamPerformance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220,15%,15%)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220,18%,7%)",
                    border: "1px solid hsl(220,15%,15%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="avgScore"
                  fill="hsl(185,80%,55%)"
                  name="Avg Score"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Performance Radar (Top Team)
            </h3>
            {radarData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                  data={[
                    { metric: "Innovation", value: radarData[0].innovation },
                    { metric: "Execution", value: radarData[0].execution },
                    { metric: "Funding", value: radarData[0].funding },
                    { metric: "Teamwork", value: radarData[0].teamwork },
                    {
                      metric: "Presentation",
                      value: radarData[0].presentation,
                    },
                  ]}
                >
                  <PolarGrid stroke="hsl(220,15%,15%)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    tick={{ fill: "hsl(215,15%,50%)", fontSize: 10 }}
                  />
                  <Radar
                    name={radarData[0].team}
                    dataKey="value"
                    stroke="hsl(185,80%,55%)"
                    fill="hsl(185,80%,55%)"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Students by Year
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={yearDist}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220,15%,15%)"
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220,18%,7%)",
                    border: "1px solid hsl(220,15%,15%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(265,80%,65%)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Funding vs Score (Bubble)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220,15%,15%)"
                />
                <XAxis
                  dataKey="funding"
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                  name="Funding"
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <YAxis
                  dataKey="avgScore"
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                  name="Score"
                />
                <ZAxis dataKey="members" range={[60, 400]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220,18%,7%)",
                    border: "1px solid hsl(220,15%,15%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Scatter data={teamPerformance} fill="hsl(150,70%,45%)" />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {[
            {
              label: "Avg Team Score",
              value: teamPerformance.length ? Math.round(
                teamPerformance.reduce((s, t) => s + t.avgScore, 0) /
                teamPerformance.length
              ) : 0,
            },
            { label: "Total Startups", value: startups.length },
            { label: "Departments", value: departments.length },
            { label: "Total Exhibitions", value: exhibitions.length },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="glass-card p-5 text-center"
            >
              <p className="text-2xl font-display font-bold text-foreground">
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}