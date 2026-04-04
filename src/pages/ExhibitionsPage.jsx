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
import { exhibitionService } from "@/services/api";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function ExhibitionsPage() {
  const { canModifyGeneral, canModifyStaff } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    exhibitionService.getAll().then(setData);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    ex_name: "",
    ex_date: "",
    ex_place: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      ex_name: "",
      ex_date: "",
      ex_place: "",
    });
    setModalOpen(true);
  };

  const openEdit = (e) => {
    setEditing(e);
    setForm({ ...e });
    setModalOpen(true);
  };

  const handleDelete = async (e) => {
    try {
      await exhibitionService.delete(e.eid);
      setData((prev) => prev.filter((x) => x.eid !== e.eid));
      toast.success("Exhibition deleted");
    } catch (err) { toast.error("Error deleting"); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.ex_name.trim()) {
      toast.error("Name required");
      return;
    }

    (async () => {
      try {
        if (editing) {
          const updated = await exhibitionService.update(editing.eid, form);
          setData((prev) =>
            prev.map((ex) => (ex.eid === editing.eid ? updated : ex))
          );
          toast.success("Exhibition updated");
        } else {
          delete form.eid;
          const newItem = await exhibitionService.create(form);
          setData((prev) => [...prev, newItem]);
          toast.success("Exhibition added");
        }
        setModalOpen(false);
      } catch (err) { toast.error(err.message || "Error saving"); }
    })();
  };

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Exhibitions
        </h1>

        <DataTable
          title="All Exhibitions"
          columns={[
            { key: "eid", label: "ID" },
            { key: "ex_name", label: "Name" },
            { key: "ex_date", label: "Date" },
            { key: "ex_place", label: "Place" },
          ]}
          data={data}
          onAdd={canModifyGeneral ? openAdd : null}
          onEdit={canModifyGeneral ? openEdit : null}
          onDelete={canModifyGeneral ? handleDelete : null}
        />

        <FormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? "Edit Exhibition" : "Add Exhibition"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Name">
              <FormInput
                value={form.ex_name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ex_name: e.target.value,
                  }))
                }
                placeholder="Exhibition name"
              />
            </FormField>

            {!editing && (
              <FormIdField
                idKey="eid"
                tableName="exhibitions"
                value={form.eid}
                onChange={(val) => setForm((f) => ({ ...f, eid: val ? parseInt(val, 10) : undefined }))}
              />
            )}

            <FormField label="Date">
              <FormInput
                type="date"
                value={form.ex_date}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ex_date: e.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Place">
              <FormInput
                value={form.ex_place}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ex_place: e.target.value,
                  }))
                }
                placeholder="Venue"
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