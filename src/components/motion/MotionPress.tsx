import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn';

type MotionPressProps = {
  children: React.ReactNode;
  className?: string;
  /** Hover lift in px (default 3) */
  lift?: number;
};

/**
 * Soft hover lift + press for interactive surfaces.
 * Prefer wrapping non-nested interactive roots (cards), not buttons that already have CSS press.
 */
export default function MotionPress({ children, className, lift = 3 }: MotionPressProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      whileHover={{ y: -lift }}
      whileTap={{ y: 0, scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 280, damping: 32, mass: 0.9 }}
    >
      {children}
    </motion.div>
  );
}
