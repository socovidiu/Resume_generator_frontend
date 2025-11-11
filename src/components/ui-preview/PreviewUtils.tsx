import React, { useEffect } from "react";
import { FaDownload, FaSearchMinus, FaSearchPlus } from "react-icons/fa";

export type PaperSize = "A4" | "Letter";
const ZOOM_PRESETS = [50, 75, 100, 125, 150, 175, 200];

type Props = {
  size: PaperSize;
  zoom: number; // percent
  onSizeChange: (size: PaperSize) => void;
  onZoomChange: (zoom: number) => void;
  onDownload: () => void;
  className?: string;
  dense?: boolean;

  /** live page indicator + controller */
  currentPage?: number | "all";
  totalPages?: number;
  onCurrentPageChange?: (page: number | "all") => void;
};

export default function PreviewUtils({
  size,
  zoom,
  onSizeChange,
  onZoomChange,
  onDownload,
  className = "",
  dense = false,
  currentPage = "all",
  totalPages = 1,
  onCurrentPageChange,
}: Props) {
  const dec = () => onZoomChange(Math.max(25, zoom - 25));
  const inc = () => onZoomChange(Math.min(300, zoom + 25));

  // --- Page nav helpers ---
  const goPrev = () => {
    if (!onCurrentPageChange) return;
    if (currentPage === "all") {
      onCurrentPageChange(0);
    } else {
      onCurrentPageChange(Math.max(0, currentPage - 1));
    }
  };

  const goNext = () => {
    if (!onCurrentPageChange) return;
    if (currentPage === "all") {
      onCurrentPageChange(0);
    } else {
      onCurrentPageChange(Math.min(totalPages - 1, currentPage + 1));
    }
  };

  const showAll = () => onCurrentPageChange?.("all");

  const jumpTo = (pageIndex: number) => {
    if (!onCurrentPageChange) return;
    const clamped = Math.max(0, Math.min(totalPages - 1, pageIndex));
    onCurrentPageChange(clamped);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;

      // Zoom & print with modifiers
      if (mod) {
        if (e.key === "-" || e.key === "_") {
          e.preventDefault(); dec(); return;
        }
        if (e.key === "+" || e.key === "=") {
          e.preventDefault(); inc(); return;
        }
        if (e.key.toLowerCase() === "p") {
          e.preventDefault(); onDownload(); return;
        }
        return;
      }

      // Page navigation without modifiers
      if (e.key === "ArrowLeft") {
        e.preventDefault(); goPrev(); return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault(); goNext(); return;
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

  const canPrev =
    currentPage !== "all" && typeof currentPage === "number" && currentPage > 0;
  const canNext =
    currentPage !== "all" &&
    typeof currentPage === "number" &&
    currentPage < totalPages - 1;

  return (
    <div
      className={[
        `sticky ${top} z-40 mx-auto w-fit bg-white/90 backdrop-blur border border-gray-200 shadow-sm rounded-xl`,
        barPad,
        "flex items-center",
        gap,
        className,
      ].join(" ")}
      role="toolbar"
      aria-label="Preview controls"
    >
      {/* Paper size */}
      <div className={["flex items-center", gap].join(" ")}>
        {!dense && (
          <label htmlFor="paper" className={`font-medium text-gray-600 ${txt}`}>
            Paper
          </label>
        )}
        <select
          id="paper"
          value={size}
          onChange={(e) => onSizeChange(e.target.value as PaperSize)}
          className={`${ctlH} rounded-lg border border-gray-300 bg-white ${txt} text-gray-900 ${padX} hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200`}
        >
          <option value="A4">A4 (210×297 mm)</option>
          <option value="Letter">Letter (8.5×11 in)</option>
        </select>
      </div>

      <span className="h-5 w-px bg-gray-200" aria-hidden />

      {/* Zoom */}
      <div className={["flex items-center", gap].join(" ")}>
        {!dense && (
          <label htmlFor="zoom" className={`font-medium text-gray-600 ${txt}`}>
            Zoom
          </label>
        )}
        <button
          type="button"
          onClick={dec}
          className={`${ctlH} w-8 inline-flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-800`}
          aria-label="Zoom out"
          title="Zoom out (Ctrl/Cmd + -)"
        >
          <FaSearchMinus className={dense ? "h-3 w-3" : "h-3.5 w-3.5"} />
        </button>
        <select
          id="zoom"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className={`${ctlH} rounded-lg border border-gray-300 bg-white ${txt} text-gray-900 ${padX} hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200`}
        >
          {ZOOM_PRESETS.map((z) => (
            <option key={z} value={z}>
              {z}%
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={inc}
          className={`${ctlH} w-8 inline-flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-800`}
          aria-label="Zoom in"
          title="Zoom in (Ctrl/Cmd + +)"
        >
          <FaSearchPlus className={dense ? "h-3 w-3" : "h-3.5 w-3.5"} />
        </button>
      </div>

      <span className="h-5 w-px bg-gray-200" aria-hidden />

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 rounded bg-slate-200 disabled:opacity-50"
          onClick={goPrev}
          disabled={!canPrev}
          title="Previous page (←)"
          aria-label="Previous page"
        >
          ←
        </button>

        {/* Quick jump select (optional; hide if only one page) */}
        {totalPages > 1 && currentPage !== "all" && (
          <select
            className={`${ctlH} rounded-lg border border-gray-300 bg-white ${txt} ${padX}`}
            value={typeof currentPage === "number" ? currentPage : 0}
            onChange={(e) => jumpTo(Number(e.target.value))}
            aria-label="Jump to page"
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <option key={i} value={i}>
                Page {i + 1}
              </option>
            ))}
          </select>
        )}

        <span className="text-sm tabular-nums">
          {currentPage === "all"
            ? `All pages (${totalPages})`
            : `Page ${(currentPage as number) + 1} / ${totalPages}`}
        </span>

        <button
          className="px-2 py-1 rounded bg-slate-200 disabled:opacity-50"
          onClick={goNext}
          disabled={!canNext}
          title="Next page (→)"
          aria-label="Next page"
        >
          →
        </button>

        <button
          className="ml-2 px-2 py-1 rounded bg-slate-200 disabled:opacity-50"
          onClick={showAll}
          disabled={currentPage === "all"}
          title="Show all pages"
        >
          Show all
        </button>
      </div>

      <span className="h-5 w-px bg-gray-200" aria-hidden />

      {/* Download */}
      <button
        type="button"
        onClick={onDownload}
        className={[
          "inline-flex items-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition",
          ctlH,
          padX,
          txt,
        ].join(" ")}
        title="Download (Ctrl/Cmd + P)"
      >
        <FaDownload className={dense ? "h-3.5 w-3.5" : "h-4 w-4"} />
        <span className={`font-medium ${txt}`}>{dense ? "Save" : "Download"}</span>
      </button>
    </div>
  );
}
