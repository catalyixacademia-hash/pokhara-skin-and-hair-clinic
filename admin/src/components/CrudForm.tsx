import { type ReactNode } from 'react';

type CrudFormProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  saving?: boolean;
};

export default function CrudForm({ title, open, onClose, onSubmit, children, saving }: CrudFormProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40">
      <div className="h-full w-full max-w-lg bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-blush px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl">{title}</h2>
          <button type="button" onClick={onClose} className="text-warm-gray hover:text-charcoal">
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {children}
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="admin-btn-primary">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
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
