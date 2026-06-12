import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('authToken'));
  const [error, setError] = useState(null);

  // Verify token with server on mount
  useEffect(() => {
    if (token) {
      authApi.me(token)
        .then((response) => {
          setUser(response.user || response);
          setError(null);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback((payload) => {
    const authToken = payload.token;
    const userData = payload.user;

    setToken(authToken);
    setUser(userData);
    localStorage.setItem('authToken', authToken);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    setError(null);
  }, []);

  const value = {
    user,
    role: user?.role || null,
    token,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
