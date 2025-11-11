import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const NotFound = () => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-gray-100", children: [_jsx("h1", { className: "text-5xl font-bold text-red-600", children: "404" }), _jsx("p", { className: "text-lg text-gray-700", children: "Oops! Page not found." }), _jsx(Link, { to: "/", className: "mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600", children: "Go Home" })] }));
};
export default NotFound;
