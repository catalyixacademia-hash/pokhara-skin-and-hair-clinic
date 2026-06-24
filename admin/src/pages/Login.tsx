import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { siteUrl } from '@/lib/site-url';

export default function Login() {
  const { signIn, session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/bookings" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn(email, password);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="admin-card">
          <p className="text-[10px] uppercase tracking-widest text-bronze mb-2">Staff only</p>
          <h1 className="font-serif text-2xl mb-1">Admin panel</h1>
          <p className="text-sm text-warm-gray mb-6">
            Sign in to manage patient booking form submissions.
          </p>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="admin-label" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
              />
            </div>
            <button type="submit" disabled={loading} className="admin-btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>
        <p className="text-center mt-6 text-sm text-taupe">
          <a href={siteUrl} className="text-bronze hover:underline">
            ← Back to clinic website
          </a>
        </p>
      </div>
    </div>
  );
}
