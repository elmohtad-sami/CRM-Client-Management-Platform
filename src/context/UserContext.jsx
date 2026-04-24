import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext(null);

const SESSION_KEY = 'finaudit_auth_session';

const readStoredSession = () => {
  if (typeof window === 'undefined') {
    return { currentUser: null, token: null };
  }

  const rawSession = localStorage.getItem(SESSION_KEY);
  if (!rawSession) {
    return { currentUser: null, token: null };
  }

  try {
    const parsedSession = JSON.parse(rawSession);
    return {
      currentUser: parsedSession.currentUser || null,
      token: parsedSession.token || null
    };
  } catch {
    return { currentUser: null, token: null };
  }
};

export function UserProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  useEffect(() => {
    const nextSession = {
      currentUser: session.currentUser,
      token: session.token
    };

    if (nextSession.currentUser && nextSession.token) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const setCurrentUser = (nextUser) => {
    setSession((current) => ({
      ...current,
      currentUser: typeof nextUser === 'function' ? nextUser(current.currentUser) : nextUser
    }));
  };

  const setAuthToken = (token) => {
    setSession((current) => ({ ...current, token }));
  };

  const login = ({ user, token }) => {
    setSession({ currentUser: user, token });
  };

  const logout = () => {
    setSession({ currentUser: null, token: null });
  };

  const value = useMemo(() => ({
    currentUser: session.currentUser,
    token: session.token,
    isAuthenticated: Boolean(session.currentUser && session.token),
    role: session.currentUser?.role || 'Viewer',
    setCurrentUser,
    setAuthToken,
    login,
    logout
  }), [session]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
