import { cn } from '../../utils/cn';
import IndexMarker from './IndexMarker';

type SectionIntroProps = {
  index?: string;
  title: React.ReactNode;
  /** Wire this to the section's `aria-labelledby` so the landmark is named. */
  titleId?: string;
  lede?: string;
  className?: string;
  inverted?: boolean;
};

export default function SectionIntro({
  index,
  title,
  titleId,
  lede,
  className,
  inverted = false,
}: SectionIntroProps) {
  return (
    <div className={cn('mb-8 md:mb-12 lg:mb-14 max-w-2xl', className)}>
      {index && <IndexMarker inverted={inverted}>{index}</IndexMarker>}
      <h2
        id={titleId}
        className={cn(
          'font-display text-h2 mt-2',
          inverted ? 'text-paper' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            'font-body text-body-lg leading-relaxed max-w-2xl mt-3 md:mt-4',
            inverted ? 'text-paper/70' : 'text-muted',
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
