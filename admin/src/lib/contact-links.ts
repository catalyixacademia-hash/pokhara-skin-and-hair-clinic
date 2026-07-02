export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function phoneHref(phone: string): string {
  const digits = phoneDigits(phone);
  if (!digits) return '#';
  const normalized = digits.startsWith('977') ? digits : `977${digits}`;
  return `tel:+${normalized}`;
}

export function whatsappHref(phone: string, message?: string): string {
  const digits = phoneDigits(phone);
  if (!digits) return '#';
  const normalized = digits.startsWith('977') ? digits : `977${digits}`;
  const base = `https://wa.me/${normalized}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function formatPreferredDate(date: string | null): string {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export type DateUrgency = 'past' | 'today' | 'soon' | 'future' | 'none';

export function preferredDateUrgency(date: string | null): DateUrgency {
  if (!date) return 'none';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'none';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(parsed);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (diffDays < 0) return 'past';
  if (diffDays === 0) return 'today';
  if (diffDays <= 7) return 'soon';
  return 'future';
}

export const urgencyStyles: Record<DateUrgency, string> = {
  past: 'text-red-700 bg-red-50 border-red-200',
  today: 'text-amber-900 bg-amber-50 border-amber-200',
  soon: 'text-sky-900 bg-sky-50 border-sky-200',
  future: 'text-ink',
  none: 'text-muted',
};
