import { useState, useEffect } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import {
  teamService,
  studentService,
  instructorService,
  exhibitionService,
  startupService,
  getStartteams,
  getTinstrs,
  getTeamExhibitions
} from "@/services/api";
import { Users, UserCog, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AssignmentsPage() {
  const [tab, setTab] = useState("team-student");

  const [data, setData] = useState(null);
  const [stData, setStData] = useState([]);
  const [tiData, setTiData] = useState([]);
  const [teData, setTeData] = useState([]);

  useEffect(() => {
    Promise.all([
      teamService.getAll(),
      studentService.getAll(),
      instructorService.getAll(),
      exhibitionService.getAll(),
      startupService.getAll(),
      getStartteams(),
      getTinstrs(),
      getTeamExhibitions()
    ]).then(([teams, students, instructors, exhibitions, startups, startteams, tinstrs, teamExhibitions]) => {
      setData({ teams, students, instructors, exhibitions, startups });
      setStData(startteams);
      setTiData(tinstrs);
      setTeData(teamExhibitions);
    });
  }, []);

  const tabs = [
    { id: "team-student", label: "Team ↔ Student", icon: Users },
    { id: "team-instructor", label: "Team ↔ Instructor", icon: UserCog },
    { id: "team-exhibition", label: "Team ↔ Exhibition", icon: Calendar },
  ];

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading assignments...
      </div>
    );
  }

  const { teams, students, instructors, exhibitions, startups } = data;

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Assignments
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage team-student, team-instructor, and team-exhibition mappings.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-card w-fit mt-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden mt-6"
        >
          {tab === "team-student" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Team
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Student
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Startup
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stData.map((st, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-foreground">
                        {teams.find((t) => t.tid === st.tid)?.tname}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-foreground">
                        {students.find((s) => s.id === st.mid)?.name}
                      </td>
                      <td className="px-5 py-3.5 text-sm">
                        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                          {startups.find((s) => s.sid === st.sid)?.sname}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setStData((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            );
                            toast.success("Removed");
                          }}
                          className="text-xs text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "team-instructor" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Team
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Instructor
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Specialization
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tiData.map((ti, i) => {
                    const inst = instructors.find(
                      (ins) => ins.iid === ti.iid
                    );
                    return (
                      <tr
                        key={i}
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-sm text-foreground">
                          {teams.find((t) => t.tid === ti.tid)?.tname}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-foreground">
                          {inst?.iname}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground">
                          {inst?.specialization || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setTiData((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              );
                              toast.success("Removed");
                            }}
                            className="text-xs text-destructive hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === "team-exhibition" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Team
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Exhibition
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Place
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teData.map((te, i) => {
                    const ex = exhibitions.find(
                      (e) => e.eid === te.eid
                    );
                    return (
                      <tr
                        key={i}
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-sm text-foreground">
                          {teams.find((t) => t.tid === te.tid)?.tname}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-foreground">
                          {ex?.ex_name}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground">
                          {ex?.ex_date}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground">
                          {ex?.ex_place}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setTeData((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              );
                              toast.success("Removed");
                            }}
                            className="text-xs text-destructive hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}