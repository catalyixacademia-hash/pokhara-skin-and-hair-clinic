import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mutationResult } from '@/lib/supabase-result';
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
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('gallery_items')
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error: saveError } = editing
      ? await supabase.from('gallery_items').update(payload).eq('id', editing.id)
      : await supabase.from('gallery_items').insert(payload);
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
    setError(null);
    const { error: deleteError } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', deleteTarget.id);
    const result = mutationResult(deleteError);
    setDeleteTarget(null);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    void load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Gallery</h1>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => {
            setEditing(null);
            setForm(empty());
            setError(null);
            setFormOpen(true);
          }}
        >
          Add Image
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <DataTable
        columns={[
          { key: 'label', label: 'Label' },
          { key: 'tag', label: 'Tag' },
          { key: 'is_tall', label: 'Tall', render: (r) => (r.is_tall ? 'Yes' : 'No') },
        ]}
        rows={filtered}
        search={search}
        onSearchChange={setSearch}
        onEdit={(r) => {
          setEditing(r);
          setForm({
            image_url: r.image_url,
            label: r.label,
            tag: r.tag,
            is_tall: r.is_tall,
            sort_order: r.sort_order,
            is_published: r.is_published,
          });
          setError(null);
          setFormOpen(true);
        }}
        onDelete={setDeleteTarget}
      />

      <CrudForm
        title={editing ? 'Edit Gallery Item' : 'Add Gallery Item'}
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
          />
        </FormField>
        <FormField label="Tag">
          <input
            className="admin-input"
            value={form.tag ?? ''}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
          />
        </FormField>
        <FormField label="Image">
          <ImageUpload
            folder="gallery"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
          />
        </FormField>
        <FormField label="Sort Order">
          <input
            type="number"
            className="admin-input"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_tall}
            onChange={(e) => setForm({ ...form, is_tall: e.target.checked })}
          />
          Tall cell (avoid for hair images)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          Published
        </label>
      </CrudForm>

      <ConfirmDelete
        open={!!deleteTarget}
        title="Delete gallery item?"
        message={`Remove "${deleteTarget?.label}"?`}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
