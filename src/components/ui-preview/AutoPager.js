import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useLayoutEffect, useEffect, useState, forwardRef, } from "react";
const DEFAULT_BLOCK_SELECTOR = "[data-page-block], .resume-block";
function pagesEqual(a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i].height !== b[i].height)
            return false;
        const A = a[i].htmlParts, B = b[i].htmlParts;
        if (A.length !== B.length)
            return false;
        for (let j = 0; j < A.length; j++)
            if (A[j] !== B[j])
                return false;
    }
    return true;
}
/**
 * AutoPager
 * - Renders children once off-screen (raw flow), measures blocks, and packs them into pages.
 * - Shows visible paged output that scales for preview with `scale`.
 * - Forward-ref points to the print root so `react-to-print` can target it.
 */
const AutoPager = forwardRef(({ children, pageWidthPx, pageHeightPx, paddingPx = 18, scale = 1, blockSelector = DEFAULT_BLOCK_SELECTOR, className, depKey, currentPage = "all", screenOnlyCurrent = true, onPagesChange, }, ref) => {
    const rawRef = useRef(null);
    const [pages, setPages] = useState([]);
    useLayoutEffect(() => {
        const raw = rawRef.current;
        if (!raw)
            return;
        const usable = pageHeightPx - paddingPx * 2;
        // The content root is the wrapper you render inside <AutoPager>{...}</AutoPager>
        const contentRoot = raw.firstElementChild ?? raw;
        // Helper: measure a single element
        const measureEl = (el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            const mt = parseFloat(style.marginTop || "0");
            const mb = parseFloat(style.marginBottom || "0");
            return rect.height + mt + mb;
        };
        // Helper: measure a consecutive group of siblings via DOM Range (handles margins/collapsing)
        const measureGroup = (els) => {
            if (els.length === 1)
                return measureEl(els[0]);
            const range = document.createRange();
            range.setStartBefore(els[0]);
            range.setEndAfter(els[els.length - 1]);
            const rect = range.getBoundingClientRect();
            return rect.height;
        };
        // Walk top-level children; group non-pageblocks, keep pageblocks as indivisible
        const kids = Array.from(contentRoot.children);
        const isPB = (el) => !!blockSelector && el.matches(blockSelector);
        const units = [];
        let buf = [];
        const flushBuf = () => {
            if (!buf.length)
                return;
            const height = measureGroup(buf);
            const html = buf.map((n) => n.outerHTML).join("");
            units.push({ els: buf.slice(), html, height });
            buf = [];
        };
        for (const child of kids) {
            if (blockSelector && isPB(child)) {
                // before pushing a pageblock, flush any buffered non-PB siblings
                flushBuf();
                const height = measureEl(child);
                units.push({ els: [child], html: child.outerHTML, height });
            }
            else {
                buf.push(child);
            }
        }
        flushBuf();
        // If nothing was found (unlikely), fall back to the whole content root as one unit
        if (units.length === 0) {
            const height = measureEl(contentRoot);
            units.push({ els: [contentRoot], html: contentRoot.outerHTML, height });
        }
        // Greedy pack into pages
        const next = [];
        let current = { htmlParts: [], height: 0 };
        // DEBUG
        const DEBUG = true;
        if (DEBUG) {
            console.groupCollapsed("[AutoPager] pagination cycle");
            console.log(`usable page height: ${usable.toFixed(1)}px (${pageHeightPx}px total)`);
        }
        units.forEach((u, idx) => {
            if (DEBUG)
                console.log(`unit ${idx}: height=${u.height.toFixed(1)}px, current=${current.height.toFixed(1)}px`);
            if (u.height > usable && current.htmlParts.length === 0) {
                // too tall: place alone on a page
                next.push({ htmlParts: [u.html], height: u.height });
                current = { htmlParts: [], height: 0 };
                return;
            }
            if (current.height + u.height > usable &&
                current.htmlParts.length > 0) {
                next.push(current);
                current = { htmlParts: [], height: 0 };
            }
            current.htmlParts.push(u.html);
            current.height += u.height;
        });
        if (current.htmlParts.length)
            next.push(current);
        if (DEBUG) {
            console.log(`→ Total pages created: ${next.length}`);
            next.forEach((p, i) => console.log(`Page ${i + 1}: ${p.htmlParts.length} unit(s), height ${p.height.toFixed(1)}px`));
            console.groupEnd();
        }
        setPages((prev) => {
            const same = pagesEqual(prev, next);
            if (!same && onPagesChange)
                onPagesChange(next.length);
            return same ? prev : next;
        });
    }, [pageWidthPx, pageHeightPx, paddingPx, blockSelector, depKey, children]);
    // Recompute on container resizes (zoom/viewport can influence layout)
    useEffect(() => {
        const ro = new ResizeObserver(() => {
            setPages((p) => [...p]); // nudge; guarded by pagesEqual in effect
        });
        if (rawRef.current)
            ro.observe(rawRef.current);
        return () => ro.disconnect();
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: rawRef, style: {
                    position: "absolute",
                    left: -99999,
                    top: 0,
                    visibility: "hidden",
                    width: pageWidthPx,
                }, children: children }), _jsx("div", { ref: ref, className: className, style: { display: "flex", flexDirection: "column", gap: 24 }, children: pages.map((page, i) => {
                    const isCurrent = currentPage === "all" ? true : i === currentPage;
                    const screenHidden = screenOnlyCurrent && !isCurrent ? "ap-hidden-screen" : "";
                    return (_jsx("div", { className: `sheet mx-auto ${screenHidden}`, style: {
                            width: pageWidthPx * scale,
                            minHeight: pageHeightPx * scale,
                            background: "#fff",
                            borderRadius: 8,
                            overflow: "hidden",
                            boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 10px 20px rgba(0,0,0,0.08)",
                        }, children: _jsx("div", { className: "sheet-canvas", style: {
                                width: pageWidthPx,
                                minHeight: pageHeightPx,
                                transform: `scale(${scale})`,
                                transformOrigin: "top left",
                            }, children: _jsx("div", { style: { width: pageWidthPx, padding: paddingPx }, children: page.htmlParts.map((html, j) => (_jsx("div", { dangerouslySetInnerHTML: { __html: html } }, j))) }) }) }, i));
                }) })] }));
});
AutoPager.displayName = "AutoPager";
export default AutoPager;
