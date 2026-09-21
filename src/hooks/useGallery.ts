import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbGalleryItem } from '../types/cms';
import {
  localGalleryFallback,
  mapGalleryRow,
  mergeGalleryItems,
  type GalleryItem,
} from '../data/gallery';

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>(localGalleryFallback);
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
        if (!error && data) {
          const mapped = data.map((row) => mapGalleryRow(row as DbGalleryItem));
          const merged = mergeGalleryItems(mapped);
          setItems(merged);
          setFromDb(mapped.length > 0);
        }
        setLoading(false);
      });
  }, []);

  return { items, loading, fromDb };
}
