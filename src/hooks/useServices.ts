import { useEffect, useState } from 'react';
import type { ServiceItem } from '../data/services';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { fallbackServices } from '../types/cms';

type ServicesByCategory = {
  skin: ServiceItem[];
  hair: ServiceItem[];
  aesthetic: ServiceItem[];
  loading: boolean;
  fromDb: boolean;
};

type DbServiceRow = {
  title: string;
  image_url: string | null;
  category_id: string;
  is_published: boolean;
};

type DbCategory = {
  id: string;
  slug: string;
};

function isUsableCmsImage(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  const lower = url.toLowerCase();
  if (lower.includes('pexels.com') || lower.includes('unsplash.com') || lower.includes('images.unsplash')) {
    return false;
  }
  // Never show Outcomes before/after assets on treatment cards.
  if (lower.includes('/results/') || lower.includes('/clinic-media/results/')) {
    return false;
  }
  return true;
}

function mergeCategory(
  local: ServiceItem[],
  cmsByTitle: Map<string, string>,
): ServiceItem[] {
  return local.map((item) => {
    const cmsImg = cmsByTitle.get(item.title.toLowerCase());
    if (cmsImg) return { ...item, img: cmsImg };
    return item;
  });
}

/**
 * Public Treatments use curated local photography as the baseline.
 * When CMS has a non-stock image_url for a matching title, that URL wins.
 */
export function useServices(): ServicesByCategory {
  const [state, setState] = useState<ServicesByCategory>({
    ...fallbackServices,
    loading: isSupabaseConfigured,
    fromDb: false,
  });

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    Promise.all([
      supabase.from('service_categories').select('id, slug'),
      supabase
        .from('services')
        .select('title, image_url, category_id, is_published')
        .eq('is_published', true),
    ]).then(([catsRes, servicesRes]) => {
      if (catsRes.error || servicesRes.error || !catsRes.data || !servicesRes.data) {
        setState({
          ...fallbackServices,
          loading: false,
          fromDb: false,
        });
        return;
      }

      const slugById = new Map(
        (catsRes.data as DbCategory[]).map((c) => [c.id, c.slug] as const),
      );

      const byCategory = {
        skin: new Map<string, string>(),
        hair: new Map<string, string>(),
        aesthetic: new Map<string, string>(),
      };

      let anyCms = false;
      for (const row of servicesRes.data as DbServiceRow[]) {
        if (!isUsableCmsImage(row.image_url)) continue;
        const slug = slugById.get(row.category_id);
        if (slug !== 'skin' && slug !== 'hair' && slug !== 'aesthetic') continue;
        byCategory[slug].set(row.title.toLowerCase(), row.image_url!.trim());
        anyCms = true;
      }

      setState({
        skin: mergeCategory(fallbackServices.skin, byCategory.skin),
        hair: mergeCategory(fallbackServices.hair, byCategory.hair),
        aesthetic: mergeCategory(fallbackServices.aesthetic, byCategory.aesthetic),
        loading: false,
        fromDb: anyCms,
      });
    });
  }, []);

  return state;
}
