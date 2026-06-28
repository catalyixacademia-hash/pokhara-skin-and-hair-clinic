import { cn } from '../../utils/cn';

type IndexMarkerProps = {
  children: React.ReactNode;
  className?: string;
  inverted?: boolean;
};

export default function IndexMarker({ children, className, inverted = false }: IndexMarkerProps) {
  return (
    <span
      className={cn(
        'section-label',
        inverted ? 'text-paper/70' : 'text-accent',
        className,
      )}
    >
      {children}
    </span>
  );
}
