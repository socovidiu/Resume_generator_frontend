// services/user.ts
import api from "./http";
import type { UserResponse, UpdateUserRequest } from "./types";

function getError(err: unknown): Error {
  if (err && typeof err === "object") {
    const obj = err as Record<string, unknown>;

    const response = obj["response"] as Record<string, unknown> | undefined;
    const data = response?.["data"];

    const message =
      (typeof data === "object" && data && "message" in data
        ? (data as Record<string, unknown>)["message"]
        : typeof data === "string"
        ? data
        : undefined) ??
      (typeof obj["message"] === "string" ? obj["message"] : undefined);

    return new Error(typeof message === "string" ? message : "Request failed");
  }

  return new Error("Request failed");
}

export async function getUser(id: string): Promise<UserResponse> {
  try {
    const { data } = await api.get<UserResponse>(`/api/users/${id}`);
    return data;
  } catch (err: unknown) {
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
  } catch (err: unknown) {
    throw getError(err);
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await api.delete(`/api/users/${id}`);
  } catch (err: unknown) {
    throw getError(err);
  }
}
