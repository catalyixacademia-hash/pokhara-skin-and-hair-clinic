import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  inView?: boolean;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  inView = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-14', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.7 }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="divider-thin" />
        <span className="section-eyebrow">{eyebrow}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-light text-charcoal leading-tight-editorial max-w-2xl"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sans text-warm-gray text-sm font-light mt-4 max-w-xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
