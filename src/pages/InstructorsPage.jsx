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
import { instructorService } from "@/services/api";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function InstructorsPage() {
  const { canModifyGeneral, canModifyStaff } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    instructorService.getAll().then(setData);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    iname: "",
    specialization: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      iname: "",
      specialization: "",
    });
    setModalOpen(true);
  };

  const openEdit = (i) => {
    setEditing(i);
    setForm({
      iid: i.iid,
      iname: i.iname,
      specialization: i.specialization || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (i) => {
    try {
      await instructorService.delete(i.iid);
      setData((prev) => prev.filter((x) => x.iid !== i.iid));
      toast.success("Instructor deleted");
    } catch (e) { toast.error("Error deleting"); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.iname.trim()) {
      toast.error("Name is required");
      return;
    }

    (async () => {
      try {
        if (editing) {
          const updated = await instructorService.update(editing.iid, form);
          setData((prev) =>
            prev.map((i) => (i.iid === editing.iid ? updated : i))
          );
          toast.success("Instructor updated");
        } else {
          delete form.iid;
          const newItem = await instructorService.create(form);
          setData((prev) => [...prev, newItem]);
          toast.success("Instructor added");
        }
        setModalOpen(false);
      } catch (err) { toast.error(err.message || "Error saving"); }
    })();
  };

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Instructors
        </h1>

        <DataTable
          title="All Instructors"
          columns={[
            { key: "iid", label: "ID" },
            { key: "iname", label: "Name" },
            {
              key: "specialization",
              label: "Specialization",
              render: (i) => i.specialization || "—",
            },
          ]}
          data={data}
          onAdd={canModifyStaff ? openAdd : null}
          onEdit={canModifyStaff ? openEdit : null}
          onDelete={canModifyStaff ? handleDelete : null}
        />

        <FormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? "Edit Instructor" : "Add Instructor"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Name">
              <FormInput
                value={form.iname}
                onChange={(e) =>
                  setForm((f) => ({ ...f, iname: e.target.value }))
                }
                placeholder="Instructor name"
              />
            </FormField>

            {!editing && (
              <FormIdField
                idKey="iid"
                tableName="instructors"
                value={form.iid}
                onChange={(val) => setForm((f) => ({ ...f, iid: val ? parseInt(val, 10) : undefined }))}
              />
            )}

            <FormField label="Specialization">
              <FormInput
                value={form.specialization}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    specialization: e.target.value,
                  }))
                }
                placeholder="e.g. Machine Learning"
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