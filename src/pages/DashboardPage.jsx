import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PageTransition,
  staggerContainer,
  fadeInUp,
} from "@/components/animations/PageTransition";
import { StatCard } from "@/components/shared/StatCard";
import {
  Users,
  Rocket,
  DollarSign,
  GraduationCap,
  Building2,
  Calendar,
  TrendingUp,
  Award,
  Loader2,
} from "lucide-react";
import {
  studentService,
  teamService,
  startupService,
  fundService,
  departmentService,
  exhibitionService,
  evaluationService,
  instructorService,
} from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";

const monthlyFunding = [
  { month: "Jan", amount: 0 },
  { month: "Feb", amount: 500000 },
  { month: "Mar", amount: 1250000 },
  { month: "Apr", amount: 1550000 },
  { month: "May", amount: 1750000 },
  { month: "Jun", amount: 2000000 },
  { month: "Jul", amount: 3000000 },
  { month: "Aug", amount: 3400000 },
  { month: "Sep", amount: 3500000 },
];

const COLORS = [
  "hsl(185, 80%, 55%)",
  "hsl(265, 80%, 65%)",
  "hsl(150, 70%, 45%)",
  "hsl(40, 90%, 55%)",
  "hsl(330, 70%, 60%)",
];

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      studentService.getAll(),
      teamService.getAll(),
      startupService.getAll(),
      fundService.getAll(),
      departmentService.getAll(),
      exhibitionService.getAll(),
      evaluationService.getAll(),
      instructorService.getAll(),
    ]).then(([students, teams, startups, funds, departments, exhibitions, evaluations, instructors]) => {
      setData({ students, teams, startups, funds, departments, exhibitions, evaluations, instructors });
    });
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading dashboard...
      </div>
    );
  }

  const { students, teams, startups, funds, departments, exhibitions, evaluations, instructors } = data;

  const fundingByTeam = teams
    .map((t) => ({
      name: t.tname,
      amount: funds
        .filter((f) => f.tid === t.tid)
        .reduce((sum, f) => sum + f.amount, 0),
    }))
    .filter((f) => f.amount > 0);

  const evalByTeam = teams
    .map((t) => {
      const evals = evaluations.filter((e) => e.tid === t.tid);
      return {
        name: t.tname,
        avg: evals.length
          ? Math.round(
            evals.reduce((s, e) => s + e.score, 0) / evals.length
          )
          : 0,
      };
    })
    .filter((e) => e.avg > 0);

  const deptData = departments.map((d) => ({
    name: d.dname.split(" ")[0],
    students: students.filter((s) => s.did === d.did).length,
  }));

  const totalFunding = funds.reduce((s, f) => s + f.amount, 0);

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-2">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's an overview of your startup ecosystem.
          </p>
        </div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            icon={GraduationCap}
            title="Total Students"
            value={students.length}
            change="+12% this month"
            changeType="up"
          />
          <StatCard
            icon={Users}
            title="Active Teams"
            value={teams.length}
            change="+2 new"
            changeType="up"
          />
          <StatCard
            icon={DollarSign}
            title="Total Funding"
            value={`₹${(totalFunding / 100000).toFixed(1)}L`}
            change="+18% growth"
            changeType="up"
          />
          <StatCard
            icon={Rocket}
            title="Startups"
            value={startups.length}
            change="5 active"
            changeType="neutral"
          />
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Funding by Team
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fundingByTeam}>
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
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220,18%,7%)",
                    border: "1px solid hsl(220,15%,15%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "hsl(210,20%,95%)" }}
                  formatter={(v) => [`₹${v.toLocaleString()}`, "Amount"]}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(185,80%,55%)"
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
              Cumulative Funding Trend
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyFunding}>
                <defs>
                  <linearGradient id="fundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(185,80%,55%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(185,80%,55%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220,15%,15%)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220,18%,7%)",
                    border: "1px solid hsl(220,15%,15%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(185,80%,55%)"
                  fill="url(#fundGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Students per Department
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="students"
                >
                  {deptData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220,18%,7%)",
                    border: "1px solid hsl(220,15%,15%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {deptData.map((d, i) => (
                <div
                  key={d.name}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                  {d.name}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="glass-card p-6 lg:col-span-2"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Average Evaluation Scores
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={evalByTeam} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220,15%,15%)"
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
                  axisLine={false}
                  width={120}
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
                  dataKey="avg"
                  fill="hsl(265,80%,65%)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <StatCard
            icon={Building2}
            title="Departments"
            value={departments.length}
          />
          <StatCard
            icon={Calendar}
            title="Exhibitions"
            value={exhibitions.length}
          />
          <StatCard
            icon={Award}
            title="Evaluations"
            value={evaluations.length}
          />
          <StatCard
            icon={TrendingUp}
            title="Instructors"
            value={instructors.length}
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}