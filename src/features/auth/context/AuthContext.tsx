import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Admin } from '@/types/auth.types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Admin | null;
  login: (token: string, user: Admin) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Admin | null>(null);

  const performLogout = useCallback(() => {
    localStorage.removeItem('nit_auth_token');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const login = useCallback((token: string, userData: Admin) => {
    localStorage.setItem('nit_auth_token', token);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('nit_auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          performLogout();
        }
      } catch (error) {
        performLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [performLogout]);

  // Listen for unauthorized events from axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      performLogout();
    };

    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
  }, [performLogout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout: performLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
