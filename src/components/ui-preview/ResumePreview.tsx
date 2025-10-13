import React, { useRef, useState, useMemo } from "react";
import { CVData } from "../../types/CVtype";
import { useReactToPrint } from "react-to-print";
import PreviewUtils, { PaperSize } from "./PreviewUtils";
import { ReactSchemaView } from "../template-engine/reactSchema";
import { cvLayout, tokens } from "../template-engine/cvLayout";

const ResumePreview: React.FC<{ resumeData: CVData, template: string }> = ({ resumeData }) => {
  // Put the ref on the *page* element we want to print
  const pageRef = useRef<HTMLDivElement>(null);
  const data = { ...resumeData, tokens };

  const [size, setSize] = useState<PaperSize>("A4");
  const [zoom, setZoom] = useState<number>(100);

  // Page dimensions (on-screen) + zoom
  const pageStyle = useMemo<React.CSSProperties>(() => {
    const dims =
      size === "A4"
        ? { width: "210mm", height: "297mm" }
        : { width: "8.5in", height: "11in" };

    return {
      ...dims,
      transform: `scale(${zoom / 100})`,
      transformOrigin: "top center",
      boxShadow:
        "0 0 0 1px rgba(0,0,0,0.08), 0 10px 20px rgba(0,0,0,0.08)",
      background: "white",
    };
  }, [size, zoom]);

  const handleDownload = useReactToPrint({
    contentRef: pageRef,            // <-- v3 API, good
    documentTitle: "My_CV",
  });

  return (
    <div className="relative">
      <PreviewUtils
        size={size}
        zoom={zoom}
        onSizeChange={setSize}
        onZoomChange={setZoom}
        onDownload={handleDownload}
        className="mb-4"
      />

      <div className="overflow-auto bg-gray-100 rounded-xl p-6">
        <div className="flex justify-center">
          <div ref={pageRef} style={pageStyle} className="print:shadow-none print:bg-white">
            <ReactSchemaView schema={cvLayout} data={data} />
          </div>
        </div>
      </div>

      {/* Print styles to avoid scaled output */}
      <style>
        {`
          @media print {
            /* ensure the printed node isn't scaled or clipped */
            [data-react-to-print] {
              transform: none !important;
              box-shadow: none !important;
              width: auto !important;
              height: auto !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;
