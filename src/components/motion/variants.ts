import type { Transition, Variants } from 'framer-motion';

/** Clinical Serenity ease — matches --ease-out in index.css */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Calm motion — 0.5–0.8s, short travel distances. */
export const duration = {
  fast: 0.32,
  base: 0.7,
  slow: 0.85,
} as const;

/** Softer travel distances (16–28px) read better on phones/tablets. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
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
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
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
export const viewportOnce = { once: true, margin: '0px 0px -12% 0px', amount: 0.12 } as const;
