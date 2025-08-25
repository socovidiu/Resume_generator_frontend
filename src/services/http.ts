import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "" ,
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("[http] 401 received. Keeping session; let UI decide.");
      if (isExpired(localStorage.getItem("auth_token"))) {
        console.warn("[http] Token is expired, removing from storage.");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_session");
      }
    }
    return Promise.reject(err);
  }
);


function isExpired(jwt?: string | null): boolean {
  if (!jwt) return true;
  try {
    const [, payload] = jwt.split(".");
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === "number" ? Date.now() / 1000 >= exp : true;
  } catch {
    return true;
  }
}


export default api;
