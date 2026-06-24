import { createClient } from '@supabase/supabase-js';
import { siteUrl } from '@/lib/site-url';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  console.warn('Admin: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.');
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'pokhara-clinic-admin',
    },
  },
});

/** Allowed redirect origin for Supabase Auth (password reset / email links). */
export const authSiteUrl = siteUrl;
