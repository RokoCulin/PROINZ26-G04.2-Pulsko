// Adresa backenda. Lokalno: http://localhost:8000; na deployu se postavlja
// varijablom VITE_API_URL (vidi .env.example).
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// FastAPI vraća detail kao tekst ili kao popis grešaka validacije.
function errorMessage(data, status) {
  const detail = data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length) {
    return detail
      .map((item) => (item.msg || "").replace(/^Value error, /, ""))
      .filter(Boolean)
      .join(" ");
  }
  return `Greška ${status}`;
}

export async function apiFetch(path, { method = "GET", body, csrfToken } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    cache: "no-store", // uvijek svježi podaci (npr. /patient nakon check-ina)
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, errorMessage(data, response.status));
  return data;
}

// /auth/me uvijek vraća 200; authenticated: false znači da korisnik nije prijavljen.
export function getMe() {
  return apiFetch("/auth/me");
}

export function loginUrl(role) {
  return `${API_URL}/auth/login?role=${encodeURIComponent(role)}`;
}

export function homePathFor(user) {
  if (user.role === "admin") return "/admin";
  if (user.role === "doctor") return "/doctor";
  return "/patient";
}
