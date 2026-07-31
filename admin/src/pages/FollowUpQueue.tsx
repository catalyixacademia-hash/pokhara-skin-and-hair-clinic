import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { mutationResult } from '@/lib/supabase-result';
import StatusBadge from '@/components/StatusBadge';
import {
  formatPreferredDate,
  phoneHref,
  preferredDateUrgency,
  urgencyStyles,
  whatsappHref,
} from '@/lib/contact-links';
import {
  defaultScriptForStatus,
  followUpWhatsAppMessage,
  scriptLabel,
  type FollowUpScriptKind,
} from '@/lib/follow-up-scripts';
import { formTypeLabel, listBasePath, type Submission, type SubmissionStatus } from '@/types/submission';

function queueSort(a: Submission, b: Submission): number {
  const statusOrder: Record<SubmissionStatus, number> = {
    pending: 0,
    confirmed: 1,
    completed: 2,
    cancelled: 3,
  };

  const statusDiff = statusOrder[a.status] - statusOrder[b.status];
  if (statusDiff !== 0) return statusDiff;

  if (a.form_type === 'booking' && b.form_type === 'booking') {
    const aDate = a.preferred_date ? new Date(a.preferred_date).getTime() : Number.MAX_SAFE_INTEGER;
    const bDate = b.preferred_date ? new Date(b.preferred_date).getTime() : Number.MAX_SAFE_INTEGER;
    if (aDate !== bDate) return aDate - bDate;
  }

  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

/** Actionable: overdue pending, preferred date past/today/soon, or confirmed with imminent preferred date. */
function needsAction(row: Submission, now: number): boolean {
  const twoDaysAgo = now - 2 * 86_400_000;
  const created = new Date(row.created_at).getTime();
  const urgency =
    row.form_type === 'booking' ? preferredDateUrgency(row.preferred_date) : 'none';
  const dateUrgent = urgency === 'past' || urgency === 'today' || urgency === 'soon';

  if (row.status === 'pending') {
    if (created < twoDaysAgo) return true;
    if (dateUrgent) return true;
    // Fresh pending with no urgent date — leave for "All open"
    return false;
  }

  if (row.status === 'confirmed') {
    // Confirmed that still need day-of / soon follow-through
    return dateUrgent;
  }

  return false;
}

export default function FollowUpQueue() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<'action' | 'all-open'>('action');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .in('status', ['pending', 'confirmed'])
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (fetchError) setError(fetchError.message);
    else setRows((data ?? []) as Submission[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();

    const channel = supabase
      .channel('follow-up-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load]);

  const actionRows = useMemo(() => {
    const now = Date.now();
    return [...rows].filter((row) => needsAction(row, now)).sort(queueSort);
  }, [rows]);

  const filtered = useMemo(() => {
    if (filter === 'all-open') return [...rows].sort(queueSort);
    return actionRows;
  }, [rows, filter, actionRows]);

  const updateStatus = async (row: Submission, status: SubmissionStatus) => {
    setUpdatingId(row.id);
    setError(null);
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', row.id);
    const result = mutationResult(updateError);
    if (!result.ok) setError(result.message);
    setUpdatingId(null);
    void load();
  };

  const overdueCount = rows.filter((r) => {
    if (r.status !== 'pending') return false;
    const created = new Date(r.created_at).getTime();
    return created < Date.now() - 2 * 86_400_000;
  }).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Follow-up queue</h1>
        <p className="text-sm text-muted mt-1">
          Pending and confirmed submissions that need staff attention, sorted by urgency.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="admin-stat-card">
          <p className="admin-stat-label">Open items</p>
          <p className="admin-stat-value">{rows.length}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Needs action</p>
          <p className="admin-stat-value">{actionRows.length}</p>
          <p className="admin-stat-hint">Overdue, today/soon preferred date</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Pending &gt; 48h</p>
          <p className="admin-stat-value">{overdueCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          className={filter === 'action' ? 'admin-btn-primary' : 'admin-btn-secondary'}
          onClick={() => setFilter('action')}
        >
          Needs action
        </button>
        <button
          type="button"
          className={filter === 'all-open' ? 'admin-btn-primary' : 'admin-btn-secondary'}
          onClick={() => setFilter('all-open')}
        >
          All open
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-muted">Loading queue…</p>
      ) : filtered.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-ink font-medium">Queue is clear</p>
          <p className="text-sm text-muted mt-1">No open submissions need follow-up right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((row) => {
            const urgency =
              row.form_type === 'booking' ? preferredDateUrgency(row.preferred_date) : 'none';
            const detailPath = `${listBasePath(row.form_type)}/${row.id}`;
            const scriptKind: FollowUpScriptKind = defaultScriptForStatus(row.status);
            const waMessage = followUpWhatsAppMessage(row, scriptKind);

            return (
              <article key={row.id} className="admin-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-widest text-accent">
                        {formTypeLabel(row.form_type)}
                      </span>
                      <StatusBadge status={row.status} />
                    </div>
                    <h2 className="font-serif text-xl text-ink">{row.name}</h2>
                    <p className="text-sm text-muted mt-1">{row.treatment}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                      <a href={phoneHref(row.phone)} className="admin-link">
                        {row.phone}
                      </a>
                      {row.email && <span className="text-muted">{row.email}</span>}
                    </div>
                    {row.form_type === 'booking' && row.preferred_date && (
                      <p
                        className={`inline-flex mt-2 text-xs font-medium px-2 py-1 rounded border ${urgencyStyles[urgency]}`}
                      >
                        Preferred: {formatPreferredDate(row.preferred_date)}
                        {urgency === 'past' && ' · Overdue'}
                        {urgency === 'today' && ' · Today'}
                        {urgency === 'soon' && ' · Soon'}
                      </p>
                    )}
                    <p className="text-xs text-muted mt-2">
                      Submitted {new Date(row.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <a href={phoneHref(row.phone)} className="admin-btn-secondary text-xs py-1.5 px-3">
                      Call
                    </a>
                    <a
                      href={whatsappHref(row.phone, waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn-secondary text-xs py-1.5 px-3"
                      title={scriptLabel(scriptKind)}
                    >
                      WhatsApp
                    </a>
                    <button
                      type="button"
                      className="admin-btn-secondary text-xs py-1.5 px-3"
                      onClick={() => navigate(detailPath)}
                    >
                      Open
                    </button>
                    {row.status === 'pending' && (
                      <button
                        type="button"
                        disabled={updatingId === row.id}
                        className="admin-btn-primary text-xs py-1.5 px-3"
                        onClick={() => void updateStatus(row, 'confirmed')}
                      >
                        {updatingId === row.id ? 'Saving…' : 'Confirm'}
                      </button>
                    )}
                    {row.status === 'confirmed' && (
                      <button
                        type="button"
                        disabled={updatingId === row.id}
                        className="admin-btn-primary text-xs py-1.5 px-3"
                        onClick={() => void updateStatus(row, 'completed')}
                      >
                        {updatingId === row.id ? 'Saving…' : 'Complete'}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-8">
        <Link to="/bookings" className="admin-btn-secondary">
          All bookings
        </Link>
        <Link to="/enquiries" className="admin-btn-secondary">
          All enquiries
        </Link>
      </div>
    </div>
  );
}
