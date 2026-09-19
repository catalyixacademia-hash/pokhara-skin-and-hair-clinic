import type { FormType, Submission, SubmissionStatus } from '@/types/submission';

export type AnalyticsSummary = {
  total: number;
  pending: number;
  thisWeek: number;
  lastWeek: number;
  bookings: number;
  enquiries: number;
};

export type CountEntry = {
  label: string;
  count: number;
};

export type DailyCount = {
  date: string;
  count: number;
  bookings: number;
  enquiries: number;
};

/** Local calendar YYYY-MM-DD (avoids UTC shift from toISOString). */
export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

function isInRange(iso: string, from: Date, to: Date): boolean {
  const t = new Date(iso).getTime();
  return t >= from.getTime() && t <= to.getTime();
}

export function computeAnalytics(
  rows: Submission[],
  rangeDays = 30,
): {
  summary: AnalyticsSummary;
  topTopics: CountEntry[];
  statusBreakdown: CountEntry[];
  dailyRange: DailyCount[];
} {
  const now = new Date();
  const weekStart = daysAgo(7);
  const lastWeekStart = daysAgo(14);
  const rangeStart = daysAgo(rangeDays);

  // Week-over-week is always last 7 vs prior 7 (independent of range picker).
  const thisWeek = rows.filter((r) => isInRange(r.created_at, weekStart, now)).length;
  const lastWeek = rows.filter((r) => {
    const t = new Date(r.created_at).getTime();
    return t >= lastWeekStart.getTime() && t < weekStart.getTime();
  }).length;

  // Range picker scopes totals, topics, status, and the daily chart.
  const ranged = rows.filter((r) => new Date(r.created_at).getTime() >= rangeStart.getTime());

  const topicMap = new Map<string, number>();
  const statusMap = new Map<SubmissionStatus, number>();
  const dailyMap = new Map<string, { total: number; bookings: number; enquiries: number }>();

  for (const row of ranged) {
    const topic = row.treatment.trim() || 'Unknown';
    topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1);
    statusMap.set(row.status, (statusMap.get(row.status) ?? 0) + 1);

    const day = localDateKey(new Date(row.created_at));
    const current = dailyMap.get(day) ?? { total: 0, bookings: 0, enquiries: 0 };
    current.total += 1;
    if ((row.form_type as FormType) === 'general_query') current.enquiries += 1;
    else current.bookings += 1;
    dailyMap.set(day, current);
  }

  const topTopics = [...topicMap.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const statusBreakdown = (['pending', 'confirmed', 'completed', 'cancelled'] as SubmissionStatus[]).map(
    (label) => ({ label, count: statusMap.get(label) ?? 0 }),
  );

  const dailyRange: DailyCount[] = [];
  for (let i = rangeDays - 1; i >= 0; i -= 1) {
    const d = daysAgo(i);
    const key = localDateKey(d);
    const entry = dailyMap.get(key) ?? { total: 0, bookings: 0, enquiries: 0 };
    dailyRange.push({
      date: key,
      count: entry.total,
      bookings: entry.bookings,
      enquiries: entry.enquiries,
    });
  }

  return {
    summary: {
      total: ranged.length,
      pending: ranged.filter((r) => r.status === 'pending').length,
      thisWeek,
      lastWeek,
      bookings: ranged.filter((r) => r.form_type === 'booking').length,
      enquiries: ranged.filter((r) => (r.form_type as FormType) === 'general_query').length,
    },
    topTopics,
    statusBreakdown,
    dailyRange,
  };
}

export function weekChangePercent(thisWeek: number, lastWeek: number): string {
  if (lastWeek === 0) return thisWeek > 0 ? '+100%' : '0%';
  const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}
