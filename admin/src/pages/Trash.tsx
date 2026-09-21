import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ConfirmDelete from '@/components/ConfirmDelete';
import StatusBadge from '@/components/StatusBadge';
import { useRefetchOnFocus } from '@/hooks/useRefetchOnFocus';
import { phoneHref } from '@/lib/contact-links';
import {
  deleteTrashItemForever,
  RETENTION_DAYS,
  runExpiredPurge,
} from '@/lib/trash';
import {
  formTypeLabel,
  listBasePath,
  type FormType,
  type Submission,
} from '@/types/submission';

type FilterType = 'all' | FormType;

function daysUntilPurge(deletedAt: string | null): number {
  if (!deletedAt) return RETENTION_DAYS;
  const deleted = new Date(deletedAt).getTime();
  const expires = deleted + RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((expires - Date.now()) / (24 * 60 * 60 * 1000)));
}

export default function Trash() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [purgeTarget, setPurgeTarget] = useState<Submission | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (fetchError) setError(fetchError.message);
    else setRows((data ?? []) as Submission[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await runExpiredPurge();
      if (!cancelled && result && result.deleted > 0) {
        setInfo(
          `Permanently removed ${result.deleted} item${result.deleted === 1 ? '' : 's'} older than ${RETENTION_DAYS} days.`,
        );
      }
      if (!cancelled) void load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  useEffect(() => {
    const channel = supabase
      .channel('trash-appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        void load();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load]);

  useRefetchOnFocus(() => {
    void load();
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows.filter((r) => {
      if (filter !== 'all' && r.form_type !== filter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.treatment.toLowerCase().includes(q) ||
        (r.message?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, filter, search]);

  const handleRestore = async (row: Submission) => {
    setBusy(true);
    setError(null);
    setInfo(null);
    const { error: restoreError } = await supabase
      .from('appointments')
      .update({ deleted_at: null, updated_at: new Date().toISOString() })
      .eq('id', row.id);
    setBusy(false);
    if (restoreError) {
      setError(restoreError.message);
      return;
    }
    setRows((prev) => prev.filter((x) => x.id !== row.id));
    setInfo(`Restored ${row.name} to ${formTypeLabel(row.form_type).toLowerCase()}s.`);
  };

  const handlePermanentDelete = async () => {
    if (!purgeTarget) return;
    const target = purgeTarget;
    setBusy(true);
    setError(null);
    setInfo(null);

    const result = await deleteTrashItemForever(target.id);
    setBusy(false);
    setPurgeTarget(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setRows((prev) => prev.filter((x) => x.id !== target.id));
    setInfo(`Permanently deleted ${target.name}.`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-secondary)] font-semibold mb-2">
            Inbox
          </p>
          <h1 className="admin-page-title text-3xl">Trash</h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Soft-deleted bookings and enquiries. Restore anytime within {RETENTION_DAYS} days —
            after that they are permanently deleted automatically.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/bookings" className="admin-btn-secondary">
            Bookings
          </Link>
          <Link to="/enquiries" className="admin-btn-secondary">
            Enquiries
          </Link>
        </div>
      </div>

      <div className="admin-media-tabs mb-4" role="tablist" aria-label="Trash filters">
        {(
          [
            { id: 'all' as const, label: 'All' },
            { id: 'booking' as const, label: 'Bookings' },
            { id: 'general_query' as const, label: 'Enquiries' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            className={`admin-media-tab${filter === tab.id ? ' admin-media-tab--active' : ''}`}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="search"
          className="admin-input w-full sm:max-w-xs"
          placeholder="Search name, phone, topic…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {info && (
        <p className="text-sm text-ink mb-3" role="status">
          {info}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 mb-3" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-muted">Loading trash…</p>
      ) : filtered.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-muted">Trash is empty.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((row) => {
            const daysLeft = daysUntilPurge(row.deleted_at);
            const base = listBasePath(row.form_type);
            return (
              <article
                key={row.id}
                className="admin-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-display font-semibold text-ink truncate">{row.name}</h2>
                    <StatusBadge status={row.status} />
                    <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">
                      {formTypeLabel(row.form_type)}
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    {row.treatment} ·{' '}
                    <a href={phoneHref(row.phone)} className="admin-link">
                      {row.phone}
                    </a>
                  </p>
                  <p className="text-xs text-muted mt-1.5">
                    Moved to trash{' '}
                    {row.deleted_at ? new Date(row.deleted_at).toLocaleString() : '—'}
                    {' · '}
                    {daysLeft === 0
                      ? 'Purge due (will be removed on next cleanup)'
                      : `Permanently deleted in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => navigate(`${base}/${row.id}`)}
                    disabled={busy}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={() => void handleRestore(row)}
                    disabled={busy}
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    className="admin-btn-danger"
                    onClick={() => setPurgeTarget(row)}
                    disabled={busy}
                  >
                    Delete forever
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDelete
        open={!!purgeTarget}
        title="Delete forever?"
        message={`Permanently remove "${purgeTarget?.name}"? This cannot be undone.`}
        deleting={busy}
        onConfirm={() => void handlePermanentDelete()}
        onCancel={() => setPurgeTarget(null)}
      />
    </div>
  );
}
