import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/DataTable';
import CrudForm, { FormField } from '@/components/CrudForm';
import ConfirmDelete from '@/components/ConfirmDelete';
import ImageUpload from '@/components/ImageUpload';

type GalleryItem = {
  id: string;
  image_url: string;
  label: string;
  tag: string | null;
  is_tall: boolean;
  sort_order: number;
  is_published: boolean;
};

const empty = (): Omit<GalleryItem, 'id'> => ({
  image_url: '',
  label: '',
  tag: '',
  is_tall: false,
  sort_order: 0,
  is_published: true,
});

export default function GalleryManager() {
  const [rows, setRows] = useState<GalleryItem[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('sort_order');
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
    if (editing) await supabase.from('gallery_items').update(payload).eq('id', editing.id);
    else await supabase.from('gallery_items').insert(payload);
    setSaving(false);
    setFormOpen(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Gallery</h1>
        <button type="button" className="admin-btn-primary" onClick={() => { setEditing(null); setForm(empty()); setFormOpen(true); }}>Add Image</button>
      </div>

      <DataTable
        columns={[
          { key: 'label', label: 'Label' },
          { key: 'tag', label: 'Tag' },
          { key: 'is_tall', label: 'Tall', render: (r) => (r.is_tall ? 'Yes' : 'No') },
        ]}
        rows={filtered}
        search={search}
        onSearchChange={setSearch}
        onEdit={(r) => { setEditing(r); setForm({ image_url: r.image_url, label: r.label, tag: r.tag, is_tall: r.is_tall, sort_order: r.sort_order, is_published: r.is_published }); setFormOpen(true); }}
        onDelete={setDeleteTarget}
      />

      <CrudForm title={editing ? 'Edit Gallery Item' : 'Add Gallery Item'} open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSave} saving={saving}>
        <FormField label="Label"><input className="admin-input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required /></FormField>
        <FormField label="Tag"><input className="admin-input" value={form.tag ?? ''} onChange={(e) => setForm({ ...form, tag: e.target.value })} /></FormField>
        <FormField label="Image"><ImageUpload folder="gallery" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} /></FormField>
        <FormField label="Sort Order"><input type="number" className="admin-input" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></FormField>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_tall} onChange={(e) => setForm({ ...form, is_tall: e.target.checked })} />Tall cell (avoid for hair images)</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
      </CrudForm>

      <ConfirmDelete open={!!deleteTarget} title="Delete gallery item?" message={`Remove "${deleteTarget?.label}"?`} onConfirm={async () => { if (deleteTarget) { await supabase.from('gallery_items').delete().eq('id', deleteTarget.id); setDeleteTarget(null); load(); } }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
