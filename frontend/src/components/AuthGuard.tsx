import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
