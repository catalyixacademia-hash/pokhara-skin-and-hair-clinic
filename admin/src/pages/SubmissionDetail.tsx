import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import StatusBadge from '@/components/StatusBadge';
import {
  SUBMISSION_STATUSES,
  formTypeLabel,
  listBasePath,
  type FormType,
  type Submission,
  type SubmissionStatus,
} from '@/types/submission';

type SubmissionDetailProps = {
  formType: FormType;
  topicLabel: string;
};

export default function SubmissionDetail({ formType, topicLabel }: SubmissionDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const basePath = listBasePath(formType);
  const [row, setRow] = useState<Submission | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
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
          const submission = data as Submission;
          setRow(submission);
          setInternalNotes(submission.internal_notes ?? '');
        }
      });
  }, [id]);

  const updateField = async (fields: Partial<Pick<Submission, 'status' | 'internal_notes'>>) => {
    if (!id) return;
    setSaving(true);
    const { data, error: updateError } = await supabase
      .from('appointments')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (updateError) setError(updateError.message);
    else if (data) setRow(data as Submission);
    setSaving(false);
  };

  const handleStatusChange = (status: SubmissionStatus) => {
    void updateField({ status });
  };

  const handleSaveNotes = () => {
    void updateField({ internal_notes: internalNotes.trim() || null });
  };

  const handleDelete = async () => {
    if (!id || !row) return;
    if (!confirm(`Delete submission from ${row.name}? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from('appointments').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    navigate(basePath);
  };

  if (error && !row) {
    return (
      <div>
        <Link to={basePath} className="admin-link">
          ← Back
        </Link>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (!row) {
    return (
      <div>
        <Link to={basePath} className="admin-link">
          ← Back
        </Link>
        <p className="mt-4 text-muted">Loading…</p>
      </div>
    );
  }

  if (row.form_type !== formType) {
    const correctPath = listBasePath(row.form_type);
    return (
      <div>
        <Link to={correctPath} className="admin-link">
          ← Go to {formTypeLabel(row.form_type)} inbox
        </Link>
        <p className="mt-4 text-muted">This record belongs in a different inbox.</p>
      </div>
    );
  }

  return (
    <div>
      <Link to={basePath} className="admin-link">
        ← Back to {formType === 'booking' ? 'bookings' : 'enquiries'}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent mb-1">Patient submission</p>
          <h1 className="font-serif text-3xl text-ink">{row.name}</h1>
          <div className="mt-2">
            <StatusBadge status={row.status} />
          </div>
        </div>
        <button type="button" onClick={handleDelete} className="admin-btn-danger">
          Delete
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
        <div className="admin-card space-y-4">
          <h2 className="font-serif text-lg text-ink border-b border-line pb-2">
            Submitted by patient
          </h2>
          <p className="text-xs text-muted">Read-only — staff cannot edit patient-entered data.</p>

          <div>
            <p className="admin-label">Phone</p>
            <p className="text-ink">{row.phone}</p>
          </div>
          {row.email && (
            <div>
              <p className="admin-label">Email</p>
              <p className="text-ink">{row.email}</p>
            </div>
          )}
          <div>
            <p className="admin-label">{topicLabel}</p>
            <p className="text-ink">{row.treatment}</p>
          </div>
          {formType === 'booking' && row.preferred_date && (
            <div>
              <p className="admin-label">Preferred date</p>
              <p className="text-ink">{row.preferred_date}</p>
            </div>
          )}
          {row.message && (
            <div>
              <p className="admin-label">Message</p>
              <p className="text-sm whitespace-pre-wrap text-ink bg-accent-soft/30 p-3 border border-line">
                {row.message}
              </p>
            </div>
          )}
          <p className="text-xs text-muted pt-2">
            Submitted {new Date(row.created_at).toLocaleString()}
          </p>
        </div>

        <div className="admin-card space-y-4">
          <h2 className="font-serif text-lg text-ink border-b border-line pb-2">Staff actions</h2>

          <div>
            <label className="admin-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={row.status}
              disabled={saving}
              onChange={(e) => handleStatusChange(e.target.value as SubmissionStatus)}
              className="admin-input max-w-xs capitalize"
            >
              {SUBMISSION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-label" htmlFor="internal_notes">
              Internal notes
            </label>
            <p className="text-xs text-muted mb-2">Staff only — not visible to the patient.</p>
            <textarea
              id="internal_notes"
              rows={5}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="admin-input resize-y"
              placeholder="e.g. Called back, offered Tuesday slot…"
            />
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveNotes}
              className="admin-btn-primary mt-3"
            >
              {saving ? 'Saving…' : 'Save notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
