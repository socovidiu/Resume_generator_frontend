import { jsx as _jsx } from "react/jsx-runtime";
// src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { logout as apiLogout } from "../services/auth";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthReady, setAuthReady] = useState(false);
    // Hydrate once on app start
    useEffect(() => {
        const t = localStorage.getItem("auth_token");
        const uRaw = localStorage.getItem("auth_session");
        const u = uRaw ? JSON.parse(uRaw) : null;
        if (t && u) {
            setToken(t);
            setUser(u);
        }
        setAuthReady(true);
    }, []);
    // Persist both, store user-only in auth_session
    const setSession = (t, u) => {
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
    const value = useMemo(() => ({ token, user, isAuthReady, setSession, clearSession }), [token, user, isAuthReady]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
