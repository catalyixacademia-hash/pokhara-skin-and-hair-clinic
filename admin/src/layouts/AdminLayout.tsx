import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePendingCounts } from '@/hooks/usePendingCounts';
import { siteUrl } from '@/lib/site-url';

type NavItem = {
  to: string;
  label: string;
  badgeKey?: 'queue' | 'bookings' | 'enquiries';
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: 'Inbox',
    items: [
      { to: '/dashboard', label: 'Overview' },
      { to: '/queue', label: 'Follow-up queue', badgeKey: 'queue' },
      { to: '/bookings', label: 'Bookings', badgeKey: 'bookings' },
      { to: '/enquiries', label: 'Enquiries', badgeKey: 'enquiries' },
    ],
  },
  {
    title: 'Insights',
    items: [{ to: '/analytics', label: 'Analytics' }],
  },
  {
    title: 'Website',
    items: [
      { to: '/settings', label: 'Clinic settings' },
      { to: '/treatment-options', label: 'Treatment options' },
      { to: '/services', label: 'Services' },
      { to: '/testimonials', label: 'Testimonials' },
      { to: '/results', label: 'Results' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/hero', label: 'Hero slides' },
      { to: '/doctor', label: 'Doctor profile' },
    ],
  },
];

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-auto inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-paper text-ink text-[10px] font-semibold px-1.5 py-0.5">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pending = usePendingCounts();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const badgeFor = (key?: NavItem['badgeKey']) => {
    if (key === 'queue') return pending.total;
    if (key === 'bookings') return pending.bookings;
    if (key === 'enquiries') return pending.enquiries;
    return 0;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper">
      <header className="flex md:hidden items-center justify-between bg-ink text-paper px-5 py-3 border-b border-paper/10 sticky top-0 z-30">
        <div className="min-w-0">
          <span className="font-display font-semibold text-sm leading-tight text-paper block truncate">
            Pokhara Skin &amp; Hair Clinic
          </span>
          <span className="font-display text-[9px] uppercase tracking-wider text-paper/70 block mt-0.5">
            Clinic admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 focus:outline-none shrink-0"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
              />
            )}
          </svg>
        </button>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink/50 z-30 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-ink text-paper flex flex-col border-r border-line transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-paper/10">
          <p className="font-display font-semibold text-base leading-tight text-paper">
            Pokhara Skin &amp; Hair Clinic
          </p>
          <p className="text-[10px] text-paper/40 mt-3 uppercase tracking-widest">Clinic admin</p>
          <p className="text-[10px] text-paper/30 mt-2 truncate font-mono">{user?.email}</p>
        </div>

        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="mb-4 last:mb-0">
              <p className="px-4 pb-2 text-[10px] uppercase tracking-widest text-paper/35">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 rounded text-sm transition-colors ${
                        isActive
                          ? 'bg-accent text-paper font-medium'
                          : 'text-paper/70 hover:text-paper hover:bg-paper/5'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    <NavBadge count={badgeFor(item.badgeKey)} />
                  </NavLink>
                ))}
              </div>
            </div>
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

      <main className="flex-1 p-4 md:p-8 overflow-auto bg-accent-soft/20 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
