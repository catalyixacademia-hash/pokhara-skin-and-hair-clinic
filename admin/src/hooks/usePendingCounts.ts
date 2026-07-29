import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type PendingCounts = {
  bookings: number;
  enquiries: number;
  total: number;
};

export function usePendingCounts(): PendingCounts {
  const [counts, setCounts] = useState<PendingCounts>({ bookings: 0, enquiries: 0, total: 0 });

  const load = async () => {
    const [bookings, enquiries] = await Promise.all([
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('form_type', 'booking')
        .eq('status', 'pending')
        .is('deleted_at', null),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('form_type', 'general_query')
        .eq('status', 'pending')
        .is('deleted_at', null),
    ]);

    const b = bookings.count ?? 0;
    const e = enquiries.count ?? 0;
    setCounts({ bookings: b, enquiries: e, total: b + e });
  };

  useEffect(() => {
    void load();

    const channel = supabase
      .channel('admin-pending-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return counts;
}
