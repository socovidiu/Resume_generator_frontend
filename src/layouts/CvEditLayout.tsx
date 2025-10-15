import React, { useEffect, useMemo, useRef, useState } from "react";

// ---- Tunables ----
const GAP = 24;                   // space between columns
const MIN_FORM = 560;             // keep the form usable
const MIN_PREVIEW = 420;          // smallest preview column we tolerate
const MAX_PREVIEW = Infinity;         // cap on huge screens
const STICKY_TOP = 0;            // should match your Navbar offset
const PREVIEW_CARD_VPAD = 48;// preview's top+bottom padding (outer card)
// A4 mm → px @96dpi
const mmToPx = (mm: number) => (mm * 96) / 25.4;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

// ---- The layout component ----
// Decides between one-column (form only) or two-column (form + preview)
// In two-column, decides the preview width based on available space  and whether the preview
// can be shown at a reasonable scale.  If not, falls back to one-column.
// The form column always takes the remaining space, and is the only one that scrolls.    
export default function CvEditLayout({
  form,
  preview,
}: { form: React.ReactNode; preview: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(0);
  const [ch, setCh] = useState(0);

  useEffect(() => {
    if (!rootRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setCw(width);
      setCh(height);
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const { mode, previewW } = useMemo(() => {
    if (!cw || !ch) return { mode: "loading" as const, previewW: 0 };

    // not enough width for both -> form only
    if (cw < MIN_FORM + GAP + MIN_PREVIEW) return { mode: "one" as const, previewW: 0 };

    const w0 = 1200, w1 = 3000;           // breakpoints
    const t = clamp01((cw - w0) / (w1 - w0));
    const previewFrac = lerp(0.60, 0.86, t);

    // proposed preview width
    let w = Math.round(cw * previewFrac);
    w = Math.min(w, cw - GAP - MIN_FORM);
    w = Math.max(MIN_PREVIEW, Math.min(MAX_PREVIEW, w));

    // keep form usable
    if (cw - GAP - w < MIN_FORM) w = cw - GAP - MIN_FORM;

    // 3) HEIGHT sanity: if the page would need too-small scale, drop preview
    const mmToPx = (mm: number) => (mm * 96) / 25.4;
    const PAGE_PX = { w: mmToPx(210), h: mmToPx(297) }; // A4
    const availH = Math.max(0, ch - STICKY_TOP - PREVIEW_CARD_VPAD);
    const availW = Math.max(0, w - 24);
    const scaleToFit = Math.min(availW / PAGE_PX.w, availH / PAGE_PX.h);
    const MIN_SCALE_TO_KEEP_PREVIEW = 0.70;

    if (scaleToFit < MIN_SCALE_TO_KEEP_PREVIEW) {
      return { mode: "one" as const, previewW: 0 };
    }


    return { mode: "split" as const, previewW: w };
  }, [cw, ch]);

  return (
    <div ref={rootRef} className="w-full h-[calc(100vh-4rem)] overflow-hidden px-4">
      {mode === "one" ? (
        // FORM only: the page scrolls only here
        <div className="h-full overflow-y-auto bg-white border border-gray-200 rounded-xl p-4">
          {form}
          <div className="h-6" />
        </div>
      ) : (
        <div className="flex h-full min-h-0" style={{ gap: GAP }}>
          {/* LEFT: the only scroller */}
          <aside
            className="flex-1 min-w-0 overflow-y-auto overscroll-contain bg-white border border-gray-200 rounded-xl p-4"
            aria-label="CV form"
          >
            {form}
            <div className="h-6" />
          </aside>

          {/* RIGHT: sticky preview, no scroll, width decided above */}
          <section className="shrink-0 h-full" style={{ width: previewW }} aria-label="CV preview">
            <div className="sticky h-full" style={{ top: STICKY_TOP }}>
              <div className="h-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                {preview}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
