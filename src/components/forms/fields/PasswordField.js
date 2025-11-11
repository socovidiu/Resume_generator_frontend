import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
export default function PasswordField({ id, value, onChange, placeholder, label = "Password", }) {
    const [show, setShow] = React.useState(false);
    return (_jsxs("div", { className: "relative", children: [_jsx("label", { htmlFor: id, className: "block text-sm font-medium text-gray-700", children: label }), _jsx("input", { id: id, type: show ? "text" : "password", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder ?? "••••••••", className: "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 pr-14" }), _jsx("button", { type: "button", onClick: () => setShow(s => !s), className: "absolute right-2 bottom-2 text-sm text-gray-500 hover:text-gray-700", "aria-label": show ? "Hide password" : "Show password", children: show ? "Hide" : "Show" })] }));
}
