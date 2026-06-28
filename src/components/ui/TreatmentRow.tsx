import { cn } from '../../utils/cn';

type TreatmentRowProps = {
  title: string;
  description: string;
  category?: 'skin' | 'hair' | 'aesthetic';
  featured?: boolean;
  img?: string;
  onSelect?: () => void;
  className?: string;
};

export default function TreatmentRow({
  title,
  description,
  category = 'skin',
  featured = false,
  img,
  onSelect,
  className,
}: TreatmentRowProps) {
  const categoryLabel =
    category === 'skin' ? 'Skin care' : category === 'hair' ? 'Hair restoration' : 'Aesthetic';

  if (featured) {
    const CardTag = onSelect ? 'button' : 'article';
    return (
      <CardTag
        type={onSelect ? 'button' : undefined}
        onClick={onSelect}
        className={cn('treatment-card', onSelect && 'cursor-pointer', className)}
      >
        {img && (
          <div className="treatment-card__image">
            <img src={img} alt={title} loading="lazy" decoding="async" />
          </div>
        )}
        <div className="treatment-card__body">
          <span className={cn('category-tag', category === 'hair' && 'category-tag--hair')}>
            {categoryLabel}
          </span>
          <h3 className="font-display text-xl text-ink">{title}</h3>
          <p className="font-body text-base text-muted leading-relaxed line-clamp-2 flex-grow">
            {description}
          </p>
          {onSelect && (
            <span className="treatment-card__link">
              Request visit
              <span aria-hidden="true">→</span>
            </span>
          )}
        </div>
      </CardTag>
    );
  }

  const Tag = onSelect ? 'button' : 'div';

  return (
    <Tag
      type={onSelect ? 'button' : undefined}
      onClick={onSelect}
      className={cn(
        'treatment-row items-center flex gap-4',
        onSelect && 'treatment-row--interactive',
        className,
      )}
    >
      {img && (
        <div className="w-16 h-12 shrink-0 overflow-hidden rounded-lg border border-line bg-paper">
          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className="category-tag block mb-1">{categoryLabel}</span>
        <h3 className="font-display text-base text-ink mb-1">{title}</h3>
        <p className="font-body text-sm text-muted leading-relaxed line-clamp-2">{description}</p>
      </div>
      {onSelect && (
        <span className="text-accent shrink-0 pt-1" aria-hidden>
          →
        </span>
      )}
    </Tag>
  );
}
