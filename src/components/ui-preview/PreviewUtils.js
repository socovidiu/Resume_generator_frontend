import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { FaDownload, FaSearchMinus, FaSearchPlus } from "react-icons/fa";
const ZOOM_PRESETS = [50, 75, 100, 125, 150, 175, 200];
export default function PreviewUtils({ size, zoom, onSizeChange, onZoomChange, onDownload, className = "", dense = false, currentPage = "all", totalPages = 1, onCurrentPageChange, }) {
    const dec = () => onZoomChange(Math.max(25, zoom - 25));
    const inc = () => onZoomChange(Math.min(300, zoom + 25));
    // --- Page nav helpers ---
    const goPrev = () => {
        if (!onCurrentPageChange)
            return;
        if (currentPage === "all") {
            onCurrentPageChange(0);
        }
        else {
            onCurrentPageChange(Math.max(0, currentPage - 1));
        }
    };
    const goNext = () => {
        if (!onCurrentPageChange)
            return;
        if (currentPage === "all") {
            onCurrentPageChange(0);
        }
        else {
            onCurrentPageChange(Math.min(totalPages - 1, currentPage + 1));
        }
    };
    const showAll = () => onCurrentPageChange?.("all");
    const jumpTo = (pageIndex) => {
        if (!onCurrentPageChange)
            return;
        const clamped = Math.max(0, Math.min(totalPages - 1, pageIndex));
        onCurrentPageChange(clamped);
    };
    // Keyboard shortcuts
    useEffect(() => {
        const onKey = (e) => {
            const mod = e.ctrlKey || e.metaKey;
            // Zoom & print with modifiers
            if (mod) {
                if (e.key === "-" || e.key === "_") {
                    e.preventDefault();
                    dec();
                    return;
                }
                if (e.key === "+" || e.key === "=") {
                    e.preventDefault();
                    inc();
                    return;
                }
                if (e.key.toLowerCase() === "p") {
                    e.preventDefault();
                    onDownload();
                    return;
                }
                return;
            }
            // Page navigation without modifiers
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
                return;
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
                return;
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zoom, currentPage, totalPages]);
    // density helpers
    const ctlH = dense ? "h-7" : "h-8";
    const txt = dense ? "text-xs" : "text-sm";
    const padX = dense ? "px-2" : "px-3";
    const gap = dense ? "gap-2" : "gap-3";
    const barPad = dense ? "px-2 py-1.5" : "px-3 py-2";
    const top = dense ? "top-2" : "top-4";
    const canPrev = currentPage !== "all" && typeof currentPage === "number" && currentPage > 0;
    const canNext = currentPage !== "all" &&
        typeof currentPage === "number" &&
        currentPage < totalPages - 1;
    return (_jsxs("div", { className: [
            `sticky ${top} z-40 mx-auto w-fit bg-white/90 backdrop-blur border border-gray-200 shadow-sm rounded-xl`,
            barPad,
            "flex items-center",
            gap,
            className,
        ].join(" "), role: "toolbar", "aria-label": "Preview controls", children: [_jsxs("div", { className: ["flex items-center", gap].join(" "), children: [!dense && (_jsx("label", { htmlFor: "paper", className: `font-medium text-gray-600 ${txt}`, children: "Paper" })), _jsxs("select", { id: "paper", value: size, onChange: (e) => onSizeChange(e.target.value), className: `${ctlH} rounded-lg border border-gray-300 bg-white ${txt} text-gray-900 ${padX} hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200`, children: [_jsx("option", { value: "A4", children: "A4 (210\u00D7297 mm)" }), _jsx("option", { value: "Letter", children: "Letter (8.5\u00D711 in)" })] })] }), _jsx("span", { className: "h-5 w-px bg-gray-200", "aria-hidden": true }), _jsxs("div", { className: ["flex items-center", gap].join(" "), children: [!dense && (_jsx("label", { htmlFor: "zoom", className: `font-medium text-gray-600 ${txt}`, children: "Zoom" })), _jsx("button", { type: "button", onClick: dec, className: `${ctlH} w-8 inline-flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-800`, "aria-label": "Zoom out", title: "Zoom out (Ctrl/Cmd + -)", children: _jsx(FaSearchMinus, { className: dense ? "h-3 w-3" : "h-3.5 w-3.5" }) }), _jsx("select", { id: "zoom", value: zoom, onChange: (e) => onZoomChange(Number(e.target.value)), className: `${ctlH} rounded-lg border border-gray-300 bg-white ${txt} text-gray-900 ${padX} hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200`, children: ZOOM_PRESETS.map((z) => (_jsxs("option", { value: z, children: [z, "%"] }, z))) }), _jsx("button", { type: "button", onClick: inc, className: `${ctlH} w-8 inline-flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-800`, "aria-label": "Zoom in", title: "Zoom in (Ctrl/Cmd + +)", children: _jsx(FaSearchPlus, { className: dense ? "h-3 w-3" : "h-3.5 w-3.5" }) })] }), _jsx("span", { className: "h-5 w-px bg-gray-200", "aria-hidden": true }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "px-2 py-1 rounded bg-slate-200 disabled:opacity-50", onClick: goPrev, disabled: !canPrev, title: "Previous page (\u2190)", "aria-label": "Previous page", children: "\u2190" }), totalPages > 1 && currentPage !== "all" && (_jsx("select", { className: `${ctlH} rounded-lg border border-gray-300 bg-white ${txt} ${padX}`, value: typeof currentPage === "number" ? currentPage : 0, onChange: (e) => jumpTo(Number(e.target.value)), "aria-label": "Jump to page", children: Array.from({ length: totalPages }).map((_, i) => (_jsxs("option", { value: i, children: ["Page ", i + 1] }, i))) })), _jsx("span", { className: "text-sm tabular-nums", children: currentPage === "all"
                            ? `All pages (${totalPages})`
                            : `Page ${currentPage + 1} / ${totalPages}` }), _jsx("button", { className: "px-2 py-1 rounded bg-slate-200 disabled:opacity-50", onClick: goNext, disabled: !canNext, title: "Next page (\u2192)", "aria-label": "Next page", children: "\u2192" }), _jsx("button", { className: "ml-2 px-2 py-1 rounded bg-slate-200 disabled:opacity-50", onClick: showAll, disabled: currentPage === "all", title: "Show all pages", children: "Show all" })] }), _jsx("span", { className: "h-5 w-px bg-gray-200", "aria-hidden": true }), _jsxs("button", { type: "button", onClick: onDownload, className: [
                    "inline-flex items-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition",
                    ctlH,
                    padX,
                    txt,
                ].join(" "), title: "Download (Ctrl/Cmd + P)", children: [_jsx(FaDownload, { className: dense ? "h-3.5 w-3.5" : "h-4 w-4" }), _jsx("span", { className: `font-medium ${txt}`, children: dense ? "Save" : "Download" })] })] }));
}
