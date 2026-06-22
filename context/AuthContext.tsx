import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch, setApiSessionId, ApiResponse } from "../lib/api";

const SESSION_STORAGE_KEY = "@parkaddis_session_id";
const PROFILE_STORAGE_KEY = "@parkaddis_clerk_profile";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status?: string;
  userType?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  assignedLocationId?: string;
  locationName?: string;
}

interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  register: (data: any) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: (force?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastRefreshedAt = useRef<number>(0);
  const isRefreshing = useRef<boolean>(false);
  const REFRESH_COOLDOWN_MS = 30_000; // 30 seconds

  const persistSession = async (id: string | null) => {
    if (id) {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, id);
    } else {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const persistProfile = async (profile: User | null) => {
    if (profile) {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } else {
      await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  };

  const loadCachedProfile = async (): Promise<User | null> => {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  };

  const parseProfileResponse = (result: ApiResponse<any>): User | null => {
    if (!result.ok || !result.data) return null;
    const payload = result.data as any;
    return payload.user || payload;
  };

  const fetchProfile = async () => {
    let result = await apiFetch<any>("/clerk/me");
    if (!result.ok && result.status === 404) {
      result = await apiFetch<any>("/auth/me");
    }
    return result;
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const cachedProfile = await loadCachedProfile();
        if (cachedProfile) {
          setUser(cachedProfile);
        }

        const storedId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (storedId) {
          setApiSessionId(storedId);
          setSessionIdState(storedId);

          const result = await fetchProfile();
          const profile = parseProfileResponse(result);

          if (profile) {
            setUser(profile);
            await persistProfile(profile);
          } else if (!cachedProfile) {
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
    const result = await apiFetch<{ user: User; sessionId: string }>(
      "/clerk/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );

    if (result.ok && result.data) {
      const { user: loggedInUser, sessionId: newSessionId } = result.data;
      await persistSession(newSessionId);
      setApiSessionId(newSessionId);
      setSessionIdState(newSessionId);
      setUser(loggedInUser);
      await persistProfile(loggedInUser);
      return { ok: true };
    }

    return { ok: false, error: result.error };
  };

  const register = async (data: any) => {
    const result = await apiFetch<{ user: User; sessionId: string }>(
      "/clerk/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    if (result.ok && result.data) {
      const { user: registeredUser, sessionId: newSessionId } = result.data;
      await persistSession(newSessionId);
      setApiSessionId(newSessionId);
      setSessionIdState(newSessionId);
      setUser(registeredUser);
      await persistProfile(registeredUser);
      return { ok: true };
    }

    return { ok: false, error: result.error };
  };

  const logout = async () => {
    setUser(null);
    setSessionIdState(null);
    setApiSessionId(null);
    await persistSession(null);
    await persistProfile(null);
  };

  const refreshProfile = async (force = false) => {
    const now = Date.now();
    // Skip if a refresh is already in-flight or was done recently
    if (isRefreshing.current) return;
    if (!force && now - lastRefreshedAt.current < REFRESH_COOLDOWN_MS) return;

    isRefreshing.current = true;
    const result = await fetchProfile();
    isRefreshing.current = false;
    lastRefreshedAt.current = Date.now();

    const profile = parseProfileResponse(result);
    if (profile) {
      setUser(profile);
      await persistProfile(profile);
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
