import api from "./http";
import type { CVResponse, CreateCVRequest, UpdateCVRequest } from "./types";

export async function listCVs(): Promise<CVResponse[]> {
  const res = await api.get<CVResponse[]>("/api/cvs");
  // Defensive: ensure array
  return Array.isArray(res.data) ? res.data : [];
}

export async function getCV(id: string): Promise<CVResponse> {
  const { data } = await api.get<CVResponse>(`/api/cvs/${id}`);
  return data;
}

export async function createCV(payload: CreateCVRequest): Promise<CVResponse> {
  const { data } = await api.post<CVResponse>("/api/cvs", payload);
  return data;
}

export async function updateCV(id: string, payload: UpdateCVRequest): Promise<CVResponse> {
  const { data } = await api.put<CVResponse>(`/api/cvs/${id}`, payload);
  return data;
}

export async function deleteCV(id: string): Promise<void> {
  await api.delete(`/api/cvs/${id}`);
}
