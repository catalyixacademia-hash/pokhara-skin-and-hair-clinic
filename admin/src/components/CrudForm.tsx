import { type ReactNode } from 'react';

type CrudFormProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  saving?: boolean;
  /** Shown inside the drawer so save failures are visible while the form is open. */
  error?: string | null;
};

export default function CrudForm({
  title,
  open,
  onClose,
  onSubmit,
  children,
  saving,
  error,
}: CrudFormProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40">
      <div className="h-full w-full max-w-lg bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-blush px-6 py-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center min-h-11 min-w-11 text-warm-gray hover:text-charcoal"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {error && (
            <p
              className="text-sm text-red-600 rounded-md border border-red-200 bg-red-50 px-3 py-2"
              role="alert"
            >
              {error}
            </p>
          )}
          {children}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button type="button" onClick={onClose} className="admin-btn-secondary w-full sm:w-auto">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="admin-btn-primary w-full sm:w-auto">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
    </div>
  );
}
