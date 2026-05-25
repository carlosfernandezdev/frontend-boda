import { useAuth } from '../../context/AuthContext.jsx';

export function FiltrosBar({ filtros, setFiltros, etapas }) {
  const { tienePermiso } = useAuth();
  const esModerador = tienePermiso('archivos.moderar');

  const set = (campo, valor) =>
    setFiltros((f) => ({ ...f, [campo]: valor, page: 1 }));

  return (
    <div className="w-full rounded-[2rem] border border-white/60 bg-white/65 p-4 shadow-sm backdrop-blur-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Tipo */}
        <div className="flex justify-center lg:justify-start">
          <div className="inline-flex rounded-full border border-black/10 bg-white/80 p-1 shadow-sm">
            {[
              { val: '', label: 'Todo' },
              { val: 'imagen', label: 'Fotos' },
              { val: 'video', label: 'Videos' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => set('tipo', opt.val)}
                className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition sm:text-sm ${
                  filtros.tipo === opt.val
                    ? 'bg-[#3f4438] text-white shadow-sm'
                    : 'text-black/55 hover:bg-black/5 hover:text-black'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Etapa */}
        <div className="relative w-full lg:max-w-xs">
          <select
            value={filtros.etapa_id}
            onChange={(e) => set('etapa_id', e.target.value)}
            className="
              h-12
              w-full
              appearance-none
              rounded-full
              border border-black/10
              bg-white/85
              px-5
              pr-12
              text-sm
              font-semibold
              text-black/65
              shadow-sm
              outline-none
              backdrop-blur-md
              transition
              focus:border-[#3f4438]/40
              focus:ring-4
              focus:ring-[#3f4438]/10
            "
          >
            <option value="">Todas las etapas</option>

            {etapas.map((et) => (
              <option key={et.id} value={et.id}>
                {et.nombre}
              </option>
            ))}

            <option value="sin_etapa">Sin etapa</option>
          </select>

          <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs text-black/40">
            ▼
          </span>
        </div>

        {/* Checks */}
        <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55 shadow-sm transition hover:bg-white sm:text-sm">
            <input
              type="checkbox"
              checked={filtros.solo_mios}
              onChange={(e) => set('solo_mios', e.target.checked)}
              className="h-4 w-4 shrink-0 accent-[#3f4438]"
            />
            <span className="truncate">Solo míos</span>
          </label>

          {esModerador && (
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55 shadow-sm transition hover:bg-white sm:text-sm">
              <input
                type="checkbox"
                checked={filtros.ver_ocultos}
                onChange={(e) => set('ver_ocultos', e.target.checked)}
                className="h-4 w-4 shrink-0 accent-[#3f4438]"
              />
              <span className="truncate">Ver ocultos</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}