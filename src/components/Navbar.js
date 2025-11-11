import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useAuth } from "../auth/AuthContext";
import Button from "./ui-elements/Button";
import { useLogout } from "../hooks/useLogout";
export default function Navbar() {
    const { user } = useAuth();
    const doLogout = useLogout();
    // CV dropdown items 
    const cvItems = [
        _jsx(Link, { to: "/exemple-cv", children: " CV Examples " }, "ex"),
        _jsx(Link, { to: "/modele-cv", children: " CV Models " }, "md"),
    ];
    // Account dropdown items 
    const accountItems = user
        ? [
            _jsx(Link, { to: "/dashboard", children: " Dashboard " }, "dash"),
            _jsx(Link, { to: "/profile", children: " Profile " }, "profile"),
            _jsx("button", { onClick: () => doLogout({ confirm: true }), children: "Logout" }, "logout"),
        ]
        : [
            _jsx(Link, { to: "/login", children: " Login " }, "login"),
            _jsx(Link, { to: "/signup", children: " Sign Up " }, "signup"),
        ];
    return (_jsx("header", { className: "sticky top-0 z-50 bg-white border-b border-gray-950/5", children: _jsx("nav", { className: "w-full", children: _jsxs("div", { className: "h-16 w-full flex items-center justify-between px-4 sm:px-6", children: [_jsx(Link, { to: "/", className: "flex items-center gap-2", children: _jsx("img", { alt: "cvapp.ro logo", src: "logo.svg", className: "h-7 sm:h-9" }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Dropdown, { button: _jsx("span", { className: "inline-flex items-center gap-1 font-medium text-gray-900 hover:text-blue-500", children: "Resume Templates" }), items: cvItems }), _jsx("span", { className: "hidden sm:block h-6 w-px bg-gray-200" }), user ? (_jsx(Dropdown, { button: _jsxs("span", { className: "font-medium text-gray-900 hover:text-blue-700", children: ["My Account (", user.username, ")"] }), items: accountItems, align: "right" })) : (_jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-700", children: "Sign in" })), _jsx(Link, { to: "/resume/new", children: _jsx(Button, { children: "Create my resume" }) })] })] }) }) }));
}
