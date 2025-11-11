// IframePagedPreview.tsx
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot, Root } from "react-dom/client";
import type { PaperSize } from "./PreviewUtils";

type Props = {
  children: React.ReactNode;
  size?: PaperSize;
  zoom?: number; // 100 = 1x
  onPageCount?: (n: number) => void;
  onCurrentPage?: (n: number) => void;
};

export type IframePagedPreviewHandle = { print: () => void };

const PAGE_GAP_PX = 16;

function raf(): Promise<void> {
  return new Promise((r) => requestAnimationFrame(() => r()));
}

const IframePagedPreview = forwardRef<IframePagedPreviewHandle, Props>(
  ({ children, size = "A4", zoom = 100, onPageCount, onCurrentPage }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const scrollHostRef = useRef<HTMLDivElement>(null);
    const reactRootRef = useRef<Root | null>(null);

    const [docReady, setDocReady] = useState<Document | null>(null);
    const [pageCount, setPageCount] = useState(1);

    // pagination job control
    const runCounterRef = useRef(0);     // increments for each preview run
    const runningRef = useRef<number>(0); // current active run id (0 = none)

    useImperativeHandle(ref, () => ({
      print: () => iframeRef.current?.contentWindow?.print(),
    }));

    const scale = useMemo(
      () => Math.max(0.25, Math.min(3, zoom / 100)),
      [zoom]
    );

    const srcDoc = useMemo(
      () => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { size: ${size === "A4" ? "210mm 297mm" : "8.5in 11in"}; margin: 0; }
      html, body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page-avoid { break-inside: avoid; page-break-inside: avoid; }
      body { background: white; }
    </style>
  </head>
  <body>
    <div id="resume-root" style="width:${size === "A4" ? "210mm" : "8.5in"}"></div>
  </body>
</html>`,
      [size]
    );

    // Wait for iframe to load
    useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const onLoad = () => setDocReady(iframe.contentDocument);
      iframe.addEventListener("load", onLoad);
      return () => iframe.removeEventListener("load", onLoad);
    }, []);

    // Helper: clone <link rel="stylesheet"> into iframe (once)
    const injectCssOnce = async (doc: Document) => {
      if (doc.getElementById("__injected_css__")) return;
      const marker = doc.createElement("meta");
      marker.id = "__injected_css__";
      doc.head.appendChild(marker);

      const links = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      ) as HTMLLinkElement[];

      await Promise.all(
        links.map(
          (lnk) =>
            new Promise<void>((resolve) => {
              const cloned = doc.createElement("link");
              cloned.rel = "stylesheet";
              cloned.href = lnk.href;
              cloned.onload = () => resolve();
              cloned.onerror = () => resolve();
              doc.head.appendChild(cloned);
            })
        )
      );
    };

    // Helper: ensure paged containers
    const ensureContainers = (doc: Document) => {
      let viewport = doc.getElementById("paged-viewport") as HTMLElement | null;
      if (!viewport) {
        viewport = doc.createElement("div");
        viewport.id = "paged-viewport";
        viewport.style.transformOrigin = "top left";
        doc.body.appendChild(viewport);
      }
      let target = doc.getElementById("paged-output") as HTMLElement | null;
      if (!target) {
        target = doc.createElement("div");
        target.id = "paged-output";
        viewport.appendChild(target);
      } else {
        target.innerHTML = "";
      }
      return { viewport, target };
    };

    // Helper: run paged.js safely, canceling previous runs
    const runPagination = async () => {
      const iframe = iframeRef.current;
      const doc = iframe?.contentDocument;
      if (!iframe || !doc || !reactRootRef.current) return;

      // bump run id and mark as running
      const runId = ++runCounterRef.current;
      runningRef.current = runId;

      // load Paged.js if needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let PagedNS: any = (iframe.contentWindow as any)?.Paged;
      if (!PagedNS) {
        await new Promise<void>((resolve) => {
          const s = doc.createElement("script");
          s.src = "https://unpkg.com/pagedjs/dist/paged.polyfill.js";
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => resolve();
          doc.body.appendChild(s);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        PagedNS = (iframe.contentWindow as any)?.Paged;
      }
      if (runningRef.current !== runId || !PagedNS) return;

      const { target } = ensureContainers(doc);
      const sourceEl = doc.getElementById("resume-root");
      if (!sourceEl || !target) return;

      // Wait two frames so React commits layout (prevents null rects in paged)
      await raf();
      await raf();
      if (runningRef.current !== runId) return;

      try {
        const previewer = new PagedNS.Previewer();
        previewer.on("rendered", () => {
          if (runningRef.current !== runId) return;
          const pages = doc.querySelectorAll(".pagedjs_page");
          const count = pages.length || 1;
          setPageCount(count);
          onPageCount?.(count);

          // cosmetics
          pages.forEach((p: Element, i: number) => {
            const el = p as HTMLElement;
            el.style.marginBottom =
              i === pages.length - 1 ? "0px" : `${PAGE_GAP_PX}px`;
            el.style.boxShadow =
              "0 0 0 1px rgba(0,0,0,.08), 0 10px 20px rgba(0,0,0,.08)";
          });

          // hide flow
          (sourceEl as HTMLElement).style.position = "absolute";
          (sourceEl as HTMLElement).style.left = "-99999px";

          // reset scroll/page
          if (scrollHostRef.current) scrollHostRef.current.scrollTop = 0;
          onCurrentPage?.(1);
        });

        // IMPORTANT: this returns a promise; await avoids overlapping runs
        await previewer.preview(sourceEl, [], target);
      } catch {
        // swallow—paged sometimes throws internally; job control prevents loops
      } finally {
        // clear running flag if this is still the latest run
        if (runningRef.current === runId) {
          runningRef.current = 0;
        }
      }
    };

    // Initial mount & size changes
    useEffect(() => {
      const iframe = iframeRef.current;
      const doc = docReady;
      if (!iframe || !doc) return;

      let disposed = false;

      (async () => {
        await injectCssOnce(doc);

        const mount = doc.getElementById("resume-root");
        if (!mount) return;

        if (!reactRootRef.current) {
          reactRootRef.current = createRoot(mount);
        }
        reactRootRef.current.render(<>{children}</>);

        await raf(); // settle
        if (disposed) return;

        ensureContainers(doc);
        await runPagination();
      })();

      return () => {
        disposed = true;
        // cancel any pending run
        runningRef.current = 0;
        // tear down root (deferred)
        setTimeout(() => {
          try {
            reactRootRef.current?.unmount();
          } catch {}
          reactRootRef.current = null;
        }, 0);
      };
      // include children so first render also paginates; subsequent updates handled below
    }, [docReady, size, children, onCurrentPage, onPageCount]);

    // Re-paginate on children changes without remounting/unloading iframe
    useEffect(() => {
      if (!iframeRef.current?.contentDocument || !reactRootRef.current) return;
      // update content
      reactRootRef.current.render(<>{children}</>);
      // debounce + serialize pagination
      const t = setTimeout(runPagination, 0);
      return () => clearTimeout(t);
    }, [children]);

    // Zoom scaling
    useEffect(() => {
      const doc = iframeRef.current?.contentDocument;
      const vp = doc?.getElementById("paged-viewport") as HTMLElement | null;
      if (vp) {
        vp.style.transform = `scale(${scale})`;
        vp.style.transformOrigin = "top left";
      }
    }, [scale]);

    // Scroll → page index
    const onScroll = () => {
      const host = scrollHostRef.current;
      const ifr = iframeRef.current;
      if (!host || !ifr) return;
      const doc = ifr.contentDocument;
      if (!doc) return;

      const first = doc.querySelector(".pagedjs_page") as HTMLElement | null;
      if (!first) return;

      const pageH = first.getBoundingClientRect().height * scale;
      if (!pageH) return;

      const st = host.scrollTop;
      const idx =
        Math.floor((st + 1) / Math.max(1, pageH + PAGE_GAP_PX * scale)) + 1;

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
          srcDoc={srcDoc}
          style={{ width: "calc(100% - 2px)", height: "100%", border: 0 }}
        />
      </div>
    );
  }
);

export default IframePagedPreview;
