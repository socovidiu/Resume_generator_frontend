import React, { useRef, useState, useMemo, useEffect, useLayoutEffect } from "react";
import type { CVData } from "../../types/CVtype";
import { useReactToPrint } from "react-to-print";
import PreviewUtils, { PaperSize } from "./PreviewUtils";
import { ReactSchemaView } from "../template-engine/reactSchema";
import { cvLayoutPro, tokens } from "../template-engine/cvLayoutPro";

/** ---------- Print CSS ----------
 * Print renders each .sheet at physical size; the zoom layer is neutralized.
 * We also expose a utility (.page-avoid) that maps to page-break avoidance.
 */
const printCss = `
  @page { size: auto; margin: 0; }
  @media print {
    html, body { margin: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .resume-print .sheet {
      width: var(--page-w) !important;
      height: var(--page-h) !important;
      margin: 0 !important;
      border-radius: 0 !important;
      background: #fff !important;
      overflow: hidden;
      box-shadow: none !important;
      page-break-after: always;
    }
    .resume-print .sheet:last-child { page-break-after: auto; }
    .resume-print .sheet .sheet-canvas { transform: none !important; }
    .page-avoid { break-inside: avoid; page-break-inside: avoid; }
  }
`;

/** Preview-only overrides (no inner scrollbars so pagination is consistent) */
const previewOverrides = `
  .sheet .paper-scroll { overflow: visible !important; }
  .sheet *::-webkit-scrollbar { width: 0; height: 0; }
  .sheet * { scrollbar-width: none; }
  .page-avoid { break-inside: avoid; page-break-inside: avoid; }
`;

// Helpers
const mmToPx = (mm: number) => (mm * 96) / 25.4;
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

const PAGE_GAP_PX = 16;   // visual gap between pages in the viewport
const CARD_PAD_PX = 12;   // matches p-3 wrapper padding

// Logical paddings inside each printed page
const PAD_LR = { left: 0, right: 28 };
const PAD_FIRST = { top: 0, bottom: 40 };
const PAD_OTHER = { top: 24, bottom: 24 };

