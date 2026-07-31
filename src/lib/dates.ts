/** Local calendar date as YYYY-MM-DD (clinic timezone / visitor local day). */
export function todayISODate(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** True when `isoDate` is strictly before today (local). Empty values are not past. */
export function isPastDate(isoDate: string, today = todayISODate()): boolean {
  if (!isoDate) return false;
  return isoDate < today;
}

/** Parse YYYY-MM-DD into local midnight Date, or null if invalid. */
export function parseISODate(isoDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function toISODate(date: Date): string {
  return todayISODate(date);
}

export function formatDisplayDate(isoDate: string): string {
  const date = parseISODate(isoDate);
  if (!date) return '';
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}
