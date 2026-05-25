import { useState, useEffect, useCallback } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

import { archivosApi } from '../api/archivos.js';
import { etapasApi } from '../api/etapas.js';
import { getErrorMessage } from '../api/client.js';

import { useAuth } from '../context/AuthContext.jsx';

import { SubirArchivo } from '../components/galeria/SubirArchivo.jsx';
import { ArchivoCard } from '../components/galeria/ArchivoCard.jsx';
import { FiltrosBar } from '../components/galeria/FiltrosBar.jsx';
import { ArchivoModal } from '../components/galeria/ArchivoModal.jsx';

const LIMIT = 24;

const FILTROS_INICIALES = {
  tipo: '',
  etapa_id: '',
  solo_mios: false,
  ver_ocultos: false,
  page: 1,
};

export function GaleriaPage() {
  const { usuario } = useAuth();

  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [archivos, setArchivos] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    total_pages: 1,
    page: 1,
  });

  const [etapas, setEtapas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    etapasApi
      .listar()
      .then((data) => setEtapas(data.etapas || []))
      .catch(() => setEtapas([]));
  }, []);

  const construirParams = useCallback(() => {
    const params = {
      page: filtros.page,
      limit: LIMIT,
    };

    if (filtros.tipo) params.tipo = filtros.tipo;
    if (filtros.etapa_id) params.etapa_id = filtros.etapa_id;
    if (filtros.solo_mios) params.usuario_id = usuario.id;
    if (filtros.ver_ocultos) params.visible = 'all';

    return params;
  }, [filtros, usuario.id]);

  const cargarArchivos = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const data = await archivosApi.listar(construirParams());

      setArchivos(data.archivos || []);

      setPagination(
        data.pagination || {
          total: 0,
          total_pages: 1,
          page: 1,
        }
      );
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos cargar la galería'));
    } finally {
      setCargando(false);
    }
  }, [construirParams]);

  useEffect(() => {
    cargarArchivos();
  }, [cargarArchivos]);

  const onEliminar = async (archivo) => {
    if (
      !confirm(
        `¿Eliminar "${archivo.nombre}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      await archivosApi.eliminar(archivo.id);

      setArchivos((prev) => prev.filter((a) => a.id !== archivo.id));

      if (seleccionado?.id === archivo.id) {
        setSeleccionado(null);
      }
    } catch (err) {
      alert(getErrorMessage(err, 'No se pudo eliminar'));
    }
  };

  const onToggleVisible = async (archivo) => {
    try {
      const { archivo: actualizado } = await archivosApi.actualizar(
        archivo.id,
        {
          visible: !archivo.visible,
        }
      );

      if (!actualizado.visible && !filtros.ver_ocultos) {
        setArchivos((prev) => prev.filter((a) => a.id !== archivo.id));
      } else {
        setArchivos((prev) =>
          prev.map((a) => (a.id === archivo.id ? actualizado : a))
        );
      }
    } catch (err) {
      alert(getErrorMessage(err, 'No se pudo cambiar la visibilidad'));
    }
  };

  const onReasignarEtapa = async (archivo, etapa_id) => {
    try {
      const { archivo: actualizado } = await archivosApi.actualizar(
        archivo.id,
        {
          etapa_id,
        }
      );

      setArchivos((prev) =>
        prev.map((a) => (a.id === archivo.id ? actualizado : a))
      );
    } catch (err) {
      alert(getErrorMessage(err, 'No se pudo reasignar la etapa'));
    }
  };

  const irAPagina = (page) => {
    setFiltros((f) => ({
      ...f,
      page,
    }));
  };

const esVideo = (archivo) => {
  const tipo = archivo?.tipo?.toLowerCase();

  return tipo === 'video';
};

const archivosOrdenados = [...archivos].sort((a, b) => {
  const aVideo = esVideo(a);
  const bVideo = esVideo(b);

  if (aVideo === bVideo) return 0;

  return aVideo ? 1 : -1;
});

  return (
  <div className="relative min-h-screen w-full overflow-hidden bg-[#fff6f1] px-0 py-0">
    {/* Fondo */}
    <div className="absolute inset-0 z-0">
      <img
        src="/fondo1.jpeg"
        alt=""
        className="h-full w-full object-cover "
      />

      <div className="absolute inset-0 bg-white/70 " />
    </div>

    <div className="relative z-10 w-full animate-fade-up">
        {/* Hero full */}
        <section className="relative w-full overflow-hidden bg-white shadow-suave">
          <div className="relative h-[360px] overflow-hidden md:h-[520px] lg:h-[620px]">
            <img
              src="/novios.jpeg"
              alt=""
              className="h-full w-full object-cover object-top"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/20 to-white" />
          </div>

          <div className="relative -mt-24 px-6 pb-10 text-center md:-mt-32 md:px-10 lg:-mt-36">
            <img
              src="/sello.jpeg"
              alt="Guillermo y Janeric"
              className="mx-auto mb-4 w-[105px] object-contain drop-shadow-md md:w-[145px]"
            />

            <p className="subtitle-romantic mb-2 text-[11px] md:text-sm">
              Guillermo & Janeric
            </p>

            <h1 className="font-body text-4xl font-bold tracking-tight text-black/70 md:text-6xl">
              Nuestra Galería
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-black/65 md:text-lg">
              Bienvenid@, {usuario?.nombre}. Comparte y revive los recuerdos
              más bonitos de nuestra celebración.
            </p>

            <div className="mx-auto mt-8 max-w-3xl">
              <SubirArchivo onComplete={cargarArchivos} />
            </div>
          </div>
        </section>

        {/* Contenido */}
        <section className="w-full px-4 py-8 md:px-8 lg:px-12">
          {/* Filtros */}
          <div className="mb-8">
            <FiltrosBar
              filtros={filtros}
              setFiltros={setFiltros}
              etapas={etapas}
            />
          </div>

          {/* Contador */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold leading-none text-black md:text-4xl">
                {pagination.total}
              </p>
              <p className="text-sm leading-tight text-black/60 md:text-base">
                Fotos & Videos
              </p>
            </div>
          </div>

          {cargando ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-black/40" />
            </div>
          ) : error ? (
            <div className="mx-auto mt-6 max-w-xl rounded-3xl bg-white/80 p-8 text-center shadow-sm">
              <p className="text-2xl font-semibold text-black">Ups…</p>
              <p className="mt-3 text-sm text-black/60">{error}</p>
            </div>
          ) : archivos.length === 0 ? (
            <div className="mx-auto mt-6 flex max-w-xl flex-col items-center rounded-3xl bg-white/80 px-6 py-16 text-center shadow-sm">
              <ImageOff
                className="h-14 w-14 text-black/30"
                strokeWidth={1.5}
              />

              <h2 className="mt-5 text-3xl font-semibold text-black">
                Todavía no hay recuerdos
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/55">
                Sé la primera persona en subir una foto o video de este día tan
                especial.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                {archivosOrdenados.map((archivo) => (
                  <div
                    key={archivo.id}
                    className="aspect-square overflow-hidden rounded-2xl bg-white shadow-sm transition hover:scale-[1.02]"
                  >
                    <ArchivoCard
                      archivo={archivo}
                      onAbrir={setSeleccionado}
                      onEliminar={onEliminar}
                      onToggleVisible={onToggleVisible}
                    />
                  </div>
                ))}
              </div>

              {pagination.total_pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    onClick={() => irAPagina(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <span className="rounded-xl bg-white px-4 py-2 text-sm text-black/60">
                    {pagination.page} / {pagination.total_pages}
                  </span>

                  <button
                    onClick={() => irAPagina(pagination.page + 1)}
                    disabled={pagination.page >= pagination.total_pages}
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-40"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {seleccionado && (
          <ArchivoModal
            archivo={seleccionado}
            etapas={etapas}
            onCerrar={() => setSeleccionado(null)}
            onReasignarEtapa={onReasignarEtapa}
          />
        )}
      </div>
    </div>
  );
}