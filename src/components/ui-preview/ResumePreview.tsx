import React, { useMemo, useRef, useState } from "react";
import type { CVData } from "../../types/CVtype";
import PreviewUtils, { PaperSize } from "./PreviewUtils";
import { ReactSchemaView } from "../template-engine/reactSchema";
import { cvLayoutPro, tokens } from "../template-engine/cvLayoutPro";
import IframePagedPreview, { IframePagedPreviewHandle } from "./IframePagedPreview";

const ResumePreview: React.FC<{ resumeData: CVData; template?: string }> = ({ resumeData }) => {
  const data = useMemo(() => ({ ...resumeData, tokens }), [resumeData]);
  const [size, setSize] = useState<PaperSize>("A4");
  const [zoom, setZoom] = useState<number>(100);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const iframeRef = useRef<IframePagedPreviewHandle>(null);

  return (
    <div className="relative h-full grid grid-rows-[auto,1fr] gap-2 min-h-0">
      <PreviewUtils
        size={size}
        zoom={zoom}
        onSizeChange={setSize}
        onZoomChange={setZoom}
        onDownload={() => iframeRef.current?.print()}
        dense={true}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <IframePagedPreview
        ref={iframeRef}
        size={size}
        zoom={zoom}
        onPageCount={setTotalPages}
        onCurrentPage={setCurrentPage}
      >
        <ReactSchemaView schema={cvLayoutPro} data={data} />
      </IframePagedPreview>
    </div>
  );
};

export default ResumePreview;
