// cvBase.schema.ts
// Runtime validation with Zod + portable JSON Schema (Draft 2020-12)
// Mirrors your TS types for CVBase, WorkExperience, Education, Link, LinkType
import { z } from "zod";
// ---------- Common primitives ----------
const nonEmpty = z.string().trim().min(1, "Required");
const phoneRegex = /^[\d\s+\-().]{5,}$/; // simple, permissive; tune as needed
const ymdDate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use date format YYYY-MM-DD");
// ---------- Link ----------
export const LinkTypeSchema = z.enum(["LinkedIn", "GitHub", "Website"]);
export const LinkSchema = z.object({
    type: LinkTypeSchema,
    url: z.string().url(),
});
// ---------- WorkExperience ----------
export const WorkExperienceSchema = z
    .object({
    position: nonEmpty,
    company: nonEmpty,
    startDate: ymdDate,
    endDate: ymdDate.nullable().optional(),
    description: nonEmpty,
})
    .refine(({ startDate, endDate }) => !endDate || endDate >= startDate, {
    message: "endDate must be on/after startDate",
    path: ["endDate"],
});
// ---------- Education ----------
export const EducationSchema = z
    .object({
    degree: nonEmpty,
    school: nonEmpty,
    startDate: ymdDate,
    endDate: ymdDate.nullable().optional(),
})
    .refine(({ startDate, endDate }) => !endDate || endDate >= startDate, {
    message: "endDate must be on/after startDate",
    path: ["endDate"],
});
// ---------- CVBase ----------
export const CVBaseSchema = z.object({
    firstName: nonEmpty,
    lastName: nonEmpty,
    city: nonEmpty,
    country: nonEmpty,
    postcode: nonEmpty,
    phone: z.string().regex(phoneRegex, "Invalid phone number"),
    email: z.string().email(),
    photo: z.string().url().nullable().optional(),
    jobTitle: nonEmpty,
    summary: nonEmpty,
    skills: z.array(nonEmpty).default([]),
    workExperiences: z.array(WorkExperienceSchema).default([]),
    educations: z.array(EducationSchema).default([]),
    links: z.array(LinkSchema).default([]),
});
// Convenience helpers
export const validateCVBase = (value) => CVBaseSchema.safeParse(value);
export const parseCVBase = (value) => CVBaseSchema.parse(value);
// ---------- Portable JSON Schema (AJV / RJSF friendly) ----------
// Note: Cross-field date ordering (startDate <= endDate) typically requires a custom AJV keyword
// or a post-validate step. The JSON schema below encodes shapes, formats and basic patterns.
export const CVBaseJsonSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://example.com/schemas/cvbase.json",
    type: "object",
    additionalProperties: false,
    required: [
        "firstName",
        "lastName",
        "city",
        "country",
        "postcode",
        "phone",
        "email",
        "jobTitle",
        "summary",
        "skills",
        "workExperiences",
        "educations",
        "links"
    ],
    properties: {
        firstName: { type: "string", minLength: 1 },
        lastName: { type: "string", minLength: 1 },
        city: { type: "string", minLength: 1 },
        country: { type: "string", minLength: 1 },
        postcode: { type: "string", minLength: 1 },
        phone: { type: "string", pattern: "^[\\d\\s+\\-().]{5,}$" },
        email: { type: "string", format: "email" },
        photo: { type: ["string", "null"], format: "uri" },
        jobTitle: { type: "string", minLength: 1 },
        summary: { type: "string", minLength: 1 },
        skills: {
            type: "array",
            default: [],
            items: { type: "string", minLength: 1 }
        },
        workExperiences: {
            type: "array",
            default: [],
            items: {
                type: "object",
                additionalProperties: false,
                required: ["position", "company", "startDate", "description"],
                properties: {
                    position: { type: "string", minLength: 1 },
                    company: { type: "string", minLength: 1 },
                    startDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
                    endDate: { type: ["string", "null"], pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
                    description: { type: "string", minLength: 1 }
                }
            }
        },
        educations: {
            type: "array",
            default: [],
            items: {
                type: "object",
                additionalProperties: false,
                required: ["degree", "school", "startDate"],
                properties: {
                    degree: { type: "string", minLength: 1 },
                    school: { type: "string", minLength: 1 },
                    startDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
                    endDate: { type: ["string", "null"], pattern: "^\\d{4}-\\d{2}-\\d{2}$" }
                }
            }
        },
        links: {
            type: "array",
            default: [],
            items: {
                type: "object",
                additionalProperties: false,
                required: ["type", "url"],
                properties: {
                    type: { type: "string", enum: ["LinkedIn", "GitHub", "Website"] },
                    url: { type: "string", format: "uri" }
                }
            }
        }
    }
};
