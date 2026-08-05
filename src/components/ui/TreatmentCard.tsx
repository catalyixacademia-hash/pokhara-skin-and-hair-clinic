import { cn } from '../../utils/cn';

export type TreatmentCategory = 'skin' | 'hair' | 'aesthetic';

export const categoryLabels: Record<TreatmentCategory, string> = {
  skin: 'Skin care',
  hair: 'Hair restoration',
  aesthetic: 'Aesthetic',
};

type BaseProps = {
  title: string;
  description: string;
  img?: string;
  category?: TreatmentCategory;
  onSelect: () => void;
  className?: string;
  id?: string;
};

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h13m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Image-led card for the primary skin specialty.
 *
 * The heading holds the only button and that button is stretched over the whole
 * card via `::after`, so the card keeps a full-surface tap target while the
 * heading stays in the document outline and the accessible name stays short.
 */
export function TreatmentCard({
  title,
  description,
  img,
  category = 'skin',
  onSelect,
  className,
  id,
}: BaseProps) {
  return (
    <article id={id} className={cn('treatment-card scroll-mt-28', className)}>
      {img && (
        <div className="treatment-card__image">
          <img
            src={img}
            alt=""
            loading="lazy"
            decoding="async"
            width={640}
            height={480}
          />
        </div>
      )}
      <div className="treatment-card__body">
        <span className={cn('category-tag', category === 'hair' && 'category-tag--hair')}>
          {categoryLabels[category]}
        </span>
        <h3 className="treatment-card__title">
          <button type="button" className="treatment-card__trigger" onClick={onSelect}>
            {title}
          </button>
        </h3>
        <p className="treatment-card__desc">{description}</p>
        <span className="treatment-card__cue" aria-hidden="true">
          View details
          <ArrowIcon />
        </span>
      </div>
    </article>
  );
}

/**
 * Compact row for the complementary hair and aesthetic families. Deliberately
 * lighter than {@link TreatmentCard} so skin care stays the visual priority.
 */
export function TreatmentRow({
  title,
  description,
  img,
  onSelect,
  className,
  id,
}: BaseProps) {
  return (
    <article id={id} className={cn('treatment-row scroll-mt-28', className)}>
      {img && (
        <div className="treatment-row__thumb">
          <img
            src={img}
            alt=""
            loading="lazy"
            decoding="async"
            width={136}
            height={136}
          />
        </div>
      )}
      <div className="treatment-row__body">
        <h3 className="treatment-row__title">
          <button type="button" className="treatment-row__trigger" onClick={onSelect}>
            {title}
          </button>
        </h3>
        <p className="treatment-row__desc">{description}</p>
      </div>
      <span className="treatment-row__chev" aria-hidden="true">
        <ChevronIcon />
      </span>
    </article>
  );
}
