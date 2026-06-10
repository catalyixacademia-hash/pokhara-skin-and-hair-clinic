import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const fallback = [
  'https://images.pexels.com/photos/32260065/pexels-photo-32260065.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/3985361/pexels-photo-3985361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/4586728/pexels-photo-4586728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
];

export function useHeroSlides() {
  const [images, setImages] = useState(fallback);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('hero_slides')
      .select('image_url')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data?.length) {
          setImages(data.map((r) => r.image_url));
        }
        setLoading(false);
      });
  }, []);

  return { heroImages: images, loading };
}
