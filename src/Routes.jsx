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
import ProtectedRoute from "components/ProtectedRoute";

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
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/prayer-times-scheduler" element={<ProtectedRoute><PrayerTimesScheduler /></ProtectedRoute>} />
          <Route path="/halal-checker" element={<ProtectedRoute><HalalChecker /></ProtectedRoute>} />
          <Route path="/wellness-survey" element={<ProtectedRoute><WellnessSurvey /></ProtectedRoute>} />
          <Route path="/ar-salah-guide" element={<ProtectedRoute><ARSalahGuide /></ProtectedRoute>} />
          <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
