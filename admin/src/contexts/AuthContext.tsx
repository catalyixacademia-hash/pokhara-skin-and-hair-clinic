import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Optional staff allowlist via VITE_ADMIN_EMAILS (comma-separated).
 * When unset or empty, any authenticated Supabase Auth user may use the admin app
 * (current production behavior). When set, non-listed emails are signed out after login.
 */
function isAdminEmailAllowed(email: string | undefined | null): boolean {
  const raw = import.meta.env.VITE_ADMIN_EMAILS?.trim();
  if (!raw) return true;
  const allow = raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allow.length === 0) return true;
  if (!email) return false;
  return allow.includes(email.toLowerCase());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const enforceAllowlist = useCallback(async (next: Session | null) => {
    if (!next?.user) {
      setSession(null);
      return;
    }
    if (!isAdminEmailAllowed(next.user.email)) {
      await supabase.auth.signOut();
      setSession(null);
      return;
    }
    setSession(next);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      void enforceAllowlist(data.session).finally(() => setLoading(false));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      void enforceAllowlist(next).finally(() => setLoading(false));
    });

    return () => sub.subscription.unsubscribe();
  }, [enforceAllowlist]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (!isAdminEmailAllowed(data.user?.email ?? email)) {
      await supabase.auth.signOut();
      return {
        error:
          'This account is not on the staff allowlist (VITE_ADMIN_EMAILS). Contact the clinic admin.',
      };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn,
      signOut,
    }),
    [session, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
