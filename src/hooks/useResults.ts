import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export type ResultItem = {
  label: string;
  before: string;
  after: string;
  duration: string;
  category: 'skin' | 'hair';
};

const fallbackSkin: ResultItem[] = [
  {
    label: 'Acne Treatment',
    before: 'https://images.pexels.com/photos/4586728/pexels-photo-4586728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480',
    after: 'https://images.pexels.com/photos/7479960/pexels-photo-7479960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480',
    duration: '8 weeks of treatment',
    category: 'skin',
  },
  {
    label: 'Pigmentation Correction',
    before: 'https://images.pexels.com/photos/3985361/pexels-photo-3985361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480',
    after: 'https://images.pexels.com/photos/15327096/pexels-photo-15327096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480',
    duration: '3 chemical peel sessions',
    category: 'skin',
  },
  {
    label: 'Skin Rejuvenation',
    before: 'https://images.pexels.com/photos/6730032/pexels-photo-6730032.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480',
    after: 'https://images.pexels.com/photos/7479517/pexels-photo-7479517.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480',
    duration: '6-session microneedling course',
    category: 'skin',
  },
];

const fallbackHair: ResultItem[] = [
  {
    label: 'Hair Density Restoration',
    before: 'https://images.pexels.com/photos/7320791/pexels-photo-7320791.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480',
    after: 'https://images.pexels.com/photos/23349910/pexels-photo-23349910.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480',
    duration: '4 PRP sessions over 4 months',
    category: 'hair',
  },
];

export function useResults() {
  const [skinResults, setSkinResults] = useState(fallbackSkin);
  const [hairResults, setHairResults] = useState(fallbackHair);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('results')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data?.length) {
          const skin = data
            .filter((r) => r.category === 'skin')
            .map((r) => ({
              label: r.label,
              before: r.before_url,
              after: r.after_url,
              duration: r.duration ?? '',
              category: 'skin' as const,
            }));
          const hair = data
            .filter((r) => r.category === 'hair')
            .map((r) => ({
              label: r.label,
              before: r.before_url,
              after: r.after_url,
              duration: r.duration ?? '',
              category: 'hair' as const,
            }));
          if (skin.length) setSkinResults(skin);
          if (hair.length) setHairResults(hair);
        }
        setLoading(false);
      });
  }, []);

  return { skinResults, hairResults, loading };
}
