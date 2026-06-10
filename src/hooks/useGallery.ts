import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export type GalleryItem = {
  img: string;
  label: string;
  tag: string;
  tall: boolean;
};

const fallback: GalleryItem[] = [
  { img: 'https://images.pexels.com/photos/32260065/pexels-photo-32260065.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', label: 'Skin Treatment Session', tag: 'Treatment', tall: true },
  { img: 'https://images.pexels.com/photos/4586740/pexels-photo-4586740.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', label: 'Patient Consultation', tag: 'Consultation', tall: false },
  { img: 'https://images.pexels.com/photos/3985361/pexels-photo-3985361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', label: 'Facial Care Procedure', tag: 'Skin Care', tall: false },
  { img: 'https://images.pexels.com/photos/7479960/pexels-photo-7479960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', label: 'Glowing Skin Results', tag: 'Results', tall: false },
  { img: 'https://images.pexels.com/photos/36963686/pexels-photo-36963686.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', label: 'Hair Restoration Procedure', tag: 'Hair Care', tall: false },
  { img: 'https://images.pexels.com/photos/29648642/pexels-photo-29648642.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', label: 'Clinical Dermatology', tag: 'Dermatology', tall: true },
  { img: 'https://images.pexels.com/photos/4586728/pexels-photo-4586728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', label: 'Laser Treatment', tag: 'Laser', tall: false },
  { img: 'https://images.pexels.com/photos/15327096/pexels-photo-15327096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', label: 'Beautiful Skin Results', tag: 'Results', tall: false },
];

export function useGallery() {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(isSupabaseConfigured);

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
      .then(({ data }) => {
        if (data?.length) {
          setItems(
            data.map((r) => ({
              img: r.image_url,
              label: r.label,
              tag: r.tag ?? '',
              tall: r.is_tall,
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  return { galleryItems: items, loading };
}
