import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/client.js';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from?.pathname || '/';

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      await login(correo, contrasena);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos iniciar sesión'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Fondo romántico */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,191,168,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(111,30,52,0.15),transparent_38%),linear-gradient(180deg,#fffaf4_0%,#f7efe7_45%,#ead8c8_100%)]" />

      {/* Glow decorativo */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-vino/10 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-terracota/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="subtitle-romantic">
            Nuestra boda
          </p>

          <div className="divider-romantic" />

          <h1 className="font-display text-[4.5rem] leading-none text-vino md:text-[5.5rem]">
            Ruiz
          </h1>

          <p className="mt-2 font-display text-2xl italic text-terracota">
            &amp;
          </p>

          <h1 className="font-display text-[4.5rem] leading-none text-vino md:text-[5.5rem]">
            Rivera
          </h1>

          <p className="mt-5 px-6 font-body text-sm leading-relaxed text-tinta/65">
            Iniciá sesión para acceder a los recuerdos,
            fotografías y momentos especiales de nuestra celebración.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={onSubmit}
          className="section-romantic p-8 md:p-10"
        >
          {error && (
            <div className="mb-6 rounded-2xl border border-terracota/25 bg-terracota/10 px-4 py-3 text-sm text-vino backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="label-base" htmlFor="correo">
              Correo electrónico
            </label>

            <input
              id="correo"
              type="email"
              className="input-base"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
              autoFocus
            />
          </div>

          <div className="mb-8">
            <label className="label-base" htmlFor="contrasena">
              Contraseña
            </label>

            <input
              id="contrasena"
              type="password"
              className="input-base"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={enviando}
          >
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-champagne/70" />
            <span className="font-body text-[11px] uppercase tracking-[0.25em] text-tinta/35">
              Bienvenidos
            </span>
            <div className="h-px flex-1 bg-champagne/70" />
          </div>

          <p className="text-center font-body text-sm leading-relaxed text-tinta/60">
            ¿Sos invitado y todavía no tenés cuenta?{' '}
            <Link
              to="/registro"
              className="font-medium text-terracota transition hover:text-vino hover:underline"
            >
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}