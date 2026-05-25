import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout({ children }) {
  const { usuario, logout, tienePermiso } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const rolLabel = {
    admin: 'Administrador',
    novio: 'Novios',
    invitado: 'Invitado',
  }[usuario?.rol_nombre] || usuario?.rol_nombre;

  const esInvitado = usuario?.rol_nombre === 'invitado';

  return (
    <div className="min-h-screen">
      {/* NAV NORMAL */}
      {!esInvitado && (
        <header className="sticky top-0 z-40 border-b border-champagne/60 bg-crema/80 backdrop-blur-xl">
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

              {tienePermiso('etapas.crear') && (
                <Link
                  to="/etapas"
                  className="rounded-full px-4 py-2 font-body text-sm text-tinta/70 transition hover:bg-arena hover:text-vino"
                >
                  Etapas
                </Link>
              )}

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
                  className="
                    rounded-full
                    px-4
                    py-2
                    text-xs
                    text-tinta/70
                    transition
                    hover:bg-arena
                    hover:text-vino
                  "
                >
                  Salir
                </button>
              </div>
            </nav>
          </div>
        </header>
      )}

      {/* BOTONES FLOTANTES INVITADOS */}
      {esInvitado && (
        <div
          className="
            absolute
            top-0
            left-0
            z-50
            flex
            w-full
            items-center
            justify-between
            px-5
            py-5
          "
        >
          <Link
            to="/"
            className="
              rounded-full
              border
              border-white/20
              bg-black/15
              px-4
              py-2
              text-sm
              font-semibold
              text-black/70
              shadow-lg
              backdrop-blur-xl
              transition
              hover:bg-black/25
            "
          >
            ← Inicio
          </Link>

          <button
            onClick={onLogout}
            className="
              rounded-full
              border
              border-white/20
              bg-black/15
              px-4
              py-2
              text-sm
              font-semibold
              text-black/70
              shadow-lg
              backdrop-blur-xl
              transition
              hover:bg-black/25
            "
          >
            Salir
          </button>
        </div>
      )}

      <main className="w-full px-0 py-0">
        {children}
      </main>
    </div>
  );
}