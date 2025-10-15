import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import { LandingPage } from './components/landing/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { Layout } from './components/layout/Layout';
import { StudentDashboard } from './components/student/Dashboard';
import { ResumeUpload } from './components/student/ResumeUpload';
import { JobsList } from './components/student/JobsList';
import { JobDetail } from './components/student/JobDetail';
import { ApplicationsList } from './components/student/ApplicationsList';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotificationsPage } from './components/student/NotificationsPage';
import { SettingsPage } from './components/student/SettingsPage';
import { ProfilePage } from './components/student/ProfilePage';
import { RecruiterDashboard } from './pages/recruiter/Dashboard';
import { PostJob } from './pages/recruiter/PostJob';
import { MyJobs } from './pages/recruiter/MyJobs';
import { Candidates } from './pages/recruiter/Candidates';
import { Analytics } from './pages/recruiter/Analytics';
import { RecruiterNotifications } from './pages/recruiter/Notifications';
import { Profile as RecruiterProfile } from './pages/recruiter/Profile';
import { Settings as RecruiterSettings } from './pages/recruiter/Settings';
import { AdminDashboard } from './pages/admin/Dashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { JobManagement } from './pages/admin/JobManagement';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminSecurity } from './pages/admin/Security';
import { AdminNotificationsPage } from './pages/admin/NotificationsPage';
import AdminSettingsPage from './pages/admin/SettingsPage';
import AdminProfilePage from './pages/admin/ProfilePage';

const DashboardRedirect: React.FC = () => {
  const { user } = useAuthStore();

  if (user?.role === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  } else if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated, user, initializeAuth } = useAuthStore();
  const { theme } = useUIStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    );
  }

  const getDefaultRoute = () => {
    if (user?.role === 'recruiter') {
      return '/recruiter/dashboard';
    } else if (user?.role === 'admin') {
      return '/admin/dashboard';
    }
    return '/dashboard';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Navigate to={getDefaultRoute()} replace />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={getDefaultRoute()} replace />} />
            
            {/* Student Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute requiredRole="student">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="resume"
              element={
                <ProtectedRoute requiredRole="student">
                  <ResumeUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs"
              element={
                <ProtectedRoute requiredRole="student">
                  <JobsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs/:id"
              element={
                <ProtectedRoute requiredRole="student">
                  <JobDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="applications"
              element={
                <ProtectedRoute requiredRole="student">
                  <ApplicationsList />
                </ProtectedRoute>
              }
            />
            
            {/* Placeholder routes for other features */}
            <Route
              path="notifications"
              element={
                <ProtectedRoute requiredRole="student">
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="settings" 
              element={
                <ProtectedRoute requiredRole="student">
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Recruiter Routes */}
            <Route
              path="recruiter/dashboard"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="recruiter/post-job" 
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <PostJob />
                </ProtectedRoute>
              } 
            />
            <Route
              path="recruiter/my-jobs"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <MyJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/jobs/:jobId/candidates"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <Candidates />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/analytics"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/notifications"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/profile"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/settings"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterSettings />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/user-management"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/job-management"
              element={
                <ProtectedRoute requiredRole="admin">
                  <JobManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/analytics"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/security"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSecurity />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/notifications"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminNotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/settings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/profile"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="admin/users" element={<div className="p-8 text-center text-gray-500">User management coming soon...</div>} />
            <Route path="admin/jobs" element={<div className="p-8 text-center text-gray-500">Job management coming soon...</div>} />
          </Route>

          <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;