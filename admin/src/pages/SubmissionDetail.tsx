import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import StatusBadge from '@/components/StatusBadge';
import ConfirmDelete from '@/components/ConfirmDelete';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';
import {
  formatPreferredDate,
  phoneHref,
  preferredDateUrgency,
  urgencyStyles,
  whatsappHref,
} from '@/lib/contact-links';
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
  const [notesSaved, setNotesSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<SubmissionStatus | null>(null);

  const [notesInitialized, setNotesInitialized] = useState(false);

  useEffect(() => {
    if (!id) return;
    setNotesInitialized(false);
    supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else if (data) {
          const submission = data as Submission;
          setRow(submission);
          setInternalNotes(submission.internal_notes ?? '');
          setNotesInitialized(true);
        } else {
          setError('Submission not found or was removed.');
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

  useDebouncedSave(
    notesInitialized ? internalNotes : null,
    (value) => {
      if (!row || value === null) return;
      const trimmed = value.trim() || null;
      if (trimmed === (row.internal_notes ?? null)) {
        setNotesSaved(true);
        return;
      }
      setNotesSaved(false);
      void updateField({ internal_notes: trimmed }).then(() => setNotesSaved(true));
    },
  );

  const handleStatusChange = (status: SubmissionStatus) => {
    if (status === 'cancelled' || status === 'completed') {
      setPendingStatus(status);
      return;
    }
    void updateField({ status });
  };

  const confirmStatusChange = () => {
    if (!pendingStatus) return;
    void updateField({ status: pendingStatus });
    setPendingStatus(null);
  };

  const handleDelete = async () => {
    if (!id || !row) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from('appointments')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }
    navigate(basePath);
  };

  const copySummary = async () => {
    if (!row) return;
    const lines = [
      row.name,
      row.phone,
      row.email ?? 'No email',
      `${topicLabel}: ${row.treatment}`,
      formType === 'booking' && row.preferred_date
        ? `Preferred date: ${formatPreferredDate(row.preferred_date)}`
        : null,
      row.message ? `Message: ${row.message}` : null,
    ].filter(Boolean);
    await navigator.clipboard.writeText(lines.join('\n'));
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

  const urgency =
    formType === 'booking' ? preferredDateUrgency(row.preferred_date) : 'none';
  const waMessage = `Hello ${row.name}, this is Pokhara Skin & Hair Clinic regarding your ${formType === 'booking' ? 'appointment request' : 'enquiry'}.`;

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
        <div className="flex flex-wrap gap-2">
          <a href={phoneHref(row.phone)} className="admin-btn-secondary">
            Call
          </a>
          <a
            href={whatsappHref(row.phone, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-secondary"
          >
            WhatsApp
          </a>
          {row.email && (
            <a href={`mailto:${row.email}`} className="admin-btn-secondary">
              Email
            </a>
          )}
          <button type="button" onClick={() => void copySummary()} className="admin-btn-secondary">
            Copy summary
          </button>
          <button type="button" onClick={() => setDeleteOpen(true)} className="admin-btn-danger">
            Remove
          </button>
        </div>
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
            <a href={phoneHref(row.phone)} className="admin-link text-base">
              {row.phone}
            </a>
          </div>
          {row.email && (
            <div>
              <p className="admin-label">Email</p>
              <a href={`mailto:${row.email}`} className="admin-link text-base">
                {row.email}
              </a>
            </div>
          )}
          <div>
            <p className="admin-label">{topicLabel}</p>
            <p className="text-ink">{row.treatment}</p>
          </div>
          {formType === 'booking' && row.preferred_date && (
            <div>
              <p className="admin-label">Preferred date</p>
              <p
                className={`inline-flex text-sm font-medium px-2.5 py-1 rounded border ${urgencyStyles[urgency]}`}
              >
                {formatPreferredDate(row.preferred_date)}
                {urgency === 'past' && ' · Overdue'}
                {urgency === 'today' && ' · Today'}
                {urgency === 'soon' && ' · This week'}
              </p>
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
            <p className="text-xs text-muted mb-2">Staff only — auto-saves as you type.</p>
            <textarea
              id="internal_notes"
              rows={5}
              value={internalNotes}
              onChange={(e) => {
                setInternalNotes(e.target.value);
                setNotesSaved(false);
              }}
              className="admin-input resize-y"
              placeholder="e.g. Called back, offered Tuesday slot…"
            />
            <p className="text-xs text-muted mt-2">
              {saving ? 'Saving…' : notesSaved ? 'Saved' : 'Saving changes…'}
            </p>
          </div>
        </div>
      </div>

      <ConfirmDelete
        open={deleteOpen}
        title="Remove submission?"
        message={`Remove submission from ${row.name}? It will be hidden from the inbox (soft-delete).`}
        deleting={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteOpen(false)}
      />

      {pendingStatus && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="admin-card max-w-md w-full">
            <h3 className="font-serif text-lg mb-2">Change status to {pendingStatus}?</h3>
            <p className="text-sm text-muted mb-6">
              Confirm this submission is marked as {pendingStatus}.
            </p>
            <div className="flex gap-3">
              <button type="button" className="admin-btn-primary" onClick={confirmStatusChange}>
                Confirm
              </button>
              <button type="button" className="admin-btn-secondary" onClick={() => setPendingStatus(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
