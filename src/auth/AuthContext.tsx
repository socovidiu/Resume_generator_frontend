import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type UseDatar = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: UseDatar | null;
  isAuthReady: boolean; // to prevent route flicker
};

type AuthContextType = AuthState & {
  setSession: (token: string, user: UseDatar) => void;
  clearSession: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UseDatar | null>(null);
  const [isAuthReady, setAuthReady] = useState(false);

  // hydrate from localStorage on first load
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userRaw = localStorage.getItem("auth_session");
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (token && user) {
      setToken(token);
      setUser(user);
    }
    setAuthReady(true);
  }, []);

  const setSession = (t: string, u: UseDatar) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("auth_session", JSON.stringify({ token: t, user: u }));
    localStorage.setItem("auth_token", t); // keep for axios interceptor re-use
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_session");
    localStorage.removeItem("auth_token");
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
