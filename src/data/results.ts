import type { ResultItem } from '../hooks/useResults';

/**
 * Static clinic before/after cases shown when CMS results are empty.
 * Individual results vary — not a guarantee of outcome.
 */
export const fallbackResults: ResultItem[] = [
  {
    id: 'fallback-acne',
    label: 'Acne & pigmentation care',
    beforeUrl: '/images/results/acne-before.webp',
    afterUrl: '/images/results/acne-after.webp',
    duration: 'Illustrative images · individual results vary',
    category: 'skin',
  },
  {
    id: 'fallback-peel',
    label: 'Pigmentation & peel refinement',
    beforeUrl: '/images/results/peel-before.webp',
    afterUrl: '/images/results/peel-after.webp',
    duration: 'Illustrative images · individual results vary',
    category: 'skin',
  },
  {
    id: 'fallback-hair',
    label: 'Hair restoration',
    beforeUrl: '/images/results/hair-before.webp',
    afterUrl: '/images/results/hair-after.webp',
    duration: 'Illustrative images · individual results vary',
    category: 'hair',
  },
];
