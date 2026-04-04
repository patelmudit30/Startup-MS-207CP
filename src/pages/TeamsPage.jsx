import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/animations/PageTransition";
import { DataTable } from "@/components/shared/DataTable";
import {
  FormModal,
  FormField,
  FormInput,
  FormButton,
  FormIdField,
} from "@/components/shared/FormModal";
import { teamService, getStartteams, fundService, evaluationService } from "@/services/api";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function TeamsPage() {
  const { canModifyGeneral, canModifyStaff } = useAuth();
  const [data, setData] = useState([]);
  const [startteams, setStartteams] = useState([]);
  const [funds, setFunds] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    teamService.getAll().then(setData);
    getStartteams().then(setStartteams);
    fundService.getAll().then(setFunds);
    evaluationService.getAll().then(setEvaluations);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ tname: "" });

  const navigate = useNavigate();

  const getMembers = (tid) => startteams.filter((st) => st.tid === tid).length;

  const getFunding = (tid) =>
    funds.filter((f) => f.tid === tid).reduce((s, f) => s + f.amount, 0);

  const getAvgScore = (tid) => {
    const evals = evaluations.filter((e) => e.tid === tid);
    return evals.length
      ? Math.round(evals.reduce((s, e) => s + e.score, 0) / evals.length)
      : 0;
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ tname: "" });
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({ ...t });
    setModalOpen(true);
  };

  const handleDelete = async (t) => {
    try {
      await teamService.delete(t.tid);
      setData((prev) => prev.filter((x) => x.tid !== t.tid));
      toast.success("Team deleted");
    } catch (e) { toast.error("Error deleting"); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.tname.trim()) {
      toast.error("Name is required");
      return;
    }

    (async () => {
      try {
        if (editing) {
          const updated = await teamService.update(editing.tid, form);
          setData((prev) => prev.map((t) => (t.tid === editing.tid ? updated : t)));
          toast.success("Team updated");
        } else {
          delete form.tid;
          const newItem = await teamService.create(form);
          setData((prev) => [...prev, newItem]);
          toast.success("Team added");
        }
        setModalOpen(false);
      } catch (err) { toast.error(err.message || "Error saving"); }
    })();
  };

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Teams
        </h1>

        <DataTable
          title="All Teams"
          columns={[
            { key: "tid", label: "ID" },
            {
              key: "tname",
              label: "Team Name",
              render: (t) => (
                <button
                  onClick={() => navigate(`/teams/${t.tid}`)}
                  className="text-primary hover:underline font-medium"
                >
                  {t.tname}
                </button>
              ),
            },
            {
              key: "members",
              label: "Members",
              render: (t) => getMembers(t.tid),
              sortable: false,
            },
            {
              key: "funding",
              label: "Funding",
              render: (t) => `₹${getFunding(t.tid).toLocaleString()}`,
              sortable: false,
            },
            {
              key: "score",
              label: "Avg Score",
              render: (t) => {
                const score = getAvgScore(t.tid);
                return (
                  <span
                    className={
                      score >= 90
                        ? "text-success"
                        : score >= 80
                          ? "text-primary"
                          : "text-warning"
                    }
                  >
                    {score || "—"}
                  </span>
                );
              },
              sortable: false,
            },
          ]}
          data={data}
          onAdd={canModifyGeneral ? openAdd : null}
          onEdit={canModifyGeneral ? openEdit : null}
          onDelete={canModifyGeneral ? handleDelete : null}
        />

        <FormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? "Edit Team" : "Add Team"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Team Name">
              <FormInput
                value={form.tname}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tname: e.target.value }))
                }
                placeholder="Team name"
              />
            </FormField>

            {!editing && (
              <FormIdField
                idKey="tid"
                tableName="teams"
                value={form.tid}
                onChange={(val) => setForm((f) => ({ ...f, tid: val ? parseInt(val, 10) : undefined }))}
              />
            )}

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