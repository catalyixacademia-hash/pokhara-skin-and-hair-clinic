import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [rows, setRows] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setRows(data ?? []));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.treatment.toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Appointments</h1>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'treatment', label: 'Treatment' },
          { key: 'status', label: 'Status', render: (r) => <span className="capitalize">{r.status}</span> },
          {
            key: 'created_at',
            label: 'Submitted',
            render: (r) => new Date(r.created_at).toLocaleDateString(),
          },
        ]}
        rows={filtered}
        search={search}
        onSearchChange={setSearch}
        onEdit={(r) => window.location.assign(`/appointments/${r.id}`)}
        onDelete={async (r) => {
          if (!confirm('Delete this appointment?')) return;
          await supabase.from('appointments').delete().eq('id', r.id);
          setRows((prev) => prev.filter((x) => x.id !== r.id));
        }}
        extraActions={(r) => (
          <Link to={`/appointments/${r.id}`} className="admin-btn-secondary text-[10px] py-1 px-2">
            View
          </Link>
        )}
      />
    </div>
  );
}
