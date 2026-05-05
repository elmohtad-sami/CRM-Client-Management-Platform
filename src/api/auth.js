import { request } from './http';

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  verifyEmail: (token) => request('/auth/verify-email', { method: 'POST', body: { token } }),
  resendVerificationEmail: (email) => request('/auth/resend-verification', { method: 'POST', body: { email } }),
  updateProfile: (payload, token) => request('/auth/profile', { method: 'PUT', body: payload, token }),
  updatePassword: (payload, token) => request('/auth/password', { method: 'PATCH', body: payload, token }),
  me: (token) => request('/auth/me', { token })
};