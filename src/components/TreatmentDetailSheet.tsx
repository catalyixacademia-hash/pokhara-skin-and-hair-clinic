import { useEffect, useId, useRef } from 'react';
import type { ServiceItem } from '../data/services';

type TreatmentDetailSheetProps = {
  service: ServiceItem | null;
  category: 'skin' | 'hair' | 'aesthetic';
  open: boolean;
  onClose: () => void;
};

export default function TreatmentDetailSheet({
  service,
  category,
  open,
  onClose,
}: TreatmentDetailSheetProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !service) return null;

  const categoryLabel =
    category === 'skin' ? 'Skin care' : category === 'hair' ? 'Hair restoration' : 'Aesthetic';

  const scrollToContact = () => {
    onClose();
    window.setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="treatment-sheet" role="presentation">
      <button
        type="button"
        className="treatment-sheet__backdrop"
        aria-label="Close treatment details"
        onClick={onClose}
      />
      <div
        className="treatment-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="treatment-sheet__header">
          <span className={`category-tag ${category === 'hair' ? 'category-tag--hair' : ''}`}>
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
            <img src={service.img} alt="" loading="lazy" decoding="async" />
          </div>
        )}

        <h2 id={titleId} className="font-display text-2xl text-ink mt-4">
          {service.title}
        </h2>
        <p className="font-body text-base text-muted leading-relaxed mt-3">{service.description}</p>

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
      </div>
    </div>
  );
}
