import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';
import Login from '@/pages/Login';
import AppointmentsList from '@/pages/AppointmentsList';
import AppointmentDetail from '@/pages/AppointmentDetail';
import AppointmentForm from '@/pages/AppointmentForm';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={routerBasename || undefined}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/bookings" element={<AppointmentsList />} />
              <Route path="/bookings/new" element={<AppointmentForm />} />
              <Route path="/bookings/:id" element={<AppointmentDetail />} />
              <Route path="/bookings/:id/edit" element={<AppointmentForm />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/bookings" replace />} />
          <Route path="*" element={<Navigate to="/bookings" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
