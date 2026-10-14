import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingState from './LoadingState';

export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingState message="Checking session authorization..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    // Redirect to the user's appropriate role dashboard
    if (currentUser?.role === 'ROLE_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (currentUser?.role === 'ROLE_OFFICER') {
      return <Navigate to="/officer/dashboard" replace />;
    }
    return <Navigate to="/citizen/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
