import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function GuestRoute({ redirectTo = "/" }) {
    const { token, isAuthReady } = useAuth();
    if (!isAuthReady)
        return null; // or a spinner
    return token ? _jsx(Navigate, { to: redirectTo, replace: true }) : _jsx(Outlet, {});
}
