import React, { useRef, useState, useMemo, useEffect } from "react";
import type { CVData } from "../../types/CVtype";
import { useReactToPrint } from "react-to-print";
import PreviewUtils, { PaperSize } from "./PreviewUtils";
import { ReactSchemaView } from "../template-engine/reactSchema";
import { cvLayout, tokens } from "../template-engine/cvLayout";

const mmToPx = (mm: number) => (mm * 96) / 25.4;

const ResumePreview: React.FC<{ resumeData: CVData; template: string }> = ({
  resumeData,
}) => {
  const data = { ...resumeData, tokens };
  const pageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState<PaperSize>("A4");
  const [zoom, setZoom] = useState<number>(100); // percent

  // Physical page size in CSS pixels at 96dpi
  const pagePx = useMemo(() => {
    return size === "A4"
      ? { w: mmToPx(210), h: mmToPx(297) }
      : { w: 8.5 * 96, h: 11 * 96 };
  }, [size]);

  // Measure the preview viewport
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

  // Auto-fit page to viewport, then apply user zoom on top
  const baseScale = useMemo(() => {
    if (!vw || !vh) return 1;
    const pad = 48; // inner padding of preview card
    const availW = Math.max(0, vw - pad);
    const availH = Math.max(0, vh - pad);
    return Math.min(availW / pagePx.w, availH / pagePx.h);
  }, [vw, vh, pagePx]);

  const scale = useMemo(() => {
    const MAX_SCALE = 2.4; // allow the sheet to get big on wide previews
    return Math.min(MAX_SCALE, baseScale * (zoom / 100));
  }, [baseScale, zoom]);

  const pageStyle = useMemo<React.CSSProperties>(() => {
    const dims =
      size === "A4"
        ? { width: "210mm", height: "297mm" }
        : { width: "8.5in", height: "11in" };
    return {
      ...dims,
      transform: `scale(${scale})`,
      transformOrigin: "top center",
      boxShadow:
        "0 0 0 1px rgba(0,0,0,0.08), 0 10px 20px rgba(0,0,0,0.08)",
      background: "white",
    };
  }, [size, scale]);

  const handlePrint = useReactToPrint({
    contentRef: pageRef,
    documentTitle: "My_CV",
  });

  // Use a compact toolbar on wide preview columns so more height goes to the page
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
      />

      {/* Viewport: fills column height; the page scales inside it */}
      <div
        ref={viewportRef}
        className="h-full bg-gray-100 rounded-xl p-3 md:p-4 min-h-0"
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          ref={pageRef}
          style={pageStyle}
          className="print:shadow-none print:bg-white"
        >
          <ReactSchemaView schema={cvLayout} data={data} />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
