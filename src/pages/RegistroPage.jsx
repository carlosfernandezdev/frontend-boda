import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/client.js';

export function RegistroPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
  });

  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const setCampo = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setEnviando(true);

    try {
      await register(form.correo, form.nombre, form.contrasena);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos crear tu cuenta'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Fondo estilo Jane & Guille */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,191,168,0.38),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(111,30,52,0.15),transparent_38%),linear-gradient(180deg,#fffaf4_0%,#f7efe7_45%,#ead8c8_100%)]" />

      {/* Luces suaves */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-vino/10 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-terracota/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Encabezado */}
        <div className="mb-10 text-center">
          <p className="subtitle-romantic">
            Sumate a la celebración
          </p>

          <div className="divider-romantic" />

          <h1 className="font-display text-[3.8rem] leading-none text-vino md:text-[4.8rem]">
            Creá
          </h1>

          <p className="mt-1 font-display text-2xl italic text-terracota">
            tu cuenta
          </p>

          <p className="mt-5 px-6 font-body text-sm leading-relaxed text-tinta/65">
            Registrate para subir tus fotos, videos y recuerdos favoritos
            del gran día.
          </p>
        </div>

        {/* Formulario */}
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
            <label className="label-base" htmlFor="nombre">
              Nombre o apodo
            </label>

            <input
              id="nombre"
              type="text"
              className="input-base"
              value={form.nombre}
              onChange={setCampo('nombre')}
              placeholder="Cómo querés que te vean"
              required
              autoFocus
            />
          </div>

          <div className="mb-5">
            <label className="label-base" htmlFor="correo">
              Correo electrónico
            </label>

            <input
              id="correo"
              type="email"
              className="input-base"
              value={form.correo}
              onChange={setCampo('correo')}
              placeholder="tu@correo.com"
              required
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
              value={form.contrasena}
              onChange={setCampo('contrasena')}
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={enviando}
          >
            {enviando ? 'Creando…' : 'Crear cuenta'}
          </button>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-champagne/70" />
            <span className="font-body text-[11px] uppercase tracking-[0.25em] text-tinta/35">
              Recuerdos
            </span>
            <div className="h-px flex-1 bg-champagne/70" />
          </div>

          <p className="text-center font-body text-sm leading-relaxed text-tinta/60">
            ¿Ya tenés cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-terracota transition hover:text-vino hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}