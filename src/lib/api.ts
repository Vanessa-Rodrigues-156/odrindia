export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
  try {
    return await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch (err) {
    console.error("Network error in apiFetch:", err);
    throw err;
  }
}

export {};
