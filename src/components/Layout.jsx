import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout({ children }) {
  const { usuario, logout, tienePermiso } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Etiqueta legible del rol
  const rolLabel = {
    admin: 'Administrador',
    novio: 'Novios',
    invitado: 'Invitado',
  }[usuario?.rol_nombre] || usuario?.rol_nombre;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-champagne/60 bg-crema/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-display text-2xl text-vino">
            Ruiz · Rivera
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link to="/" className="rounded-full px-4 py-2 font-body text-sm text-tinta/70 transition hover:bg-arena hover:text-vino">
              Galería
            </Link>

            {/* Solo moderadores ven gestión de etapas */}
            {tienePermiso('etapas.crear') && (
              <Link to="/etapas" className="rounded-full px-4 py-2 font-body text-sm text-tinta/70 transition hover:bg-arena hover:text-vino">
                Etapas
              </Link>
            )}

            {/* Solo admin ve gestión de usuarios */}
            {tienePermiso('usuarios.asignar_rol') && (
              <Link to="/usuarios" className="rounded-full px-4 py-2 font-body text-sm text-tinta/70 transition hover:bg-arena hover:text-vino">
                Usuarios
              </Link>
            )}

            <div className="ml-2 flex items-center gap-3 border-l border-champagne/60 pl-3">
              <div className="hidden text-right sm:block">
                <p className="font-body text-sm font-medium text-tinta">{usuario?.nombre}</p>
                <p className="font-body text-xs text-terracota">{rolLabel}</p>
              </div>
              <button onClick={onLogout} className="btn-ghost px-4 py-2 text-xs">
                Salir
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}