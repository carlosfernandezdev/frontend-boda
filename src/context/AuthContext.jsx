import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/auth.js';
import { tokenStore, setUnauthorizedHandler } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Carga el usuario actual desde /me (usando el token guardado).
  const cargarUsuario = useCallback(async () => {
    if (!tokenStore.get()) {
      setUsuario(null);
      setCargando(false);
      return;
    }
    try {
      const { usuario } = await authApi.me();
      setUsuario(usuario);
    } catch {
      // Token inválido/expirado: el interceptor ya lo limpió
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  // Al montar, intenta restaurar la sesión.
  useEffect(() => {
    cargarUsuario();
  }, [cargarUsuario]);

  // Si cualquier request da 401, el cliente llama esto y cerramos sesión.
  useEffect(() => {
    setUnauthorizedHandler(() => setUsuario(null));
  }, []);

  const login = async (correo, contrasena) => {
    const { token } = await authApi.login(correo, contrasena);
    tokenStore.set(token);
    const { usuario } = await authApi.me();
    setUsuario(usuario);
    return usuario;
  };

  const register = async (correo, nombre, contrasena) => {
    const { token } = await authApi.register(correo, nombre, contrasena);
    tokenStore.set(token);
    const { usuario } = await authApi.me();
    setUsuario(usuario);
    return usuario;
  };

  const logout = () => {
    tokenStore.clear();
    setUsuario(null);
  };

  // Helper: ¿el usuario tiene este permiso?
  const tienePermiso = useCallback(
    (permiso) => usuario?.permisos?.includes(permiso) ?? false,
    [usuario]
  );

  const value = {
    usuario,
    cargando,
    autenticado: !!usuario,
    login,
    register,
    logout,
    tienePermiso,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
