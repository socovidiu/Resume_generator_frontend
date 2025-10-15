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
  /** compact UI for wide preview columns */
  dense?: boolean;
};

export default function PreviewUtils({
  size,
  zoom,
  onSizeChange,
  onZoomChange,
  onDownload,
  className = "",
  dense = false,
}: Props) {
  const dec = () => onZoomChange(Math.max(25, zoom - 25));
  const inc = () => onZoomChange(Math.min(300, zoom + 25));

  // Keyboard shortcuts: Ctrl/Cmd + (+/-), and Ctrl/Cmd + P for download
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        dec();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        inc();
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        onDownload();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  // density helpers
  const ctlH = dense ? "h-7" : "h-8";
  const txt = dense ? "text-xs" : "text-sm";
  const padX = dense ? "px-2" : "px-3";
  const gap = dense ? "gap-2" : "gap-3";
  const barPad = dense ? "px-2 py-1.5" : "px-3 py-2";
  const top = dense ? "top-2" : "top-4";

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
