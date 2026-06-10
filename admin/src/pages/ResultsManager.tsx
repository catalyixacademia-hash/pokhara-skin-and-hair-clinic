import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/DataTable';
import CrudForm, { FormField } from '@/components/CrudForm';
import ConfirmDelete from '@/components/ConfirmDelete';
import ImageUpload from '@/components/ImageUpload';

type Result = {
  id: string;
  label: string;
  before_url: string;
  after_url: string;
  duration: string | null;
  category: 'skin' | 'hair';
  sort_order: number;
  is_published: boolean;
};

const empty = (): Omit<Result, 'id'> => ({
  label: '',
  before_url: '',
  after_url: '',
  duration: '',
  category: 'skin',
  sort_order: 0,
  is_published: true,
});

export default function ResultsManager() {
  const [rows, setRows] = useState<Result[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Result | null>(null);
  const [editing, setEditing] = useState<Result | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('results').select('*').order('sort_order');
    setRows(data ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => r.label.toLowerCase().includes(q));
  }, [rows, search]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (editing) await supabase.from('results').update(payload).eq('id', editing.id);
    else await supabase.from('results').insert(payload);
    setSaving(false);
    setFormOpen(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Results</h1>
        <button type="button" className="admin-btn-primary" onClick={() => { setEditing(null); setForm(empty()); setFormOpen(true); }}>Add Result</button>
      </div>

      <DataTable
        columns={[
          { key: 'label', label: 'Label' },
          { key: 'category', label: 'Category' },
          { key: 'is_published', label: 'Published', render: (r) => (r.is_published ? 'Yes' : 'No') },
        ]}
        rows={filtered}
        search={search}
        onSearchChange={setSearch}
        onEdit={(r) => { setEditing(r); setForm({ label: r.label, before_url: r.before_url, after_url: r.after_url, duration: r.duration, category: r.category, sort_order: r.sort_order, is_published: r.is_published }); setFormOpen(true); }}
        onDelete={setDeleteTarget}
      />

      <CrudForm title={editing ? 'Edit Result' : 'Add Result'} open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSave} saving={saving}>
        <FormField label="Label"><input className="admin-input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required /></FormField>
        <FormField label="Category">
          <select className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as 'skin' | 'hair' })}>
            <option value="skin">Skin</option>
            <option value="hair">Hair</option>
          </select>
        </FormField>
        <FormField label="Before Image"><ImageUpload folder="results" value={form.before_url} onChange={(url) => setForm({ ...form, before_url: url })} /></FormField>
        <FormField label="After Image"><ImageUpload folder="results" value={form.after_url} onChange={(url) => setForm({ ...form, after_url: url })} /></FormField>
        <FormField label="Duration"><input className="admin-input" value={form.duration ?? ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></FormField>
        <FormField label="Sort Order"><input type="number" className="admin-input" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></FormField>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
      </CrudForm>

      <ConfirmDelete open={!!deleteTarget} title="Delete result?" message={`Remove "${deleteTarget?.label}"?`} onConfirm={async () => { if (deleteTarget) { await supabase.from('results').delete().eq('id', deleteTarget.id); setDeleteTarget(null); load(); } }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
