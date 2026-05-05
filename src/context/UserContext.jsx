import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // Optionally verify the token with the server
      authApi.me(storedToken)
        .then((response) => {
          setUser(response.user || response);
          setError(null);
        })
        .catch(() => {
          // Token is invalid, clear it
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
