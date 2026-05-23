import { useState, useEffect, useCallback } from 'react';

import {
  Plus,
  Pencil,
  Trash2,
  CalendarClock,
  Loader2,
} from 'lucide-react';

import { etapasApi } from '../api/etapas.js';
import { getErrorMessage } from '../api/client.js';
import { formatRango } from '../utils/format.js';

import { EtapaForm } from '../components/etapas/EtapaForm.jsx';

export function EtapasPage() {
  const [etapas, setEtapas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState(null);

  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  // =========================
  // Cargar etapas
  // =========================

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const data = await etapasApi.listar();
      setEtapas(data.etapas || []);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'No pudimos cargar las etapas'
        )
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // =========================
  // Modal
  // =========================

  const abrirCrear = () => {
    setEditando(null);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const abrirEditar = (etapa) => {
    setEditando(etapa);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const cerrarForm = () => {
    if (guardando) return;

    setFormAbierto(false);
    setEditando(null);
    setErrorForm(null);
  };

  // =========================
  // Guardar
  // =========================

  const guardar = async (datos) => {
    setGuardando(true);
    setErrorForm(null);

    try {
      if (editando) {
        await etapasApi.actualizar(editando.id, datos);
      } else {
        await etapasApi.crear(datos);
      }

      setFormAbierto(false);
      setEditando(null);

      await cargar();
    } catch (err) {
      setErrorForm(
        getErrorMessage(
          err,
          'No se pudo guardar la etapa'
        )
      );
    } finally {
      setGuardando(false);
    }
  };

  // =========================
  // Eliminar
  // =========================

  const eliminar = async (etapa) => {
    if (
      !confirm(
        `¿Eliminar la etapa "${etapa.nombre}"?`
      )
    ) {
      return;
    }

    try {
      await etapasApi.eliminar(etapa.id);

      setEtapas((prev) =>
        prev.filter((e) => e.id !== etapa.id)
      );
    } catch (err) {
      alert(
        getErrorMessage(
          err,
          'No se pudo eliminar la etapa'
        )
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      {/* Fondo Jane & Guille */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,191,168,0.38),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(111,30,52,0.15),transparent_38%),linear-gradient(180deg,#fffaf4_0%,#f7efe7_45%,#ead8c8_100%)]" />

      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-vino/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-terracota/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl animate-fade-up">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="subtitle-romantic">
              El cronograma
            </p>

            <div className="divider-romantic ml-0" />

            <h1 className="font-display text-[4rem] leading-none text-vino md:text-[5.5rem]">
              Etapas
            </h1>

            <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-tinta/65">
              Organiza cada momento de la celebración para que
              las fotos y videos queden agrupados según cada
              etapa del evento.
            </p>
          </div>

          <button
            onClick={abrirCrear}
            className="btn-primary flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            Nueva etapa
          </button>
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
        ) : etapas.length === 0 ? (
          <div className="section-romantic mx-auto flex max-w-xl flex-col items-center py-20 text-center">
            <CalendarClock
              className="h-14 w-14 text-champagne"
              strokeWidth={1.5}
            />

            <h2 className="mt-5 font-display text-4xl text-vino">
              Todavía no hay etapas
            </h2>

            <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-tinta/55">
              Crea las etapas para organizar los recuerdos
              según cada momento especial del evento.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {etapas.map((etapa, i) => (
              <div
                key={etapa.id}
                className="section-romantic flex flex-col gap-5 p-5 transition duration-300 hover:scale-[1.01] md:flex-row md:items-center"
              >
                {/* Número */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-champagne/70 bg-vino text-center font-display text-2xl text-crema shadow-lg">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-3xl text-vino">
                    {etapa.nombre}
                  </h3>

                  <p className="mt-1 font-body text-sm text-terracota">
                    {formatRango(
                      etapa.inicio,
                      etapa.fin
                    )}
                  </p>

                  {etapa.descripcion && (
                    <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-tinta/65">
                      {etapa.descripcion}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:ml-auto">
                  <button
                    onClick={() => abrirEditar(etapa)}
                    title="Editar"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/70 bg-white/40 text-tinta/65 transition hover:border-terracota hover:bg-arena hover:text-vino"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => eliminar(etapa)}
                    title="Eliminar"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/70 bg-white/40 text-tinta/65 transition hover:border-terracota hover:bg-terracota/10 hover:text-terracota"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {formAbierto && (
          <EtapaForm
            etapa={editando}
            onGuardar={guardar}
            onCerrar={cerrarForm}
            guardando={guardando}
            error={errorForm}
          />
        )}
      </div>
    </div>
  );
}