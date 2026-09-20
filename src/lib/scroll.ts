/**
 * Smooth-scroll helpers that prefer Lenis when active, else native scroll.
 */

type LenisLike = {
  scrollTo: (
    target: string | number | HTMLElement,
    opts?: { offset?: number; immediate?: boolean },
  ) => void;
};

declare global {
  interface Window {
    __lenis?: LenisLike | null;
  }
}

export function scrollToId(id: string, opts?: { immediate?: boolean }) {
  const selector = id.startsWith('#') ? id : `#${id}`;
  const el = document.querySelector(selector);
  if (!el) return;

  const nav = document.querySelector('.site-header') as HTMLElement | null;
  const offset = -(nav?.offsetHeight ?? 72) - 8;
  const immediate = opts?.immediate ?? false;

  if (window.__lenis) {
    window.__lenis.scrollTo(selector, { offset, immediate });
    return;
  }

  el.scrollIntoView({
    behavior: immediate ? 'auto' : 'smooth',
    block: 'start',
  });
}

export function scrollToTop(opts?: { immediate?: boolean }) {
  const immediate = opts?.immediate ?? false;
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { immediate });
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
}
