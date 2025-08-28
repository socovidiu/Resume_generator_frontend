// services/types.ts

// Auth
export type LoginRequest = { username: string; password: string };
export type SignUpRequest = { username: string; email: string; password: string };
export type UserResponse = { id: string; username: string; email: string };
export type AuthResponse = { message: string; token?: string; user?: UserResponse };

//  (used by PUT /api/users/{id})
export type UpdateUserRequest = {
  username: string;
  email: string;
  password?: string; // omit/empty to keep password server-side
};

// localStorage "auth_session"
export type AuthSession = UserResponse;

// CVs
export type WorkExperience = {
  position: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  description: string;
};

export type Education = {
  degree: string;
  school: string;
  startDate: string;
  endDate?: string | null;
};

export type LinkType = "LinkedIn" | "GitHub" | "Website";
export type Link = { type: LinkType; url: string };

export type CVBase = {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  postcode: string;
  phone: string;
  email: string;
  photo?: string | null;
  jobTitle: string;
  summary: string;
  skills: string[];
  workExperiences: WorkExperience[];
  educations: Education[];
  links: Link[];
};

// CV Templates
/** Rendering engine; matches backend enum values. */
export type Engine = "react-schema" | "markup";

export type LayoutNode =
  | { type: "header"; fields: string[] }
  | { type: "section"; title: string; bind?: string; renderer?: "bullets" | "block" }
  | { type: "twoColumn"; left: LayoutNode[]; right: LayoutNode[] };

export interface TemplateBase {
  id: string;
  name: string;
  description: string;
  engine: Engine;
  variables: string[];
  version: string;
  tags?: string[];
  previewImageUrl?: string;
  isActive: boolean;
}


export interface ReactSchemaTemplate extends TemplateBase {
  engine: "react-schema";
  tokens: Record<string, string>;   // Tailwind classes per token key
  layout: LayoutNode[];
}

export interface MarkupTemplate extends TemplateBase {
  engine: "markup";
  markup: string;                   // HTML with {{…}}
  css?: string;
}

export type AnyTemplate = ReactSchemaTemplate | MarkupTemplate;
/** List item shape returned by GET /api/cv-templates (no engine-specific fields). */
export type TemplateListItem = Omit<TemplateBase, "variables">;
/** Full detail shape returned by GET /api/cv-templates/{id}. */
export type TemplateDetail = AnyTemplate & {
  createdAt: string; // ISO timestamps from backend
  updatedAt: string;
};

/** Filters accepted by GET /api/cv-templates. */
export interface ListFilters {
  engine?: Engine;
  activeOnly?: boolean;
  search?: string;
  tags?: string[];
}


// API responses
export type CreateCVRequest = CVBase;
export type UpdateCVRequest = CVBase;
export type CVResponse = CVBase & { id: string };

export type TemplateResponse = AnyTemplate;