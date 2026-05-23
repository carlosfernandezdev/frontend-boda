import { api } from './client.js';

export const archivosApi = {
  /**
   * Lista archivos con filtros. `params` es un objeto con cualquiera de:
   * tipo, usuario_id, etapa_id, visible, page, limit, order, dir.
   * Los undefined se omiten automáticamente.
   */
  listar: (params = {}) =>
    api.get('/archivos', { params }).then((r) => r.data),

  obtener: (id) => api.get(`/archivos/${id}`).then((r) => r.data),

  /**
   * Sube un archivo (multipart). `onProgress` recibe 0-100.
   * etapaId es opcional (override de la auto-asignación por metadata).
   */
  subir: (file, { etapaId, onProgress } = {}) => {
    const formData = new FormData();
    formData.append('archivo', file);
    if (etapaId) formData.append('etapa_id', etapaId);

    return api
      .post('/archivos', formData, {
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      })
      .then((r) => r.data);
  },

  actualizar: (id, cambios) =>
    api.patch(`/archivos/${id}`, cambios).then((r) => r.data),

  eliminar: (id) => api.delete(`/archivos/${id}`).then((r) => r.data),
};
