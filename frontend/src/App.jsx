import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import PortalLayout from './components/layout/PortalLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import PublicIssuesPage from './pages/public/PublicIssuesPage';
import PublicIssueDetailsPage from './pages/public/PublicIssueDetailsPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OfficerLoginPage from './pages/auth/OfficerLoginPage';
import OfficerRegisterPage from './pages/auth/OfficerRegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Citizen Pages
import DashboardPage from './pages/citizen/DashboardPage';
import ReportProblemPage from './pages/citizen/ReportProblemPage';
import MyComplaintsPage from './pages/citizen/MyComplaintsPage';
import ComplaintDetailsPage from './pages/citizen/ComplaintDetailsPage';
import NotificationsPage from './pages/citizen/NotificationsPage';
import ProfilePage from './pages/citizen/ProfilePage';

// Officer Pages
import OfficerDashboardPage from './pages/officer/OfficerDashboardPage';
import OfficerComplaintsPage from './pages/officer/OfficerComplaintsPage';
import OfficerComplaintDetailsPage from './pages/officer/OfficerComplaintDetailsPage';
import OfficerProfilePage from './pages/officer/OfficerProfilePage';
import OfficerNotificationsPage from './pages/officer/OfficerNotificationsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminComplaintDetailsPage from './pages/admin/AdminComplaintDetailsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Router>
          <Routes>
            {/* Public and Auth Pages (Navbar + Outlet + Footer) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/public-issues" element={<PublicIssuesPage />} />
              <Route path="/public-issues/:id" element={<PublicIssueDetailsPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/officer/login" element={<OfficerLoginPage />} />
              <Route path="/officer/register" element={<OfficerRegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Protected Citizen Portal (Sidebar + Portal Header + Outlet) */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
                  <PortalLayout roleType="citizen" />
                </ProtectedRoute>
              }
            >
              <Route path="/citizen/dashboard" element={<DashboardPage />} />
              <Route path="/citizen/report" element={<ReportProblemPage />} />
              <Route path="/citizen/complaints" element={<MyComplaintsPage />} />
              <Route path="/citizen/complaints/:id" element={<ComplaintDetailsPage />} />
              <Route path="/citizen/notifications" element={<NotificationsPage />} />
              <Route path="/citizen/profile" element={<ProfilePage />} />
            </Route>

            {/* Protected Officer Portal (Sidebar + Portal Header + Outlet) */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['ROLE_OFFICER']}>
                  <PortalLayout roleType="officer" />
                </ProtectedRoute>
              }
            >
              <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
              <Route path="/officer/complaints" element={<OfficerComplaintsPage />} />
              <Route path="/officer/complaints/:id" element={<OfficerComplaintDetailsPage />} />
              <Route path="/officer/notifications" element={<OfficerNotificationsPage />} />
              <Route path="/officer/profile" element={<OfficerProfilePage />} />
            </Route>

            {/* Protected Admin Portal (Sidebar + Portal Header + Outlet) */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <PortalLayout roleType="admin" />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
              <Route path="/admin/complaints/:id" element={<AdminComplaintDetailsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
            </Route>

            {/* Catch-all Fallback: Redirect to Public Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;
