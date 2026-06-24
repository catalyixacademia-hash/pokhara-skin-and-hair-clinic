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
};

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
  return t >= from.getTime() && t < to.getTime();
}

export function computeAnalytics(rows: Submission[]): {
  summary: AnalyticsSummary;
  topTopics: CountEntry[];
  statusBreakdown: CountEntry[];
  dailyLast30: DailyCount[];
} {
  const now = new Date();
  const weekStart = daysAgo(7);
  const lastWeekStart = daysAgo(14);
  const thirtyDaysAgo = daysAgo(30);

  const thisWeek = rows.filter((r) => isInRange(r.created_at, weekStart, now)).length;
  const lastWeek = rows.filter((r) => isInRange(r.created_at, lastWeekStart, weekStart)).length;

  const topicMap = new Map<string, number>();
  const statusMap = new Map<SubmissionStatus, number>();
  const dailyMap = new Map<string, number>();

  for (const row of rows) {
    const topic = row.treatment.trim() || 'Unknown';
    topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1);
    statusMap.set(row.status, (statusMap.get(row.status) ?? 0) + 1);

    const day = row.created_at.slice(0, 10);
    if (new Date(row.created_at) >= thirtyDaysAgo) {
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
    }
  }

  const topTopics = [...topicMap.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const statusBreakdown = (['pending', 'confirmed', 'completed', 'cancelled'] as SubmissionStatus[]).map(
    (label) => ({ label, count: statusMap.get(label) ?? 0 }),
  );

  const dailyLast30: DailyCount[] = [];
  for (let i = 29; i >= 0; i -= 1) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    dailyLast30.push({ date: key, count: dailyMap.get(key) ?? 0 });
  }

  return {
    summary: {
      total: rows.length,
      pending: rows.filter((r) => r.status === 'pending').length,
      thisWeek,
      lastWeek,
      bookings: rows.filter((r) => r.form_type === 'booking').length,
      enquiries: rows.filter((r) => (r.form_type as FormType) === 'general_query').length,
    },
    topTopics,
    statusBreakdown,
    dailyLast30,
  };
}

export function weekChangePercent(thisWeek: number, lastWeek: number): string {
  if (lastWeek === 0) return thisWeek > 0 ? '+100%' : '0%';
  const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}
