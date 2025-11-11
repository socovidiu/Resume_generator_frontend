import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
const defaultItemClasses = "block w-full text-left px-5 py-3 text-l leading-7 font-medium " +
    "text-slate-800 hover:bg-slate-50 hover:text-blue-400 rounded-lg";
export default function Dropdown({ button, items, align = "left", buttonClassName = "flex items-center gap-1 px-4 py-2 hover:text-blue-600", }) {
    // State to manage dropdown open/close
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    // Close on click outside or ESC
    useEffect(() => {
        function onDocClick(e) {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        }
        function onKey(e) {
            if (e.key === "Escape")
                setOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);
    return (_jsxs("div", { className: "relative", ref: ref, children: [_jsxs("button", { type: "button", onClick: () => setOpen((v) => !v), className: buttonClassName, "aria-haspopup": "menu", "aria-expanded": open, children: [button, _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M5.8 7l4.2 4 4.2-4 1.4 1.4-5.6 5.6-5.6-5.6L5.8 7z" }) })] }), open && (_jsx("div", { role: "menu", className: `absolute z-50 ${align === "right" ? "right-0" : "left-0"}
                mt-2 w-[200px] rounded-2xl bg-white border border-slate-200 shadow-xl`, children: _jsx("ul", { className: "py-2", children: items.map((node, i) => (_jsx("li", { onClick: () => setOpen(false), className: defaultItemClasses, children: node }, i))) }) }))] }));
}
