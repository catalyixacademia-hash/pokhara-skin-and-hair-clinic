import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mutationResult } from '@/lib/supabase-result';
import { useRefetchOnFocus } from '@/hooks/useRefetchOnFocus';
import DataTable from '@/components/DataTable';
import CrudForm, { FormField } from '@/components/CrudForm';
import ConfirmDelete from '@/components/ConfirmDelete';
import ImageUpload from '@/components/ImageUpload';

type Credential = { label: string; value: string };

type DoctorRow = {
  id: string;
  numericId: number;
  name: string;
  title: string;
  title_short: string;
  bio: string[];
  credentials: Credential[];
  portrait_url: string | null;
  pull_quote: string;
  sort_order: number;
  is_published: boolean;
};

type DoctorForm = Omit<DoctorRow, 'id' | 'numericId'>;

const emptyCredentials = (): Credential[] => [{ label: '', value: '' }];

const emptyForm = (sortOrder = 0): DoctorForm => ({
  name: '',
  title: '',
  title_short: '',
  bio: [],
  credentials: emptyCredentials(),
  portrait_url: null,
  pull_quote: '',
  sort_order: sortOrder,
  is_published: true,
});

function normalizeCredentials(raw: unknown): Credential[] {
  if (!Array.isArray(raw) || raw.length === 0) return emptyCredentials();
  return raw.map((item) => {
    if (item && typeof item === 'object' && 'label' in item && 'value' in item) {
      const row = item as Credential;
      return { label: String(row.label ?? ''), value: String(row.value ?? '') };
    }
    return { label: '', value: '' };
  });
}

function nmcValue(credentials: Credential[]): string {
  const nmc = credentials.find((c) => /nmc/i.test(c.label));
  return nmc?.value || '—';
}

