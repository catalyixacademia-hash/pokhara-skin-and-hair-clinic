import { cn } from '../../utils/cn';

type TreatmentRowProps = {
  title: string;
  description: string;
  category?: 'skin' | 'hair' | 'aesthetic';
  featured?: boolean;
  onSelect?: () => void;
  className?: string;
};

export default function TreatmentRow({
  title,
  description,
  category = 'skin',
  featured = false,
  onSelect,
  className,
}: TreatmentRowProps) {
  const categoryClass =
    category === 'hair' ? 'category-tag--hair' : 'category-tag';

  if (featured) {
    return (
      <article className={cn('treatment-featured', className)}>
        <span className={cn('category-tag block mb-3', category === 'hair' && 'category-tag--hair')}>
          {category === 'skin' ? 'Skin care' : category === 'hair' ? 'Hair restoration' : 'Aesthetic'}
        </span>
        <h3 className="font-display text-h3 text-ink mb-2">{title}</h3>
        <p className="font-body text-sm text-muted leading-relaxed">{description}</p>
      </article>
    );
  }

  const Tag = onSelect ? 'button' : 'div';

  return (
    <Tag
      type={onSelect ? 'button' : undefined}
      onClick={onSelect}
      className={cn(
        'treatment-row',
        onSelect && 'treatment-row--interactive',
        className,
      )}
    >
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
