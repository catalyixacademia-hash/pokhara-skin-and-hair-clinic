import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbGalleryItem } from '../types/cms';
import {
  fallbackGallery,
  isStockGalleryUrl,
  mapGalleryRow,
  type GalleryItem,
} from '../data/gallery';

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>(fallbackGallery);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('gallery_items')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data?.length) {
          const curated = data
            .map((row) => mapGalleryRow(row as DbGalleryItem))
            .filter((item) => !isStockGalleryUrl(item.imageUrl));
          if (curated.length > 0) {
            setItems(curated);
            setFromDb(true);
          } else {
            // Keep clinic photography when CMS only has Pexels seed rows.
            setItems(fallbackGallery);
            setFromDb(false);
          }
        }
        setLoading(false);
      });
  }, []);

  return { items, loading, fromDb };
}
