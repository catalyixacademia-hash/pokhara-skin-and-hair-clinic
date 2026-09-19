import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { baseTransition, fadeLeft, fadeRight, fadeUp, viewportOnce } from './variants';

type RevealDirection = 'up' | 'left' | 'right';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
};

const directionVariants = {
  up: fadeUp,
  left: fadeLeft,
  right: fadeRight,
} as const;

export default function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={directionVariants[direction]}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={baseTransition(delay)}
    >
      {children}
    </motion.div>
  );
}
