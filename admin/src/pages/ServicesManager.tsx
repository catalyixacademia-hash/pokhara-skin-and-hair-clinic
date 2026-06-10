import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/DataTable';
import CrudForm, { FormField } from '@/components/CrudForm';
import ConfirmDelete from '@/components/ConfirmDelete';
import ImageUpload from '@/components/ImageUpload';

type Category = { id: string; slug: string; label: string };

type Service = {
  id: string;
  category_id: string;
  title: string;
  description: string;
  benefits: string[];
  result: string;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  is_published: boolean;
};

const emptyForm = (): Omit<Service, 'id'> => ({
  category_id: '',
  title: '',
  description: '',
  benefits: [],
  result: '',
  image_url: null,
  featured: false,
  sort_order: 0,
  is_published: true,
});

export default function ServicesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rows, setRows] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [benefitsText, setBenefitsText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [{ data: cats }, { data: services }] = await Promise.all([
      supabase.from('service_categories').select('*').order('sort_order'),
      supabase.from('services').select('*').order('sort_order'),
    ]);
    setCategories(cats ?? []);
    setRows((services ?? []).map((s) => ({ ...s, benefits: s.benefits as string[] })));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => r.title.toLowerCase().includes(q));
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm(), category_id: categories[0]?.id ?? '' });
    setBenefitsText('');
    setFormOpen(true);
  };

  const openEdit = (row: Service) => {
    setEditing(row);
    setForm({
      category_id: row.category_id,
      title: row.title,
      description: row.description,
      benefits: row.benefits,
      result: row.result,
      image_url: row.image_url,
      featured: row.featured,
      sort_order: row.sort_order,
      is_published: row.is_published,
    });
    setBenefitsText(row.benefits.join('\n'));
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      benefits: benefitsText.split('\n').map((b) => b.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      await supabase.from('services').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('services').insert(payload);
    }

    setSaving(false);
    setFormOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    await supabase.from('services').delete().eq('id', deleteTarget.id);
    setSaving(false);
    setDeleteTarget(null);
    load();
  };

  const togglePublish = async (row: Service) => {
    await supabase.from('services').update({ is_published: !row.is_published }).eq('id', row.id);
    load();
  };

  const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.slug ?? id;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Services</h1>
        <button type="button" className="admin-btn-primary" onClick={openCreate}>
          Add Service
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'category_id', label: 'Category', render: (r) => categoryLabel(r.category_id) },
          { key: 'featured', label: 'Featured', render: (r) => (r.featured ? 'Yes' : 'No') },
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
        extraActions={(r) => (
          <button type="button" className="admin-btn-secondary text-[10px] py-1 px-2" onClick={() => togglePublish(r)}>
            {r.is_published ? 'Unpublish' : 'Publish'}
          </button>
        )}
      />

      <CrudForm
        title={editing ? 'Edit Service' : 'Add Service'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        saving={saving}
      >
        <FormField label="Category">
          <select
            className="admin-input"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Title">
          <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </FormField>
        <FormField label="Description">
          <textarea className="admin-input min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </FormField>
        <FormField label="Benefits (one per line)">
          <textarea className="admin-input min-h-20" value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} />
        </FormField>
        <FormField label="Result">
          <input className="admin-input" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} required />
        </FormField>
        <FormField label="Image">
          <ImageUpload folder="services" value={form.image_url ?? ''} onChange={(url) => setForm({ ...form, image_url: url })} />
        </FormField>
        <FormField label="Sort Order">
          <input type="number" className="admin-input" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured (skin row)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Published
        </label>
      </CrudForm>

      <ConfirmDelete
        open={!!deleteTarget}
        title="Delete service?"
        message={`Remove "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        deleting={saving}
      />
    </div>
  );
}
