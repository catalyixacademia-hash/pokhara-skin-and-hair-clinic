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
    imageUrl: '/images/clinic/interior-waiting.webp',
    label: 'Reception & waiting',
    tag: 'Clinic',
    isTall: false,
  },
  {
    id: 'fallback-reception',
    imageUrl: '/images/hero/clinic-hero.webp',
    label: 'Clinic reception',
    tag: 'Nayabazar',
    isTall: true,
  },
  {
    id: 'fallback-consult',
    imageUrl: '/images/treatments/hair/hair-consultation.webp',
    label: 'Consultation space',
    tag: 'Care',
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
