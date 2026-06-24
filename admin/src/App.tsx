import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import SubmissionsList from '@/pages/SubmissionsList';
import SubmissionDetail from '@/pages/SubmissionDetail';
import Analytics from '@/pages/Analytics';

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
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
