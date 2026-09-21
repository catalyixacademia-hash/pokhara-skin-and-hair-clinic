import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbHeroSlide } from '../types/cms';

const LOCAL_HERO = {
  desktopSrc: '/images/hero/clinic-hero@1920.jpg?v=9',
  webpSrc: '/images/hero/clinic-hero.webp?v=9',
  jpegSrc: '/images/hero/clinic-hero.jpg?v=9',
};

function isStockOrEmpty(url: string | null | undefined): boolean {
  if (!url?.trim()) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('pexels.com') ||
    lower.includes('unsplash.com') ||
    lower.includes('images.unsplash')
  );
}

export type HeroMedia = {
  /** When set, a single CMS image replaces the curated reception picture sources. */
  cmsUrl: string | null;
  alt: string;
  local: typeof LOCAL_HERO;
  fromDb: boolean;
  loading: boolean;
};

export function useHeroMedia(): HeroMedia {
  const [cmsUrl, setCmsUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState(
    'Pokhara Skin & Hair Clinic reception — Nayabazar-8, opposite GMC Hospital, Pokhara',
  );
  const [fromDb, setFromDb] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('hero_slides')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          const row = data as DbHeroSlide;
          if (!isStockOrEmpty(row.image_url)) {
            setCmsUrl(row.image_url.trim());
            setFromDb(true);
          }
          if (row.alt?.trim()) setAlt(row.alt.trim());
        }
        setLoading(false);
      });
  }, []);

  return { cmsUrl, alt, local: LOCAL_HERO, fromDb, loading };
}
