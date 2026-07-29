import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Gate for authenticated staff sessions.
 * Full JWT custom-role claims are not used yet; access is "any Supabase Auth user"
 * unless VITE_ADMIN_EMAILS is set (see AuthContext allowlist). Keep this route
 * as the single session check so login, inbox, and CMS pages stay consistent.
 */
export function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-warm-gray">
        Loading…
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-warm-gray">
        Loading…
      </div>
    );
  }

  if (session) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
