import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/forms/SignupForm";
const SignupPage = () => {
    const navigate = useNavigate();
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-6 text-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Create your account" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "It takes less than a minute." })] }), _jsx(SignupForm, {}), _jsxs("p", { className: "mt-6 text-center text-sm text-gray-600", children: ["Already have an account?", " ", _jsx("button", { type: "button", onClick: () => navigate("/login"), className: "text-indigo-600 hover:underline", children: "Log in" })] })] }));
};
export default SignupPage;
