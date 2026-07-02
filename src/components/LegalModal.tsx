import { useEffect, useRef } from 'react';
import type { LegalDocument } from '../data/legal';

type LegalModalProps = {
  doc: LegalDocument | null;
  onClose: () => void;
};

export default function LegalModal({ doc, onClose }: LegalModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!doc) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [doc, onClose]);

  if (!doc) return null;

  return (
    <div
      className="legal-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div className="legal-modal-panel" onClick={(e) => e.stopPropagation()}>
        <header className="legal-modal-header">
          <h2 id="legal-modal-title" className="font-display text-2xl text-ink">
            {doc.title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="legal-modal-close touch-target"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="legal-modal-body">
          <p className="font-body text-base text-muted leading-relaxed">{doc.intro}</p>
          {doc.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h3 className="font-display text-lg text-ink">{section.heading}</h3>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="font-body text-base text-muted leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
