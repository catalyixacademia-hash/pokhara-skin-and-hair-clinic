import { useEffect, useRef } from 'react';

export function useDebouncedSave<T>(value: T | null, onSave: (value: T) => void, delayMs = 800): void {
  const isFirst = useRef(true);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (value === null) {
      isFirst.current = true;
      return;
    }

    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      onSaveRef.current(value);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
}
