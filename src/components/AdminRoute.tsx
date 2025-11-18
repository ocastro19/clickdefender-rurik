import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { userData } = useUser();

  if (userData.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};