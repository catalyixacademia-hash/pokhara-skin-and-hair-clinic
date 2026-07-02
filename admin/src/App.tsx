import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import FollowUpQueue from '@/pages/FollowUpQueue';
import SubmissionsList from '@/pages/SubmissionsList';
import SubmissionDetail from '@/pages/SubmissionDetail';
import Analytics from '@/pages/Analytics';
import TreatmentOptionsManager from '@/pages/TreatmentOptionsManager';
import ClinicSettings from '@/pages/ClinicSettings';
import ServicesManager from '@/pages/ServicesManager';
import TestimonialsManager from '@/pages/TestimonialsManager';
import ResultsManager from '@/pages/ResultsManager';
import GalleryManager from '@/pages/GalleryManager';
import HeroSlidesManager from '@/pages/HeroSlidesManager';
import DoctorProfile from '@/pages/DoctorProfile';

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/queue" element={<FollowUpQueue />} />
              <Route
                path="/bookings"
                element={
                  <SubmissionsList
                    formType="booking"
                    title="Booking forms"
                    description="Appointment requests submitted by patients on the website."
                    topicLabel="Treatment"
                  />
                }
              />
              <Route
                path="/bookings/:id"
                element={<SubmissionDetail formType="booking" topicLabel="Treatment" />}
              />
              <Route
                path="/enquiries"
                element={
                  <SubmissionsList
                    formType="general_query"
                    title="General enquiries"
                    description="Questions and concerns submitted via the Ask a question form."
                    topicLabel="Topic"
                  />
                }
              />
              <Route
                path="/enquiries/:id"
                element={<SubmissionDetail formType="general_query" topicLabel="Topic" />}
              />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/treatment-options" element={<TreatmentOptionsManager />} />
              <Route path="/settings" element={<ClinicSettings />} />
              <Route path="/services" element={<ServicesManager />} />
              <Route path="/testimonials" element={<TestimonialsManager />} />
              <Route path="/results" element={<ResultsManager />} />
              <Route path="/gallery" element={<GalleryManager />} />
              <Route path="/hero" element={<HeroSlidesManager />} />
              <Route path="/doctor" element={<DoctorProfile />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
