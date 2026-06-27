import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { siteUrl } from '@/lib/site-url';

const navItems = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/enquiries', label: 'Enquiries' },
  { to: '/analytics', label: 'Analytics' },
] as const;

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper">
      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between bg-ink text-paper px-5 py-3 border-b border-paper/10 sticky top-0 z-30">
        <div>
          <span className="font-display font-semibold text-base leading-none text-paper block">Pokhara</span>
          <span className="font-display text-[9px] uppercase tracking-wider text-paper/70 block mt-0.5">Skin &amp; Hair Clinic</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 focus:outline-none"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
            )}
          </svg>
        </button>
      </header>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink/50 z-30 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-ink text-paper flex flex-col border-r border-line transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-paper/10">
          <p className="font-display font-semibold text-lg leading-tight text-paper">Pokhara</p>
          <p className="font-display text-[10px] uppercase tracking-wider text-paper/70 mt-0.5">Skin &amp; Hair Clinic</p>
          <p className="text-[10px] text-paper/40 mt-3 uppercase tracking-widest">Clinic admin</p>
          <p className="text-[10px] text-paper/30 mt-2 truncate font-mono">{user?.email}</p>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-accent text-paper font-medium'
                    : 'text-paper/70 hover:text-paper hover:bg-paper/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-paper/10 space-y-2">
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center admin-btn-ghost text-xs"
          >
            View website
          </a>
          <button type="button" onClick={handleSignOut} className="w-full admin-btn-ghost text-xs">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-auto bg-accent-soft/20 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
