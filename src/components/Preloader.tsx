import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Minimal logo-draw preloader. Skipped for reduced-motion and Save-Data.
 */
export default function Preloader() {
  const prefersReducedMotion = useReducedMotion();
  const [done, setDone] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const saveData =
      typeof navigator !== 'undefined' &&
      'connection' in navigator &&
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

    if (prefersReducedMotion || saveData) {
      setDone(true);
      setHide(true);
      return;
    }

    const t1 = window.setTimeout(() => setDone(true), 900);
    const t2 = window.setTimeout(() => setHide(true), 1300);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [prefersReducedMotion]);

  if (hide) return null;

  return (
    <div
      className="preloader"
      style={{
        clipPath: done ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
        transition: 'clip-path 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      aria-hidden="true"
    >
      <svg className="preloader__mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d="M24 4c-2 6-8 10-14 12 6 2 12 8 14 16 2-8 8-14 14-16-6-2-12-6-14-12z"
          stroke="#005f56"
          strokeWidth="1.6"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 120,
            strokeDashoffset: done ? 0 : 120,
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
    </div>
  );
}
