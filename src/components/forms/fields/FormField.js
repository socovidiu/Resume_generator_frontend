import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FormField({ id, label, helperText, ...inputProps }) {
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: id, className: "block text-sm font-medium text-gray-700", children: label }), _jsx("input", { id: id, ...inputProps, className: "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm " +
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 " +
                    (inputProps.className ?? "") }), helperText && _jsx("p", { className: "mt-1 text-xs text-gray-500", children: helperText })] }));
}
