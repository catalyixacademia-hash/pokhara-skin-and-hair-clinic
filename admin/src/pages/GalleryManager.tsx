import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mutationResult } from '@/lib/supabase-result';
import { useRefetchOnFocus } from '@/hooks/useRefetchOnFocus';
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

const STORAGE =
  'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/gallery';

/** Same clinic photos shown in the public “Inside the clinic” section. */
const CLINIC_SEED: Omit<GalleryItem, 'id'>[] = [
  {
    image_url: `${STORAGE}/interior-waiting.webp`,
    label: 'Reception & waiting',
    tag: 'Clinic',
    is_tall: false,
    sort_order: 1,
    is_published: true,
  },
  {
    image_url: `${STORAGE}/welcome-board.webp`,
    label: 'Welcome — coffee & cookies corner',
    tag: 'Visit',
    is_tall: true,
    sort_order: 2,
    is_published: true,
  },
];

const empty = (nextSort = 10): Omit<GalleryItem, 'id'> => ({
  image_url: '',
  label: '',
  tag: '',
  is_tall: false,
  sort_order: nextSort,
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
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

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

  useRefetchOnFocus(() => {
    void load();
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => r.label.toLowerCase().includes(q));
  }, [rows, search]);

  const nextSortOrder = useMemo(() => {
    if (rows.length === 0) return 10;
    return Math.max(...rows.map((r) => r.sort_order)) + 1;
  }, [rows]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url.trim()) {
      setError('Image is required.');
      return;
    }
    if (!form.label.trim()) {
      setError('Label is required.');
      return;
    }
    setSaving(true);
    setError(null);
    setInfo(null);
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
    setInfo(null);
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

  const handleSeedClinicPhotos = async () => {
    setSeeding(true);
    setError(null);
    setInfo(null);
    let inserted = 0;
    let updated = 0;

    for (const seed of CLINIC_SEED) {
      const existing = rows.find((r) => r.label.toLowerCase() === seed.label.toLowerCase());
      if (existing) {
        const { error: updateError } = await supabase
          .from('gallery_items')
          .update({ ...seed, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (updateError) {
          setError(updateError.message);
          setSeeding(false);
          return;
        }
        updated += 1;
      } else {
        const { error: insertError } = await supabase.from('gallery_items').insert(seed);
        if (insertError) {
          setError(insertError.message);
          setSeeding(false);
          return;
        }
        inserted += 1;
      }
    }

    setSeeding(false);
    setInfo(
      inserted || updated
        ? `Clinic photos ready (${inserted} added, ${updated} refreshed). Published items appear in “Inside the clinic”.`
        : 'Clinic photos already present.',
    );
    void load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="font-serif text-3xl">Gallery</h1>
          <p className="text-sm text-muted mt-1 max-w-xl">
            Photos shown in the public “Inside the clinic” grid. Add images here; published
            rows appear on the website in sort order.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="admin-btn-secondary"
            disabled={seeding}
            onClick={() => void handleSeedClinicPhotos()}
          >
            {seeding ? 'Seeding…' : 'Restore clinic photos'}
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => {
              setEditing(null);
              setForm(empty(nextSortOrder));
              setError(null);
              setInfo(null);
              setFormOpen(true);
            }}
          >
            Add Image
          </button>
        </div>
      </div>

      {info && (
        <p className="text-sm text-ink mb-4" role="status">
          {info}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <DataTable
        columns={[
          {
            key: 'image_url',
            label: 'Preview',
            render: (r) =>
              r.image_url ? (
                <a
                  href={r.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-14 h-14 rounded-md overflow-hidden border border-border bg-muted/30 shrink-0"
                  title="Open full image"
                >
                  <img
                    src={r.image_url}
                    alt={r.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </a>
              ) : (
                <span className="inline-flex w-14 h-14 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-muted">
                  None
                </span>
              ),
          },
          { key: 'label', label: 'Label' },
          { key: 'tag', label: 'Tag' },
          {
            key: 'is_published',
            label: 'Published',
            render: (r) => (r.is_published ? 'Yes' : 'No'),
          },
          { key: 'sort_order', label: 'Order' },
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
          setInfo(null);
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
        error={error}
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
            placeholder="Clinic, Visit, Treatment…"
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
          Tall cell (taller crop on the public grid)
        </label>
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
        title="Delete gallery item?"
        message={`Remove "${deleteTarget?.label}"?`}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
