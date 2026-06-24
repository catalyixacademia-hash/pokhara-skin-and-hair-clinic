import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-60 shrink-0 bg-ink text-paper flex flex-col border-r border-line">
        <div className="p-5 border-b border-paper/10">
          <p className="font-serif text-lg leading-tight">Pokhara Skin & Hair</p>
          <p className="text-[10px] text-paper/50 mt-1 uppercase tracking-widest">Clinic admin</p>
          <p className="text-[10px] text-paper/40 mt-2 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 py-4 px-2">
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
      <main className="flex-1 p-6 md:p-8 overflow-auto bg-accent-soft/20">
        <Outlet />
      </main>
    </div>
  );
}
