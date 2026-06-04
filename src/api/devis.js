import { request } from './http';

export const devisApi = {
  list: (token) => request('/devis', { token }),
  create: (payload, token) => request('/devis', { method: 'POST', body: payload, token }),
  remove: (id, token) => request(`/devis/${id}`, { method: 'DELETE', token })
};
