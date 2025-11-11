import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
const LoginPage = () => {
    const navigate = useNavigate();
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-6 text-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Sign in" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Welcome back \u2014 let\u2019s get to work." })] }), _jsx(LoginForm, {}), _jsxs("p", { className: "mt-6 text-center text-sm text-gray-600", children: ["Don\u2019t have an account?", " ", _jsx("button", { type: "button", onClick: () => navigate("/signup"), className: "text-indigo-600 hover:underline", children: "Create one" })] })] }));
};
export default LoginPage;
