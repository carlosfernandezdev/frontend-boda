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
<div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
  
  {/* Fondo base */}
  <div className="absolute inset-0 bg-[#f7f3eb]" />

  {/* Imagen */}
  <div className="absolute inset-0 overflow-hidden">
   <img
  src="/estancia.webp"
  alt=""
  className="
    h-full
    w-full
    object-cover
    object-[center_top]
    scale-125
    object-top
    opacity-95
    animate-fade-up
  "
/>
  
  </div>

  {/* Overlay suave para integrar */}
  <div className="absolute inset-0" />


{/* Glow decorativo */}
<div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-vino/10 blur-3xl" />

<div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-terracota/20 blur-3xl" />

{/* Overlay suave */}
<div className="absolute inset-0 " />
      {/* Glow decorativo */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-vino/10 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-terracota/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="mb-24 text-center">
  <p className="subtitle-romantic mb-0 leading-none">
  Guillermo & Janeric
</p>

<div className="divider-romantic mt-2 mb-1" />
  <div className="flex mt-1 justify-center">
    <img
      src="/sello.webp"
      alt="Ruiz & Rivera"
      className="
        w-[100px]
        md:w-[150px]
        object-contain
        opacity-95
        animate-fade-up
      "
    />
  </div>

  <p className="mt-5 px-6 font-body text-sm leading-relaxed text-tinta/">
    Inicia sesión para acceder a los recuerdos,
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
            className="btn-primary mx-auto"
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
            ¿Eres invitado y todavía no tienes cuenta?{' '}
            <Link
              to="/registro"
              className="font-medium text-black transition hover:text-vino hover:underline"
            >
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}