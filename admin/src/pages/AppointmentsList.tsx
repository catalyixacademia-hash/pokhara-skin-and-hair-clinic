import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/DataTable';

type Appointment = {
  id: string;
  name: string;
  phone: string;
  treatment: string;
  status: string;
  preferred_date: string | null;
  created_at: string;
};

export default function AppointmentsList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('appointments')
      .select('id, name, phone, treatment, status, preferred_date, created_at')
      .order('created_at', { ascending: false });
    if (fetchError) setError(fetchError.message);
    else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.treatment.toLowerCase().includes(q),
    );
  }, [rows, search]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl">Booking forms</h1>
          <p className="text-sm text-warm-gray mt-1">
            Patient appointment requests from the website contact form.
          </p>
        </div>
        <Link to="/bookings/new" className="admin-btn-primary">
          Add booking
        </Link>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-warm-gray">Loading bookings…</p>
      ) : (
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'treatment', label: 'Treatment' },
            {
              key: 'status',
              label: 'Status',
              render: (r) => <span className="capitalize">{r.status}</span>,
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
          onEdit={(r) => navigate(`/bookings/${r.id}/edit`)}
          onDelete={async (r) => {
            if (!confirm(`Delete booking for ${r.name}?`)) return;
            const { error: deleteError } = await supabase.from('appointments').delete().eq('id', r.id);
            if (deleteError) {
              alert(deleteError.message);
              return;
            }
            setRows((prev) => prev.filter((x) => x.id !== r.id));
          }}
          extraActions={(r) => (
            <Link to={`/bookings/${r.id}`} className="admin-btn-secondary text-[10px] py-3 px-2">
              View
            </Link>
          )}
        />
      )}
    </div>
  );
}
