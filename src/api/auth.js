import { request } from './http';

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  updateProfile: (payload, token) => request('/auth/profile', { method: 'PUT', body: payload, token }),
  updatePassword: (payload, token) => request('/auth/password', { method: 'PATCH', body: payload, token }),
  me: (token) => request('/auth/me', { token })
};