import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createRoot, Root } from "react-dom/client";
import type { PaperSize } from "./PreviewUtils";

type IframePagedPreviewProps = {
  children: React.ReactNode;     // your ReactSchemaView tree
  size?: PaperSize;              // "A4" | "Letter"
  zoom?: number;                 // 100 = 1x
  onPageCount?: (n: number) => void;
  onCurrentPage?: (n: number) => void;
};

export type IframePagedPreviewHandle = { print: () => void };

const PAGE_GAP_PX = 16;

function collectStylesheetLinks(): string[] {
  const urls: string[] = [];
  document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]').forEach((lnk) => {
    if (lnk.href) urls.push(lnk.href);
  });
  return urls;
}

async function loadStylesInto(doc: Document, hrefs: string[]) {
  await Promise.all(
    hrefs.map(
      href =>
        new Promise<void>((resolve) => {
          const l = doc.createElement("link");
          l.rel = "stylesheet";
          l.href = href;
          l.onload = () => resolve();
          l.onerror = () => resolve(); // don’t block if a sheet fails
          doc.head.appendChild(l);
        })
    )
  );
}

async function loadScriptInto(doc: Document, src: string): Promise<void> {
  await new Promise<void>((resolve) => {
    const s = doc.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve(); // best effort
    doc.body.appendChild(s);
  });
}

const IframePagedPreview = forwardRef<IframePagedPreviewHandle, IframePagedPreviewProps>(
  ({ children, size = "A4", zoom = 100, onPageCount, onCurrentPage }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const scrollHostRef = useRef<HTMLDivElement>(null);
    const reactRootRef = useRef<Root | null>(null);
    const [pageCount, setPageCount] = useState(1);

    useImperativeHandle(ref, () => ({
      print: () => {
        const w = iframeRef.current?.contentWindow;
        if (!w) return;
        w.focus();
        w.print();
      },
    }));

    const scale = useMemo(() => Math.max(0.25, Math.min(3, zoom / 100)), [zoom]);

    useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      let disposed = false;

      (async () => {
        // Build fresh iframe document
        const doc = iframe.contentDocument!;
        doc.open();
        doc.write(`<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>`);
        doc.close();

        // Inject styles (Tailwind/app CSS)
        const hrefs = collectStylesheetLinks();
        await loadStylesInto(doc, hrefs);
        if (disposed) return;

        // Add our print/preview helpers
        const css = doc.createElement("style");
        css.textContent = `
          @page { size: ${size === "A4" ? "210mm 297mm" : "8.5in 11in"}; margin: 0; }
          html, body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-avoid { break-inside: avoid; page-break-inside: avoid; }
          .paper-scroll { overflow: visible !important; }
          .pagedjs_page { box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 10px 20px rgba(0,0,0,.08); }
          .pagedjs_page { margin-bottom: ${PAGE_GAP_PX}px; }
          .pagedjs_page:last-child { margin-bottom: 0; }
          @media print {
            .pagedjs_page { box-shadow: none !important; margin: 0 !important; page-break-after: always !important; }
            .pagedjs_page:last-child { page-break-after: auto !important; }
          }
        `;
        doc.head.appendChild(css);

        // Mount point (width must match paper width)
        const mount = doc.createElement("div");
        mount.id = "resume-root";
        mount.style.width = size === "A4" ? "210mm" : "8.5in";
        mount.style.background = "white";
        doc.body.appendChild(mount);

        // Render React INTO the iframe
        reactRootRef.current?.unmount();
        const root = createRoot(mount);
        reactRootRef.current = root;
        root.render(<>{children}</>);

        // Give React a frame to commit layout before paginating
        await new Promise(r => requestAnimationFrame(() => r(null as unknown as void)));
        if (disposed) return;

        // Load Paged.js in the iframe
        await loadScriptInto(doc, "https://unpkg.com/pagedjs/dist/paged.polyfill.js");
        if (disposed) return;

        // Access the Paged namespace from the iframe window
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const PagedNS = (iframe.contentWindow as any)?.Paged || (window as any)?.Paged;
        if (!PagedNS) return;

        // ✅ Correct API: Previewer().preview(content, styles[], onRender)
        const previewer = new PagedNS.Previewer();

        const onRendered = () => {
          if (disposed) return;
          const pages = doc.querySelectorAll(".pagedjs_page");
          const count = pages.length || 1;
          setPageCount(count);
          onPageCount?.(count);
          if (scrollHostRef.current) scrollHostRef.current.scrollTop = 0;
          onCurrentPage?.(1);
        };

        // content can be the iframe's Document for “whole doc” pagination
        previewer.preview(doc, [], onRendered);
      })();

      return () => {
        disposed = true;
        // Defer unmount to avoid “synchronously unmount” warnings during render
        setTimeout(() => {
          try {
            reactRootRef.current?.unmount();
            if (iframeRef.current) iframeRef.current.src = "about:blank";
          } catch {
            /* noop */
          }
        }, 0);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children, size, onPageCount, onCurrentPage]);

    // Track current page index while scrolling
    const onScroll = () => {
      const host = scrollHostRef.current;
      const iframe = iframeRef.current;
      if (!host || !iframe) return;
      const doc = iframe.contentDocument;
      if (!doc) return;
      const first = doc.querySelector(".pagedjs_page") as HTMLElement | null;
      if (!first) return;
      const pageH = first.getBoundingClientRect().height * scale;
      const st = host.scrollTop;
      const idx = Math.floor((st + 1) / Math.max(1, pageH + PAGE_GAP_PX * scale)) + 1;
      onCurrentPage?.(Math.max(1, Math.min(pageCount, idx)));
    };

    return (
      <div
        ref={scrollHostRef}
        onScroll={onScroll}
        className="h-full bg-gray-100 rounded-xl p-3 md:p-4 min-h-0 overflow-auto flex justify-center items-start"
      >
        <iframe
          ref={iframeRef}
          title="resume-paged-iframe"
          style={{
            width: "calc(100% - 2px)",
            height: "100%",
            border: 0,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    );
  }
);

export default IframePagedPreview;
