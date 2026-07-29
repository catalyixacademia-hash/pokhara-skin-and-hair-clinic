import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mutationResult } from '@/lib/supabase-result';
import DataTable from '@/components/DataTable';
import CrudForm, { FormField } from '@/components/CrudForm';
import ConfirmDelete from '@/components/ConfirmDelete';

type TreatmentOption = {
  id: string;
  label: string;
  sort_order: number;
  is_published: boolean;
};

const empty = (): Omit<TreatmentOption, 'id'> => ({
  label: '',
  sort_order: 0,
  is_published: true,
});

export default function TreatmentOptionsManager() {
  const [rows, setRows] = useState<TreatmentOption[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TreatmentOption | null>(null);
  const [editing, setEditing] = useState<TreatmentOption | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('treatment_options')
      .select('*')
      .order('sort_order');
    if (fetchError) setError(fetchError.message);
    else {
      setError(null);
      setRows(data ?? []);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => r.label.toLowerCase().includes(q));
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...empty(), sort_order: rows.length + 1 });
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (row: TreatmentOption) => {
    setEditing(row);
    setForm({
      label: row.label,
      sort_order: row.sort_order,
      is_published: row.is_published,
    });
    setError(null);
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      label: form.label.trim(),
      sort_order: form.sort_order,
      is_published: form.is_published,
      updated_at: new Date().toISOString(),
    };

    const { error: saveError } = editing
      ? await supabase.from('treatment_options').update(payload).eq('id', editing.id)
      : await supabase.from('treatment_options').insert(payload);

    const result = mutationResult(saveError);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setFormOpen(false);
    void load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    const { error: deleteError } = await supabase
      .from('treatment_options')
      .delete()
      .eq('id', deleteTarget.id);
    const result = mutationResult(deleteError);
    setDeleting(false);
    setDeleteTarget(null);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    void load();
  };

  return (
    <div>
      <div className="mb-6 max-w-3xl">
        <h1 className="font-serif text-3xl text-ink">Treatment options</h1>
        <p className="text-sm text-muted mt-1">
          Manage the treatments patients can choose on the website booking form. Published options
          appear in the dropdown on the public site.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">{rows.filter((r) => r.is_published).length} published</p>
        <button type="button" className="admin-btn-primary" onClick={openCreate}>
          Add option
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'label', label: 'Treatment' },
          { key: 'sort_order', label: 'Order' },
          {
            key: 'is_published',
            label: 'Published',
            render: (r) => (r.is_published ? 'Yes' : 'No'),
          },
        ]}
        rows={filtered}
        search={search}
        onSearchChange={setSearch}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        editLabel="Edit"
      />

      <CrudForm
        title={editing ? 'Edit treatment option' : 'Add treatment option'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(e) => void handleSave(e)}
        saving={saving}
      >
        <FormField label="Label">
          <input
            className="admin-input"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            required
            placeholder="e.g. Acne & Pigmentation"
          />
        </FormField>
        <FormField label="Sort order">
          <input
            type="number"
            className="admin-input max-w-[8rem]"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          Published on website
        </label>
      </CrudForm>

      <ConfirmDelete
        open={!!deleteTarget}
        title="Delete treatment option?"
        message={`Remove "${deleteTarget?.label}" from the booking form?`}
        deleting={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
