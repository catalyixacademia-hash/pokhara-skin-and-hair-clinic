import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import type { ServiceItem } from '../data/services';
import { fallbackServices } from '../types/cms';

type ServicesByCategory = {
  skin: ServiceItem[];
  hair: ServiceItem[];
  aesthetic: ServiceItem[];
  loading: boolean;
  fromDb: boolean;
};

function mapRow(row: {
  title: string;
  description: string;
  benefits: string[];
  result: string;
  image_url: string | null;
  featured: boolean;
}): ServiceItem {
  return {
    title: row.title,
    description: row.description,
    benefits: row.benefits,
    result: row.result,
    img: row.image_url ?? '',
    featured: row.featured,
  };
}

export function useServices(): ServicesByCategory {
  const [state, setState] = useState<ServicesByCategory>({
    skin: fallbackServices.skin,
    hair: fallbackServices.hair,
    aesthetic: fallbackServices.aesthetic,
    loading: isSupabaseConfigured,
    fromDb: false,
  });

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    async function load() {
      const { data: categories } = await supabase!
        .from('service_categories')
        .select('id, slug');

      const { data: services } = await supabase!
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');

      if (!categories?.length || !services?.length) {
        setState((s) => ({ ...s, loading: false }));
        return;
      }

      const slugById = Object.fromEntries(categories.map((c) => [c.id, c.slug as string]));
      const grouped: Record<string, ServiceItem[]> = { skin: [], hair: [], aesthetic: [] };

      for (const row of services) {
        const slug = slugById[row.category_id];
        if (slug && grouped[slug]) {
          grouped[slug].push(mapRow({ ...row, benefits: row.benefits as string[] }));
        }
      }

      setState({
        skin: grouped.skin.length ? grouped.skin : fallbackServices.skin,
        hair: grouped.hair.length ? grouped.hair : fallbackServices.hair,
        aesthetic: grouped.aesthetic.length ? grouped.aesthetic : fallbackServices.aesthetic,
        loading: false,
        fromDb: true,
      });
    }

    load();
  }, []);

  return state;
}
