import { useAuth } from '../../context/AuthContext.jsx';

export function FiltrosBar({ filtros, setFiltros, etapas }) {
  const { tienePermiso } = useAuth();
  const esModerador = tienePermiso('archivos.moderar');

  const set = (campo, valor) =>
    setFiltros((f) => ({ ...f, [campo]: valor, page: 1 }));

  return (
    <div className="mb-6 w-full space-y-3">
      {/* Tipo */}
      <div className="flex w-full justify-center">
        <div className="inline-flex max-w-full rounded-full border border-champagne bg-white/50 p-1 backdrop-blur-sm">
          {[
            { val: '', label: 'Todo' },
            { val: 'imagen', label: 'Fotos' },
            { val: 'video', label: 'Videos' },
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => set('tipo', opt.val)}
              className={`min-w-0 flex-1 rounded-full px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] transition sm:flex-none sm:text-sm ${
                filtros.tipo === opt.val
                  ? 'bg-vino text-crema shadow-sm'
                  : 'text-tinta/60 hover:text-vino'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Etapa */}
      <select
        value={filtros.etapa_id}
        onChange={(e) => set('etapa_id', e.target.value)}
        className="w-full rounded-full border border-champagne bg-white/50 px-5 py-3 font-body text-sm text-tinta outline-none backdrop-blur-sm transition focus:border-terracota sm:w-auto"
      >
        <option value="">Todas las etapas</option>
        {etapas.map((et) => (
          <option key={et.id} value={et.id}>
            {et.nombre}
          </option>
        ))}
        <option value="sin_etapa">Sin etapa</option>
      </select>

      {/* Checks */}
      <div className="grid w-full grid-cols-2 gap-3">
        <label className="flex min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-champagne/70 bg-white/50 px-3 py-3 text-center font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-tinta/70 backdrop-blur-sm transition hover:border-terracota hover:bg-arena/40 sm:text-sm">
          <input
            type="checkbox"
            checked={filtros.solo_mios}
            onChange={(e) => set('solo_mios', e.target.checked)}
            className="h-4 w-4 shrink-0 accent-terracota"
          />
          <span className="truncate">Solo míos</span>
        </label>

        {esModerador && (
          <label className="flex min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-champagne/70 bg-white/50 px-3 py-3 text-center font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-tinta/70 backdrop-blur-sm transition hover:border-terracota hover:bg-arena/40 sm:text-sm">
            <input
              type="checkbox"
              checked={filtros.ver_ocultos}
              onChange={(e) => set('ver_ocultos', e.target.checked)}
              className="h-4 w-4 shrink-0 accent-terracota"
            />
            <span className="truncate">Ver ocultos</span>
          </label>
        )}
      </div>
    </div>
  );
}