import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/DataTable';
import CrudForm, { FormField } from '@/components/CrudForm';
import ConfirmDelete from '@/components/ConfirmDelete';

type Testimonial = {
  id: string;
  name: string;
  location: string | null;
  treatment: string;
  rating: number;
  quote: string;
  initial: string | null;
  sort_order: number;
  is_published: boolean;
};

const empty = (): Omit<Testimonial, 'id'> => ({
  name: '',
  location: '',
  treatment: '',
  rating: 5,
  quote: '',
  initial: '',
  sort_order: 0,
  is_published: true,
});

export default function TestimonialsManager() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    setRows(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => r.name.toLowerCase().includes(q) || r.treatment.toLowerCase().includes(q));
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(empty());
    setFormOpen(true);
  };

  const openEdit = (row: Testimonial) => {
    setEditing(row);
    setForm({
      name: row.name,
      location: row.location,
      treatment: row.treatment,
      rating: row.rating,
      quote: row.quote,
      initial: row.initial,
      sort_order: row.sort_order,
      is_published: row.is_published,
    });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (editing) {
      await supabase.from('testimonials').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('testimonials').insert(payload);
    }
    setSaving(false);
    setFormOpen(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Testimonials</h1>
        <button type="button" className="admin-btn-primary" onClick={openCreate}>
          Add Testimonial
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'treatment', label: 'Treatment' },
          { key: 'rating', label: 'Rating' },
          { key: 'is_published', label: 'Published', render: (r) => (r.is_published ? 'Yes' : 'No') },
        ]}
        rows={filtered}
        search={search}
        onSearchChange={setSearch}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <CrudForm title={editing ? 'Edit Testimonial' : 'Add Testimonial'} open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSave} saving={saving}>
        <FormField label="Name"><input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Location"><input className="admin-input" value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
        <FormField label="Treatment"><input className="admin-input" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} required /></FormField>
        <FormField label="Rating"><input type="number" min={1} max={5} className="admin-input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></FormField>
        <FormField label="Initial"><input className="admin-input max-w-[4rem]" maxLength={1} value={form.initial ?? ''} onChange={(e) => setForm({ ...form, initial: e.target.value })} /></FormField>
        <FormField label="Quote"><textarea className="admin-input min-h-32" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required /></FormField>
        <FormField label="Sort Order"><input type="number" className="admin-input" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></FormField>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
      </CrudForm>

      <ConfirmDelete open={!!deleteTarget} title="Delete testimonial?" message={`Remove "${deleteTarget?.name}"?`} onConfirm={async () => { if (deleteTarget) { await supabase.from('testimonials').delete().eq('id', deleteTarget.id); setDeleteTarget(null); load(); } }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
