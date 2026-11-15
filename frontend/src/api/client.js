const BASE = "/api";

export const getTokens = () => JSON.parse(localStorage.getItem("tokens") || "null");
export const saveTokens = (tokens) => localStorage.setItem("tokens", JSON.stringify(tokens));
export const clearTokens = () => localStorage.removeItem("tokens");

async function refreshAccess() {
  const tokens = getTokens();
  if (!tokens?.refresh) throw new Error("No refresh token");

  const res = await fetch(`${BASE}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error("Session expired");
  }
  const { access } = await res.json();
  saveTokens({ ...tokens, access });
  return access;
}

export async function api(path, { method = "GET", body, retry = true } = {}) {
  const tokens = getTokens();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(tokens?.access && { Authorization: `Bearer ${tokens.access}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry) {
    await refreshAccess();
    return api(path, { method, body, retry: false });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || "Request failed");
  return data;
}