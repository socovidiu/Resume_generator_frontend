// resumeTemplates.ts

export type ResumeTheme = {
  // existing class tokens (keep for your React-based preview)
  container: string;
  header: string;
  sectionTitle: string;
  text: string;

  // NEW: template-based rendering
  markup: string; // Handlebars markup string
  css: string;    // print-friendly CSS for the markup
};

export const resumeTemplates: Record<"classic" | "modern" | "dark", ResumeTheme> = {
  classic: {
    container: "resume-container p-6 bg-white text-black border border-gray-300",
    header: "text-center border-b-2 border-black pb-2",
    sectionTitle: "text-lg font-semibold border-b pb-1 mt-4",
    text: "text-sm",

    // ---- Handlebars template (classic) ----
    markup: `
<header class="hdr">
  <div class="id">
    {{#if photo}}<img class="avatar" src="{{photo}}" alt="{{firstName}} {{lastName}} photo"/>{{/if}}
    <div>
      <h1 class="name">{{firstName}} {{lastName}}</h1>
      {{#if jobTitle}}<p class="role">{{jobTitle}}</p>{{/if}}
    </div>
  </div>
  <div class="contact">
    {{#if city}}{{city}}, {{/if}}{{#if country}}{{country}}{{/if}}
    {{#if postcode}} • {{postcode}}{{/if}}
    {{#if phone}} • {{phone}}{{/if}}
    {{#if email}} • {{email}}{{/if}}
  </div>
</header>

{{#if summary}}
<section>
  <h2>Summary</h2>
  <p>{{summary}}</p>
</section>
{{/if}}

{{#if skills.length}}
<section>
  <h2>Skills</h2>
  <ul class="bullets">
    {{#each skills}}<li>{{this}}</li>{{/each}}
  </ul>
</section>
{{/if}}

{{#if workExperiences.length}}
<section>
  <h2>Work Experience</h2>
  {{#each workExperiences}}
    <div class="item">
      <div class="row">
        <h3 class="item-title">{{position}} — {{company}}</h3>
        <span class="dates">{{startDate}} – {{#if endDate}}{{endDate}}{{else}}Present{{/if}}</span>
      </div>
      {{#if description}}
        <ul class="bullets">
          {{#each (splitLines description)}}
            <li>{{this}}</li>
          {{/each}}
        </ul>
      {{/if}}
    </div>
  {{/each}}
</section>
{{/if}}

{{#if educations.length}}
<section>
  <h2>Education</h2>
  {{#each educations}}
    <div class="item">
      <div class="row">
        <h3 class="item-title">{{degree}}</h3>
        <span class="dates">{{startDate}} – {{#if endDate}}{{endDate}}{{else}}Present{{/if}}</span>
      </div>
      <div class="muted">{{school}}</div>
    </div>
  {{/each}}
</section>
{{/if}}

{{#if links.length}}
<section>
  <h2>Links</h2>
  <ul class="links">
    {{#each links}}
      <li><span class="label">{{type}}:</span> <a href="{{url}}" target="_blank" rel="noopener noreferrer">{{url}}</a></li>
    {{/each}}
  </ul>
</section>
{{/if}}
`,

    // ---- CSS (classic) ----
    css: `
* { box-sizing: border-box; }
:root { --accent: ${"#111827"}; --muted: #6b7280; }
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
.resume { width: 210mm; min-height: 297mm; padding: 16mm; background: #fff; color: #111; }
.hdr { border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 14px; display: flex; justify-content: space-between; gap: 12px; }
.id { display: flex; align-items: center; gap: 12px; }
.avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd; }
.name { margin: 0; font-size: 24px; letter-spacing: .2px; }
.role { margin: 2px 0 0; color: var(--muted); }
.contact { text-align: right; color: var(--muted); font-size: 12px; }
section { margin-top: 14px; }
h2 { font-size: 14px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: .04em; color: var(--accent); border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
.item { margin: 8px 0 10px; }
.row { display: flex; justify-content: space-between; gap: 8px; align-items: baseline; }
.item-title { margin: 0; font-size: 13px; font-weight: 600; }
.dates { font-size: 12px; color: var(--muted); white-space: nowrap; }
.muted { color: var(--muted); font-size: 12px; }
.bullets { margin: 6px 0 0; padding-left: 18px; }
.links { margin: 0; padding-left: 18px; }
a { text-decoration: underline; color: inherit; }
@page { size: A4; margin: 0; }
@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`
  },

  modern: {
    container: "resume-container p-6 bg-gray-100 text-gray-800 shadow-lg rounded-lg",
    header: "text-center border-b-2 border-blue-500 pb-2",
    sectionTitle: "text-lg font-semibold text-blue-600 border-b pb-1 mt-4",
    text: "text-sm text-gray-700",

    markup: `
<header class="hdr">
  <div class="left">
    <h1 class="name">{{firstName}} {{lastName}}</h1>
    {{#if jobTitle}}<p class="role">{{jobTitle}}</p>{{/if}}
  </div>
  <div class="right">
    {{#if email}}<span>{{email}}</span>{{/if}}
    {{#if phone}}<span> • {{phone}}</span>{{/if}}
    {{#if city}}<span> • {{city}}, {{country}}</span>{{/if}}
  </div>
</header>

{{#if summary}}
<section>
  <h2>Profile</h2>
  <p>{{summary}}</p>
</section>
{{/if}}

{{#if skills.length}}
<section>
  <h2>Skills</h2>
  <div class="chips">
    {{#each skills}}<span class="chip">{{this}}</span>{{/each}}
  </div>
</section>
{{/if}}

{{#if workExperiences.length}}
<section>
  <h2>Experience</h2>
  {{#each workExperiences}}
    <article class="card">
      <div class="top">
        <div>
          <h3>{{position}}</h3>
          <div class="muted">{{company}}</div>
        </div>
        <div class="dates">{{startDate}} – {{#if endDate}}{{endDate}}{{else}}Present{{/if}}</div>
      </div>
      {{#if description}}
        <ul class="bullets">
          {{#each (splitLines description)}}<li>{{this}}</li>{{/each}}
        </ul>
      {{/if}}
    </article>
  {{/each}}
</section>
{{/if}}

{{#if educations.length}}
<section>
  <h2>Education</h2>
  {{#each educations}}
    <article class="edu">
      <div class="left"><strong>{{degree}}</strong><div class="muted">{{school}}</div></div>
      <div class="dates">{{startDate}} – {{#if endDate}}{{endDate}}{{else}}Present{{/if}}</div>
    </article>
  {{/each}}
</section>
{{/if}}
`,
    css: `
:root { --bg: #f3f4f6; --fg: #111827; --muted: #6b7280; --accent: ${"#3b82f6"}; }
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
.resume { width: 210mm; min-height: 297mm; padding: 16mm; background: var(--bg); color: var(--fg); }
.hdr { display:flex; justify-content:space-between; align-items:baseline; border-bottom: 2px solid var(--accent); padding-bottom: 8px; margin-bottom: 14px; }
.name { margin:0; font-size: 26px; letter-spacing:.2px; }
.role { margin: 2px 0 0; color: var(--muted); }
.right { color: var(--muted); font-size: 12px; }
section { margin-top: 14px; }
h2 { font-size: 14px; margin: 0 0 8px; color: var(--accent); text-transform: uppercase; letter-spacing: .05em; }
.card { background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; margin:8px 0; }
.top { display:flex; justify-content:space-between; gap:8px; align-items:baseline; }
.bullets { margin:6px 0 0; padding-left: 18px; }
.muted { color: var(--muted); font-size: 12px; }
.chips { display:flex; flex-wrap:wrap; gap:6px; }
.chip { background:#fff; border:1px solid #e5e7eb; padding:4px 8px; border-radius:999px; font-size:12px; }
.edu { display:flex; justify-content:space-between; gap:8px; padding:6px 0; border-bottom:1px dashed #e5e7eb; }
.dates { font-size: 12px; color: var(--muted); white-space: nowrap; }
@page { size: A4; margin: 0; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`
  },

  dark: {
    container: "resume-container p-6 bg-gray-900 text-white border border-gray-700",
    header: "text-center border-b-2 border-gray-400 pb-2",
    sectionTitle: "text-lg font-semibold text-gray-300 border-b pb-1 mt-4",
    text: "text-sm text-gray-200",

    markup: `
<header class="hdr">
  <div class="id">
    <h1 class="name">{{firstName}} {{lastName}}</h1>
    {{#if jobTitle}}<div class="muted">{{jobTitle}}</div>{{/if}}
  </div>
  <div class="contact">
    {{#if email}}{{email}}{{/if}}
    {{#if phone}} • {{phone}}{{/if}}
    {{#if city}} • {{city}}, {{country}}{{/if}}
  </div>
</header>

{{#if summary}}
<section>
  <h2>Summary</h2>
  <p>{{summary}}</p>
</section>
{{/if}}

{{#if skills.length}}
<section>
  <h2>Skills</h2>
  <ul class="bullets">
    {{#each skills}}<li>{{this}}</li>{{/each}}
  </ul>
</section>
{{/if}}

{{#if workExperiences.length}}
<section>
  <h2>Experience</h2>
  {{#each workExperiences}}
    <div class="item">
      <div class="row">
        <h3>{{position}} — {{company}}</h3>
        <span class="dates">{{startDate}} – {{#if endDate}}{{endDate}}{{else}}Present{{/if}}</span>
      </div>
      {{#if description}}
        <ul class="bullets">
          {{#each (splitLines description)}}<li>{{this}}</li>{{/each}}
        </ul>
      {{/if}}
    </div>
  {{/each}}
</section>
{{/if}}

{{#if educations.length}}
<section>
  <h2>Education</h2>
  {{#each educations}}
    <div class="item">
      <div class="row">
        <h3>{{degree}}</h3>
        <span class="dates">{{startDate}} – {{#if endDate}}{{endDate}}{{else}}Present{{/if}}</span>
      </div>
      <div class="muted">{{school}}</div>
    </div>
  {{/each}}
</section>
{{/if}}
`,
    css: `
:root { --bg: #0b1020; --card: #121933; --fg: #e5e7eb; --muted: #a1a1aa; --accent: #60a5fa; }
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: var(--bg); color: var(--fg); }
.resume { width: 210mm; min-height: 297mm; padding: 16mm; background: #0f172a; color: var(--fg); }
.hdr { display:flex; justify-content:space-between; align-items:baseline; border-bottom: 2px solid var(--accent); padding-bottom: 8px; margin-bottom: 14px; }
.name { margin:0; font-size: 26px; letter-spacing:.2px; }
.contact { color: var(--muted); font-size: 12px; }
section { margin-top: 14px; }
h2 { font-size: 14px; margin: 0 0 8px; color: var(--accent); text-transform: uppercase; letter-spacing: .05em; }
.item { background: var(--card); border: 1px solid rgba(255,255,255,.08); border-radius: 8px; padding: 10px 12px; margin: 8px 0; }
.row { display:flex; justify-content:space-between; gap:8px; align-items:baseline; }
.dates { font-size: 12px; color: var(--muted); white-space: nowrap; }
.muted { color: var(--muted); }
.bullets { margin:6px 0 0; padding-left: 18px; }
@page { size: A4; margin: 0; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`
  }
};

// OPTIONAL: register this once in your template engine setup
// to support (splitLines description) used above.
// Example Handlebars helper:
// Handlebars.registerHelper("splitLines", (text: string) =>
//   (text || "").split("\\n").map(s => s.trim()).filter(Boolean)
// );
