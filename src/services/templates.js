// services/templates.ts
import api from "./http";
/**
 * List templates with optional filters.
 * GET /api/cv-templates
 */
export async function fetchTemplates(filters) {
    const response = await api.get("/api/cv-templates", {
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
export async function fetchTemplateById(id) {
    const response = await api.get(`/api/cv-templates/${id}`);
    return response.data;
}
/**
 * Create a new template (Admin only).
 * POST /api/cv-templates
 *
 * Returns 201 + TemplateDetail
 */
export async function createTemplate(payload) {
    const response = await api.post("/api/cv-templates", payload);
    return response.data;
}
/**
 * Update an existing template (Admin only).
 * PUT /api/cv-templates/{id}
 *
 * Returns 204 No Content
 */
export async function updateTemplate(id, payload) {
    await api.put(`/api/cv-templates/${id}`, payload);
}
/**
 * Delete a template (Admin only).
 * DELETE /api/cv-templates/{id}
 *
 * Returns 204 No Content
 * Prefer toggling isActive unless hard delete is required.
 */
export async function deleteTemplate(id) {
    await api.delete(`/api/cv-templates/${id}`);
}
