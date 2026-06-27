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
        'font-mono text-[0.8125rem] font-medium tracking-wide',
        inverted ? 'text-paper/50' : 'text-accent',
        className,
      )}
    >
      {children}
    </span>
  );
}
