import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Envuelve rutas que requieren sesión.
 * - Mientras carga la sesión, muestra un loader.
 * - Si no hay sesión, redirige a /login (recordando a dónde quería ir).
 * - Si se pasa `permiso`, exige además ese permiso; si falta, redirige a /.
 */
export function RutaProtegida({ children, permiso }) {
  const { autenticado, cargando, tienePermiso } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-crema">
        <div className="animate-pulse font-display text-2xl text-vino">
          Cargando…
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permiso && !tienePermiso(permiso)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
