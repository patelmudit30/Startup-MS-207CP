import { useState, useEffect } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { DataTable } from "@/components/shared/DataTable";
import {
  FormModal,
  FormField,
  FormInput,
  FormSelect,
  FormButton,
  FormIdField,
} from "@/components/shared/FormModal";
import { evaluationService, teamService, instructorService } from "@/services/api";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function EvaluationsPage() {
  const { canModifyGeneral, canModifyStaff } = useAuth();
  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    evaluationService.getAll().then(setData);
    teamService.getAll().then(setTeams);
    instructorService.getAll().then(setInstructors);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    tid: 1,
    iid: 1,
    score: 0,
    remarks: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      tid: teams[0]?.tid || 1,
      iid: instructors[0]?.iid || 1,
      score: 0,
      remarks: "",
    });
    setModalOpen(true);
  };

  const openEdit = (ev) => {
    setEditing(ev);
    setForm({ ...ev });
    setModalOpen(true);
  };

  const handleDelete = async (ev) => {
    try {
      await evaluationService.delete(ev.eid);
      setData((prev) => prev.filter((x) => x.eid !== ev.eid));
      toast.success("Evaluation deleted");
    } catch (err) { toast.error("Error deleting"); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.score || !form.remarks.trim()) {
      toast.error("All fields required");
      return;
    }

    (async () => {
      try {
        if (editing) {
          const updated = await evaluationService.update(editing.eid, form);
          setData((prev) =>
            prev.map((ev) => (ev.eid === editing.eid ? updated : ev))
          );
          toast.success("Evaluation updated");
        } else {
          delete form.eid;
          const newItem = await evaluationService.create(form);
          setData((prev) => [...prev, newItem]);
          toast.success("Evaluation added");
        }
        setModalOpen(false);
      } catch (err) { toast.error(err.message || "Error saving"); }
    })();
  };

  const getTeamName = (tid) =>
    teams.find((t) => t.tid === tid)?.tname || "Unknown";

  const getInstrName = (iid) =>
    instructors.find((i) => i.iid === iid)?.iname || "Unknown";

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Evaluations
        </h1>

        <DataTable
          title="All Evaluations"
          columns={[
            { key: "eid", label: "ID" },
            {
              key: "tid",
              label: "Team",
              render: (ev) => getTeamName(ev.tid),
            },
            {
              key: "iid",
              label: "Instructor",
              render: (ev) => getInstrName(ev.iid),
            },
            {
              key: "score",
              label: "Score",
              render: (ev) => (
                <span
                  className={`font-semibold ${ev.score >= 90
                    ? "text-success"
                    : ev.score >= 80
                      ? "text-primary"
                      : "text-warning"
                    }`}
                >
                  {ev.score}
                </span>
              ),
            },
            { key: "remarks", label: "Remarks" },
          ]}
          data={data}
          onAdd={canModifyGeneral ? openAdd : null}
          onEdit={canModifyGeneral ? openEdit : null}
          onDelete={canModifyGeneral ? handleDelete : null}
        />

        <FormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? "Edit Evaluation" : "Add Evaluation"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Team">
              <FormSelect
                value={form.tid}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    tid: +e.target.value,
                  }))
                }
              >
                {teams.map((t) => (
                  <option key={t.tid} value={t.tid}>
                    {t.tname}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            {!editing && (
              <FormIdField
                idKey="eid"
                tableName="evaluations"
                value={form.eid}
                onChange={(val) => setForm((f) => ({ ...f, eid: val ? parseInt(val, 10) : undefined }))}
              />
            )}

            <FormField label="Instructor">
              <FormSelect
                value={form.iid}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    iid: +e.target.value,
                  }))
                }
              >
                {instructors.map((i) => (
                  <option key={i.iid} value={i.iid}>
                    {i.iname}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField label="Score (0-100)">
              <FormInput
                type="number"
                min={0}
                max={100}
                value={form.score}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    score: +e.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Remarks">
              <FormInput
                value={form.remarks}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    remarks: e.target.value,
                  }))
                }
                placeholder="Evaluation remarks"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </FormButton>
              <FormButton type="submit">
                {editing ? "Update" : "Create"}
              </FormButton>
            </div>
          </form>
        </FormModal>
      </div>
    </PageTransition>
  );
}