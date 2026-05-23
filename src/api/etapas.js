import { api } from './client.js';

export const etapasApi = {
  listar: () => api.get('/etapas').then((r) => r.data),
  obtener: (id) => api.get(`/etapas/${id}`).then((r) => r.data),
  crear: (data) => api.post('/etapas', data).then((r) => r.data),
  actualizar: (id, cambios) => api.patch(`/etapas/${id}`, cambios).then((r) => r.data),
  eliminar: (id) => api.delete(`/etapas/${id}`).then((r) => r.data),
};
