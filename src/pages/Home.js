import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import Button from "../components/ui-elements/Button";
const Home = () => {
    return (_jsxs("div", { className: "min-h-screen flex flex-col justify-center items-center text-black", children: [_jsx(motion.h1, { className: "text-5xl font-bold mb-4", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: "Resume Generator" }), _jsx("p", { className: "text-lg opacity-80 text-center max-w-lg", children: "Create, edit, and manage your CVs with ease. Start building your professional career today!" }), _jsxs("div", { className: "mt-8 flex justify-between w-full sm:px-8", children: [_jsx("a", { href: "/resumes", children: _jsx(Button, { children: "Manage CVs" }) }), _jsx("a", { href: "/about", children: _jsx(Button, { children: "Learn More" }) })] }), _jsxs("div", { className: "absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute top-10 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse" }), _jsx("div", { className: "absolute bottom-10 right-1/3 w-20 h-20 bg-white opacity-15 rounded-full animate-bounce" })] })] }));
};
export default Home;
