// The backend address the browser calls directly.
// - Set VITE_API_URL in Vercel to override it.
// - Local dev (npm run dev) uses the Django server on port 8000.
// - Production builds use the Render backend.
export const API_ORIGIN =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://email-ai-assistant-ogl8.onrender.com");