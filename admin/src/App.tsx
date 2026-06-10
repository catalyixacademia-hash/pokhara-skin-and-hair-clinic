import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AppointmentsList from '@/pages/AppointmentsList';
import AppointmentDetail from '@/pages/AppointmentDetail';
import ServicesManager from '@/pages/ServicesManager';
import TestimonialsManager from '@/pages/TestimonialsManager';
import ResultsManager from '@/pages/ResultsManager';
import GalleryManager from '@/pages/GalleryManager';
import HeroSlidesManager from '@/pages/HeroSlidesManager';
import ClinicSettings from '@/pages/ClinicSettings';
import DoctorProfile from '@/pages/DoctorProfile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/appointments" element={<AppointmentsList />} />
              <Route path="/appointments/:id" element={<AppointmentDetail />} />
              <Route path="/services" element={<ServicesManager />} />
              <Route path="/testimonials" element={<TestimonialsManager />} />
              <Route path="/results" element={<ResultsManager />} />
              <Route path="/gallery" element={<GalleryManager />} />
              <Route path="/hero" element={<HeroSlidesManager />} />
              <Route path="/settings" element={<ClinicSettings />} />
              <Route path="/doctor" element={<DoctorProfile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
