export const tokens = {
    page: "paper",
    divider: "paper-divider",
    main: "paper-col paper-col-right",
    sidebar: "paper-col paper-col-left bg-stone-400 rounded-lg", // bg on the grid item wrapper
    sectionTitle: "section-title",
    h1: "h1",
    h2: "h2",
    body: "body",
    small: "small",
    // repeated items / timeline
    accentBorder: "item-block",
    atomic: "atomic",
    // Header: gradient bar, light-on-dark text
    header: "header",
    link: "text-sm text-stone-500 underline",
    // Skills
    chipContainer: "chips",
    chip: "inline-flex self-start items-center whitespace-nowrap rounded-full px-3 py-1 text-sm " +
        "bg-stone-100 text-amber-800 border border-indigo-200",
    // Avatar
    avatar: "w-32 h-32 rounded-full object-cover border-4 border-white shadow-md",
    sectiondivider: "my-4 border-slate-300",
    sectionBlock: "page-avoid", // keep section header with its first item if possible
    // Education
    eduBlock: "edu-block",
    eduGap: "edu-gap",
    eduMeta: "edu-meta",
    eduBadge: "edu-badge",
    mutedDivider: "muted-divider",
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
                {
                    type: "text",
                    props: { className: "{{tokens.h2}}", children: "{{jobTitle}}" },
                },
                {
                    type: "text",
                    props: {
                        className: "{{tokens.small}}",
                        children: "{{email}} • {{phone}}",
                    },
                },
                {
                    type: "text",
                    props: {
                        className: "{{tokens.small}}",
                        children: "{{city}}, {{country}}",
                    },
                },
            ],
        },
        {
            type: "image",
            props: { src: { bind: "photo" }, className: "{{tokens.avatar}}" },
        },
    ],
});
// Sidebar (skills + links)
const Sidebar = () => ({
    type: "stack",
    props: { className: "{{tokens.sidebar}}", gap: 16 },
    children: [
        {
            type: "stack",
            props: { className: "{{tokens.atomic}}" },
            children: [
                {
                    type: "text",
                    props: { className: "{{tokens.sectionTitle}}", children: "Skills" },
                },
                {
                    type: "row",
                    props: { className: "{{tokens.chipContainer}}", gap: 8 },
                    repeat: "skills",
                    children: [
                        {
                            type: "text",
                            props: {
                                as: "span",
                                className: "{{tokens.chip}}",
                                children: "{{.}}",
                            },
                        },
                    ],
                },
            ],
        },
        { type: "divider", props: { className: "{{tokens.divider}}" } },
        {
            type: "stack",
            props: { className: "{{tokens.atomic}}" },
            children: [
                {
                    type: "text",
                    props: { className: "{{tokens.sectionTitle}}", children: "Links" },
                },
                {
                    type: "stack",
                    repeat: "links",
                    children: [
                        {
                            type: "text",
                            props: {
                                as: "a",
                                href: { bind: "url" },
                                className: "{{tokens.link}} text-sm break-all",
                                children: "{{type}}",
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
// Experience section (detailed timeline)
const ExperienceEntry = () => ({
    type: "pageblock",
    props: { className: "{{tokens.sectionBlock}}", gap: 8 },
    children: [
        {
            type: "text",
            props: { className: "{{tokens.sectionTitle}}", children: "Experience" },
        },
        {
            type: "stack",
            props: { className: "item-gap" },
            repeat: "workExperiences",
            children: [
                {
                    type: "stack",
                    props: { className: "{{tokens.accentBorder}} {{tokens.atomic}}" },
                    children: [
                        {
                            type: "text",
                            props: { className: "{{tokens.h2}}", children: "{{position}}" },
                        },
                        {
                            type: "text",
                            props: {
                                className: "font-medium text-slate-800",
                                children: "{{company}}",
                            },
                        },
                        {
                            type: "text",
                            props: {
                                className: "text-xs text-slate-500",
                                children: "{{startDate}} — {{endDate}}",
                            },
                        },
                        {
                            type: "text",
                            props: {
                                className: "{{tokens.body}} mt-2 whitespace-pre-wrap",
                                children: "{{description}}",
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
// Education section (lighter timeline)
const EducationEntry = () => ({
    type: "pageblock",
    props: { className: "{{tokens.sectionBlock}}", gap: 12 },
    children: [
        {
            type: "text",
            props: { className: "{{tokens.sectionTitle}}", children: "Education" },
        },
        {
            type: "stack",
            props: { className: "edu-grid" },
            repeat: "educations",
            children: [
                {
                    type: "stack",
                    props: { className: "{{tokens.eduBlock}} {{tokens.atomic}}" },
                    children: [
                        {
                            type: "text",
                            props: { className: "{{tokens.h2}}", children: "{{degree}}" },
                        },
                        {
                            type: "text",
                            props: {
                                className: "font-medium text-slate-800",
                                children: "{{school}}",
                            },
                        },
                        {
                            type: "text",
                            props: {
                                className: "{{tokens.eduMeta}}",
                                children: "{{startDate}} — {{endDate}}{{city ? ' • ' + city : ''}}",
                            },
                        },
                        {
                            type: "row",
                            props: { gap: 8 },
                            children: [
                                {
                                    type: "text",
                                    props: {
                                        as: "span",
                                        className: "{{tokens.eduBadge}}",
                                        children: "{{gpa ? 'GPA ' + gpa : ''}}",
                                    },
                                },
                                {
                                    type: "text",
                                    props: {
                                        as: "span",
                                        className: "{{tokens.eduBadge}}",
                                        children: "{{honors}}",
                                    },
                                },
                            ],
                        },
                        {
                            type: "row",
                            props: { gap: 6 },
                            repeat: "coursework",
                            children: [
                                {
                                    type: "text",
                                    props: {
                                        as: "span",
                                        className: "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] bg-stone-100 text-slate-700 border border-stone-200",
                                        children: "{{.}}",
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        { type: "divider", props: { className: "{{tokens.mutedDivider}}" } },
    ],
});
// Main content (about + experience + education)
const MainContent = () => ({
    type: "stack",
    props: { className: "{{tokens.main}}", gap: 24 },
    children: [
        // About
        {
            type: "stack",
            children: [
                {
                    type: "text",
                    props: { className: "{{tokens.sectionTitle}}", children: "About Me" },
                },
                {
                    type: "text",
                    props: { className: "{{tokens.body}}", children: "{{summary}}" },
                },
            ],
        },
        { type: "divider", props: { className: "{{tokens.divider}}" } },
        // Experience
        ExperienceEntry(),
        { type: "divider", props: { className: "{{tokens.divider}}" } },
        // Education
        EducationEntry(),
    ],
});
// Root (A4 + two columns with grid)
export const cvLayoutPro = {
    root: {
        type: "stack",
        props: { className: "{{tokens.page}}" },
        children: [
            {
                type: "pageblock",
                children: [
                    {
                        type: "box",
                        props: { className: "paper-layout", noPageBlock: true },
                        children: [
                            // 1) Header
                            {
                                type: "box",
                                props: { style: { gridArea: "header" }, noPageBlock: true },
                                children: [
                                    HeaderSection(),
                                    {
                                        type: "divider",
                                        props: { className: "{{tokens.divider}}" },
                                    },
                                ],
                            },
                            // 2) Main
                            {
                                type: "box",
                                props: {
                                    className: "paper-col paper-col-right {{tokens.main}}",
                                    style: { gridArea: "main" },
                                    noPageBlock: true,
                                },
                                children: [MainContent()],
                            },
                            // 3) Sidebar
                            {
                                type: "box",
                                props: {
                                    className: "paper-col paper-col-left {{tokens.sidebar}}",
                                    style: { gridArea: "sidebar" },
                                    noPageBlock: true,
                                },
                                children: [Sidebar()],
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
