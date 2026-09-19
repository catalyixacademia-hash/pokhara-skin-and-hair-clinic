import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { baseTransition, staggerContainer, staggerItem, viewportOnce } from './variants';

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  /** Render as a semantic list when wrapping <li> children */
  as?: 'div' | 'ul';
  role?: string;
  'aria-label'?: string;
  tabIndex?: number;
};

/** Parent that staggers children that use StaggerItem (or any child with stagger variants). */
export function Stagger({
  children,
  className,
  as = 'div',
  role,
  'aria-label': ariaLabel,
  tabIndex,
}: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as === 'ul' ? motion.ul : motion.div;
  const a11y = { role, 'aria-label': ariaLabel, tabIndex };

  if (prefersReducedMotion) {
    const Static = as === 'ul' ? 'ul' : 'div';
    return (
      <Static className={className} {...a11y}>
        {children}
      </Static>
    );
  }

  return (
    <Tag
      className={cn(className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      {...a11y}
    >
      {children}
    </Tag>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
};

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const MotionTag = as === 'li' ? motion.li : as === 'article' ? motion.article : motion.div;

  return (
    <MotionTag className={cn(className)} variants={staggerItem} transition={baseTransition()}>
      {children}
    </MotionTag>
  );
}
