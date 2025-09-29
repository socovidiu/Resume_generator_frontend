import React, { useState } from "react";
import TemplatePreview from "../components/ui-preview/TemplatePreview";

// Your sample markup (the one you posted)
const initialTemplate = `<!-- markup -->
<header>
  <h1>{{firstName}} {{lastName}}</h1>
  <p>{{email}} {{#if phone}} • {{phone}}{{/if}}</p>
</header>

{{#if summary}}
<section><h2>Summary</h2><p>{{summary}}</p></section>
{{/if}}

{{#if skills.length}}
<section><h2>Skills</h2>
  <ul>{{#each skills}}<li>{{this}}</li>{{/each}}</ul>
</section>
{{/if}}

{{#if experiences.length}}
<section><h2>Experience</h2>
  {{#each experiences}}
    <div class="job">
      <h3>{{role}} — {{company}}</h3>
      <p>{{startDate}} – {{endDate}}</p>
      <ul>{{#each bullets}}<li>{{this}}</li>{{/each}}</ul>
    </div>
  {{/each}}
</section>
{{/if}}
`;

const initialCSS = `
* { box-sizing: border-box; }
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
header { border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 16px; }
h1 { margin: 0; font-size: 28px; }
h2 { font-size: 16px; margin: 16px 0 8px; text-transform: uppercase; letter-spacing: .02em; }
.job h3 { margin: 8px 0 4px; font-weight: 600; }
.job p { margin: 0 0 4px; color: #6b7280; }
ul { margin: 0; padding-left: 18px; }
section { margin-bottom: 12px; }
`;

const initialData = {
  firstName: "Alex",
  lastName: "Popescu",
  email: "alex.popescu@example.com",
  phone: "+40 721 000 000",
  summary: "Senior Frontend Engineer with a passion for performance and DX.",
  skills: ["TypeScript", "React", "Tailwind", "Node.js"],
  experiences: [
    {
      role: "Senior Frontend Engineer",
      company: "TechCorp",
      startDate: "2022-03",
      endDate: "2025-09",
      bullets: [
        "Led migration to React 18 + Vite.",
        "Built design system components with accessibility in mind.",
      ],
    },
    {
      role: "Frontend Engineer",
      company: "DevWorks",
      startDate: "2020-01",
      endDate: "2022-02",
      bullets: [
        "Implemented SSR for SEO-critical pages.",
        "Drove Lighthouse performance from 70 → 95.",
      ],
    },
  ],
};

const TemplatePlayground: React.FC = () => {
  const [template, setTemplate] = useState(initialTemplate);
  const [css, setCss] = useState(initialCSS);
  const [json, setJson] = useState(JSON.stringify(initialData, null, 2));
  const data = (() => { try { return JSON.parse(json); } catch { return {}; } })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-6rem)]">
      {/* Editors */}
      <div className="flex flex-col gap-4 bg-amber-950 text-white p-4">
        <div>
          <div className="text-sm font-medium mb-1">Template (Handlebars)</div>
          <textarea
            className="w-full h-56 rounded border p-2 font-mono text-sm"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">CSS</div>
          <textarea
            className="w-full h-40 rounded border p-2 font-mono text-sm"
            value={css}
            onChange={(e) => setCss(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium mb-1">Data (JSON)</div>
          <textarea
            className="w-full h-full rounded border p-2 font-mono text-sm"
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded shadow text-black">
        <TemplatePreview template={template} data={data} css={css} documentTitle="My_CV" />
      </div>
    </div>
  );
};

export default TemplatePlayground;
