import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type Appointment = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  treatment: string;
  preferred_date: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
};

const statuses: Appointment['status'][] = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [row, setRow] = useState<Appointment | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setRow(data));
  }, [id]);

  const updateStatus = async (status: Appointment['status']) => {
    if (!id) return;
    setSaving(true);
    const { data } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (data) setRow(data);
    setSaving(false);
  };

  if (!row) {
    return (
      <div>
        <Link to="/appointments" className="text-sm text-bronze hover:underline">
          ← Back
        </Link>
        <p className="mt-4 text-warm-gray">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/appointments" className="text-sm text-bronze hover:underline">
        ← Back to appointments
      </Link>
      <h1 className="font-serif text-3xl mt-4 mb-6">{row.name}</h1>

      <div className="admin-card max-w-xl space-y-4">
        <div>
          <p className="admin-label">Phone</p>
          <p>{row.phone}</p>
        </div>
        {row.email && (
          <div>
            <p className="admin-label">Email</p>
            <p>{row.email}</p>
          </div>
        )}
        <div>
          <p className="admin-label">Treatment</p>
          <p>{row.treatment}</p>
        </div>
        {row.preferred_date && (
          <div>
            <p className="admin-label">Preferred Date</p>
            <p>{row.preferred_date}</p>
          </div>
        )}
        {row.message && (
          <div>
            <p className="admin-label">Message</p>
            <p className="text-sm whitespace-pre-wrap">{row.message}</p>
          </div>
        )}
        <div>
          <p className="admin-label">Status</p>
          <select
            value={row.status}
            disabled={saving}
            onChange={(e) => updateStatus(e.target.value as Appointment['status'])}
            className="admin-input max-w-xs capitalize"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-warm-gray">
          Submitted {new Date(row.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
