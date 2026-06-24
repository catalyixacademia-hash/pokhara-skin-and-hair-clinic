import { useEffect, useMemo, useState } from 'react';
import {
  groupTreatmentOptions,
  treatmentOptionGroups,
  treatmentOptions as fallbackOptions,
} from '../data/clinic';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export type TreatmentOptionGroup = {
  label: string;
  options: string[];
};

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

  const treatmentGroups = useMemo(
    () => groupTreatmentOptions(options),
    [options],
  );

  const fallbackGroups = useMemo(
    () =>
      treatmentOptionGroups.map((group) => ({
        label: group.label,
        options: [...group.options],
      })),
    [],
  );

  return {
    treatmentOptions: options,
    treatmentGroups: options.length ? treatmentGroups : fallbackGroups,
    loading,
  };
}
