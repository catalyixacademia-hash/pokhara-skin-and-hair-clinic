import type { DbGalleryItem } from '../types/cms';

export type GalleryItem = {
  id: string;
  imageUrl: string;
  label: string;
  tag: string | null;
  isTall: boolean;
};

export const fallbackGallery: GalleryItem[] = [
  {
    id: 'fallback-waiting',
    imageUrl: '/images/clinic/interior-waiting.webp?v=2',
    label: 'Reception & waiting',
    tag: 'Clinic',
    isTall: false,
  },
  {
    id: 'fallback-welcome',
    imageUrl: '/images/clinic/welcome-board.webp',
    label: 'Welcome — coffee & cookies corner',
    tag: 'Visit',
    isTall: true,
  },
  {
    id: 'fallback-reception',
    imageUrl: '/images/hero/clinic-hero.webp?v=9',
    label: 'Clinic reception',
    tag: 'Nayabazar',
    isTall: false,
  },
];

export function mapGalleryRow(row: DbGalleryItem): GalleryItem {
  return {
    id: row.id,
    imageUrl: row.image_url,
    label: row.label,
    tag: row.tag,
    isTall: row.is_tall,
  };
}
