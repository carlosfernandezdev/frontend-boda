import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { isoADatetimeLocal, datetimeLocalAIso } from '../../utils/format.js';

/**
 * Modal de formulario para crear o editar una etapa.
 * Si recibe `etapa`, está en modo edición; si no, modo creación.
 * Llama a onGuardar(datos) con { nombre, descripcion, inicio, fin } en ISO.
 */
export function EtapaForm({ etapa, onGuardar, onCerrar, guardando, error }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    inicio: '',
    fin: '',
  });

  // Precargar datos si es edición
  useEffect(() => {
    if (etapa) {
      setForm({
        nombre: etapa.nombre || '',
        descripcion: etapa.descripcion || '',
        inicio: isoADatetimeLocal(etapa.inicio),
        fin: isoADatetimeLocal(etapa.fin),
      });
    }
  }, [etapa]);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCerrar]);

  const setCampo = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  // Validación en vivo: fin debe ser posterior a inicio
  const rangoInvalido =
    form.inicio && form.fin && new Date(form.fin) <= new Date(form.inicio);
  const puedeGuardar =
    form.nombre.trim() && form.inicio && form.fin && !rangoInvalido && !guardando;

  const onSubmit = () => {
    if (!puedeGuardar) return;
    onGuardar({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      inicio: datetimeLocalAIso(form.inicio),
      fin: datetimeLocalAIso(form.fin),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/70 p-4 backdrop-blur-sm"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-crema p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <h3 className="font-display text-3xl text-vino">
            {etapa ? 'Editar etapa' : 'Nueva etapa'}
          </h3>
          <button
            onClick={onCerrar}
            className="rounded-full p-1.5 text-tinta/50 transition hover:bg-arena hover:text-vino"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-terracota/30 bg-terracota/10 px-4 py-3 text-sm text-vino">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="label-base" htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              className="input-base"
              value={form.nombre}
              onChange={setCampo('nombre')}
              placeholder="Ceremonia, Recepción, Fiesta…"
              autoFocus
            />
          </div>

          <div>
            <label className="label-base" htmlFor="descripcion">Descripción (opcional)</label>
            <input
              id="descripcion"
              type="text"
              className="input-base"
              value={form.descripcion}
              onChange={setCampo('descripcion')}
              placeholder="Un detalle del momento"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-base" htmlFor="inicio">Inicio</label>
              <input
                id="inicio"
                type="datetime-local"
                className="input-base"
                value={form.inicio}
                onChange={setCampo('inicio')}
              />
            </div>
            <div>
              <label className="label-base" htmlFor="fin">Fin</label>
              <input
                id="fin"
                type="datetime-local"
                className="input-base"
                value={form.fin}
                onChange={setCampo('fin')}
              />
            </div>
          </div>

          {rangoInvalido && (
            <p className="text-sm text-terracota">
              El fin debe ser posterior al inicio.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCerrar} className="btn-ghost px-5 py-2 text-sm">
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="btn-primary px-5 py-2 text-sm"
            disabled={!puedeGuardar}
          >
            {guardando ? 'Guardando…' : etapa ? 'Guardar cambios' : 'Crear etapa'}
          </button>
        </div>
      </div>
    </div>
  );
}
