 import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
