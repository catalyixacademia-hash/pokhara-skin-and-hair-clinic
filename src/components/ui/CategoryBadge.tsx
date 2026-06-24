import { cn } from '../../utils/cn';

type CategoryBadgeProps = {
  variant: 'skin' | 'hair' | 'aesthetic';
  className?: string;
};

const labels = {
  skin: 'Skin Treatments',
  hair: 'Hair Restoration',
  aesthetic: 'Aesthetic Procedures',
} as const;

export default function CategoryBadge({ variant, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        variant === 'skin' && 'category-skin',
        variant === 'hair' && 'category-hair',
        variant === 'aesthetic' && 'category-aesthetic',
        className,
      )}
    >
      {labels[variant]}
    </span>
  );
}
