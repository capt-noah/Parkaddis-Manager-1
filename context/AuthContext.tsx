import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, setApiSessionId } from '../lib/api';

const SESSION_STORAGE_KEY = '@parkaddis_session_id';

interface User {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: any) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persist helper
  const persistSession = async (id: string | null) => {
    if (id) {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, id);
    } else {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  // On mount: restore session from storage
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (storedId) {
          setApiSessionId(storedId);
          setSessionIdState(storedId);
          // Validate the session is still alive
          const result = await apiFetch<User>('/auth/me');
          if (result.ok && result.data) {
            setUser(result.data);
          } else {
            // Session expired — clear it
            await persistSession(null);
            setApiSessionId(null);
            setSessionIdState(null);
          }
        }
      } catch (e) {
        // Storage read failed — continue as logged out
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await apiFetch<{ user: User; sessionId: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.ok && result.data) {
      const { user: loggedInUser, sessionId: newSessionId } = result.data;
      setUser(loggedInUser);
      setSessionIdState(newSessionId);
      setApiSessionId(newSessionId);
      await persistSession(newSessionId);
      return { ok: true };
    }

    return { ok: false, error: result.error };
  };

  const register = async (data: any) => {
    const result = await apiFetch<{ sessionId: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.ok && result.data) {
      const newSessionId = result.data.sessionId;
      setSessionIdState(newSessionId);
      setApiSessionId(newSessionId);
      await persistSession(newSessionId);
      await refreshProfile();
      return { ok: true };
    }

    return { ok: false, error: result.error };
  };

  const logout = async () => {
    setUser(null);
    setSessionIdState(null);
    setApiSessionId(null);
    await persistSession(null);
  };

  const refreshProfile = async () => {
    const result = await apiFetch<User>('/auth/me');
    if (result.ok && result.data) {
      setUser(result.data);
    } else if (result.status === 401) {
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
