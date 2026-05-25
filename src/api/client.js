import axios from 'axios';

const TOKEN_KEY = 'wedding_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Cliente base. baseURL '/api' funciona con el proxy de Vite en dev
// y con un reverse-proxy o mismo dominio en producción.
export const api = axios.create({
  baseURL: '/api',
});

// Request interceptor: adjunta el Bearer token si existe.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: si el backend responde 401 (token expirado o inválido),
// limpiamos el token y redirigimos al login. Evita estados zombi.
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(error);
  }
);

/**
 * Extrae un mensaje de error legible de la respuesta del backend.
 * El backend devuelve { error: { code, message, details? } }.
 */
export const getErrorMessage = (error, fallback = 'Ocurrió un error') => {
  return (
    error?.response?.data?.error?.message ||
    error?.message ||
    fallback
  );
};
