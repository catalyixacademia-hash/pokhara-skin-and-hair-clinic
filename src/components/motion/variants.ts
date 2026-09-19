import type { Transition, Variants } from 'framer-motion';

/** Clinical Serenity ease — matches --ease-out in index.css */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.28,
  base: 0.5,
  slow: 0.7,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0 },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

export function baseTransition(delay = 0): Transition {
  return {
    duration: duration.base,
    ease: easeOut,
    delay,
  };
}

export const viewportOnce = { once: true, margin: '-8% 0px' } as const;
