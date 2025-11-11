import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Field({ label, htmlFor, error, hint, children, }) {
    return (_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: htmlFor, className: "block text-sm font-medium text-gray-800", children: label }), children, hint && !error && _jsx("p", { className: "text-xs text-gray-500", children: hint }), error && _jsx("p", { className: "text-xs text-red-600", id: `${htmlFor}-error`, children: error })] }));
}
export function Input({ id, invalid, className = "", ...rest }) {
    return (_jsx("input", { id: id, "aria-invalid": invalid || undefined, "aria-describedby": invalid ? `${id}-error` : undefined, className: [
            "w-full rounded-lg shadow-sm",
            "bg-white border ring-1 ring-inset",
            invalid
                ? "border-red-300 ring-red-300 focus:ring-2 focus:ring-red-400"
                : "border-gray-300 ring-gray-300 focus:ring-2 focus:ring-blue-400",
            "px-3 py-2 placeholder:text-gray-400 outline-none transition",
            className,
        ].join(" "), ...rest }));
}
export function Textarea({ id, invalid, className = "", ...rest }) {
    return (_jsx("textarea", { id: id, "aria-invalid": invalid || undefined, "aria-describedby": invalid ? `${id}-error` : undefined, className: [
            "w-full rounded-lg shadow-sm resize-none",
            "bg-white border ring-1 ring-inset min-h-28",
            invalid
                ? "border-red-300 ring-red-300 focus:ring-2 focus:ring-red-400"
                : "border-gray-300 ring-gray-300 focus:ring-2 focus:ring-blue-400",
            "px-3 py-2 placeholder:text-gray-400 outline-none transition",
            className,
        ].join(" "), ...rest }));
}
export function Select({ id, invalid, className = "", ...rest }) {
    return (_jsx("select", { id: id, "aria-invalid": invalid || undefined, "aria-describedby": invalid ? `${id}-error` : undefined, className: [
            "w-full rounded-lg shadow-sm bg-white border ring-1 ring-inset px-3 py-2",
            invalid
                ? "border-red-300 ring-red-300 focus:ring-2 focus:ring-red-400"
                : "border-gray-300 ring-gray-300 focus:ring-2 focus:ring-blue-400",
            "outline-none transition",
            className,
        ].join(" "), ...rest }));
}
