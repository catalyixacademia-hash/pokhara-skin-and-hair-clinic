import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import ConfirmDelete from '@/components/ConfirmDelete';
import { downloadCsv } from '@/lib/export-csv';
import { formatPreferredDate, phoneHref } from '@/lib/contact-links';
import type { FormType, Submission, SubmissionStatus } from '@/types/submission';
import { listBasePath } from '@/types/submission';

type SubmissionsListProps = {
  formType: FormType;
  title: string;
  description: string;
  topicLabel: string;
};

const STATUS_FILTERS: Array<{ value: 'all' | SubmissionStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

type CreateDraft = {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  preferred_date: string;
  message: string;
  status: SubmissionStatus;
};

const emptyDraft = (): CreateDraft => ({
  name: '',
  phone: '',
  email: '',
  treatment: '',
  preferred_date: '',
  message: '',
  status: 'pending',
});

export default function SubmissionsList({
  formType,
  title,
  description,
  topicLabel,
}: SubmissionsListProps) {
  const navigate = useNavigate();
  const basePath = listBasePath(formType);
  const [rows, setRows] = useState<Submission[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all');
  const [showTrash, setShowTrash] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState<CreateDraft>(emptyDraft);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from('appointments')
      .select('*')
      .eq('form_type', formType)
      .order('created_at', { ascending: false });

    query = showTrash ? query.not('deleted_at', 'is', null) : query.is('deleted_at', null);

    const { data, error: fetchError } = await query;
    if (fetchError) setError(fetchError.message);
    else setRows((data ?? []) as Submission[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();

    const channel = supabase
      .channel(`submissions-${formType}-${showTrash ? 'trash' : 'active'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [formType, showTrash]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return (
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.treatment.toLowerCase().includes(q) ||
        (r.message?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, search, statusFilter]);

  const exportRows = () => {
    const headers =
      formType === 'booking'
        ? ['Name', 'Phone', 'Email', topicLabel, 'Preferred date', 'Status', 'Submitted', 'Message']
        : ['Name', 'Phone', 'Email', topicLabel, 'Status', 'Submitted', 'Message'];

    const data = filtered.map((r) => {
      const base = [r.name, r.phone, r.email ?? '', r.treatment];
      if (formType === 'booking') {
        base.push(r.preferred_date ?? '');
      }
      base.push(r.status, new Date(r.created_at).toLocaleString(), r.message ?? '');
      return base;
    });

    downloadCsv(`${formType}-export.csv`, headers, data);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from('appointments')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', deleteTarget.id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      setRows((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const handleRestore = async (row: Submission) => {
    setError(null);
    const { error: restoreError } = await supabase
      .from('appointments')
      .update({ deleted_at: null, updated_at: new Date().toISOString() })
      .eq('id', row.id);
    if (restoreError) setError(restoreError.message);
    else setRows((prev) => prev.filter((x) => x.id !== row.id));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || !draft.phone.trim() || !draft.treatment.trim()) {
      setError(`${topicLabel}, name, and phone are required.`);
      return;
    }
    setCreating(true);
    setError(null);
    const { data, error: insertError } = await supabase
      .from('appointments')
      .insert({
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        email: draft.email.trim() || null,
        treatment: draft.treatment.trim(),
        preferred_date:
          formType === 'booking' && draft.preferred_date ? draft.preferred_date : null,
        message: draft.message.trim() || null,
        status: draft.status,
        form_type: formType,
        internal_notes: 'Created by staff (walk-in / phone).',
      })
      .select('id')
      .maybeSingle();

    setCreating(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setCreateOpen(false);
    setDraft(emptyDraft());
    if (data?.id) navigate(`${basePath}/${data.id}`);
    else void load();
  };

  const columns =
    formType === 'booking'
      ? [
          { key: 'name', label: 'Name' },
          {
            key: 'phone',
            label: 'Phone',
            render: (r: Submission) => (
              <a href={phoneHref(r.phone)} className="admin-link">
                {r.phone}
              </a>
            ),
          },
          { key: 'treatment', label: topicLabel },
          {
            key: 'preferred_date',
            label: 'Preferred date',
            render: (r: Submission) => formatPreferredDate(r.preferred_date),
          },
          {
            key: 'status',
            label: 'Status',
            render: (r: Submission) => <StatusBadge status={r.status} />,
          },
          {
            key: 'created_at',
            label: 'Submitted',
            render: (r: Submission) => new Date(r.created_at).toLocaleDateString(),
          },
        ]
      : [
          { key: 'name', label: 'Name' },
          {
            key: 'phone',
            label: 'Phone',
            render: (r: Submission) => (
              <a href={phoneHref(r.phone)} className="admin-link">
                {r.phone}
              </a>
            ),
          },
          { key: 'treatment', label: topicLabel },
          {
            key: 'status',
            label: 'Status',
            render: (r: Submission) => <StatusBadge status={r.status} />,
          },
          {
            key: 'created_at',
            label: 'Submitted',
            render: (r: Submission) => new Date(r.created_at).toLocaleDateString(),
          },
        ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">{title}</h1>
          <p className="text-sm text-muted mt-1">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={showTrash ? 'admin-btn-secondary' : 'admin-btn-primary'}
            onClick={() => {
              setShowTrash(false);
              setStatusFilter('all');
            }}
          >
            Inbox
          </button>
          <button
            type="button"
            className={showTrash ? 'admin-btn-primary' : 'admin-btn-secondary'}
            onClick={() => {
              setShowTrash(true);
              setStatusFilter('all');
            }}
          >
            Trash
          </button>
          {!showTrash && (
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => {
                setCreateOpen(true);
                setError(null);
              }}
            >
              {formType === 'booking' ? 'Add booking' : 'Add enquiry'}
            </button>
          )}
        </div>
      </div>

      {!showTrash && (
        <div className="flex flex-wrap gap-2 mb-4">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={statusFilter === item.value ? 'admin-btn-primary' : 'admin-btn-secondary'}
              onClick={() => setStatusFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : showTrash ? (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-muted">Trash is empty.</p>
          ) : (
            filtered.map((r) => (
              <article key={r.id} className="admin-card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{r.name}</p>
                  <p className="text-sm text-muted">
                    {r.treatment} · {r.phone}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Hidden {r.deleted_at ? new Date(r.deleted_at).toLocaleString() : '—'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="admin-btn-secondary text-xs py-1.5 px-3"
                    onClick={() => navigate(`${basePath}/${r.id}`)}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="admin-btn-primary text-xs py-1.5 px-3"
                    onClick={() => void handleRestore(r)}
                  >
                    Restore
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          search={search}
          onSearchChange={setSearch}
          onView={(r) => navigate(`${basePath}/${r.id}`)}
          onDelete={setDeleteTarget}
          toolbar={
            <button type="button" className="admin-btn-secondary" onClick={exportRows}>
              Export CSV
            </button>
          }
        />
      )}

      <ConfirmDelete
        open={!!deleteTarget}
        title="Remove submission?"
        message={`Remove submission from ${deleteTarget?.name}? It will move to Trash (soft-delete).`}
        deleting={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <form
            onSubmit={(e) => void handleCreate(e)}
            className="admin-card w-full max-w-lg space-y-3 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-serif text-xl text-ink">
              {formType === 'booking' ? 'Add booking' : 'Add enquiry'}
            </h2>
            <p className="text-sm text-muted">For walk-ins or phone requests taken by staff.</p>
            <div>
              <label className="admin-label">Name *</label>
              <input
                className="admin-input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="admin-label">Phone *</label>
              <input
                className="admin-input"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="admin-label">Email</label>
              <input
                className="admin-input"
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">{topicLabel} *</label>
              <input
                className="admin-input"
                value={draft.treatment}
                onChange={(e) => setDraft({ ...draft, treatment: e.target.value })}
                required
              />
            </div>
            {formType === 'booking' && (
              <div>
                <label className="admin-label">Preferred date</label>
                <input
                  className="admin-input"
                  type="date"
                  value={draft.preferred_date}
                  onChange={(e) => setDraft({ ...draft, preferred_date: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="admin-label">Message</label>
              <textarea
                className="admin-input min-h-20"
                value={draft.message}
                onChange={(e) => setDraft({ ...draft, message: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Status</label>
              <select
                className="admin-input"
                value={draft.status}
                onChange={(e) =>
                  setDraft({ ...draft, status: e.target.value as SubmissionStatus })
                }
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="admin-btn-primary" disabled={creating}>
                {creating ? 'Saving…' : 'Create'}
              </button>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  setCreateOpen(false);
                  setDraft(emptyDraft());
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
