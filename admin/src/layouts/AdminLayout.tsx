import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { siteUrl } from '@/lib/site-url';

const navItems = [{ to: '/bookings', label: 'Booking forms' }] as const;

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 bg-charcoal text-ivory flex flex-col">
        <div className="p-5 border-b border-white/10">
          <p className="font-serif text-lg">Clinic Admin</p>
          <p className="text-[10px] text-taupe mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-5 py-2.5 text-xs uppercase tracking-wider transition-colors ${
                  isActive ? 'bg-bronze text-white' : 'text-taupe hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center admin-btn-secondary text-xs border-white/20 text-taupe hover:text-white"
          >
            View website
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full admin-btn-secondary text-xs border-white/20 text-taupe hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
