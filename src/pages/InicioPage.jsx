import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import { archivosApi } from '../api/archivos.js';

export function InicioPage() {
  const { usuario } = useAuth();

  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await archivosApi.listar({
          page: 1,
          limit: 80,
        });

        setArchivos(data.archivos || []);
      } catch (error) {
        setArchivos([]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const esVideo = (archivo) => {
    const url = archivo?.url?.toLowerCase() || '';

    return (
      archivo.tipo === 'video' ||
      url.endsWith('.mov') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm')
    );
  };

 return (
  <div className="relative min-h-screen w-full overflow-hidden bg-[#f7f3eb] px-0 py-0">
    {/* Fondo */}
    <div className="absolute inset-0 z-0">
      <img
        src="/fondo1.webp"
        alt=""
        className="h-full w-full object-cover "
      />

      <div className="absolute inset-0 bg-white/65 " />
    </div>

    <div className="relative z-10 w-full animate-fade-up">


  <div className="absolute inset-0 bg-[#f7f3eb]/80 backdrop-blur-[2px]" />

    <div className="absolute inset-0 bg-[#f7f3eb]/90 backdrop-blur-[2px]" />
  </div>
      <div className="w-full animate-fade-up">
        {/* HERO */}
        <section className="relative w-full overflow-hidden bg-white shadow-suave">
          <div className="relative h-[360px] overflow-hidden md:h-[520px] lg:h-[640px]">
            <img
              src="/novios.webp"
              alt=""
              className="h-full w-full object-cover object-top"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/20 to-white" />
          </div>

          <div className="relative -mt-24 px-6 pb-10 text-center md:-mt-32 md:px-10 lg:-mt-36">
            <img
              src="/sello.webp"
              alt="Guillermo y Janeric"
              className="mx-auto mb-5 w-[105px] object-contain drop-shadow-md md:w-[145px]"
            />

            <p className="subtitle-romantic mb-3 text-[11px] md:text-sm">
              Guillermo & Janeric
            </p>

            <h1 className="font-body text-4xl font-bold tracking-tight text-black md:text-6xl">
              Nuestra Galería
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-black/60 md:text-lg">
              Bienvenid@, {usuario?.nombre}. Comparte y revive los recuerdos
              más bonitos de nuestra celebración.
            </p>

            {/* BOTONES */}
            <div className="mx-auto mt-7 grid max-w-md grid-cols-2 gap-3">
              <Link
                to="/galeria"
                className="rounded-xl bg-[#3f4438] px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
              >
                ↑ Subir fotos
              </Link>

              <Link
                to="/galeria"
                className="rounded-xl border border-black/15 bg-white px-4 py-3 text-center text-sm font-semibold text-black shadow-sm transition hover:scale-[1.02]"
              >
                Ver galería
              </Link>
            </div>
          </div>
        </section>

        {/* CONTENIDO */}
        <section className="w-full px-4 py-8 md:px-8 lg:px-12">
          {/* INFO */}
          <div className="mb-8 flex items-end justify-between">
            <p className="text-sm text-black/60 md:text-base">
              Fotos recientes
            </p>

            <Link
              to="/galeria"
              className="text-sm font-semibold text-black/70 md:text-base"
            >
              Ver todo
            </Link>
          </div>

          {/* CARRUSEL */}
          {cargando ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-black/40" />
            </div>
          ) : archivos.filter((a) => !esVideo(a)).length === 20 ? (
            <div className="rounded-3xl bg-white/80 px-6 py-10 text-center shadow-sm">
              <p className="text-sm text-black/55">
                Todavía no hay fotos subidas.
              </p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6">
              {archivos
                .filter((archivo) => !esVideo(archivo))
                .map((archivo) => (
                  <button
                    key={archivo.id}
                    type="button"
                    className="shrink-0 overflow-hidden rounded-3xl bg-white shadow-sm transition hover:scale-[1.02]"
                  >
                    <img
                      src={archivo.url}
                      alt="Recuerdo"
                      loading="lazy"
                      decoding="async"
                      className="
                        h-[210px]
                        w-[155px]
                        object-cover

                        md:h-[320px]
                        md:w-[240px]

                        lg:h-[420px]
                        lg:w-[320px]
                      "
                    />

                    <div className="px-4 py-3">
                      <p className="text-xs text-[#cdbd9a] md:text-sm">
                        {archivo.etapa_nombre || 'Recepción'}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}