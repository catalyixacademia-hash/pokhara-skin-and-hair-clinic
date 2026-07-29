import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { computeAnalytics, weekChangePercent } from '@/lib/analytics';
import type { Submission } from '@/types/submission';

const RANGE_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
] as const;

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

function DailyChart({
  data,
  rangeDays,
}: {
  data: { date: string; count: number; bookings: number; enquiries: number }[];
  rangeDays: number;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const labelEvery = rangeDays <= 7 ? 1 : rangeDays <= 30 ? 5 : 10;

  return (
    <div>
      <div className="flex items-end gap-1 h-36 mb-2">
        {data.map((d) => (
          <div key={d.date} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full gap-0.5">
            <div className="w-full flex items-end justify-center gap-px h-[calc(100%-1rem)]">
              <div
                className="admin-chart-bar flex-1 max-w-3"
                style={{ height: `${Math.max((d.bookings / max) * 100, d.bookings > 0 ? 8 : 2)}%` }}
                title={`${d.date}: ${d.bookings} bookings`}
              />
              <div
                className="admin-chart-bar flex-1 max-w-3 opacity-60"
                style={{
                  height: `${Math.max((d.enquiries / max) * 100, d.enquiries > 0 ? 8 : 2)}%`,
                  background: 'var(--color-muted, #5c5c57)',
                }}
                title={`${d.date}: ${d.enquiries} enquiries`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {data.map((d, index) => (
          <div key={`${d.date}-label`} className="flex-1 min-w-0 text-center">
            {index % labelEvery === 0 || index === data.length - 1 ? (
              <span className="text-[10px] text-muted block truncate">
                {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-accent" /> Bookings
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-muted" /> Enquiries
        </span>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('appointments')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setRows((data ?? []) as Submission[]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-muted">Loading analytics…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const { summary, topTopics, statusBreakdown, dailyRange } = computeAnalytics(rows, rangeDays);
  const weekChange = weekChangePercent(summary.thisWeek, summary.lastWeek);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">Analytics</h1>
          <p className="text-sm text-muted mt-1">
            Insights from patient booking and enquiry forms.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={rangeDays === option.value ? 'admin-btn-primary' : 'admin-btn-secondary'}
              onClick={() => setRangeDays(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
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
        <h2 className="font-serif text-xl text-ink mb-1">Submissions — last {rangeDays} days</h2>
        <p className="text-xs text-muted mb-4">Daily form volume split by booking vs enquiry</p>
        <DailyChart data={dailyRange} rangeDays={rangeDays} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/bookings" className="admin-btn-secondary">
          View bookings
        </Link>
        <Link to="/enquiries" className="admin-btn-secondary">
          View enquiries
        </Link>
        <Link to="/queue" className="admin-btn-secondary">
          Follow-up queue
        </Link>
      </div>
    </div>
  );
}
