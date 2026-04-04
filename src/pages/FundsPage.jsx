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
import { fundService, teamService } from "@/services/api";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function FundsPage() {
  const { canModifyGeneral, canModifyStaff } = useAuth();
  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fundService.getAll().then(setData);
    teamService.getAll().then(setTeams);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    tid: 1,
    investor: "",
    amount: 0,
    date: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      tid: teams[0]?.tid || 1,
      investor: "",
      amount: 0,
      date: "",
    });
    setModalOpen(true);
  };

  const openEdit = (f) => {
    setEditing(f);
    setForm({ ...f, date: f.date || "" });
    setModalOpen(true);
  };

  const handleDelete = async (f) => {
    try {
      await fundService.delete(f.fid);
      setData((prev) => prev.filter((x) => x.fid !== f.fid));
      toast.success("Fund deleted");
    } catch (e) { toast.error("Error deleting"); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.investor.trim() || !form.amount) {
      toast.error("All fields required");
      return;
    }

    (async () => {
      try {
        if (editing) {
          const updated = await fundService.update(editing.fid, form);
          setData((prev) =>
            prev.map((f) => (f.fid === editing.fid ? updated : f))
          );
          toast.success("Fund updated");
        } else {
          delete form.fid;
          const newItem = await fundService.create(form);
          setData((prev) => [...prev, newItem]);
          toast.success("Fund added");
        }
        setModalOpen(false);
      } catch (err) { toast.error(err.message || "Error saving"); }
    })();
  };

  const getTeamName = (tid) =>
    teams.find((t) => t.tid === tid)?.tname || "Unknown";

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Funds
        </h1>

        <DataTable
          title="All Funding Records"
          columns={[
            { key: "fid", label: "ID" },
            {
              key: "tid",
              label: "Team",
              render: (f) => getTeamName(f.tid),
            },
            { key: "investor", label: "Investor" },
            {
              key: "amount",
              label: "Amount",
              render: (f) => `₹${f.amount.toLocaleString()}`,
            },
            {
              key: "date",
              label: "Date",
              render: (f) => f.date || "—",
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
          title={editing ? "Edit Fund" : "Add Fund"}
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
                idKey="fid"
                tableName="funds"
                value={form.fid}
                onChange={(val) => setForm((f) => ({ ...f, fid: val ? parseInt(val, 10) : undefined }))}
              />
            )}

            <FormField label="Investor">
              <FormInput
                value={form.investor}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    investor: e.target.value,
                  }))
                }
                placeholder="Investor name"
              />
            </FormField>

            <FormField label="Amount (₹)">
              <FormInput
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    amount: +e.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Date">
              <FormInput
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    date: e.target.value,
                  }))
                }
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