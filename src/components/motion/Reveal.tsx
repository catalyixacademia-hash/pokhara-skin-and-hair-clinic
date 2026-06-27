import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
