import React, { useMemo, useRef } from "react";
import DOMPurify from "dompurify";
import { renderTemplate } from "../../lib/templateEngine";
import { useReactToPrint } from "react-to-print";

type Props = {
  template: string;   // the Handlebars markup string
  data: any;          // your CV data object
  css?: string;       // optional CSS to style the rendered HTML
  documentTitle?: string;
};

const TemplatePreview: React.FC<Props> = ({ template, data, css = "", documentTitle = "CV" }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => {
    try {
      const rendered = renderTemplate(template, data);
      const withStyles = css?.trim() ? `<style>${css}</style>\n${rendered}` : rendered;

      return DOMPurify.sanitize(withStyles, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ["style"],        // keep <style> tags
        ADD_ATTR: ["style"],        // keep inline style if your templates need it
        FORBID_TAGS: ["script"],    // belt-and-suspenders
      });
    } catch (e: any) {
      return `<pre style="color:red">Template error: ${e?.message || e}</pre>`;
    }
  }, [template, data, css]);

    const handlePrint = useReactToPrint({
    contentRef: printRef, 
    documentTitle,
    onAfterPrint: () => alert("Print/Download completed!"),
});

  return (
    <div className="w-full h-full overflow-auto bg-gray-900 p-4">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => handlePrint()} 
          className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
        >
          Download / Print
        </button>
      </div>

      <div className="mx-auto bg-white shadow border border-gray-700"
           style={{ width: "210mm", minHeight: "297mm", padding: "16mm" }}
           ref={ printRef}
           dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default TemplatePreview;
