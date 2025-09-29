export function getRolesFromToken(token?: string): string[] {
  if (!token) return [];
  try {
    const [, payload] = token.split(".");
    const json = JSON.parse(atob(payload));
    // Depending on emitter, "role" may be string or array
    const value = json.role ?? json.roles;
    return Array.isArray(value) ? value : value ? [String(value)] : [];
  } catch {
    return [];
  }
}
