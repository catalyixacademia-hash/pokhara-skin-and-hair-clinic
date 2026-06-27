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
    <div className={cn('mb-10 md:mb-12 max-w-2xl', className)}>
      {index && (
        <IndexMarker className="mb-4" inverted={inverted}>
          {index}
        </IndexMarker>
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
            'font-body text-base mt-4 leading-relaxed max-w-xl',
            inverted ? 'text-paper/70' : 'text-muted',
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
