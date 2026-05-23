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

  // =========================
  // Cargar etapas
  // =========================

  useEffect(() => {
    etapasApi
      .listar()
      .then((data) => setEtapas(data.etapas || []))
      .catch(() => setEtapas([]));
  }, []);

  // =========================
  // Construir params
  // =========================

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

  // =========================
  // Cargar archivos
  // =========================

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

  // =========================
  // Acciones
  // =========================

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

      setArchivos((prev) =>
        prev.filter((a) => a.id !== archivo.id)
      );

      if (seleccionado?.id === archivo.id) {
        setSeleccionado(null);
      }
    } catch (err) {
      alert(getErrorMessage(err, 'No se pudo eliminar'));
    }
  };

  const onToggleVisible = async (archivo) => {
    try {
      const { archivo: actualizado } =
        await archivosApi.actualizar(archivo.id, {
          visible: !archivo.visible,
        });

      if (!actualizado.visible && !filtros.ver_ocultos) {
        setArchivos((prev) =>
          prev.filter((a) => a.id !== archivo.id)
        );
      } else {
        setArchivos((prev) =>
          prev.map((a) =>
            a.id === archivo.id ? actualizado : a
          )
        );
      }
    } catch (err) {
      alert(
        getErrorMessage(
          err,
          'No se pudo cambiar la visibilidad'
        )
      );
    }
  };

  const onReasignarEtapa = async (archivo, etapa_id) => {
    try {
      const { archivo: actualizado } =
        await archivosApi.actualizar(archivo.id, {
          etapa_id,
        });

      setArchivos((prev) =>
        prev.map((a) =>
          a.id === archivo.id ? actualizado : a
        )
      );

      setSeleccionado(actualizado);
    } catch (err) {
      alert(
        getErrorMessage(
          err,
          'No se pudo reasignar la etapa'
        )
      );
    }
  };

  const irAPagina = (page) => {
    setFiltros((f) => ({
      ...f,
      page,
    }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      {/* Fondo Jane & Guille */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,191,168,0.38),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(111,30,52,0.15),transparent_38%),linear-gradient(180deg,#fffaf4_0%,#f7efe7_45%,#ead8c8_100%)]" />

      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-vino/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-terracota/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl animate-fade-up">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="subtitle-romantic">
            Nuestros recuerdos
          </p>

          <div className="divider-romantic" />

          <h1 className="font-display text-[4.5rem] leading-none text-vino md:text-[6rem]">
            La galería
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-sm leading-relaxed text-tinta/65 md:text-base">
            Un espacio para guardar cada abrazo, sonrisa y momento
            especial de nuestra celebración.
          </p>
        </div>

        {/* Upload */}
        <div className="mb-8">
          <SubirArchivo onComplete={cargarArchivos} />
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <FiltrosBar
            filtros={filtros}
            setFiltros={setFiltros}
            etapas={etapas}
          />
        </div>

        {/* Estados */}
        {cargando ? (
          <div className="flex justify-center py-28">
            <Loader2 className="h-10 w-10 animate-spin text-champagne" />
          </div>
        ) : error ? (
          <div className="section-romantic mx-auto max-w-xl p-8 text-center">
            <p className="font-display text-3xl text-vino">
              Ups…
            </p>

            <p className="mt-3 font-body text-sm text-vino">
              {error}
            </p>
          </div>
        ) : archivos.length === 0 ? (
          <div className="section-romantic mx-auto flex max-w-xl flex-col items-center py-20 text-center">
            <ImageOff
              className="h-14 w-14 text-champagne"
              strokeWidth={1.5}
            />

            <h2 className="mt-5 font-display text-4xl text-vino">
              Todavía no hay recuerdos
            </h2>

            <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-tinta/55">
              Sé la primera persona en subir una foto o video
              de este día tan especial.
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {archivos.map((archivo) => (
                <div
                  key={archivo.id}
                  className="animate-fade-up"
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

            {/* Paginación */}
            {pagination.total_pages > 1 && (
              <div className="mt-14 flex flex-col items-center justify-center gap-5 md:flex-row">
                <button
                  onClick={() =>
                    irAPagina(pagination.page - 1)
                  }
                  disabled={pagination.page <= 1}
                  className="btn-ghost px-6 py-3 text-sm"
                >
                  Anterior
                </button>

                <div className="rounded-full border border-champagne/70 bg-white/35 px-6 py-3 backdrop-blur-sm">
                  <span className="font-body text-sm text-tinta/65">
                    Página{' '}
                    <span className="font-medium text-vino">
                      {pagination.page}
                    </span>{' '}
                    de{' '}
                    <span className="font-medium text-vino">
                      {pagination.total_pages}
                    </span>{' '}
                    · {pagination.total} archivos
                  </span>
                </div>

                <button
                  onClick={() =>
                    irAPagina(pagination.page + 1)
                  }
                  disabled={
                    pagination.page >=
                    pagination.total_pages
                  }
                  className="btn-ghost px-6 py-3 text-sm"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
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