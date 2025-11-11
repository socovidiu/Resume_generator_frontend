import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function ProtectedRoute({ redirectTo = "/login" }) {
    const { token, isAuthReady } = useAuth();
    // Show nothing (or a spinner) until we know if the user is logged in.
    if (!isAuthReady)
        return null;
    return token ? _jsx(Outlet, {}) : _jsx(Navigate, { to: redirectTo, replace: true });
}
