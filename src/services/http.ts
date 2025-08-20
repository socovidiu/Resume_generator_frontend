import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL,
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
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_session");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
