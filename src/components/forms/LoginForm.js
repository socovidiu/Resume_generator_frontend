import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { login } from "../../services/auth";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
export default function LoginForm() {
    // "identifier" can be username OR email
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setSession } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    async function onSubmit(e) {
        e.preventDefault();
        if (loading)
            return;
        setLoading(true);
        setError(null);
        try {
            // We keep the API contract: send "username" even if it's an email.
            const res = await login({ username: identifier, password });
            if (res.token && res.user) {
                setSession(res.token, res.user);
                const to = location.state?.from ?? "/managecvs";
                navigate(to, { replace: true });
            }
            else {
                setError(res.message || "Login failed");
            }
        }
        catch (err) {
            let message = "Login failed";
            // If this is an Error, prefer its message
            if (err instanceof Error) {
                message = err.message || message;
            }
            // Handle Axios-like errors without using `any`
            if (typeof err === "object" && err !== null && "response" in err) {
                const httpErr = err;
                message = httpErr.response?.data?.message ?? httpErr.response?.statusText ?? message;
            }
            setError(message);
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("form", { onSubmit: onSubmit, noValidate: true, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "identifier", className: "block text-gray-700 font-medium mb-1", children: "Username or Email" }), _jsx("input", { id: "identifier", name: "identifier", type: "text", placeholder: "Enter username or email", value: identifier, onChange: (e) => setIdentifier(e.target.value), autoComplete: "username", required: true, className: "w-full px-3 py-2 border rounded-md text-gray-700 bg-gray-200 focus:ring focus:ring-blue-200", "aria-invalid": !!error })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "password", className: "block text-gray-700 font-medium mb-1", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "current-password", required: true, className: "w-full px-3 py-2 border rounded-md text-gray-700 bg-gray-200 focus:ring focus:ring-blue-200", "aria-invalid": !!error })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition py-2 rounded", children: loading ? "Signing in..." : "Login" }), error && _jsx("p", { className: "mt-3 text-sm text-red-600", children: error })] }));
}
