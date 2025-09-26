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
import ARSalahGuide from './pages/ar-salah-guide';
import ProfileSettings from './pages/profile-settings';

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
          
          {/* Main App Routes - Accessible in Preview Mode */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prayer-times-scheduler" element={<PrayerTimesScheduler />} />
          <Route path="/halal-checker" element={<HalalChecker />} />
          <Route path="/wellness-survey" element={<WellnessSurvey />} />
          <Route path="/ar-salah-guide" element={<ARSalahGuide />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
