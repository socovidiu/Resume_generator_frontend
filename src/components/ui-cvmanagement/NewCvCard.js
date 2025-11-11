import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
export default function NewCvCard() {
    const navigate = useNavigate();
    return (_jsx("button", { onClick: () => navigate("/resume/new"), className: "w-full rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50/40 transition grid place-items-center aspect-[3/4] shadow-sm", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gray-100", children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", children: _jsx("path", { d: "M12 5v14M5 12h14", stroke: "currentColor", strokeWidth: "2" }) }) }), _jsx("p", { className: "font-semibold text-gray-800", children: "CV nou" }), _jsx("p", { className: "text-sm text-gray-600", children: "\u00CEncepe un CV personalizat" })] }) }));
}
