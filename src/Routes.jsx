import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from './contexts/AuthContext';
import NotFound from "pages/NotFound";
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrayerTimesScheduler from './pages/prayer-times-scheduler';
import HalalChecker from './pages/halal-checker';
import Dashboard from './pages/dashboard';
import WellnessSurvey from './pages/wellness-survey';
import ProfileSettings from './pages/profile-settings';
import DeedsTracking from './pages/deeds-tracking';
import AISheikh from './pages/ai-sheikh';
import DhikrCounter from './pages/dhikr-counter';
import QadaTracker from './pages/qada-tracker';
import ProtectedRoute from "components/ProtectedRoute";
import Layout from "components/Layout";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main App Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prayer-times-scheduler" element={<PrayerTimesScheduler />} />
            <Route path="/halal-checker" element={<HalalChecker />} />
            <Route path="/wellness-survey" element={<WellnessSurvey />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/deeds-tracking" element={<DeedsTracking />} />
            <Route path="/ai-sheikh" element={<AISheikh />} />
            <Route path="/dhikr-counter" element={<DhikrCounter />} />
            <Route path="/qada-tracker" element={<QadaTracker />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
