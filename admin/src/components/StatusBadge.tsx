import type { SubmissionStatus } from '@/types/submission';

const styles: Record<SubmissionStatus, string> = {
  pending: 'bg-amber-100 text-amber-900 border-amber-200',
  confirmed: 'bg-sky-100 text-sky-900 border-sky-200',
  completed: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  cancelled: 'bg-stone-100 text-stone-600 border-stone-200',
};

type StatusBadgeProps = {
  status: SubmissionStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${styles[status]}`}
    >
      {status}
    </span>
  );
}
