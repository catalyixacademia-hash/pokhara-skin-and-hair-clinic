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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('form_type', formType)
      .order('created_at', { ascending: false });
    if (fetchError) setError(fetchError.message);
    else setRows((data ?? []) as Submission[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();

    const channel = supabase
      .channel(`submissions-${formType}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [formType]);

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
      const base = [
        r.name,
        r.phone,
        r.email ?? '',
        r.treatment,
      ];
      if (formType === 'booking') {
        base.push(r.preferred_date ?? '');
      }
      base.push(
        r.status,
        new Date(r.created_at).toLocaleString(),
        r.message ?? '',
      );
      return base;
    });

    downloadCsv(`${formType}-export.csv`, headers, data);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', deleteTarget.id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      setRows((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    }
    setDeleting(false);
    setDeleteTarget(null);
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
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        <p className="text-sm text-muted mt-1">{description}</p>
      </div>

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

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-muted">Loading…</p>
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
        title="Delete submission?"
        message={`Delete submission from ${deleteTarget?.name}? This cannot be undone.`}
        deleting={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
