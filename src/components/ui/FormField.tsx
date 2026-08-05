type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export default function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && <span className="text-muted"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="font-body text-xs text-muted mt-1.5">{hint}</p>
      )}
      {error && (
        <p className="font-body text-xs text-[var(--color-error)] mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
