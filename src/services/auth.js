// auth.ts
import api from "./http";
function setAuthToken(token) {
    if (token) {
        localStorage.setItem("auth_token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else {
        localStorage.removeItem("auth_token");
        delete api.defaults.headers.common["Authorization"];
    }
}
function setAuthSession(user) {
    if (user)
        localStorage.setItem("auth_session", JSON.stringify(user));
    else
        localStorage.removeItem("auth_session");
}
// Restore header + (optional) you can read user for your UI/store on app init
(() => {
    const existing = localStorage.getItem("auth_token");
    if (existing) {
        api.defaults.headers.common["Authorization"] = `Bearer ${existing}`;
    }
})();
export async function signup(payload) {
    const url = "/api/users";
    const res = await api.post(url, payload);
    if (res.data?.token)
        setAuthToken(res.data.token);
    if (res.data?.user)
        setAuthSession(res.data.user);
    return res.data;
}
export async function login(payload) {
    const url = "/api/sessions";
    const res = await api.post(url, payload);
    if (res.data?.token)
        setAuthToken(res.data.token);
    if (res.data?.user)
        setAuthSession(res.data.user);
    return res.data;
}
export function logout() {
    setAuthToken(null);
    setAuthSession(null);
}
