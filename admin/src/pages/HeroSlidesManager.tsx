import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mutationResult } from '@/lib/supabase-result';
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
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('hero_slides')
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

  const filtered = useMemo(
    () => rows.filter((r) => (r.alt ?? '').toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error: saveError } = editing
      ? await supabase.from('hero_slides').update(payload).eq('id', editing.id)
      : await supabase.from('hero_slides').insert(payload);
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
      .from('hero_slides')
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
        <h1 className="font-serif text-3xl">Hero Slides</h1>
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
          Add Slide
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <DataTable
        columns={[
          { key: 'alt', label: 'Alt Text' },
          { key: 'sort_order', label: 'Order' },
          { key: 'is_published', label: 'Published', render: (r) => (r.is_published ? 'Yes' : 'No') },
        ]}
        rows={filtered}
        search={search}
        onSearchChange={setSearch}
        onEdit={(r) => {
          setEditing(r);
          setForm({
            image_url: r.image_url,
            alt: r.alt,
            sort_order: r.sort_order,
            is_published: r.is_published,
          });
          setError(null);
          setFormOpen(true);
        }}
        onDelete={setDeleteTarget}
      />

      <CrudForm
        title={editing ? 'Edit Slide' : 'Add Slide'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(e) => void handleSave(e)}
        saving={saving}
      >
        <FormField label="Image">
          <ImageUpload
            folder="hero"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
          />
        </FormField>
        <FormField label="Alt Text">
          <input
            className="admin-input"
            value={form.alt ?? ''}
            onChange={(e) => setForm({ ...form, alt: e.target.value })}
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
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          Published
        </label>
      </CrudForm>

      <ConfirmDelete
        open={!!deleteTarget}
        title="Delete slide?"
        message="Remove this hero slide?"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
