import { useEffect, useState } from 'react';

/**
 * Tracks which section the visitor is currently reading so nav state reflects
 * the page rather than the last thing that was clicked.
 *
 * This measures positions on scroll rather than using IntersectionObserver:
 * the sections here vary hugely in height (a 2,000px treatments block next to a
 * 400px anchor), and with an observer whichever tall section overlaps the
 * viewport wins regardless of where the visitor actually is. Picking the last
 * heading to have crossed the reading line is both simpler and more accurate.
 */
export function useActiveSection(hrefs: readonly string[], navHeight = 88): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      // Nothing is active while the visitor is still on the hero.
      if (window.scrollY < 140) {
        setActive(null);
        return;
      }

      // At the very bottom the last section is active even if its top never
      // crosses the line (short trailing sections would otherwise never light).
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(hrefs[hrefs.length - 1] ?? null);
        return;
      }

      /*
       * The line sits below the header by more than the header's own height:
       * anchors carry their own `scroll-mt`, so a clicked target can settle
       * ~170px down. A shallower line would leave the link the visitor just
       * clicked un-highlighted.
       */
      const line = navHeight + 96;
      let current: string | null = null;

      for (const href of hrefs) {
        const el = document.querySelector(href);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = href;
      }

      setActive(current);
    };

    // Read-only measurement of a handful of elements, so running it straight
    // off the passive scroll listener costs less than scheduling would.
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [hrefs, navHeight]);

  return active;
}
