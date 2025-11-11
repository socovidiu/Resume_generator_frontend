import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import FormField from "./fields/FormField";
import PasswordField from "./fields/PasswordField";
export default function SignupForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tos, setTos] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function onSubmit(e) {
        e.preventDefault();
        if (loading)
            return;
        setLoading(true);
        setError(null);
        try {
            // const res = await signup({ username, email, password });
            // handle session + navigate…
        }
        catch (err) {
            // Safely narrow and log if desired
            if (err instanceof Error) {
                console.error("Signup failed:", err.message);
            }
            setError("Sign up failed");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("form", { onSubmit: onSubmit, noValidate: true, className: "space-y-4", children: [_jsx(FormField, { id: "username", label: "Username", value: username, onChange: (e) => setUsername(e.currentTarget.value), placeholder: "Your display name", required: true }), _jsx(FormField, { id: "email", label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.currentTarget.value), placeholder: "name@example.com", required: true }), _jsx(PasswordField, { id: "password", value: password, onChange: setPassword }), _jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx("input", { type: "checkbox", checked: tos, onChange: (e) => setTos(e.target.checked), className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" }), "I agree to the Terms and Privacy Policy"] }), _jsx("button", { type: "submit", disabled: loading || !tos, className: "w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 transition disabled:opacity-60", children: loading ? "Creating account…" : "Create account" }), error && _jsx("p", { className: "text-sm text-red-600", children: error })] }));
}
