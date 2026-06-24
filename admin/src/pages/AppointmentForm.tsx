import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

const statuses: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

type FormState = {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  preferred_date: string;
  message: string;
  status: AppointmentStatus;
};

const emptyForm: FormState = {
  name: '',
  phone: '',
  email: '',
  treatment: '',
  preferred_date: '',
  message: '',
  status: 'pending',
};

export default function AppointmentForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
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
        else if (data) {
          setForm({
            name: data.name,
            phone: data.phone,
            email: data.email ?? '',
            treatment: data.treatment,
            preferred_date: data.preferred_date ?? '',
            message: data.message ?? '',
            status: data.status,
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      treatment: form.treatment.trim(),
      preferred_date: form.preferred_date || null,
      message: form.message.trim() || null,
      status: form.status,
      updated_at: new Date().toISOString(),
    };

    if (isEdit && id) {
      const { error: updateError } = await supabase.from('appointments').update(payload).eq('id', id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      navigate(`/bookings/${id}`);
    } else {
      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert(payload)
        .select('id')
        .single();
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
      navigate(`/bookings/${data.id}`);
    }
    setSaving(false);
  };

  if (loading) {
    return <p className="text-warm-gray">Loading…</p>;
  }

  return (
    <div>
      <Link to={isEdit && id ? `/bookings/${id}` : '/bookings'} className="text-sm text-bronze hover:underline">
        ← Back
      </Link>
      <h1 className="font-serif text-3xl mt-4 mb-6">{isEdit ? 'Edit booking' : 'New booking'}</h1>

      <form onSubmit={handleSubmit} className="admin-card max-w-xl space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <label className="admin-label" htmlFor="name">
            Patient name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            required
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="email">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="treatment">
            Treatment
          </label>
          <input
            id="treatment"
            required
            value={form.treatment}
            onChange={(e) => handleChange('treatment', e.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="preferred_date">
            Preferred date (optional)
          </label>
          <input
            id="preferred_date"
            type="date"
            value={form.preferred_date}
            onChange={(e) => handleChange('preferred_date', e.target.value)}
            className="admin-input max-w-xs"
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="message">
            Message (optional)
          </label>
          <textarea
            id="message"
            rows={4}
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="admin-input resize-y"
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="admin-input max-w-xs capitalize"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="admin-btn-primary">
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create booking'}
          </button>
          <Link to="/bookings" className="admin-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
