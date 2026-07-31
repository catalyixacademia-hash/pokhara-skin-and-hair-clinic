import type { ResultItem } from '../hooks/useResults';

/**
 * Static illustrative fallbacks when CMS results are empty.
 * Not clinical before/after claims — photography placeholders until staff publish real cases.
 */
export const fallbackResults: ResultItem[] = [
  {
    id: 'fallback-acne',
    label: 'Acne & pigmentation care',
    beforeUrl: '/images/treatments/skin/skin-analyzer.webp',
    afterUrl: '/images/treatments/skin/acne-pigmentation.webp',
    duration: 'Illustrative · individual results vary',
    category: 'skin',
  },
  {
    id: 'fallback-peel',
    label: 'Chemical peel refinement',
    beforeUrl: '/images/treatments/skin/hydrafacial.webp',
    afterUrl: '/images/treatments/skin/chemical-peels.webp',
    duration: 'Illustrative · individual results vary',
    category: 'skin',
  },
  {
    id: 'fallback-hair',
    label: 'Hair restoration protocols',
    beforeUrl: '/images/treatments/hair/hair-consultation.webp',
    afterUrl: '/images/treatments/hair/prp-therapy.webp',
    duration: 'Illustrative · individual results vary',
    category: 'hair',
  },
];
