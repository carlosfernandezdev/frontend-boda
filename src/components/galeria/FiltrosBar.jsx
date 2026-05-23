import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Barra de filtros. Recibe el estado de filtros y un setter.
 * Filtros: tipo, etapa, solo míos, (moderadores) ver ocultos.
 */
export function FiltrosBar({ filtros, setFiltros, etapas }) {
  const { tienePermiso } = useAuth();
  const esModerador = tienePermiso('archivos.moderar');

  const set = (campo, valor) =>
    setFiltros((f) => ({ ...f, [campo]: valor, page: 1 }));

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Tipo */}
      <div className="flex rounded-full border border-champagne bg-white/50 p-1">
        {[
          { val: '', label: 'Todo' },
          { val: 'imagen', label: 'Fotos' },
          { val: 'video', label: 'Videos' },
        ].map((opt) => (
          <button
            key={opt.val}
            onClick={() => set('tipo', opt.val)}
            className={`rounded-full px-4 py-1.5 font-body text-sm transition ${
              filtros.tipo === opt.val
                ? 'bg-vino text-crema'
                : 'text-tinta/60 hover:text-vino'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Etapa */}
      <select
        value={filtros.etapa_id}
        onChange={(e) => set('etapa_id', e.target.value)}
        className="rounded-full border border-champagne bg-white/50 px-4 py-2 font-body text-sm text-tinta outline-none transition focus:border-terracota"
      >
        <option value="">Todas las etapas</option>
        {etapas.map((et) => (
          <option key={et.id} value={et.id}>
            {et.nombre}
          </option>
        ))}
        <option value="sin_etapa">Sin etapa</option>
      </select>

      {/* Solo míos */}
      <label className="flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-champagne/70 bg-white/50 px-4 py-2 text-center font-body text-sm text-tinta/70 backdrop-blur-sm transition hover:border-terracota hover:bg-arena/40 sm:w-auto">
        <input
          type="checkbox"
          checked={filtros.solo_mios}
          onChange={(e) => set('solo_mios', e.target.checked)}
          className="accent-terracota"
        />
        Solo míos
      </label>

      {/* Ver ocultos (solo moderadores) */}
      {esModerador && (
        <label className="flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-champagne/70 bg-white/50 px-4 py-2 text-center font-body text-sm text-tinta/70 backdrop-blur-sm transition hover:border-terracota hover:bg-arena/40 sm:w-auto">
          <input
            type="checkbox"
            checked={filtros.ver_ocultos}
            onChange={(e) => set('ver_ocultos', e.target.checked)}
            className="accent-terracota"
          />
          Ver ocultos
        </label>
      )}
    </div>
  );
}