const ResumePreview: React.FC<{ resumeData: CVData; template?: string }> = ({ resumeData }) => {
  const data = { ...resumeData, tokens };

  // Paper + zoom
  const [size, setSize] = useState<PaperSize>("A4");
  const [zoom, setZoom] = useState<number>(100);

  const arraysEqual = (a: number[], b: number[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

  const rangesEqual = (
    a: Array<{ top: number; bottom: number }>,
    b: Array<{ top: number; bottom: number }>
  ) =>
    a.length === b.length &&
    a.every((v, i) => v.top === b[i].top && v.bottom === b[i].bottom);
  // under existing state near docHeight
  const [avoidRanges, setAvoidRanges] = useState<Array<{top:number; bottom:number}>>([]);
  const [breaks, setBreaks] = useState<number[]>([]); // cumulative Y offsets where each page starts (except page 1 which is 0)

  // Base page size @96dpi
  const pagePx = useMemo(
    () => (size === "A4" ? { w: mmToPx(210), h: mmToPx(297) } : { w: 8.5 * 96, h: 11 * 96 }),
    [size]
  );

  /** ---- Viewport measure & scale ---- */
  const viewportRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    if (!viewportRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      setVw(e.contentRect.width);
      setVh(e.contentRect.height);
    });
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  const baseScale = useMemo(() => {
    if (!vw || !vh) return 1;
    const availW = Math.max(0, vw - CARD_PAD_PX * 2);
    const availH = Math.max(0, vh - CARD_PAD_PX * 2);
    return Math.min(availW / pagePx.w, availH / pagePx.h);
  }, [vw, vh, pagePx]);

  const scale = useMemo(() => Math.min(2.4, baseScale * (zoom / 100)), [baseScale, zoom]);

  /** ---- Content measurement at content width ---- */
  const contentWidth = useMemo(() => pagePx.w - PAD_LR.left - PAD_LR.right, [pagePx.w]);

  const measureRef = useRef<HTMLDivElement>(null);
  const [docHeight, setDocHeight] = useState<number>(pagePx.h);

  // Keep docHeight live using a ResizeObserver (handles fonts/images/async reflow)
  useLayoutEffect(() => {
    let raf = 0;

    const update = () => {
      if (!measureRef.current) return;

      // 1) height (already guarded)
      const h = measureRef.current.scrollHeight || pagePx.h;
      setDocHeight(prev => (prev !== h ? h : prev));

      // 2) collect ranges for .page-avoid
      const nodes = Array.from(
        measureRef.current.querySelectorAll<HTMLElement>(".page-avoid")
      );
      const next = nodes.map((el) => {
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        return { top, bottom };
      });

      // ✅ guard: only update state if ranges actually changed
      setAvoidRanges(prev => (rangesEqual(prev, next) ? prev : next));
    };

    update();

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });

    if (measureRef.current) ro.observe(measureRef.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [data, pagePx.h, contentWidth, size]);

  
  // Content box heights
  const firstBoxH = useMemo(() => pagePx.h - (PAD_FIRST.top + PAD_FIRST.bottom), [pagePx.h]);
  const otherBoxH = useMemo(() => pagePx.h - (PAD_OTHER.top + PAD_OTHER.bottom), [pagePx.h]);

  // Pagination
  const totalPages = useMemo(() => 1 + breaks.length, [breaks]);
  const pageStartY = (i: number) => (i === 0 ? 0 : breaks[i - 1]);
  // helper: if a break falls inside a forbidden range, push it down to the end of that range
  const snapBreak = (y: number, ranges: Array<{top:number; bottom:number}>) => {
    for (const r of ranges) {
      if (y > r.top && y < r.bottom) return r.bottom;
    }
    return y;
  };

  // compute break list whenever inputs change
  useEffect(() => {
    const b: number[] = [];
    let cursor = firstBoxH;

    if (docHeight <= firstBoxH) {
      if (breaks.length) setBreaks([]);
      return;
    }

    const snapBreak = (y: number, ranges: Array<{ top: number; bottom: number }>) => {
      for (const r of ranges) {
        if (y > r.top && y < r.bottom) return r.bottom;
      }
      return y;
    };

    cursor = snapBreak(cursor, avoidRanges);
    b.push(cursor);

    while (cursor < docHeight) {
      const next = snapBreak(cursor + otherBoxH, avoidRanges);
      if (next <= cursor) break; // extra safety: ensure forward progress
      cursor = Math.min(next, docHeight);
      b.push(cursor);
      if (b.length > 200) break;
    }

    // trim trailing break at exact end
    while (b.length && b[b.length - 1] >= docHeight - 1) b.pop();

    if (!arraysEqual(b, breaks)) setBreaks(b);
  }, [docHeight, firstBoxH, otherBoxH, avoidRanges, breaks]);
  /** ---- Current page tracking ---- */
  const [currentPage, setCurrentPage] = useState(1);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const st = (e.currentTarget as HTMLDivElement).scrollTop;
    const visualPageH = pagePx.h * scale; // outer sheet height (without gap)
    const stride = visualPageH + PAGE_GAP_PX;
    const idx = Math.floor((st + 1) / Math.max(1, stride)) + 1;
    setCurrentPage(clamp(idx, 1, totalPages));
  };

  // Keep the same page centered when zoom changes
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const stride = pagePx.h * scale + PAGE_GAP_PX;
    el.scrollTop = (currentPage - 1) * stride;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, pagePx.h]);

  /** ---- Printing ---- */
  const pagesRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: pagesRef,
    documentTitle: "My_CV",
    pageStyle: printCss,
  });

  /** ---- Styles ---- */
  const sheetStyle = useMemo<React.CSSProperties>(() => {
    const w = pagePx.w * scale;
    const h = pagePx.h * scale;
    return {
      width: w,
      height: h,
      boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 10px 20px rgba(0,0,0,0.08)",
      background: "white",
      borderRadius: 8,
      overflow: "hidden",
    };
  }, [pagePx.w, pagePx.h, scale]);

  const pageVars =
    size === "A4"
      ? ({ ["--page-w" as any]: "210mm", ["--page-h" as any]: "297mm" } as React.CSSProperties)
      : ({ ["--page-w" as any]: "8.5in", ["--page-h" as any]: "11in" } as React.CSSProperties);

  const denseToolbar = vw >= 900;

  return (
    <div className="relative h-full grid grid-rows-[auto,1fr] gap-2 min-h-0">
      <PreviewUtils
        size={size}
        zoom={zoom}
        onSizeChange={setSize}
        onZoomChange={setZoom}
        onDownload={handlePrint}
        dense={denseToolbar}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <style>{previewOverrides}</style>

      {/* Scrollable preview viewport */}
      <div
        ref={viewportRef}
        className="h-full bg-gray-100 rounded-xl p-3 md:p-4 min-h-0 overflow-auto flex justify-center items-start"
        onScroll={onScroll}
      >
        {/* Printable page stack */}
        <div ref={pagesRef} className="resume-print w-fit">
          {Array.from({ length: totalPages }).map((_, i) => {
            const isFirst = i === 0;
            const padT = isFirst ? PAD_FIRST.top : PAD_OTHER.top;
            const padB = isFirst ? PAD_FIRST.bottom : PAD_OTHER.bottom;
            const padL = PAD_LR.left;
            const padR = PAD_LR.right;
            const startY = pageStartY(i);

            return (
              <div
                key={i}
                className="sheet mx-auto"
                style={{
                  ...sheetStyle,
                  ...pageVars,
                  marginBottom: i === totalPages - 1 ? 0 : PAGE_GAP_PX,
                }}
              >
                <div
                  className="sheet-canvas"
                  style={{
                    width: pagePx.w,
                    height: pagePx.h,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    boxSizing: "border-box",
                    padding: `${padT}px ${padR}px ${padB}px ${padL}px`,
                  }}
                >
                  {/* Render the full document, shifted so the correct slice is visible */}
                  <div
                    className="sheet-inner"
                    style={{
                      width: contentWidth,
                      minHeight: docHeight,
                      transform: `translateY(-${startY - padT}px)`,
                    }}
                  >
                    <ReactSchemaView schema={cvLayoutPro} data={data} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invisible measurer at content width (observed for live height) */}
        <div
          aria-hidden
          ref={measureRef}
          style={{
            position: "absolute",
            top: -99999,
            left: -99999,
            width: contentWidth,
          }}
        >
          <ReactSchemaView schema={cvLayoutPro} data={data} />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
