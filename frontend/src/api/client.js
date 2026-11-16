const BASE = "/api";

export const getTokens = () => JSON.parse(localStorage.getItem("tokens") || "null");
export const saveTokens = (tokens) => localStorage.setItem("tokens", JSON.stringify(tokens));
export const clearTokens = () => localStorage.removeItem("tokens");

async function refreshAccess() {
  const tokens = getTokens();
  if (!tokens?.refresh) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const res = await fetch(`${BASE}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const { access } = await res.json();
  saveTokens({ ...tokens, access });
  return access;
}

// Only accept JSON. If the server returns HTML (for example, the Vercel
// index.html fallback because a rewrite didn't match), throw a clear error
// instead of letting the UI receive undefined data.
async function readJson(res, path) {
  const type = res.headers.get("content-type") || "";
  if (!type.includes("application/json")) {
    throw new Error(
      `Expected JSON from ${path} but got ${type || "no content type"} (HTTP ${res.status}). ` +
        "Check the API rewrite in vercel.json and VITE_API_URL."
    );
  }
  return res.json();
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

  const data = res.status === 204 ? null : await readJson(res, path);

  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Request to ${path} failed (HTTP ${res.status})`);
  }

  return data;
}