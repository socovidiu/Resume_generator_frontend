

export const tokens = {
  // Palette: Indigo/Violet accents, Slate neutrals
  page: "paper",

  // Header: gradient bar, light-on-dark text
  header: "bg-gradient-to-r from-indigo-600 to-violet-600 p-8 flex items-center justify-between",
  h1: "text-4xl font-bold text-white tracking-tight",
  h2: "text-lg font-semibold text-slate-900",

  // Section titles (light surface) + on-dark variant (sidebar)
  sectionTitle: "uppercase text-xs tracking-widest text-slate-500 mb-2",
  sectionTitleOnDark: "uppercase text-xs tracking-widest text-slate-200 mb-2",

  // Body text (light surface)
  body: "text-sm text-slate-700 leading-relaxed",

  // Links (light surface) + on-dark variant (sidebar)
  link: "text-indigo-600 underline",
  linkOnDark: "text-indigo-500 underline",

  // Skill chip (used in dark sidebar — keeps good contrast)
  chipContainer: "flex flex-wrap gap-1 items-start",
  chip:
    "inline-flex self-start items-center whitespace-nowrap rounded-full px-3 py-1 text-xs " +
    "bg-indigo-100 text-indigo-800 border border-indigo-200",

  // Avatar
  avatar: "w-32 h-32 rounded-full object-cover border-4 border-white shadow-md",

  // Dividers for light & dark surfaces
  divider: "my-4 border-slate-200",
  dividerOnDark: "my-4 border-slate-600/50",

  // Columns
  sidebar: "paper-col paper-col-left paper-scroll bg-stone-800 text-stone-100 rounded-lg",
  main: "paper-col paper-col-right paper-scroll",

  // Accents
  accentBorder: "border-l-4 border-indigo-500",

  // Pagination helpers
  atomic: "page-avoid",          // keep a single card together
  sectionBlock: "page-avoid",    // keep a whole section header + first item together

  gapSection: 24,
  gapItem: 8,
};

// Header
const HeaderSection = () => ({
  type: "box",
  props: { className: "{{tokens.header}} {{tokens.atomic}}" }, // keep header together
  children: [
    {
      type: "stack",
      props: { className: "grow" },
      children: [
        {
          type: "heading",
          props: {
            level: 1,
            className: "{{tokens.h1}}",
            children: "{{firstName}} {{lastName}}",
          },
        },
        { type: "text", props: { className: "text-indigo-100 text-base font-medium", children: "{{jobTitle}}" } },
        { type: "text", props: { className: "text-sm text-indigo-50/90", children: "{{email}} • {{phone}}" } },
        { type: "text", props: { className: "text-sm text-indigo-50/90", children: "{{city}}, {{country}}" } },
      ],
    },
    { type: "image", props: { src: { bind: "photo" }, className: "{{tokens.avatar}}" } },
  ],
});

// Sidebar
const Sidebar = () => ({
  type: "stack",
  props: { className: "{{tokens.sidebar}}", gap: 16 },
  children: [
    {
      type: "stack",
      props: { className: "{{tokens.atomic}}" }, // keep the Skills block together
      children: [
        { type: "text", props: { className: "{{tokens.sectionTitleOnDark}}", children: "Skills" } },
        {
          type: "stack",
          props: { className: "{{tokens.chipContainer}}" },
          repeat: "skills",
          children: [{ type: "text", props: { className: tokens.chip, children: "{{.}}" } }],
        },
      ],
    },
    { type: "divider", props: { className: "{{tokens.dividerOnDark}}" } },
    {
      type: "stack",
      props: { className: "{{tokens.atomic}}" }, // keep the Links block together
      children: [
        { type: "text", props: { className: "{{tokens.sectionTitleOnDark}}", children: "Links" } },
        {
          type: "stack",
          repeat: "links",
          children: [
            {
              type: "text",
              props: {
                as: "a",
                href: { bind: "url" },
                className: "{{tokens.linkOnDark}} text-sm break-all",
                children: "{{type}}",
              },
            },
          ],
        },
      ],
    },
  ],
});

// Main content
// Main content
const MainContent = () => ({
  type: "stack",
  props: { className: "{{tokens.main}}", gap: 24 },
  children: [
    // ABOUT ME (allowed to break)
    {
      type: "stack",
      children: [
        { type: "text", props: { className: "{{tokens.sectionTitle}}", children: "About Me" } },
        { type: "text", props: { className: "{{tokens.body}}", children: "{{summary}}" } },
      ],
    },

    { type: "divider", props: { className: "{{tokens.divider}}" } },

    // EXPERIENCE (whole section kept together enough to avoid orphan header)
    {
      type: "stack",
      props: { className: "{{tokens.sectionBlock}}", gap: 12 }, // <-- new
      children: [
        { type: "text", props: { className: "{{tokens.sectionTitle}}", children: "Experience" } },
        {
          type: "stack",
          repeat: "workExperiences",
          children: [
            {
              type: "stack",
              props: { className: "{{tokens.accentBorder}} pl-4 {{tokens.atomic}}" }, // item stays intact
              children: [
                { type: "text", props: { className: "{{tokens.h2}}", children: "{{position}}" } },
                { type: "text", props: { className: "font-medium text-slate-800", children: "{{company}}" } },
                { type: "text", props: { className: "text-xs text-slate-500", children: "{{startDate}} — {{endDate}}" } },
                { type: "text", props: { className: "{{tokens.body}} mt-2 whitespace-pre-wrap", children: "{{description}}" } },
              ],
            },
          ],
        },
      ],
    },

    { type: "divider", props: { className: "{{tokens.divider}}" } },

    // EDUCATION (same treatment as Experience)
    {
      type: "stack",
      props: { className: "{{tokens.sectionBlock}}", gap: 12 }, // <-- new
      children: [
        { type: "text", props: { className: "{{tokens.sectionTitle}}", children: "Education" } },
        {
          type: "stack",
          repeat: "educations",
          children: [
            {
              type: "stack",
              props: { className: "{{tokens.atomic}}" }, // item stays intact
              children: [
                { type: "text", props: { className: "{{tokens.h2}}", children: "{{degree}}" } },
                { type: "text", props: { className: "font-medium text-slate-800", children: "{{school}}" } },
                { type: "text", props: { className: "text-xs text-slate-500", children: "{{startDate}} — {{endDate}}" } },
              ],
            },
          ],
        },
      ],
    },
  ],
});

// Root layout (A4 + two columns with gutter)
export const cvLayoutPro = {
  root: {
    type: "stack",
    props: { className: "{{tokens.page}}" },
    children: [
      HeaderSection(),
      { type: "divider", props: { className: "{{tokens.divider}}" } },
      {
        type: "box",
        props: { className: "paper-grid" }, // fixed-height row with gap
        children: [Sidebar(), MainContent()],
      },
    ],
  },
};
