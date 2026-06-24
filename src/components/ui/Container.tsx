import { cn } from '../../utils/cn';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return <div className={cn('container-site', className)}>{children}</div>;
}
