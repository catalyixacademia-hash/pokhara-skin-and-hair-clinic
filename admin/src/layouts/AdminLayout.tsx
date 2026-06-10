import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/services', label: 'Services' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/results', label: 'Results' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/hero', label: 'Hero Slides' },
  { to: '/settings', label: 'Clinic Settings' },
  { to: '/doctor', label: 'Doctor Profile' },
];

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
        <button
          type="button"
          onClick={handleSignOut}
          className="m-4 admin-btn-secondary text-xs border-white/20 text-taupe hover:text-white"
        >
          Sign Out
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
