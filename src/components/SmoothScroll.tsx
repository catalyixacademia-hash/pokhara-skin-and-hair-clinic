import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Lenis smooth scroll on desktop only. Disabled for touch and reduced-motion.
 */
export default function SmoothScroll() {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px) and (pointer: fine)');

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) {
      document.documentElement.classList.remove('lenis-active');
      window.__lenis = null;
      return;
    }

    let destroyed = false;
    let rafId = 0;
    let lenis: {
      destroy: () => void;
      raf: (t: number) => void;
      scrollTo: (
        target: string | number | HTMLElement,
        opts?: { offset?: number; immediate?: boolean },
      ) => void;
    } | null = null;

    void import('lenis').then(({ default: Lenis }) => {
      if (destroyed) return;
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
      });
      window.__lenis = lenis;
      document.documentElement.classList.add('lenis-active');

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      window.__lenis = null;
      document.documentElement.classList.remove('lenis-active');
    };
  }, [isDesktop, prefersReducedMotion]);

  return null;
}
