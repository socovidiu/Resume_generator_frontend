import api from "./http";
import type { LoginRequest, SignUpRequest, AuthResponse } from "./types";


export async function signup(payload: SignUpRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/users", payload);
  if (data.token) localStorage.setItem("auth_token", data.token);
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/sessions", payload);
  if (data.token) localStorage.setItem("auth_token", data.token);
  return data;
}

export function logout(): void {
  // For stateless JWT just remove it; backend DELETE is optional
  localStorage.removeItem("auth_token");
  // Optionally notify API (will require auth header)
  // return api.delete("/api/sessions");
}


