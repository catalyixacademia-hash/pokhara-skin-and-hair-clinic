type ConfirmDeleteProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting?: boolean;
};

export default function ConfirmDelete({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  deleting,
}: ConfirmDeleteProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="admin-card max-w-md w-full">
        <h3 className="font-serif text-lg mb-2">{title}</h3>
        <p className="text-sm text-warm-gray mb-6">{message}</p>
        <div className="flex gap-3">
          <button type="button" className="admin-btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
          <button type="button" className="admin-btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
