import { cn } from '../../utils/cn';

type SectionHeaderProps = {
  label: string;
  title: React.ReactNode;
  lede?: string;
  className?: string;
  align?: 'left' | 'center';
  inverted?: boolean;
};

export default function SectionHeader({
  label,
  title,
  lede,
  className,
  align = 'left',
  inverted = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' && 'text-center mx-auto max-w-2xl',
        className,
      )}
    >
      <p className={cn('section-label mb-3', inverted && 'text-paper/60')}>{label}</p>
      <h2 className={cn('font-serif text-h2 leading-tight-editorial max-w-2xl', inverted ? 'text-paper' : 'text-ink')}>
        {title}
      </h2>
      {lede && (
        <p className={cn('font-sans text-base mt-4 max-w-xl leading-relaxed', inverted ? 'text-paper/70' : 'text-muted')}>
          {lede}
        </p>
      )}
    </div>
  );
}
