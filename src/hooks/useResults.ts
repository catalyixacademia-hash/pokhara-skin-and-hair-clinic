import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbResult } from '../types/cms';

export type ResultItem = {
  id: string;
  label: string;
  beforeUrl: string;
  afterUrl: string;
  duration: string | null;
  category: 'skin' | 'hair';
};

function mapRow(row: DbResult): ResultItem {
  return {
    id: row.id,
    label: row.label,
    beforeUrl: row.before_url,
    afterUrl: row.after_url,
    duration: row.duration,
    category: row.category,
  };
}

export function useResults() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [fromDb, setFromDb] = useState(false);

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
      .then(({ data, error }) => {
        if (!error && data?.length) {
          setResults(data.map((row) => mapRow(row as DbResult)));
          setFromDb(true);
        }
        setLoading(false);
      });
  }, []);

  return { results, loading, fromDb };
}
