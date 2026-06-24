import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [row, setRow] = useState<Appointment | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setRow(data);
      });
  }, [id]);

  const updateStatus = async (status: Appointment['status']) => {
    if (!id) return;
    setSaving(true);
    const { data, error: updateError } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (updateError) setError(updateError.message);
    else if (data) setRow(data);
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!id || !row) return;
    if (!confirm(`Delete booking for ${row.name}? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from('appointments').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    navigate('/bookings');
  };

  if (error && !row) {
    return (
      <div>
        <Link to="/bookings" className="text-sm text-bronze hover:underline">
          ← Back to bookings
        </Link>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (!row) {
    return (
      <div>
        <Link to="/bookings" className="text-sm text-bronze hover:underline">
          ← Back to bookings
        </Link>
        <p className="mt-4 text-warm-gray">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/bookings" className="text-sm text-bronze hover:underline">
        ← Back to bookings
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-6">
        <h1 className="font-serif text-3xl">{row.name}</h1>
        <div className="flex gap-2">
          <Link to={`/bookings/${row.id}/edit`} className="admin-btn-secondary">
            Edit
          </Link>
          <button type="button" onClick={handleDelete} className="admin-btn-danger">
            Delete
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

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
            <p className="admin-label">Preferred date</p>
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
            id="status"
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
        <p className="text-xs text-warm-gray">Submitted {new Date(row.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
