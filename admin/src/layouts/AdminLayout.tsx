import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePendingCounts } from '@/hooks/usePendingCounts';
import { siteUrl } from '@/lib/site-url';

type NavIcon =
  | 'overview'
  | 'queue'
  | 'bookings'
  | 'enquiries'
  | 'analytics'
  | 'settings'
  | 'treatments'
  | 'services'
  | 'testimonials'
  | 'results'
  | 'gallery'
  | 'hero'
  | 'doctor';

type NavItem = {
  to: string;
  label: string;
  icon: NavIcon;
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
      { to: '/dashboard', label: 'Overview', icon: 'overview' },
      { to: '/queue', label: 'Follow-up queue', icon: 'queue', badgeKey: 'queue' },
      { to: '/bookings', label: 'Bookings', icon: 'bookings', badgeKey: 'bookings' },
      { to: '/enquiries', label: 'Enquiries', icon: 'enquiries', badgeKey: 'enquiries' },
    ],
  },
  {
    title: 'Insights',
    items: [{ to: '/analytics', label: 'Analytics', icon: 'analytics' }],
  },
  {
    title: 'Website',
    items: [
      { to: '/settings', label: 'Clinic settings', icon: 'settings' },
      { to: '/treatment-options', label: 'Treatment options', icon: 'treatments' },
      { to: '/services', label: 'Services', icon: 'services' },
      { to: '/testimonials', label: 'Testimonials', icon: 'testimonials' },
      { to: '/results', label: 'Results', icon: 'results' },
      { to: '/media', label: 'Media', icon: 'gallery' },
      { to: '/hero', label: 'Hero', icon: 'hero' },
      { to: '/doctor', label: 'Doctor profile', icon: 'doctor' },
    ],
  },
];

function NavIconSvg({ name }: { name: NavIcon }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true as const,
    className: 'admin-nav-icon shrink-0',
  };

  const stroke = {
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const icons: Record<NavIcon, ReactNode> = {
    overview: (
      <svg {...common}>
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" {...stroke} />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" {...stroke} />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" {...stroke} />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" {...stroke} />
      </svg>
    ),
    queue: (
      <svg {...common}>
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" {...stroke} />
      </svg>
    ),
    bookings: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2" {...stroke} />
        <path d="M3 10h18M8 3v4M16 3v4" {...stroke} />
      </svg>
    ),
    enquiries: (
      <svg {...common}>
        <path
          d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5V16H6.5A2.5 2.5 0 0 1 4 13.5v-7z"
          {...stroke}
        />
      </svg>
    ),
    analytics: (
      <svg {...common}>
        <path d="M4 19V5M4 19h16" {...stroke} />
        <path d="M8 16v-5M12 16V8M16 16v-8" {...stroke} />
      </svg>
    ),
    settings: (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" {...stroke} />
        <path
          d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
          {...stroke}
        />
      </svg>
    ),
    treatments: (
      <svg {...common}>
        <path d="M9 3h6v4l2 2v4a5 5 0 0 1-10 0V9l2-2V3z" {...stroke} />
        <path d="M9 7h6" {...stroke} />
      </svg>
    ),
    services: (
      <svg {...common}>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" {...stroke} />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" {...stroke} />
      </svg>
    ),
    testimonials: (
      <svg {...common}>
        <path d="M8 10h.01M12 10h.01M16 10h.01" {...stroke} />
        <path
          d="M12 19c4.5 0 8-3.1 8-7s-3.5-7-8-7-8 3.1-8 7c0 2.2 1.1 4.1 2.9 5.4L6 20l3.2-1.3c.9.2 1.8.3 2.8.3z"
          {...stroke}
        />
      </svg>
    ),
    results: (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" {...stroke} />
        <path d="M12 8v4l2.5 2.5" {...stroke} />
      </svg>
    ),
    gallery: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" {...stroke} />
        <circle cx="8.5" cy="10" r="1.5" {...stroke} />
        <path d="M3 16l5-4 4 3 3-2 6 4" {...stroke} />
      </svg>
    ),
    hero: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" {...stroke} />
        <path d="M3 14l4-3 3 2 4-4 7 5" {...stroke} />
      </svg>
    ),
    doctor: (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.5" {...stroke} />
        <path d="M5.5 19.5c0-3.1 2.9-5.5 6.5-5.5s6.5 2.4 6.5 5.5" {...stroke} />
      </svg>
    ),
  };

  return icons[name];
}

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="admin-nav-badge">
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
    if (key === 'queue') return pending.queue;
    if (key === 'bookings') return pending.bookings;
    if (key === 'enquiries') return pending.enquiries;
    return 0;
  };

  return (
    <div className="admin-shell h-dvh flex flex-col lg:flex-row bg-paper overflow-hidden">
      <header className="admin-shell__header flex lg:hidden items-center justify-between px-5 py-3 shrink-0 z-30">
        <div className="min-w-0">
          <span className="font-display font-semibold text-sm leading-tight text-ink block truncate">
            Pokhara Skin &amp; Hair Clinic
          </span>
          <span className="font-display text-[9px] uppercase tracking-wider text-muted block mt-0.5">
            Clinic admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center min-h-11 min-w-11 focus:outline-none shrink-0 text-ink"
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
          className="fixed inset-0 bg-ink/40 z-30 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-40 w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-line/70">
          <p className="font-display font-semibold text-base leading-tight text-ink">
            Pokhara Skin &amp; Hair Clinic
          </p>
          <p className="text-[10px] text-muted mt-3 uppercase tracking-widest">Clinic admin</p>
          <p className="text-[10px] text-muted/80 mt-2 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="mb-4 last:mb-0">
              <p className="px-4 pb-2 text-[10px] uppercase tracking-widest text-muted">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `admin-nav-link flex items-center gap-3 min-h-11 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        isActive ? 'admin-nav-link--active' : ''
                      }`
                    }
                  >
                    <NavIconSvg name={item.icon} />
                    <span className="truncate">{item.label}</span>
                    <NavBadge count={badgeFor(item.badgeKey)} />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-line/70 space-y-2">
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full admin-btn-ghost text-xs"
          >
            View website
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full admin-btn-ghost text-xs"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-shell__main flex-1 p-4 lg:p-8 overflow-y-auto overflow-x-hidden bg-accent-soft/20 min-w-0 min-h-0">
        <Outlet />
      </main>
    </div>
  );
}
