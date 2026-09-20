import { useEffect, useState } from 'react';

/**
 * Tracks which section the visitor is currently reading so nav state reflects
 * the page rather than the last thing that was clicked.
 *
 * This measures positions on scroll rather than using IntersectionObserver:
 * the sections here vary hugely in height, and with an observer whichever tall
 * section overlaps the viewport wins regardless of where the visitor actually is.
 *
 * Optional `clearAfter` maps: when the reading line has passed a landmark that
 * is not in `hrefs` (e.g. gallery after results), clear the stuck parent link.
 */
export function useActiveSection(
  hrefs: readonly string[],
  navHeight = 88,
  clearAfter?: Readonly<Record<string, readonly string[]>>,
): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      if (window.scrollY < 140) {
        setActive(null);
        return;
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(hrefs[hrefs.length - 1] ?? null);
        return;
      }

      const line = navHeight + 96;
      let current: string | null = null;
      let currentTop = -Infinity;

      for (const href of hrefs) {
        const el = document.querySelector(href);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top >= currentTop) {
          current = href;
          currentTop = top;
        }
      }

      /*
       * If a non-nav landmark (gallery, testimonials, faq, aesthetics panel)
       * sits below the active nav section but closer to the reading line,
       * clear the sticky parent so Results does not stay lit through half the page.
       */
      if (current && clearAfter?.[current]) {
        for (const landmark of clearAfter[current]) {
          const el = document.querySelector(landmark);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top <= line && top > currentTop) {
            current = null;
            break;
          }
        }
      }

      setActive(current);
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [hrefs, navHeight, clearAfter]);

  return active;
}
