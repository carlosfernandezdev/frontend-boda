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
    {/* SOLO mostrar navbar si NO es invitado */}
    {usuario?.rol_nombre !== 'invitado' && (
      <header className="sticky top-0 z-10 border-b border-champagne/60 bg-crema/80 backdrop-blur">
        <div className="flex w-full items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="font-display text-2xl text-vino">
            Ruiz · Rivera
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className="rounded-full px-4 py-2 font-body text-sm text-tinta/70 transition hover:bg-arena hover:text-vino"
            >
              Galería
            </Link>

            {/* Solo moderadores */}
            {tienePermiso('etapas.crear') && (
              <Link
                to="/etapas"
                className="rounded-full px-4 py-2 font-body text-sm text-tinta/70 transition hover:bg-arena hover:text-vino"
              >
                Etapas
              </Link>
            )}

            {/* Solo admin */}
            {tienePermiso('usuarios.asignar_rol') && (
              <Link
                to="/usuarios"
                className="rounded-full px-4 py-2 font-body text-sm text-tinta/70 transition hover:bg-arena hover:text-vino"
              >
                Usuarios
              </Link>
            )}

            <div className="ml-2 flex items-center gap-3 border-l border-champagne/60 pl-3">
              <div className="hidden text-right sm:block">
                <p className="font-body text-sm font-medium text-tinta">
                  {usuario?.nombre}
                </p>

                <p className="font-body text-xs text-terracota">
                  {rolLabel}
                </p>
              </div>

              <button
                onClick={onLogout}
                className="btn-ghost px-4 py-2 text-xs"
              >
                Salir
              </button>
            </div>
          </nav>
        </div>
      </header>
    )}

    <main className="w-full px-0 py-0">
      {children}
    </main>
  </div>
);
}