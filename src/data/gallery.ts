import type { DbGalleryItem } from '../types/cms';

export type GalleryItem = {
  id: string;
  imageUrl: string;
  label: string;
  tag: string | null;
  isTall: boolean;
};

const STORAGE =
  'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/gallery';

/**
 * Curated “Inside the clinic” photos. Used as the public fallback and as the
 * admin “Restore clinic photos” seed set. Prefer Storage URLs so admin preview
 * and the live site share the same assets.
 */
export const fallbackGallery: GalleryItem[] = [
  {
    id: 'fallback-waiting',
    imageUrl: `${STORAGE}/interior-waiting.webp`,
    label: 'Reception & waiting',
    tag: 'Clinic',
    isTall: false,
  },
  {
    id: 'fallback-welcome',
    imageUrl: `${STORAGE}/welcome-board.webp`,
    label: 'Welcome — coffee & cookies corner',
    tag: 'Visit',
    isTall: true,
  },
];

/** Local paths kept for offline / first paint before Storage resolves. */
export const localGalleryFallback: GalleryItem[] = [
  {
    id: 'fallback-waiting-local',
    imageUrl: '/images/clinic/interior-waiting.webp?v=3',
    label: 'Reception & waiting',
    tag: 'Clinic',
    isTall: false,
  },
  {
    id: 'fallback-welcome-local',
    imageUrl: '/images/clinic/welcome-board.webp?v=3',
    label: 'Welcome — coffee & cookies corner',
    tag: 'Visit',
    isTall: true,
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

/** True when a CMS URL is illustrative stock, not clinic-owned media. */
export function isStockGalleryUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes('pexels.com') ||
    lower.includes('unsplash.com') ||
    lower.includes('images.unsplash')
  );
}

export function isHeroCropUrl(url: string): boolean {
  return url.toLowerCase().includes('clinic-hero');
}

/**
 * Merge CMS rows with clinic fallbacks: CMS wins for matching labels, then any
 * extra admin-uploaded photos append. Stock and hero-crop URLs are dropped.
 */
export function mergeGalleryItems(cmsItems: GalleryItem[]): GalleryItem[] {
  const curated = cmsItems.filter(
    (item) => !isStockGalleryUrl(item.imageUrl) && !isHeroCropUrl(item.imageUrl),
  );

  if (curated.length === 0) {
    return localGalleryFallback;
  }

  const byLabel = new Map(curated.map((item) => [item.label.toLowerCase(), item]));
  const merged: GalleryItem[] = [];

  for (const fallback of fallbackGallery) {
    merged.push(byLabel.get(fallback.label.toLowerCase()) ?? fallback);
    byLabel.delete(fallback.label.toLowerCase());
  }

  // Append admin-added photos in CMS sort order (already reflected in curated).
  for (const item of curated) {
    if (!byLabel.has(item.label.toLowerCase())) continue;
    merged.push(item);
    byLabel.delete(item.label.toLowerCase());
  }

  return merged;
}
