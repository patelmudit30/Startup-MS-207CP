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
import { studentService, departmentService } from "@/services/api";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function StudentsPage() {
  const { canModifyGeneral, canModifyStaff } = useAuth();
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    studentService.getAll().then(setData);
    departmentService.getAll().then(setDepartments);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    did: 1,
    year: 1,
    email: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      did: 1,
      year: 1,
      email: "",
    });
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      id: s.id,
      name: s.name,
      did: s.did,
      year: s.year,
      email: s.email || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (s) => {
    try {
      await studentService.delete(s.id);
      setData((prev) => prev.filter((x) => x.id !== s.id));
      toast.success("Student deleted");
    } catch (e) { toast.error("Error deleting"); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    (async () => {
      try {
        if (editing) {
          const updated = await studentService.update(editing.id, form);
          setData((prev) =>
            prev.map((s) => (s.id === editing.id ? updated : s))
          );
          toast.success("Student updated");
        } else {
          delete form.id; // ensure new creations have clean id auto-increment
          const newItem = await studentService.create(form);
          setData((prev) => [...prev, newItem]);
          toast.success("Student added");
        }
        setModalOpen(false);
      } catch (err) { toast.error(err.message || "Error saving"); }
    })();
  };

  const getDeptName = (did) =>
    departments.find((d) => d.did === did)?.dname || "Unknown";

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Students
        </h1>

        <DataTable
          title="All Students"
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            {
              key: "did",
              label: "Department",
              render: (s) => getDeptName(s.did),
            },
            { key: "year", label: "Year" },
            {
              key: "email",
              label: "Email",
              render: (s) => s.email || "—",
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
          title={editing ? "Edit Student" : "Add Student"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Name">
              <FormInput
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Student name"
              />
            </FormField>

            {!editing && (
              <FormIdField
                idKey="id"
                tableName="students"
                value={form.id}
                onChange={(val) => setForm((f) => ({ ...f, id: val ? parseInt(val, 10) : undefined }))}
              />
            )}

            <FormField label="Department">
              <FormSelect
                value={form.did}
                onChange={(e) =>
                  setForm((f) => ({ ...f, did: +e.target.value }))
                }
              >
                {departments.map((d) => (
                  <option key={d.did} value={d.did}>
                    {d.dname}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField label="Year">
              <FormSelect
                value={form.year}
                onChange={(e) =>
                  setForm((f) => ({ ...f, year: +e.target.value }))
                }
              >
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField label="Email">
              <FormInput
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="email@bvm.edu"
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