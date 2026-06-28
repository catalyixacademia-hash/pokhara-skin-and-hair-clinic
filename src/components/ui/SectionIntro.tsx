import { cn } from '../../utils/cn';
import IndexMarker from './IndexMarker';

type SectionIntroProps = {
  index?: string;
  title: React.ReactNode;
  lede?: string;
  className?: string;
  inverted?: boolean;
};

export default function SectionIntro({
  index,
  title,
  lede,
  className,
  inverted = false,
}: SectionIntroProps) {
  return (
    <div className={cn('mb-10 md:mb-14 lg:mb-16 space-y-3 md:space-y-4 max-w-2xl', className)}>
      {index && (
        <IndexMarker inverted={inverted}>{index}</IndexMarker>
      )}
      <h2
        className={cn(
          'font-display text-h2',
          inverted ? 'text-paper' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            'font-body text-base leading-relaxed max-w-2xl',
            inverted ? 'text-paper/70' : 'text-muted',
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
