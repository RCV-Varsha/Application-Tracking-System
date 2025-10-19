import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'recruiter' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Compare roles case-insensitively and redirect to appropriate dashboard based on user role
    const userRole = (user?.role || '').toString().toLowerCase();
    const reqRole = (requiredRole || '').toString().toLowerCase();
    if (userRole === reqRole) {
      return <>{children}</>;
    }
    const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : (userRole === 'recruiter' ? '/recruiter/dashboard' : '/dashboard');
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};