// services/user.ts
import api from "./http";
import type { UserResponse, UpdateUserRequest } from "./types";

function getError(err: any): Error {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    "Request failed";
  return new Error(typeof msg === "string" ? msg : "Request failed");
}

export async function getUser(id: string): Promise<UserResponse> {
  try {
    const { data } = await api.get<UserResponse>(`/api/users/${id}`);
    return data;
  } catch (err) {
    throw getError(err);
  }
}

export async function updateUser(
  id: string,
  payload: UpdateUserRequest
): Promise<UserResponse> {
  try {
    const { data } = await api.put<UserResponse>(`/api/users/${id}`, payload);
    return data;
  } catch (err) {
    throw getError(err);
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await api.delete(`/api/users/${id}`);
  } catch (err) {
    throw getError(err);
  }
}
