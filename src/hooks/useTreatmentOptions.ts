import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { treatmentOptions as fallbackOptions } from '../data/clinic';

export function useTreatmentOptions() {
  const [options, setOptions] = useState<string[]>([...fallbackOptions]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('treatment_options')
      .select('label')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data?.length) {
          setOptions(data.map((r) => r.label));
        }
        setLoading(false);
      });
  }, []);

  return { treatmentOptions: options, loading };
}
