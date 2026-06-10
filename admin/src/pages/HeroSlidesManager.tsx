import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/DataTable';
import CrudForm, { FormField } from '@/components/CrudForm';
import ConfirmDelete from '@/components/ConfirmDelete';
import ImageUpload from '@/components/ImageUpload';

type HeroSlide = {
  id: string;
  image_url: string;
  alt: string | null;
  sort_order: number;
  is_published: boolean;
};

const empty = (): Omit<HeroSlide, 'id'> => ({
  image_url: '',
  alt: '',
  sort_order: 0,
  is_published: true,
});

export default function HeroSlidesManager() {
  const [rows, setRows] = useState<HeroSlide[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('hero_slides').select('*').order('sort_order');
    setRows(data ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => rows.filter((r) => (r.alt ?? '').toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (editing) await supabase.from('hero_slides').update(payload).eq('id', editing.id);
    else await supabase.from('hero_slides').insert(payload);
    setSaving(false);
    setFormOpen(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Hero Slides</h1>
        <button type="button" className="admin-btn-primary" onClick={() => { setEditing(null); setForm(empty()); setFormOpen(true); }}>Add Slide</button>
      </div>

      <DataTable
        columns={[
          { key: 'alt', label: 'Alt Text' },
          { key: 'sort_order', label: 'Order' },
          { key: 'is_published', label: 'Published', render: (r) => (r.is_published ? 'Yes' : 'No') },
        ]}
        rows={filtered}
        search={search}
        onSearchChange={setSearch}
        onEdit={(r) => { setEditing(r); setForm({ image_url: r.image_url, alt: r.alt, sort_order: r.sort_order, is_published: r.is_published }); setFormOpen(true); }}
        onDelete={setDeleteTarget}
      />

      <CrudForm title={editing ? 'Edit Slide' : 'Add Slide'} open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSave} saving={saving}>
        <FormField label="Image"><ImageUpload folder="hero" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} /></FormField>
        <FormField label="Alt Text"><input className="admin-input" value={form.alt ?? ''} onChange={(e) => setForm({ ...form, alt: e.target.value })} /></FormField>
        <FormField label="Sort Order"><input type="number" className="admin-input" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></FormField>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
      </CrudForm>

      <ConfirmDelete open={!!deleteTarget} title="Delete slide?" message="Remove this hero slide?" onConfirm={async () => { if (deleteTarget) { await supabase.from('hero_slides').delete().eq('id', deleteTarget.id); setDeleteTarget(null); load(); } }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
