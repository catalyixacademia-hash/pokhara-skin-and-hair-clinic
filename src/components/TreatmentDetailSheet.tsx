import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef } from 'react';
import type { ServiceItem } from '../data/services';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { scrollToId } from '../lib/scroll';
import { easeOut } from './motion/variants';

type TreatmentDetailSheetProps = {
  service: ServiceItem | null;
  category: 'skin' | 'hair' | 'aesthetic';
  open: boolean;
  onClose: () => void;
  layoutId?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function TreatmentDetailSheet({
  service,
  category,
  open,
  onClose,
  layoutId,
}: TreatmentDetailSheetProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const dragStartY = useRef<number | null>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      restoreFocusRef.current?.focus();
    };
  }, [open, onClose]);

  const categoryLabel =
    category === 'skin' ? 'Skin care' : category === 'hair' ? 'Hair restoration' : 'Aesthetic';

  const scrollToContact = () => {
    onClose();
    window.setTimeout(() => {
      scrollToId('#contact');
    }, 100);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isMobile) return;
    dragStartY.current = e.clientY;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isMobile || dragStartY.current == null) return;
    const delta = e.clientY - dragStartY.current;
    dragStartY.current = null;
    if (delta > 80) onClose();
  };

  return (
    <AnimatePresence>
      {open && service && (
        <div className="treatment-sheet" role="presentation">
          <motion.button
            type="button"
            className="treatment-sheet__backdrop"
            aria-label="Close treatment details"
            onClick={onClose}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            ref={panelRef}
            className="treatment-sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={
              prefersReducedMotion
                ? false
                : isMobile
                  ? { y: '100%' }
                  : { opacity: 0, scale: 0.97, y: 16 }
            }
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={
              isMobile
                ? { y: '100%' }
                : { opacity: 0, scale: 0.98, y: 12 }
            }
            transition={{ duration: 0.4, ease: easeOut }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div className="treatment-sheet__handle" aria-hidden="true" />
            <div className="treatment-sheet__header">
              <span
                className={`category-tag ${
                  category === 'hair'
                    ? 'category-tag--hair'
                    : category === 'aesthetic'
                      ? 'category-tag--aesthetic'
                      : ''
                }`}
              >
                {categoryLabel}
              </span>
              <button
                ref={closeRef}
                type="button"
                className="treatment-sheet__close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {service.img && (
              <div className="treatment-sheet__media">
                <motion.img
                  layoutId={layoutId}
                  src={service.img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}

            <h2 id={titleId} className="font-display text-2xl text-ink mt-4">
              {service.title}
            </h2>
            <p className="font-body text-base text-muted leading-relaxed mt-3">
              {service.description}
            </p>

            {service.benefits.length > 0 && (
              <div className="mt-6">
                <p className="text-label text-ink mb-3">Benefits</p>
                <ul className="treatment-sheet__list">
                  {service.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {service.result && (
              <p className="font-body text-sm text-secondary mt-6 leading-relaxed">
                Typical outcome: {service.result}
              </p>
            )}

            <button type="button" className="btn-primary w-full mt-8" onClick={scrollToContact}>
              Book a consultation
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
