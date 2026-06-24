import type { TreatmentOptionGroup } from '../hooks/useTreatmentOptions';

type TreatmentSelectProps = {
  id?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  groups: TreatmentOptionGroup[];
  loading?: boolean;
  required?: boolean;
};

export default function TreatmentSelect({
  id = 'treatment',
  name,
  value,
  onChange,
  groups,
  loading = false,
  required = true,
}: TreatmentSelectProps) {
  return (
    <div className="treatment-select-wrap">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={loading}
        className="treatment-select"
        aria-label="Select a treatment"
      >
        <option value="" disabled>
          {loading ? 'Loading treatments…' : 'Choose a treatment'}
        </option>
        {groups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <span className="treatment-select-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </span>
    </div>
  );
}
