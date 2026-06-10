import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export type TestimonialItem = {
  name: string;
  location: string;
  treatment: string;
  rating: number;
  quote: string;
  initial: string;
};

const fallback: TestimonialItem[] = [
  {
    name: 'Priya S.',
    location: 'Pokhara',
    treatment: 'Acne & Pigmentation Treatment',
    rating: 5,
    quote: 'After years of struggling with hormonal acne, I finally found a clinic that approached my skin medically rather than cosmetically. Dr. Acharya created a treatment plan that addressed the root cause. Three months later, my skin is clearer than it has been in a decade.',
    initial: 'P',
  },
  {
    name: 'Sunita T.',
    location: 'Kaski',
    treatment: 'Chemical Peel & Skin Rejuvenation',
    rating: 5,
    quote: 'The clinic feels different from the moment you walk in. Clean, calm, and clinical in the best way. My skin tone is significantly more even after the peel series, and the team was genuinely attentive throughout every session.',
    initial: 'S',
  },
  {
    name: 'Manjula R.',
    location: 'Lekhnath',
    treatment: 'Laser Pigmentation Treatment',
    rating: 5,
    quote: 'I travelled from Lekhnath specifically for this clinic after reading about Dr. Acharya. Worth every kilometer. The laser treatment for my pigmentation was precise, painless, and the results were visible within two weeks.',
    initial: 'M',
  },
  {
    name: 'Deepa B.',
    location: 'Pokhara',
    treatment: 'Botox & Filler Consultation',
    rating: 5,
    quote: 'What I appreciated most was the honest, no-pressure consultation. Dr. Acharya advised me against a treatment I thought I wanted and suggested an alternative that has given me genuinely natural results. That kind of integrity is rare.',
    initial: 'D',
  },
  {
    name: 'Rohan M.',
    location: 'Pokhara',
    treatment: 'PRP Hair Restoration',
    rating: 5,
    quote: 'I was skeptical about PRP therapy but the consultation was thorough and honest — Dr. Acharya explained exactly what to expect and what not to expect. Four sessions in, my hair density has noticeably improved. The professionalism here is unlike any clinic I have visited.',
    initial: 'R',
  },
  {
    name: 'Aarav K.',
    location: 'Pokhara',
    treatment: 'GFC Hair Therapy',
    rating: 5,
    quote: 'GFC therapy at Pokhara Skin and Hair Clinic genuinely changed how I feel about my hair. I came in feeling resigned about my hairline. Three months after treatment, I feel confident again. The expertise here is real.',
    initial: 'A',
  },
];

export function useTestimonials() {
  const [items, setItems] = useState<TestimonialItem[]>(fallback);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data?.length) {
          setItems(
            data.map((r) => ({
              name: r.name,
              location: r.location ?? '',
              treatment: r.treatment,
              rating: r.rating,
              quote: r.quote,
              initial: r.initial ?? r.name.charAt(0),
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  return { testimonials: items, loading };
}
