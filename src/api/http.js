const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Use an explicit backend URL when provided, otherwise fall back to localhost:5000 in dev.
// This avoids 502 proxy failures if the Vite proxy reloads before the backend is ready.
export const API_BASE_URL = (configuredBaseUrl || (import.meta.env.DEV ? 'http://localhost:5000' : ''))
  .replace(/\/$/, '');

function buildApiUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}/api${path}` : `/api${path}`;
}

export async function request(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(buildApiUrl(path), {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
}