// services/user.ts
import api from "./http";
function getError(err) {
    if (err && typeof err === "object") {
        const obj = err;
        const response = obj["response"];
        const data = response?.["data"];
        const message = (typeof data === "object" && data && "message" in data
            ? data["message"]
            : typeof data === "string"
                ? data
                : undefined) ??
            (typeof obj["message"] === "string" ? obj["message"] : undefined);
        return new Error(typeof message === "string" ? message : "Request failed");
    }
    return new Error("Request failed");
}
export async function getUser(id) {
    try {
        const { data } = await api.get(`/api/users/${id}`);
        return data;
    }
    catch (err) {
        throw getError(err);
    }
}
export async function updateUser(id, payload) {
    try {
        const { data } = await api.put(`/api/users/${id}`, payload);
        return data;
    }
    catch (err) {
        throw getError(err);
    }
}
export async function deleteUser(id) {
    try {
        await api.delete(`/api/users/${id}`);
    }
    catch (err) {
        throw getError(err);
    }
}
