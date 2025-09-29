// cvLayout.ts
// Reusable, token-driven layout built for your existing ReactSchema engine
// Works with: ReactSchemaView from ./reactSchema and CVBase data

// ---------------- Tokens ----------------
export type Tokens = {
  page: string;
  h1: string;
  h2: string;
  smallMuted: string;
  sectionTitle: string;
  body: string;
  chip: string;
  avatar: string;
  divider: string;
  gapSection: number;
  gapItem: number;
};

export const tokens: Tokens = {
  page: "max-w-3xl mx-auto p-8 bg-white text-gray-900",
  h1: "text-3xl font-bold tracking-tight",
  h2: "text-xl font-semibold tracking-tight",
  smallMuted: "text-sm text-gray-500",
  sectionTitle: "uppercase text-xs tracking-wider text-gray-500",
  body: "text-sm leading-6",
  chip: "inline-flex items-center rounded-full px-3 py-1 text-xs border",
  avatar: "w-24 h-24 rounded-full object-cover",
  divider: "my-4",
  gapSection: 16,
  gapItem: 8,
};

// ---------------- Helpers ----------------
// Tiny helpers that return nodes of your ReactSchema tree

const SectionTitle = (title: string) => ({
  type: "text",
  props: { className: "{{tokens.sectionTitle}}", children: title },
});

const Card = (children: any) => ({
  type: "stack",
  props: { className: "rounded-2xl border p-4 shadow-sm", gap: { bind: "tokens.gapItem", default: 8 } },
  children,
});

const Divider = () => ({ type: "divider", props: { className: "{{tokens.divider}}" } });

// ---------------- Sections ----------------

export const HeaderSection = () => ({
  type: "row",
  props: { className: "items-center justify-between", gap: 16 },
  children: [
    {
      type: "stack",
      props: { className: "grow" },
      children: [
        { type: "heading", props: { level: 1, className: "{{tokens.h1}}", children: "{{firstName}} {{lastName}}" } },
        { type: "text", props: { className: "{{tokens.smallMuted}}", children: "{{jobTitle}}" } },
        { type: "text", props: { className: "{{tokens.smallMuted}}", children: "{{city}}, {{country}} • {{postcode}}" } },
        { type: "text", props: { className: "{{tokens.smallMuted}}", children: "{{phone}} • {{email}}" } },
      ],
    },
    {
      type: "box",
      children: [
        {
          type: "image",
          props: { src: { bind: "photo", default: "" }, className: "{{tokens.avatar}}", alt: "Profile Photo" },
        },
      ],
    },
  ],
});

export const SummarySection = () => ({
  type: "stack",
  children: [SectionTitle("Summary"), { type: "text", props: { className: "{{tokens.body}}", children: "{{summary}}" } }],
});

export const SkillsSection = () => ({
  type: "stack",
  children: [
    SectionTitle("Skills"),
    {
      type: "row",
      props: { className: "flex-wrap", gap: 8 },
      repeat: "skills",
      children: [{ type: "text", props: { className: "{{tokens.chip}}", children: "{{.}}" } }],
    },
  ],
});

export const WorkExperienceSection = () => ({
  type: "stack",
  children: [
    SectionTitle("Work Experience"),
    {
      type: "stack",
      repeat: "workExperiences",
      children: [
        Card([
          {
            type: "row",
            props: { className: "justify-between items-baseline" },
            children: [
              { type: "text", props: { className: "{{tokens.h2}}", children: "{{position}}" } },
              { type: "text", props: { className: "{{tokens.smallMuted}}", children: "{{startDate}} — {{endDate}}" } },
            ],
          },
          { type: "text", props: { className: "font-medium", children: "{{company}}" } },
          { type: "text", props: { className: "{{tokens.body}} whitespace-pre-wrap", children: "{{description}}" } },
        ]),
      ],
    },
  ],
});

export const EducationSection = () => ({
  type: "stack",
  children: [
    SectionTitle("Education"),
    {
      type: "stack",
      repeat: "educations",
      children: [
        Card([
          {
            type: "row",
            props: { className: "justify-between items-baseline" },
            children: [
              { type: "text", props: { className: "{{tokens.h2}}", children: "{{degree}}" } },
              { type: "text", props: { className: "{{tokens.smallMuted}}", children: "{{startDate}} — {{endDate}}" } },
            ],
          },
          { type: "text", props: { className: "font-medium", children: "{{school}}" } },
        ]),
      ],
    },
  ],
});

export const LinksSection = () => ({
  type: "stack",
  children: [
    SectionTitle("Links"),
    {
      type: "row",
      props: { className: "flex-wrap", gap: 12 },
      repeat: "links",
      children: [
        {
          type: "text",
          props: {
            as: "a",
            href: { bind: "url" },
            className: "underline break-all",
            target: "_blank",
            rel: "noreferrer",
            children: "{{type}}",
          },
        },
      ],
    },
  ],
});

// ---------------- Root layout ----------------
export const cvLayout = {
  root: {
    type: "stack",
    props: { className: "{{tokens.page}}", gap: { bind: "tokens.gapSection", default: 16 } },
    children: [
      HeaderSection(),
      Divider(),
      SummarySection(),
      SkillsSection(),
      WorkExperienceSection(),
      EducationSection(),
      LinksSection(),
    ],
  },
} as const;

