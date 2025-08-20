import React, { useEffect, useRef, useState } from "react";

type Align = "left" | "right";

export default function Dropdown({
    button,
    items,
    align = "left",
    buttonClassName = "flex items-center gap-1 px-4 py-2 hover:text-blue-600",
    }: {
    button: React.ReactNode;       // trigger content (e.g., "My Account")
    items: React.ReactNode[];      // <Link/> or <button/> nodes you pass in
    align?: Align;                  // menu alignment
    buttonClassName?: string;       // optional custom trigger styles
    }) {

    // State to manage dropdown open/close
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside or ESC
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        
        return () => {
        document.removeEventListener("mousedown", onDocClick);
        document.removeEventListener("keydown", onKey);
        };
    }, []);

    return (
        <div className="relative" ref={ref}>
        <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={buttonClassName}
            aria-haspopup="menu"
            aria-expanded={open}
        >
            {button}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.8 7l4.2 4 4.2-4 1.4 1.4-5.6 5.6-5.6-5.6L5.8 7z" />
            </svg>
        </button>

        {open && (
            <div
            role="menu"
            className={`absolute z-50 mt-2 min-w-40 rounded-md border bg-white shadow-md ${
                align === "right" ? "right-0" : "left-0"
            }`}
            >
            <ul className="py-1">
                {items.map((node, i) => (
                <li key={i} onClick={() => setOpen(false)}>
                    {node}
                </li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
}
