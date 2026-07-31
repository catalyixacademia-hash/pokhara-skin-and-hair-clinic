import { useEffect, useId, useRef, useState } from 'react';
import {
  addMonths,
  formatDisplayDate,
  formatMonthYear,
  parseISODate,
  startOfMonth,
  todayISODate,
  toISODate,
} from '../../lib/dates';
import { cn } from '../../utils/cn';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

type DatePickerProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
};

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DatePicker({
  id,
  name,
  value,
  onChange,
  minDate,
  required,
  className,
  placeholder = 'Select a preferred date',
}: DatePickerProps) {
  const min = minDate ?? todayISODate();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const selected = value ? parseISODate(value) : null;
    return startOfMonth(selected ?? new Date());
  });

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selected = value ? parseISODate(value) : null;
    setViewMonth(startOfMonth(selected ?? new Date()));
  }, [open, value]);

  const monthStart = startOfMonth(viewMonth);
  const firstWeekday = monthStart.getDay();
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate();

  const cells: Array<{ iso: string; day: number; inMonth: boolean } | null> = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    cells.push({ iso: toISODate(date), day, inMonth: true });
  }

  const canGoPrev = (() => {
    const prev = addMonths(viewMonth, -1);
    const prevLast = toISODate(new Date(prev.getFullYear(), prev.getMonth() + 1, 0));
    return prevLast >= min;
  })();

  const selectDate = (iso: string) => {
    if (iso < min) return;
    onChange(iso);
    setOpen(false);
  };

  const goToday = () => {
    const today = todayISODate();
    if (today < min) return;
    onChange(today);
    setViewMonth(startOfMonth(new Date()));
    setOpen(false);
  };

  const clearDate = () => {
    onChange('');
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn('date-picker', className)}>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        id={id}
        type="button"
        className={cn('date-picker-trigger field-input', open && 'is-open')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={cn('date-picker-value', !value && 'is-placeholder')}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <span className="date-picker-icon">
          <CalendarIcon />
        </span>
      </button>

      {open && (
        <div
          id={listboxId}
          className="date-picker-popover"
          role="dialog"
          aria-label="Choose preferred date"
        >
          <div className="date-picker-header">
            <button
              type="button"
              className="date-picker-nav"
              aria-label="Previous month"
              disabled={!canGoPrev}
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
            >
              <ChevronIcon direction="prev" />
            </button>
            <p className="date-picker-month">{formatMonthYear(viewMonth)}</p>
            <button
              type="button"
              className="date-picker-nav"
              aria-label="Next month"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
            >
              <ChevronIcon direction="next" />
            </button>
          </div>

          <div className="date-picker-weekdays" aria-hidden="true">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="date-picker-grid" role="grid" aria-label={formatMonthYear(viewMonth)}>
            {cells.map((cell, index) => {
              if (!cell) {
                return <span key={`empty-${index}`} className="date-picker-day is-empty" />;
              }

              const disabled = cell.iso < min;
              const isSelected = cell.iso === value;
              const isToday = cell.iso === todayISODate();

              return (
                <button
                  key={cell.iso}
                  type="button"
                  role="gridcell"
                  disabled={disabled}
                  aria-disabled={disabled}
                  aria-selected={isSelected}
                  aria-label={formatDisplayDate(cell.iso)}
                  className={cn(
                    'date-picker-day',
                    disabled && 'is-disabled',
                    isSelected && 'is-selected',
                    isToday && 'is-today',
                  )}
                  onClick={() => selectDate(cell.iso)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className="date-picker-footer">
            <button type="button" className="date-picker-footer-btn" onClick={clearDate}>
              Clear
            </button>
            <button
              type="button"
              className="date-picker-footer-btn is-accent"
              onClick={goToday}
              disabled={todayISODate() < min}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
