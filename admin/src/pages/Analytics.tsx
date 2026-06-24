import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { computeAnalytics, weekChangePercent } from '@/lib/analytics';
import type { Submission } from '@/types/submission';

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="admin-stat-card">
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-value">{value}</p>
      {hint && <p className="admin-stat-hint">{hint}</p>}
    </div>
  );
}

function BarList({ items, maxItems = 8 }: { items: { label: string; count: number }[]; maxItems?: number }) {
  const top = items.slice(0, maxItems);
  const max = Math.max(...top.map((i) => i.count), 1);

  return (
    <div className="space-y-3">
      {top.length === 0 && <p className="text-sm text-muted">No data yet.</p>}
      {top.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-sm mb-1 gap-4">
            <span className="text-ink truncate">{item.label}</span>
            <span className="text-muted shrink-0">{item.count}</span>
          </div>
          <div className="admin-bar-track">
            <div className="admin-bar-fill" style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DailyChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d) => (
        <div
          key={d.date}
          className="admin-chart-bar flex-1 min-w-0"
          style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 8 : 2)}%` }}
          title={`${d.date}: ${d.count}`}
        />
      ))}
    </div>
  );
}

export default function Analytics() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setRows((data ?? []) as Submission[]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-muted">Loading analytics…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const { summary, topTopics, statusBreakdown, dailyLast30 } = computeAnalytics(rows);
  const weekChange = weekChangePercent(summary.thisWeek, summary.lastWeek);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Analytics</h1>
        <p className="text-sm text-muted mt-1">
          Insights from patient booking and enquiry forms — last 30 days where noted.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total submissions" value={summary.total} />
        <StatCard label="Pending follow-up" value={summary.pending} />
        <StatCard
          label="This week"
          value={summary.thisWeek}
          hint={`vs last week: ${weekChange} (${summary.lastWeek})`}
        />
        <StatCard
          label="Bookings / Enquiries"
          value={`${summary.bookings} / ${summary.enquiries}`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="admin-card">
          <h2 className="font-serif text-xl text-ink mb-1">Top treatments & topics</h2>
          <p className="text-xs text-muted mb-4">Main patient interests and concerns</p>
          <BarList items={topTopics} />
        </div>

        <div className="admin-card">
          <h2 className="font-serif text-xl text-ink mb-1">Status breakdown</h2>
          <p className="text-xs text-muted mb-4">How staff are progressing submissions</p>
          <BarList items={statusBreakdown.map((s) => ({ label: s.label, count: s.count }))} />
        </div>
      </div>

      <div className="admin-card mb-6">
        <h2 className="font-serif text-xl text-ink mb-1">Submissions — last 30 days</h2>
        <p className="text-xs text-muted mb-4">Daily form volume from the website</p>
        <DailyChart data={dailyLast30} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/bookings" className="admin-btn-secondary">
          View bookings
        </Link>
        <Link to="/enquiries" className="admin-btn-secondary">
          View enquiries
        </Link>
      </div>
    </div>
  );
}
