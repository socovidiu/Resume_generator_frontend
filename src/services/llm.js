import api from "./http"; // your axios instance file
/** Extract keywords from a job description */
export async function extractKeywords(req) {
    const { data } = await api.post("/api/llmconnection/extract-keywords", req);
    return data;
}
/** Generate a tailored cover letter from profile + JD */
export async function generateCoverLetter(req) {
    const { data } = await api.post("/api/llmconnection/cover-letter", req);
    return data;
}
