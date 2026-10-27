import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path to your AuthContext

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo = '/' }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Wait until AuthContext finishes fetching the initial user state (/api/users/me)
  if (loading) {
    return <div className="p-8 text-center">Loading authentication...</div>;
  }

  // If no user, redirect to landing page (or login)
  if (!isAuthenticated && user?.role !== 'admin') {
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated, render child routes/components
  return <Outlet />;
};