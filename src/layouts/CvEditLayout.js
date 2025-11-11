import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
// ---- Tunables ----
const GAP = 24; // space between columns
const MIN_FORM = 680; // keep the form usable
const MIN_PREVIEW = 420; // smallest preview column we tolerate
const MAX_PREVIEW = Infinity; // cap on huge screens
const STICKY_TOP = 0; // should match your Navbar offset
const PREVIEW_CARD_VPAD = 48; // preview's top+bottom padding (outer card)
const MIN_SCALE_TO_KEEP_PREVIEW = 0.60; // if preview would be smaller, drop it
// A4 mm → px @96dpi
const mmToPx = (mm) => (mm * 96) / 25.4;
const clamp01 = (t) => Math.max(0, Math.min(1, t));
const lerp = (a, b, t) => a + (b - a) * clamp01(t);
const PAGE_PX = { w: mmToPx(210), h: mmToPx(297) }; // A4
// Decides between one-column (form only) or two-column (form + preview)
// In two-column, decides the preview width based on available space  and whether the preview
// can be shown at a reasonable scale.  If not, falls back to one-column.
// The form column always takes the remaining space, and is the only one that scrolls.    
export default function CvEditLayout({ form, preview, }) {
    const rootRef = useRef(null);
    const [cw, setCw] = useState(0);
    const [ch, setCh] = useState(0);
    useEffect(() => {
        if (!rootRef.current)
            return;
        const ro = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry)
                return;
            const { width, height } = entry.contentRect;
            setCw(width);
            setCh(height);
        });
        ro.observe(rootRef.current);
        return () => ro.disconnect();
    }, []);
    const { previewW } = useMemo(() => {
        if (!cw || !ch)
            return { previewW: 0 };
        // If preview rendered, what width would we like (preview gets wider as viewport grows)
        const w0 = 1200, w1 = 3000; // breakpoints
        const t = clamp01((cw - w0) / (w1 - w0));
        const previewFrac = lerp(0.60, 0.86, t); // 60% → 86%
        let w = Math.round(cw * previewFrac);
        // keep form usable
        w = Math.min(w, cw - GAP - MIN_FORM);
        w = Math.max(MIN_PREVIEW, Math.min(MAX_PREVIEW, w));
        // height/scale sanity: would the page be too small?
        const availH = Math.max(0, ch - STICKY_TOP - PREVIEW_CARD_VPAD);
        const availW = Math.max(0, w - 24); // minus inner padding
        const scaleToFit = Math.min(availW / PAGE_PX.w, availH / PAGE_PX.h);
        // not enough width for both or scale too tiny → hide preview (but keep it mounted)
        const tooNarrow = cw < MIN_FORM + GAP + MIN_PREVIEW;
        const tooSmallScale = scaleToFit < MIN_SCALE_TO_KEEP_PREVIEW;
        return {
            previewW: tooNarrow || tooSmallScale ? 0 : w,
        };
    }, [cw, ch]);
    return (_jsx("div", { ref: rootRef, className: "w-full h-[calc(100vh-4rem)] overflow-hidden px-4", children: _jsxs("div", { className: "flex h-full min-h-0", style: { gap: GAP }, children: [_jsxs("aside", { className: "flex-1 min-w-0 overflow-y-auto overscroll-contain bg-white border border-gray-200 rounded-xl p-4", "aria-label": "CV form", children: [form, _jsx("div", { className: "h-6" })] }), _jsx("section", { className: "shrink-0 h-full", style: { width: previewW }, "aria-label": "CV preview", children: _jsx("div", { className: "sticky h-full", style: { top: STICKY_TOP }, children: _jsx("div", { className: "h-full bg-white border border-gray-200 rounded-xl overflow-hidden", children: preview }) }) })] }) }));
}
