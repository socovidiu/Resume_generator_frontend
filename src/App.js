import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate, useLocation, matchPath } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import GuestRoute from "./auth/GuestRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CvEditPage from "./pages/CvEditPage";
import CvManager from "./pages/CvManagerPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import AuthLayout from "./layouts/AuthLayout";
function Shell({ children }) {
    const location = useLocation();
    // Any paths that should be edge-to-edge (no gray container)
    const edgeToEdge = [
        "/login",
        "/signup",
        "/dashboard",
        "/profile",
        "/resume/new",
        "/resume/:id",
        // add more like "/forgot-password" if you add them later
    ].some((pattern) => matchPath({ path: pattern, end: true }, location.pathname));
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), edgeToEdge ? (
            // No container / gray background on auth pages
            _jsx("div", { className: "min-h-[calc(100vh-4rem)] overflow-hidden", children: children })) : (
            // Default app shell
            _jsx("div", { className: "min-h-[calc(100vh-4rem)] bg-gray-300", children: _jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-6", children: children }) }))] }));
}
export default function App() {
    return (_jsx(Shell, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsxs(Route, { element: _jsx(GuestRoute, { redirectTo: "/" }), children: [_jsx(Route, { path: "/login", element: _jsx(AuthLayout, { title: "Welcome back", blurb: "Pick up where you left off.", children: _jsx(LoginPage, {}) }) }), _jsx(Route, { path: "/signup", element: _jsx(AuthLayout, { title: "Create your account", blurb: "It takes less than a minute.", children: _jsx(SignupPage, {}) }) })] }), _jsxs(Route, { element: _jsx(ProtectedRoute, { redirectTo: "/login" }), children: [_jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/resumes", element: _jsx(CvManager, {}) }), _jsx(Route, { path: "/resume/new", element: _jsx(CvEditPage, {}) }), _jsx(Route, { path: "/resume/:id", element: _jsx(CvEditPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
