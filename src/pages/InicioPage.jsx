import { useAuth } from '../context/AuthContext.jsx';

export function InicioPage() {
  const { usuario, tienePermiso } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      {/* Fondo Jane & Guille */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,191,168,0.38),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(111,30,52,0.15),transparent_38%),linear-gradient(180deg,#fffaf4_0%,#f7efe7_45%,#ead8c8_100%)]" />

      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-vino/10 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-terracota/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl animate-fade-up">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <p className="subtitle-romantic">
            Bienvenido, {usuario?.nombre}
          </p>

          <div className="divider-romantic" />

          <h1 className="font-display text-[4.5rem] leading-none text-vino md:text-[6rem]">
            La galería
          </h1>

          <p className="mx-auto mt-6 max-w-xl font-body text-sm leading-relaxed text-tinta/65 md:text-base">
            Acá van a vivir todas las fotos y videos de la boda. Un espacio
            especial para guardar, compartir y revivir los recuerdos más bonitos
            de esta celebración.
          </p>
        </div>

        {/* Grid principal */}
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          {/* Card principal */}
          <section className="section-romantic p-8 md:p-10">
            <p className="subtitle-romantic text-[11px]">
              Recuerdos del gran día
            </p>

            <h2 className="mt-3 font-display text-4xl leading-none text-vino md:text-5xl">
              Comparte tus momentos favoritos
            </h2>

            <p className="mt-5 font-body text-sm leading-relaxed text-tinta/65">
              Cada foto y cada video cuentan una parte de la historia. Desde los
              abrazos espontáneos hasta los detalles de la celebración, este será
              el lugar donde todos podrán dejar sus recuerdos.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-champagne/70 bg-white/35 p-5 backdrop-blur-sm">
                <p className="font-display text-3xl text-vino">01</p>
                <p className="mt-2 font-body text-sm text-tinta/65">
                  Ver la galería completa.
                </p>
              </div>

              <div className="rounded-3xl border border-champagne/70 bg-white/35 p-5 backdrop-blur-sm">
                <p className="font-display text-3xl text-vino">02</p>
                <p className="mt-2 font-body text-sm text-tinta/65">
                  Subir fotos y videos.
                </p>
              </div>

              {tienePermiso('archivos.moderar') && (
                <div className="rounded-3xl border border-champagne/70 bg-white/35 p-5 backdrop-blur-sm">
                  <p className="font-display text-3xl text-vino">03</p>
                  <p className="mt-2 font-body text-sm text-tinta/65">
                    Moderar contenido publicado.
                  </p>
                </div>
              )}

              {tienePermiso('etapas.crear') && (
                <div className="rounded-3xl border border-champagne/70 bg-white/35 p-5 backdrop-blur-sm">
                  <p className="font-display text-3xl text-vino">04</p>
                  <p className="mt-2 font-body text-sm text-tinta/65">
                    Gestionar etapas del evento.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Tarjeta sesión */}
          <aside className="section-romantic p-7 md:p-8">
            <p className="subtitle-romantic text-[11px]">
              Tu sesión
            </p>

            <h2 className="mt-3 font-display text-3xl text-vino">
              Acceso activo
            </h2>

            <dl className="mt-6 space-y-4 font-body text-sm">
              <div className="rounded-2xl border border-champagne/60 bg-white/35 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.18em] text-tinta/40">
                  Nombre
                </dt>
                <dd className="mt-1 font-medium text-tinta">
                  {usuario?.nombre}
                </dd>
              </div>

              <div className="rounded-2xl border border-champagne/60 bg-white/35 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.18em] text-tinta/40">
                  Correo
                </dt>
                <dd className="mt-1 break-words font-medium text-tinta">
                  {usuario?.correo}
                </dd>
              </div>

              <div className="rounded-2xl border border-champagne/60 bg-white/35 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.18em] text-tinta/40">
                  Rol
                </dt>
                <dd className="mt-1 font-medium text-terracota">
                  {usuario?.rol_nombre}
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-champagne/60 pt-5">
              <p className="mb-3 font-body text-xs uppercase tracking-[0.22em] text-tinta/40">
                Permisos activos
              </p>

              <div className="flex flex-wrap gap-2">
                {usuario?.permisos?.length ? (
                  usuario.permisos.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-champagne/70 bg-arena/60 px-3 py-1 font-body text-xs text-vino"
                    >
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="font-body text-sm text-tinta/40">
                    Sin permisos
                  </span>
                )}
              </div>
            </div>

            {tienePermiso('usuarios.asignar_rol') && (
              <div className="mt-6 rounded-3xl border border-terracota/25 bg-terracota/10 p-4">
                <p className="font-body text-sm leading-relaxed text-vino">
                  También puedes administrar usuarios y roles dentro de la
                  plataforma.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}