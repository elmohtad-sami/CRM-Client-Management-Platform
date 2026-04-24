

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ).replace(/\/$/, '');

export async function request(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(new URL(`/api${path}`, API_BASE_URL), {
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