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
  const categoryClass =
    category === 'hair' ? 'category-tag--hair' : 'category-tag';

  if (featured) {
    const CardTag = onSelect ? 'button' : 'article';
    return (
      <CardTag
        type={onSelect ? 'button' : undefined}
        onClick={onSelect}
        className={cn(
          'treatment-featured flex flex-col h-full text-left group transition-all duration-300',
          onSelect && 'treatment-row--interactive hover:border-ink hover:shadow-sm cursor-pointer',
          className
        )}
      >
        {img && (
          <div className="mb-4 overflow-hidden rounded-[var(--radius-sm)] border border-line aspect-[4/3] bg-paper w-full">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <span className={cn('category-tag block mb-3', category === 'hair' && 'category-tag--hair')}>
          {category === 'skin' ? 'Skin care' : category === 'hair' ? 'Hair restoration' : 'Aesthetic'}
        </span>
        <h3 className="font-display text-h3 text-ink mb-2">{title}</h3>
        <p className="font-body text-sm text-muted leading-relaxed flex-grow">{description}</p>
        {onSelect && (
          <div className="mt-4 pt-3 border-t border-line w-full flex items-center justify-between font-mono text-xs text-muted group-hover:text-ink transition-colors duration-200">
            <span>Request visit</span>
            <span>→</span>
          </div>
        )}
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
        <div className="w-16 h-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-paper">
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className={cn('category-tag block mb-1', categoryClass)}>
          {category === 'skin' ? 'Skin' : category === 'hair' ? 'Hair' : 'Aesthetic'}
        </span>
        <h3 className="font-display text-base text-ink mb-1">{title}</h3>
        <p className="font-body text-sm text-muted leading-relaxed line-clamp-2">{description}</p>
      </div>
      {onSelect && (
        <span className="font-mono text-sm text-muted shrink-0 pt-1" aria-hidden>
          →
        </span>
      )}
    </Tag>
  );
}