export default function DoctorProfile() {
  const [rows, setRows] = useState<DoctorRow[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DoctorRow | null>(null);
  const [editing, setEditing] = useState<DoctorRow | null>(null);
  const [form, setForm] = useState<DoctorForm>(emptyForm());
  const [bioText, setBioText] = useState('');
  const [credentials, setCredentials] = useState<Credential[]>(emptyCredentials());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('doctor_profile')
      .select('*')
      .order('id');
    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setError(null);
    setRows(
      (data ?? []).map((row) => ({
        id: String(row.id),
        numericId: Number(row.id),
        name: String(row.name ?? ''),
        title: String(row.title ?? ''),
        title_short: String(row.title_short ?? ''),
        bio: Array.isArray(row.bio) ? (row.bio as string[]) : [],
        credentials: normalizeCredentials(row.credentials),
        portrait_url: typeof row.portrait_url === 'string' ? row.portrait_url : null,
        pull_quote: typeof row.pull_quote === 'string' ? row.pull_quote : '',
        sort_order: Number(row.sort_order ?? 0),
        is_published: row.is_published !== false,
      })),
    );
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useRefetchOnFocus(() => {
    void load();
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) => r.name.toLowerCase().includes(q) || r.title.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const openCreate = () => {
    const nextSort = rows.reduce((max, row) => Math.max(max, row.sort_order), 0) + 1;
    setEditing(null);
    setForm(emptyForm(nextSort));
    setBioText('');
    setCredentials(emptyCredentials());
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (row: DoctorRow) => {
    setEditing(row);
    setForm({
      name: row.name,
      title: row.title,
      title_short: row.title_short,
      bio: row.bio,
      credentials: row.credentials,
      portrait_url: row.portrait_url,
      pull_quote: row.pull_quote,
      sort_order: row.sort_order,
      is_published: row.is_published,
    });
    setBioText((row.bio ?? []).join('\n\n'));
    setCredentials(normalizeCredentials(row.credentials));
    setError(null);
    setFormOpen(true);
  };

  const updateCredential = (index: number, field: keyof Credential, value: string) => {
    setCredentials((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.title.trim()) {
      setError('Name and title are required.');
      return;
    }

    const cleanedCredentials = credentials
      .map((c) => ({ label: c.label.trim(), value: c.value.trim() }))
      .filter((c) => c.label || c.value);

    if (cleanedCredentials.some((c) => !c.label || !c.value)) {
      setError('Each credential needs both a label and a value.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      title_short: form.title_short.trim(),
      bio: bioText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean),
      credentials: cleanedCredentials,
      portrait_url: form.portrait_url,
      pull_quote: form.pull_quote.trim() || null,
      sort_order: form.sort_order,
      is_published: form.is_published,
      updated_at: new Date().toISOString(),
    };

    let { error: saveError } = editing
      ? await supabase.from('doctor_profile').update(payload).eq('id', editing.numericId)
      : await supabase.from('doctor_profile').insert(payload);

    if (saveError && /pull_quote|sort_order|is_published/i.test(saveError.message)) {
      const legacy = {
        name: payload.name,
        title: payload.title,
        title_short: payload.title_short,
        bio: payload.bio,
        credentials: payload.credentials,
        portrait_url: payload.portrait_url,
        updated_at: payload.updated_at,
      };
      const retry = editing
        ? await supabase.from('doctor_profile').update(legacy).eq('id', editing.numericId)
        : await supabase.from('doctor_profile').insert(legacy);
      saveError = retry.error;
    }

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
      .from('doctor_profile')
      .delete()
      .eq('id', deleteTarget.numericId);
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
        <div>
          <h1 className="font-serif text-3xl">Doctors</h1>
          <p className="text-sm text-muted mt-2 max-w-2xl">
            Profiles on the public Dermatology section. Keep NMC details accurate for each
            physician.
          </p>
        </div>
        <button type="button" className="admin-btn-primary" onClick={openCreate}>
          Add doctor
        </button>
      </div>

      {error && !formOpen && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <DataTable
        columns={[
          {
            key: 'portrait',
            label: 'Portrait',
            render: (r) =>
              r.portrait_url ? (
                <img
                  src={r.portrait_url}
                  alt=""
                  className="h-12 w-10 object-cover rounded-md bg-surface"
                />
              ) : (
                <span className="text-muted">—</span>
              ),
          },
          { key: 'name', label: 'Name' },
          { key: 'title', label: 'Title' },
          {
            key: 'nmc',
            label: 'NMC',
            render: (r) => nmcValue(r.credentials),
          },
          { key: 'sort_order', label: 'Sort' },
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
      />

      <CrudForm
        title={editing ? 'Edit doctor' : 'Add doctor'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(e) => void handleSave(e)}
        saving={saving}
        error={error}
      >
        <FormField label="Name">
          <input
            className="admin-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Title">
          <input
            className="admin-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Short title">
          <input
            className="admin-input"
            value={form.title_short}
            onChange={(e) => setForm({ ...form, title_short: e.target.value })}
          />
        </FormField>
        <FormField label="Pull quote">
          <textarea
            className="admin-input min-h-24"
            value={form.pull_quote}
            onChange={(e) => setForm({ ...form, pull_quote: e.target.value })}
          />
        </FormField>
        <FormField label="Bio (paragraphs separated by a blank line)">
          <textarea
            className="admin-input min-h-40"
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
          />
        </FormField>

        <fieldset className="space-y-3 border border-line rounded p-4">
          <legend className="text-sm font-medium text-ink px-1">Credentials</legend>
          {credentials.map((row, index) => (
            <div key={index} className="grid sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-end">
              <div>
                <label className="admin-label">Label</label>
                <input
                  className="admin-input"
                  value={row.label}
                  onChange={(e) => updateCredential(index, 'label', e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Value</label>
                <input
                  className="admin-input"
                  value={row.value}
                  onChange={(e) => updateCredential(index, 'value', e.target.value)}
                />
              </div>
              <button
                type="button"
                className="admin-btn-secondary text-xs py-2 px-3 mb-0.5"
                onClick={() => setCredentials((prev) => prev.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn-secondary text-xs"
            onClick={() => setCredentials((prev) => [...prev, { label: '', value: '' }])}
          >
            Add credential
          </button>
        </fieldset>

        <FormField label="Portrait">
          <ImageUpload
            folder="doctor"
            value={form.portrait_url ?? ''}
            onChange={(url) => setForm({ ...form, portrait_url: url || null })}
          />
        </FormField>
        <FormField label="Sort order">
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
        title="Delete doctor?"
        message={`Remove "${deleteTarget?.name}" from the website?`}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
