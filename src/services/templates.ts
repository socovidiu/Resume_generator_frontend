// services/templates.ts
import api from "./http";
import type {
  Engine,
  TemplateListItem,
  TemplateDetail,
  ListFilters,
} from "./types";

/** Create payload: union by engine to enforce required fields per branch. */
export type CreateTemplatePayload =
  | {
      name: string;
      description: string;
      engine: "markup";
      markup: string;   // required
      css?: string;
      version?: string;
      variables?: string[];
      tags?: string[];
      previewImageUrl?: string;
      isActive?: boolean;
    }
  | {
      name: string;
      description: string;
      engine: "react-schema";
      layout: unknown[];                    // required
      tokens?: Record<string, string>;
      version?: string;
      variables?: string[];
      tags?: string[];
      previewImageUrl?: string;
      isActive?: boolean;
    };

/** Update payload: all optional fields. */
export type UpdateTemplatePayload = Partial<{
  name: string;
  description: string;
  engine: Engine;
  // Markup fields
  markup: string;
  css: string;
  // React-schema fields
  tokens: Record<string, string>;
  layout: unknown[];
  // Shared
  version: string;
  variables: string[];
  tags: string[];
  previewImageUrl: string;
  isActive: boolean;
}>;
/**
 * List templates with optional filters.
 * GET /api/cv-templates
 */
export async function fetchTemplates(filters?: ListFilters): Promise<TemplateListItem[]> {
  const response = await api.get<TemplateListItem[]>("/api/cv-templates", {
    params: filters,
    // If your backend expects repeated ?tags=tag1&tags=tag2, ensure your axios
    // instance has a paramsSerializer that does that; otherwise it may send tags[]=.
  });
  return response.data;
}

/**
 * Get one template by id (full definition).
 * GET /api/cv-templates/{id}
 */
export async function fetchTemplateById(id: string): Promise<TemplateDetail> {
  const response = await api.get<TemplateDetail>(`/api/cv-templates/${id}`);
  return response.data;
}

/**
 * Create a new template (Admin only).
 * POST /api/cv-templates
 *
 * Returns 201 + TemplateDetail
 */
export async function createTemplate(payload: CreateTemplatePayload): Promise<TemplateDetail> {
  const response = await api.post<TemplateDetail>("/api/cv-templates", payload);
  return response.data;
}

/**
 * Update an existing template (Admin only).
 * PUT /api/cv-templates/{id}
 *
 * Returns 204 No Content
 */
export async function updateTemplate(id: string, payload: UpdateTemplatePayload): Promise<void> {
  await api.put<void>(`/api/cv-templates/${id}`, payload);
}

/**
 * Delete a template (Admin only).
 * DELETE /api/cv-templates/{id}
 *
 * Returns 204 No Content
 * Prefer toggling isActive unless hard delete is required.
 */
export async function deleteTemplate(id: string): Promise<void> {
  await api.delete<void>(`/api/cv-templates/${id}`);
}
