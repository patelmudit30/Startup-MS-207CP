import { useState, useEffect } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { DataTable } from "@/components/shared/DataTable";
import {
  FormModal,
  FormField,
  FormInput,
  FormButton,
  FormIdField,
} from "@/components/shared/FormModal";
import { startupService } from "@/services/api";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function StartupsPage() {
  const { canModifyGeneral, canModifyStaff } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    startupService.getAll().then(setData);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    sname: "",
    description: "",
    founded: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      sname: "",
      description: "",
      founded: "",
    });
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      sid: s.sid,
      sname: s.sname,
      description: s.description || "",
      founded: s.founded || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (s) => {
    try {
      await startupService.delete(s.sid);
      setData((prev) => prev.filter((x) => x.sid !== s.sid));
      toast.success("Startup deleted");
    } catch (e) { toast.error("Error deleting"); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.sname.trim()) {
      toast.error("Name is required");
      return;
    }

    (async () => {
      try {
        if (editing) {
          const updated = await startupService.update(editing.sid, form);
          setData((prev) =>
            prev.map((s) => (s.sid === editing.sid ? updated : s))
          );
          toast.success("Startup updated");
        } else {
          delete form.sid;
          const newItem = await startupService.create(form);
          setData((prev) => [...prev, newItem]);
          toast.success("Startup added");
        }
        setModalOpen(false);
      } catch (err) { toast.error(err.message || "Error saving"); }
    })();
  };

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Startups
        </h1>

        <DataTable
          title="All Startups"
          columns={[
            { key: "sid", label: "ID" },
            { key: "sname", label: "Startup Name" },
            {
              key: "description",
              label: "Description",
              render: (s) => s.description || "—",
            },
            {
              key: "founded",
              label: "Founded",
              render: (s) => s.founded || "—",
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
          title={editing ? "Edit Startup" : "Add Startup"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Startup Name">
              <FormInput
                value={form.sname}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sname: e.target.value }))
                }
                placeholder="Startup name"
              />
            </FormField>

            {!editing && (
              <FormIdField
                idKey="sid"
                tableName="startups"
                value={form.sid}
                onChange={(val) => setForm((f) => ({ ...f, sid: val ? parseInt(val, 10) : undefined }))}
              />
            )}

            <FormField label="Description">
              <FormInput
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description"
              />
            </FormField>

            <FormField label="Founded">
              <FormInput
                type="month"
                value={form.founded}
                onChange={(e) =>
                  setForm((f) => ({ ...f, founded: e.target.value }))
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