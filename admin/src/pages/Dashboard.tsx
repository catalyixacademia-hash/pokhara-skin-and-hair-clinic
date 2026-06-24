import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type Counts = {
  pendingBookings: number;
  pendingEnquiries: number;
  thisWeek: number;
};

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    Promise.all([
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('form_type', 'booking')
        .eq('status', 'pending'),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('form_type', 'general_query')
        .eq('status', 'pending'),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString()),
    ]).then(([bookings, enquiries, week]) => {
      setCounts({
        pendingBookings: bookings.count ?? 0,
        pendingEnquiries: enquiries.count ?? 0,
        thisWeek: week.count ?? 0,
      });
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Overview</h1>
        <p className="text-sm text-muted mt-1">Pokhara Skin & Hair Clinic — patient inbox at a glance.</p>
      </div>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="admin-stat-card">
            <p className="admin-stat-label">Pending bookings</p>
            <p className="admin-stat-value">{counts?.pendingBookings ?? 0}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-label">Pending enquiries</p>
            <p className="admin-stat-value">{counts?.pendingEnquiries ?? 0}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-label">Submissions this week</p>
            <p className="admin-stat-value">{counts?.thisWeek ?? 0}</p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/bookings" className="admin-nav-card">
          <p className="font-serif text-lg text-ink">Booking forms</p>
          <p className="text-sm text-muted mt-1">Appointment requests from the website</p>
        </Link>
        <Link to="/enquiries" className="admin-nav-card">
          <p className="font-serif text-lg text-ink">General enquiries</p>
          <p className="text-sm text-muted mt-1">Patient questions and concerns</p>
        </Link>
        <Link to="/analytics" className="admin-nav-card">
          <p className="font-serif text-lg text-ink">Analytics</p>
          <p className="text-sm text-muted mt-1">Top treatments, trends, and status</p>
        </Link>
      </div>
    </div>
  );
}
