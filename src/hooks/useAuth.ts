import { useCallback, useEffect, useState } from 'react';

const AUTH_KEY = 'nit_auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(localStorage.getItem(AUTH_KEY) === 'true');
    };

    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const login = useCallback(() => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
