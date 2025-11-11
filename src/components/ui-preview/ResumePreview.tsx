import React, { useMemo, useRef, useState } from "react";
import type { CVData } from "../../types/CVtype";
import { useReactToPrint } from "react-to-print";
import PreviewUtils, { PaperSize } from "./PreviewUtils";
import AutoPager from "./AutoPager";
import { ReactSchemaView } from "../template-engine/reactSchema";
import { cvLayoutPro, tokens } from "../template-engine/cvLayoutPro";

/** Print CSS — neutralize preview transforms, force clean A4/Letter pages */
const printCss = `
  @page { size: var(--page-size, A4); margin: 0; }
  @media print {
    html, body { margin: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .resume-print .sheet {
      width: var(--page-w, 210mm) !important;
      min-height: var(--page-h, 297mm) !important;
      margin: 0 !important;
      background: #fff !important;
      page-break-after: always;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
    }
    .resume-print .sheet .sheet-canvas { transform: none !important; }
    .page-avoid { break-inside: avoid; page-break-inside: avoid; }
  }
`;

/** Preview niceties */
const previewOverrides = `
  .sheet .paper-scroll { overflow: visible !important; }
  .sheet *::-webkit-scrollbar { width: 0; height: 0; }
  .sheet * { scrollbar-width: none; }
  .page-avoid { break-inside: avoid; page-break-inside: avoid; }
`;

const mmToPx = (mm: number) => (mm * 96) / 25.4;

const ResumePreview: React.FC<{ resumeData: CVData; template?: string }> = ({
  resumeData,
}) => {
  const data = useMemo(() => ({ ...resumeData, tokens }), [resumeData]);

  // Paper & zoom
  const [size, setSize] = useState<PaperSize>("A4");
  const [zoom, setZoom] = useState<number>(100);
  const scale = useMemo(() => Math.max(0.25, Math.min(3, zoom / 100)), [zoom]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number | "all">("all");
  const [totalPages, setTotalPages] = useState(1);
  // Page dimensions (CSS px @96dpi)
  const pagePx = useMemo(
    () =>
      size === "A4"
        ? { w: mmToPx(210), h: mmToPx(297) }
        : { w: 8.5 * 96, h: 11 * 96 },
    [size]
  );

  // Print target = AutoPager root
  const printRootRef = useRef<Element>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRootRef,
    documentTitle: "My_CV",
    pageStyle: printCss,
  });

  // CSS custom props for @page size
  const pageVars =
    size === "A4"
      ? ({
          ["--page-size" as any]: "A4",
          ["--page-w" as any]: "210mm",
          ["--page-h" as any]: "297mm",
        } as React.CSSProperties)
      : ({
          ["--page-size" as any]: "Letter",
          ["--page-w" as any]: "8.5in",
          ["--page-h" as any]: "11in",
        } as React.CSSProperties);

  return (
    <div className="relative h-full grid grid-rows-[auto,1fr] gap-2 min-h-0">
      <PreviewUtils
        size={size}
        zoom={zoom}
        onSizeChange={setSize}
        onZoomChange={setZoom}
        onDownload={handlePrint}
        dense={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onCurrentPageChange={setCurrentPage}
      />

      <style>{previewOverrides}</style>

      {/* Paged preview */}
      <div className="h-full bg-gray-100 rounded-xl p-3 md:p-4 min-h-0 overflow-auto flex flex-col items-center">
        <AutoPager
          ref={printRootRef}
          className="resume-print w-full flex flex-col items-center"
          pageWidthPx={pagePx.w}
          pageHeightPx={pagePx.h}
          paddingPx={Math.round(mmToPx(0))}
          scale={scale}
          blockSelector="[data-page-block]"
          depKey={resumeData}
          currentPage={currentPage}
          screenOnlyCurrent={true}
          onPagesChange={setTotalPages}
        >
          {/* Your schema content */}
          <div style={pageVars as React.CSSProperties}>
            <ReactSchemaView schema={cvLayoutPro} data={data} />
          </div>
        </AutoPager>

        {/* Optional small note */}
        {/* <div className="text-xs text-gray-500 mt-2">{/* pages are shown above */}
        {/*}</div> */}
      </div>
    </div>
  );
};

export default ResumePreview;
