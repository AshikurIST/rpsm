import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleRoute = ({ children, role }) => {
  const { user, hasRole } = useAuthStore();

  if (!user || !hasRole(role)) {
    // Redirect to appropriate home page based on user role
    const redirectPath = user?.role === 'admin' ? '/admin/home' : '/student/home';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleRoute;
