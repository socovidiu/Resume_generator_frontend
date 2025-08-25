// src/services/user.ts
import api from "./http";

export type User = {
  id: string;
  username: string;
  email: string;
};

export type UpdateUserRequest = {
  username: string;
  email: string;
  password?: string; // omit/empty to keep the old password
};

export type UserResponse = User;

function getError(err: any): Error {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    "Request failed";
  return new Error(typeof msg === "string" ? msg : "Request failed");
}

/** GET /api/users/{id} — must match the JWT subject */
export async function getUser(id: string): Promise<UserResponse> {
  try {
    const { data } = await api.get<UserResponse>(`/api/users/${id}`);
    return data;
  } catch (err) {
    throw getError(err);
  }
}

/** PUT /api/users/{id} */
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

/** DELETE /api/users/{id} */
export async function deleteUser(id: string): Promise<void> {
  try {
    await api.delete(`/api/users/${id}`);
  } catch (err) {
    throw getError(err);
  }
}
