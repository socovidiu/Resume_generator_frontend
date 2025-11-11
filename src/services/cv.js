import api from "./http";
export async function listCVs() {
    const res = await api.get("/api/cvs");
    // Defensive: ensure array
    return Array.isArray(res.data) ? res.data : [];
}
export async function getCV(id) {
    const { data } = await api.get(`/api/cvs/${id}`);
    return data;
}
export async function createCV(payload) {
    console.log("create/update payload", payload.links);
    const { data } = await api.post("/api/cvs", payload);
    return data;
}
export async function updateCV(id, payload) {
    console.log("create/update payload", payload.links);
    const { data } = await api.put(`/api/cvs/${id}`, payload);
    return data;
}
export async function deleteCV(id) {
    await api.delete(`/api/cvs/${id}`);
}
