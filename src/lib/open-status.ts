/**
 * Nepal Standard Time (UTC+5:45) open/closed status for clinic hours 8:00–19:00.
 */
export function getClinicOpenStatus(now = new Date()): {
  open: boolean;
  label: string;
} {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  const mins = hour * 60 + minute;
  const openMins = 8 * 60;
  const closeMins = 19 * 60;

  if (mins >= openMins && mins < closeMins) {
    const remaining = closeMins - mins;
    const h = Math.floor(remaining / 60);
    const m = remaining % 60;
    const closes =
      h > 0 ? `Closes in ${h}h${m > 0 ? ` ${m}m` : ''}` : `Closes in ${m}m`;
    return { open: true, label: `Open now · ${closes}` };
  }

  return { open: false, label: 'Closed · Opens 8:00 AM' };
}
