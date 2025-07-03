import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    // Redirect to supplier auth page if not authenticated
    return <Navigate to="/supplier/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
