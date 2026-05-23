import { api } from './client.js';

export const authApi = {
  login: (correo, contrasena) =>
    api.post('/auth/login', { correo, contrasena }).then((r) => r.data),

  register: (correo, nombre, contrasena) =>
    api.post('/auth/register', { correo, nombre, contrasena }).then((r) => r.data),

  me: () => api.get('/auth/me').then((r) => r.data),
};
