import type { Transition, Variants } from 'framer-motion';

/** Clinical Serenity ease — matches --ease-out in index.css */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Deliberately unhurried — scroll reveals should feel calm, not snappy. */
export const duration = {
  fast: 0.4,
  base: 0.85,
  slow: 1.15,
} as const;

/** Softer travel distances read better on phones/tablets. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0 },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function baseTransition(delay = 0): Transition {
  return {
    duration: duration.base,
    ease: easeOut,
    delay,
  };
}

/** Trigger a bit earlier on scroll so slow animations finish while content is still central. */
export const viewportOnce = { once: true, margin: '-4% 0px -6% 0px', amount: 0.15 } as const;
