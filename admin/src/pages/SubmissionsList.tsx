import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import type { FormType, Submission } from '@/types/submission';
import { listBasePath } from '@/types/submission';

type SubmissionsListProps = {
  formType: FormType;
  title: string;
  description: string;
  topicLabel: string;
};

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [formType]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.treatment.toLowerCase().includes(q) ||
        (r.message?.toLowerCase().includes(q) ?? false),
    );
  }, [rows, search]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        <p className="text-sm text-muted mt-1">{description}</p>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'treatment', label: topicLabel },
            {
              key: 'status',
              label: 'Status',
              render: (r) => <StatusBadge status={r.status} />,
            },
            {
              key: 'created_at',
              label: 'Submitted',
              render: (r) => new Date(r.created_at).toLocaleDateString(),
            },
          ]}
          rows={filtered}
          search={search}
          onSearchChange={setSearch}
          onView={(r) => navigate(`${basePath}/${r.id}`)}
          onDelete={async (r) => {
            if (!confirm(`Delete submission from ${r.name}?`)) return;
            const { error: deleteError } = await supabase.from('appointments').delete().eq('id', r.id);
            if (deleteError) {
              alert(deleteError.message);
              return;
            }
            setRows((prev) => prev.filter((x) => x.id !== r.id));
          }}
        />
      )}
    </div>
  );
}
