// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import TripForm from './pages/TripForm';
import ItineraryView from './pages/ItineraryView';
import ItineraryEditor from './pages/ItineraryEditor';
import BudgetOverview from './pages/BudgetOverview';
import NotificationsCenter from './pages/NotificationsCenter';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';

// NEW
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgetPassword';
import AdminSecureLogin from './pages/AdminSecureLogin';


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Trip flow */}
        <Route path="/new-trip" element={<TripForm />} />
        <Route path="/itinerary/:tripId" element={<ItineraryView />} />
        <Route path="/itinerary/:tripId/edit" element={<ItineraryEditor />} />
        <Route path="/budget/:tripId" element={<BudgetOverview />} />

        {/* User / Admin */}
        <Route path="/notifications" element={<NotificationsCenter />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* NEW: direct auth routes */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Admin (nested) */}
        <Route path="/admin">
          <Route index element={<AdminLogin />} />             {/* /admin */}
          <Route path="login" element={<AdminSecureLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />  {/* /admin/dashboard */}
        </Route>

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  );
}
