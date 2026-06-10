import { cn } from '../../utils/cn';

export type CategoryVariant = 'skin' | 'hair' | 'aesthetic';

type CategoryBadgeProps = {
  variant: CategoryVariant;
  label?: string;
  className?: string;
};

const labels: Record<CategoryVariant, string> = {
  skin: 'Skin Treatments',
  hair: 'Hair Restoration',
  aesthetic: 'Aesthetic Procedures',
};

export default function CategoryBadge({ variant, label, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block font-sans text-[9px] tracking-[0.25em] uppercase px-3 py-1',
        variant === 'skin' && 'category-skin',
        variant === 'hair' && 'category-hair',
        variant === 'aesthetic' && 'category-aesthetic',
        className,
      )}
    >
      {label ?? labels[variant]}
    </span>
  );
}
