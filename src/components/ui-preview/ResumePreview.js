import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PreviewUtils from "./PreviewUtils";
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
const mmToPx = (mm) => (mm * 96) / 25.4;
const ResumePreview = ({ resumeData, }) => {
    const data = useMemo(() => ({ ...resumeData, tokens }), [resumeData]);
    // Paper & zoom
    const [size, setSize] = useState("A4");
    const [zoom, setZoom] = useState(100);
    const scale = useMemo(() => Math.max(0.25, Math.min(3, zoom / 100)), [zoom]);
    // Pagination state
    const [currentPage, setCurrentPage] = useState("all");
    const [totalPages, setTotalPages] = useState(1);
    // Page dimensions (CSS px @96dpi)
    const pagePx = useMemo(() => size === "A4"
        ? { w: mmToPx(210), h: mmToPx(297) }
        : { w: 8.5 * 96, h: 11 * 96 }, [size]);
    // Print target = AutoPager root
    const printRootRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: printRootRef,
        documentTitle: "My_CV",
        pageStyle: printCss,
    });
    // CSS custom props for @page size
    const pageVars = size === "A4"
        ? { "--page-size": "A4", "--page-w": "210mm", "--page-h": "297mm" }
        : { "--page-size": "Letter", "--page-w": "8.5in", "--page-h": "11in" };
    return (_jsxs("div", { className: "relative h-full grid grid-rows-[auto,1fr] gap-2 min-h-0", children: [_jsx(PreviewUtils, { size: size, zoom: zoom, onSizeChange: setSize, onZoomChange: setZoom, onDownload: handlePrint, dense: true, currentPage: currentPage, totalPages: totalPages, onCurrentPageChange: setCurrentPage }), _jsx("style", { children: previewOverrides }), _jsx("div", { className: "h-full bg-gray-100 rounded-xl p-3 md:p-4 min-h-0 overflow-auto flex flex-col items-center", children: _jsx(AutoPager, { ref: printRootRef, className: "resume-print w-full flex flex-col items-center", pageWidthPx: pagePx.w, pageHeightPx: pagePx.h, paddingPx: Math.round(mmToPx(0)), scale: scale, blockSelector: "[data-page-block]", depKey: resumeData, currentPage: currentPage, screenOnlyCurrent: true, onPagesChange: setTotalPages, children: _jsx("div", { style: pageVars, children: _jsx(ReactSchemaView, { schema: cvLayoutPro, data: data }) }) }) })] }));
};
export default ResumePreview;
