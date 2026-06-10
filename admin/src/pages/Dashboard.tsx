import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type AppointmentRow = {
  id: string;
  name: string;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const [pendingCount, setPendingCount] = useState(0);
  const [recent, setRecent] = useState<AppointmentRow[]>([]);

  useEffect(() => {
    async function load() {
      const { count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { data } = await supabase
        .from('appointments')
        .select('id, name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setPendingCount(count ?? 0);
      setRecent(data ?? []);
    }
    load();
  }, []);

  const links = [
    { to: '/appointments', label: 'Appointments', desc: 'Review booking requests' },
    { to: '/services', label: 'Services', desc: 'Manage treatment listings' },
    { to: '/testimonials', label: 'Testimonials', desc: 'Patient quotes' },
    { to: '/settings', label: 'Settings', desc: 'Clinic info & hours' },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wider text-warm-gray">Pending Appointments</p>
          <p className="font-serif text-4xl text-bronze mt-2">{pendingCount}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-serif text-xl mb-4">Quick Links</h2>
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block admin-card hover:border-bronze transition-colors"
              >
                <p className="font-medium">{link.label}</p>
                <p className="text-sm text-warm-gray">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl mb-4">Recent Appointments</h2>
          <div className="admin-card">
            {recent.length === 0 ? (
              <p className="text-sm text-warm-gray">No appointments yet.</p>
            ) : (
              <ul className="space-y-3">
                {recent.map((a) => (
                  <li key={a.id} className="flex justify-between text-sm border-b border-blush/50 pb-2">
                    <Link to={`/appointments/${a.id}`} className="hover:text-bronze">
                      {a.name}
                    </Link>
                    <span className="text-warm-gray capitalize">{a.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
