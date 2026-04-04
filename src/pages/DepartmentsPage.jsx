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
import { departmentService } from "@/services/api";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function DepartmentsPage() {
  const { canModifyGeneral, canModifyStaff } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    departmentService.getAll().then(setData);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ dname: "" });

  const openAdd = () => {
    setEditing(null);
    setForm({ dname: "" });
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditing(d);
    setForm({ ...d });
    setModalOpen(true);
  };

  const handleDelete = async (d) => {
    try {
      await departmentService.delete(d.did);
      setData((prev) => prev.filter((x) => x.did !== d.did));
      toast.success("Department deleted");
    } catch (e) { toast.error("Error deleting"); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.dname.trim()) {
      toast.error("Name is required");
      return;
    }

    (async () => {
      try {
        if (editing) {
          const updated = await departmentService.update(editing.did, form);
          setData((prev) =>
            prev.map((d) => (d.did === editing.did ? updated : d))
          );
          toast.success("Department updated");
        } else {
          delete form.did;
          const newItem = await departmentService.create(form);
          setData((prev) => [...prev, newItem]);
          toast.success("Department created");
        }
        setModalOpen(false);
      } catch (err) { toast.error(err.message || "Error saving"); }
    })();
  };

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Departments
        </h1>

        <DataTable
          title="All Departments"
          columns={[
            { key: "did", label: "ID" },
            { key: "dname", label: "Department Name" },
          ]}
          data={data}
          onAdd={canModifyGeneral ? openAdd : null}
          onEdit={canModifyGeneral ? openEdit : null}
          onDelete={canModifyGeneral ? handleDelete : null}
        />

        <FormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? "Edit Department" : "Add Department"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Department Name">
              <FormInput
                value={form.dname}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dname: e.target.value }))
                }
                placeholder="e.g. Computer Science"
              />
            </FormField>

            {!editing && (
              <FormIdField
                idKey="did"
                tableName="departments"
                value={form.did}
                onChange={(val) => setForm((f) => ({ ...f, did: val ? parseInt(val, 10) : undefined }))}
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