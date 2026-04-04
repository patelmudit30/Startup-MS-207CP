import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PageTransition,
  fadeInUp,
  staggerContainer,
} from "@/components/animations/PageTransition";
import {
  teamService,
  studentService,
  startupService,
  fundService,
  evaluationService,
  instructorService,
  exhibitionService,
  getStartteams,
  getTinstrs,
  getTeamExhibitions
} from "@/services/api";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Award,
  Calendar,
  UserCog,
  Loader2
} from "lucide-react";

export default function TeamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tid = Number(id);

  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      teamService.getAll(),
      getStartteams(),
      studentService.getAll(),
      startupService.getAll(),
      fundService.getAll(),
      evaluationService.getAll(),
      instructorService.getAll(),
      getTinstrs(),
      getTeamExhibitions(),
      exhibitionService.getAll()
    ]).then(([teams, startteams, students, startups, funds, evaluations, instructors, tinstrs, teamExhibitions, exhibitions]) => {
      setData({ teams, startteams, students, startups, funds, evaluations, instructors, tinstrs, teamExhibitions, exhibitions });
    });
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading details...
      </div>
    );
  }

  const { teams, startteams, students, startups, funds, evaluations, instructors, tinstrs, teamExhibitions, exhibitions } = data;

  const team = teams.find((t) => t.tid === tid);

  if (!team) {
    return (
      <div className="page-container">
        <p className="text-muted-foreground">Team not found</p>
      </div>
    );
  }

  const members = startteams
    .filter((st) => st.tid === tid)
    .map((st) => {
      const student = students.find((s) => s.id === st.mid);
      const startup = startups.find((s) => s.sid === st.sid);
      return { student, startup };
    });

  const teamFunds = funds.filter((f) => f.tid === tid);
  const teamEvals = evaluations.filter((e) => e.tid === tid);

  const teamInstructors = tinstrs
    .filter((ti) => ti.tid === tid)
    .map((ti) => instructors.find((i) => i.iid === ti.iid))
    .filter(Boolean);

  const teamExhibs = teamExhibitions
    .filter((te) => te.tid === tid)
    .map((te) => exhibitions.find((e) => e.eid === te.eid))
    .filter(Boolean);

  const totalFunding = teamFunds.reduce((s, f) => s + f.amount, 0);

  const avgScore = teamEvals.length
    ? Math.round(
      teamEvals.reduce((s, e) => s + e.score, 0) /
      teamEvals.length
    )
    : 0;

  return (
    <PageTransition>
      <div className="page-container">
        <button
          onClick={() => navigate("/teams")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Teams
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Users className="w-7 h-7 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {team.tname}
            </h1>
            <p className="text-sm text-muted-foreground">
              Team ID: {team.tid}
            </p>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {[
            { icon: Users, label: "Members", value: members.length },
            {
              icon: DollarSign,
              label: "Total Funding",
              value: `₹${(totalFunding / 100000).toFixed(1)}L`,
            },
            {
              icon: Award,
              label: "Avg Score",
              value: avgScore || "N/A",
            },
            {
              icon: Calendar,
              label: "Exhibitions",
              value: teamExhibs.length,
            },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="stat-card">
              <stat.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Members */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Team Members
            </h3>

            <div className="space-y-3">
              {members.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {m.student?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Student ID: {m.student?.id}
                    </p>
                  </div>

                  <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                    {m.startup?.sname}
                  </span>
                </div>
              ))}

              {members.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No members assigned
                </p>
              )}
            </div>
          </div>

          {/* Mentors */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <UserCog className="w-4 h-4 text-accent" /> Mentors
            </h3>

            <div className="space-y-3">
              {teamInstructors.map((inst, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-secondary/50"
                >
                  <p className="text-sm font-medium text-foreground">
                    {inst?.iname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inst?.specialization}
                  </p>
                </div>
              ))}

              {teamInstructors.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No mentors assigned
                </p>
              )}
            </div>
          </div>

          {/* Funding */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-success" /> Funding
            </h3>

            <div className="space-y-3">
              {teamFunds.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {f.investor}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {f.date}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-success">
                    ₹{f.amount.toLocaleString()}
                  </span>
                </div>
              ))}

              {teamFunds.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No funding records
                </p>
              )}
            </div>
          </div>

          {/* Evaluations */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-warning" /> Evaluations
            </h3>

            <div className="space-y-3">
              {teamEvals.map((ev, i) => (
                <div
                  key={i}
                  className="flex justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {
                        instructors.find(
                          (inst) => inst.iid === ev.iid
                        )?.iname
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ev.remarks}
                    </p>
                  </div>

                  <span
                    className={`text-lg font-bold ${ev.score >= 90
                      ? "text-success"
                      : ev.score >= 80
                        ? "text-primary"
                        : "text-warning"
                      }`}
                  >
                    {ev.score}
                  </span>
                </div>
              ))}

              {teamEvals.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No evaluations
                </p>
              )}
            </div>
          </div>
        </div>
      </div >
    </PageTransition >
  );
}