// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { UserResponse } from "../services/types";
import { logout as apiLogout } from "../services/auth";

type AuthState = {
  token: string | null;
  user: UserResponse | null;
  isAuthReady: boolean;
};

type AuthContextType = AuthState & {
  setSession: (token: string, user: UserResponse) => void;
  clearSession: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isAuthReady, setAuthReady] = useState(false);

  // Hydrate once on app start
  useEffect(() => {
    const t = localStorage.getItem("auth_token");
    const uRaw = localStorage.getItem("auth_session");
    const u: UserResponse | null = uRaw ? JSON.parse(uRaw) : null;

    if (t && u) {
      setToken(t);
      setUser(u);
    }
    setAuthReady(true);
  }, []);

  // Persist both, store user-only in auth_session
  const setSession = (t: string, u: UserResponse) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("auth_token", t);
    localStorage.setItem("auth_session", JSON.stringify(u));
    // No need to set Axios header here; request interceptor reads from localStorage,
    // and services/auth.ts sets defaults on login/signup. 
  };

  // Single source of truth: call services/auth.ts → logout()
  const clearSession = () => {
    apiLogout(); // clears auth_token, auth_session, and axios default header. 
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthReady, setSession, clearSession }),
    [token, user, isAuthReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
