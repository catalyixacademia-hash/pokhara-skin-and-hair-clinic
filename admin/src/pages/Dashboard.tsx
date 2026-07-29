import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { errorMessage } from '@/lib/supabase-result';
import StatusBadge from '@/components/StatusBadge';
import { formatPreferredDate, preferredDateUrgency } from '@/lib/contact-links';
import type { Submission } from '@/types/submission';
import { listBasePath } from '@/types/submission';

type Counts = {
  pendingBookings: number;
  pendingEnquiries: number;
  submissionsThisWeek: number;
  upcomingPreferred: number;
  overduePending: number;
};

function isoDateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recent, setRecent] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const twoDaysAgoIso = new Date(Date.now() - 2 * 86_400_000).toISOString();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAhead = new Date(today);
    weekAhead.setDate(weekAhead.getDate() + 7);

    const [
      bookings,
      enquiries,
      week,
      upcoming,
      overdue,
      recentRows,
    ] = await Promise.all([
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('form_type', 'booking')
        .eq('status', 'pending')
        .is('deleted_at', null),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('form_type', 'general_query')
        .eq('status', 'pending')
        .is('deleted_at', null),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString())
        .is('deleted_at', null),
      // Dedicated count: pending bookings with preferred date today through +7 days
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('form_type', 'booking')
        .eq('status', 'pending')
        .is('deleted_at', null)
        .gte('preferred_date', isoDateOnly(today))
        .lte('preferred_date', isoDateOnly(weekAhead)),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
        .is('deleted_at', null)
        .lt('created_at', twoDaysAgoIso),
      supabase
        .from('appointments')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(8),
    ]);

    const failures = [bookings, enquiries, week, upcoming, overdue, recentRows]
      .map((r) => r.error)
      .filter(Boolean);

    if (failures.length > 0) {
      setError(errorMessage(failures[0], 'Could not load dashboard metrics.'));
      setLoading(false);
      return;
    }

    setCounts({
      pendingBookings: bookings.count ?? 0,
      pendingEnquiries: enquiries.count ?? 0,
      submissionsThisWeek: week.count ?? 0,
      upcomingPreferred: upcoming.count ?? 0,
      overduePending: overdue.count ?? 0,
    });
    setRecent((recentRows.data ?? []) as Submission[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();

    const channel = supabase
      .channel('dashboard-appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Overview</h1>
        <p className="text-sm text-muted mt-1">Pokhara Skin & Hair Clinic — patient inbox at a glance.</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
            <div className="admin-stat-card">
              <p className="admin-stat-label">Pending bookings</p>
              <p className="admin-stat-value">{counts?.pendingBookings ?? 0}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Pending enquiries</p>
              <p className="admin-stat-value">{counts?.pendingEnquiries ?? 0}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Submissions this week</p>
              <p className="admin-stat-value">{counts?.submissionsThisWeek ?? 0}</p>
              <p className="admin-stat-hint">Created in the last 7 days</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Upcoming preferred dates</p>
              <p className="admin-stat-value">{counts?.upcomingPreferred ?? 0}</p>
              <p className="admin-stat-hint">Pending bookings · preferred date today–7 days</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Pending &gt; 48h</p>
              <p className="admin-stat-value">{counts?.overduePending ?? 0}</p>
            </div>
          </div>

          <div className="admin-card mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-serif text-xl text-ink">Recent submissions</h2>
              <Link to="/queue" className="admin-btn-secondary text-xs">
                Open follow-up queue
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-muted">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {recent.map((row) => (
                  <Link
                    key={row.id}
                    to={`${listBasePath(row.form_type)}/${row.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 border border-line rounded px-4 py-3 hover:border-accent transition-colors no-underline"
                  >
                    <div className="min-w-0">
                      <p className="text-ink font-medium">{row.name}</p>
                      <p className="text-sm text-muted truncate">
                        {row.treatment}
                        {row.form_type === 'booking' && row.preferred_date
                          ? ` · ${formatPreferredDate(row.preferred_date)}`
                          : ''}
                        {row.form_type === 'booking' &&
                        preferredDateUrgency(row.preferred_date) === 'today'
                          ? ' · Today'
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={row.status} />
                      <span className="text-xs text-muted">
                        {new Date(row.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/queue" className="admin-nav-card">
          <p className="font-serif text-lg text-ink">Follow-up queue</p>
          <p className="text-sm text-muted mt-1">Pending items that need staff action</p>
        </Link>
        <Link to="/bookings" className="admin-nav-card">
          <p className="font-serif text-lg text-ink">Booking forms</p>
          <p className="text-sm text-muted mt-1">Appointment requests from the website</p>
        </Link>
        <Link to="/enquiries" className="admin-nav-card">
          <p className="font-serif text-lg text-ink">General enquiries</p>
          <p className="text-sm text-muted mt-1">Patient questions and concerns</p>
        </Link>
        <Link to="/analytics" className="admin-nav-card">
          <p className="font-serif text-lg text-ink">Analytics</p>
          <p className="text-sm text-muted mt-1">Top treatments, trends, and status</p>
        </Link>
        <Link to="/treatment-options" className="admin-nav-card">
          <p className="font-serif text-lg text-ink">Treatment options</p>
          <p className="text-sm text-muted mt-1">Booking form dropdown labels</p>
        </Link>
        <Link to="/settings" className="admin-nav-card">
          <p className="font-serif text-lg text-ink">Clinic settings</p>
          <p className="text-sm text-muted mt-1">Hours, phones, maps, and contact info</p>
        </Link>
      </div>
    </div>
  );
}
