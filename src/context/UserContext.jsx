import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';

const UserContext = createContext(null);

const resolveUserFromPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return null;
  if (payload.user && typeof payload.user === 'object') return payload.user;

  const hasUserShape = payload.email || payload.fullName || payload.role || payload.id;
  return hasUserShape ? payload : null;
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUser = useCallback(async (activeToken) => {
    if (!activeToken) {
      setUser(null);
      return null;
    }

    const response = await authApi.me(activeToken);
    const resolvedUser = resolveUserFromPayload(response);
    setUser(resolvedUser);
    setError(null);
    return resolvedUser;
  }, []);

  // Load token from localStorage on mount and hydrate current user from server.
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    refreshUser(storedToken)
      .catch(() => {
        // Token is invalid, clear the session.
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refreshUser]);

  // If a token exists but user is missing (e.g. non-standard login payload), hydrate from server.
  useEffect(() => {
    if (!token || user) return;

    refreshUser(token).catch(() => {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    });
  }, [token, user, refreshUser]);

  const login = useCallback((payload) => {
    const authToken = payload.token;
    const userData = resolveUserFromPayload(payload);

    if (!authToken) {
      setError('Authentication token is missing from login response.');
      return;
    }

    setToken(authToken);
    setUser(userData);
    localStorage.setItem('authToken', authToken);
    setError(null);

    // Notify other parts of the app (e.g., sidebar) that the user updated
    try {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        console.debug('UserContext.login: dispatching userUpdated', userData);
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: userData }));
      }
    } catch (e) {
      console.debug('UserContext.login: dispatch failed', e);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    setError(null);
    try {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: null }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const value = {
    user,
    currentUser: user,
    token,
    isLoading,
    error,
    role: user?.role || 'Viewer',
    login,
    logout,
    refreshUser,
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
