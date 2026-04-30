import { request } from './http';

export const clientsApi = {
  list: (token) => request('/clients', { token }),
  create: (payload, token) => request('/clients', { method: 'POST', body: payload, token }),
  update: (clientId, payload, token) => request(`/clients/${clientId}`, { method: 'PUT', body: payload, token }),
  remove: (clientId, token) => request(`/clients/${clientId}`, { method: 'DELETE', token }),
  createInvoice: (clientId, payload, token) => request(`/clients/${clientId}/invoices`, { method: 'POST', body: payload, token }),
  addNote: (clientId, payload, token) => request(`/clients/${clientId}/notes`, { method: 'POST', body: payload, token }),
  addDocument: (clientId, payload, token) => request(`/clients/${clientId}/documents`, { method: 'POST', body: payload, token }),
  updateNote: (clientId, noteId, payload, token) => request(`/clients/${clientId}/notes/${noteId}`, { method: 'PUT', body: payload, token }),
  deleteNote: (clientId, noteId, token) => request(`/clients/${clientId}/notes/${noteId}`, { method: 'DELETE', token }),
  updateActivity: (clientId, activityId, payload, token) => request(`/clients/${clientId}/activities/${activityId}`, { method: 'PUT', body: payload, token }),
  deleteActivity: (clientId, activityId, token) => request(`/clients/${clientId}/activities/${activityId}`, { method: 'DELETE', token }),
  updateInvoice: (clientId, invoiceId, payload, token) => request(`/clients/${clientId}/invoices/${invoiceId}`, { method: 'PATCH', body: payload, token })
};