import { Play, EyeOff, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export function ArchivoCard({ archivo, onAbrir, onEliminar, onToggleVisible }) {
  const { usuario, tienePermiso } = useAuth();

  const esDueno = archivo.usuario_id === usuario?.id;
  const esModerador = tienePermiso('archivos.moderar');
  const puedeEliminar = esDueno || tienePermiso('archivos.eliminar_todos');

  return (
    <div className="group relative overflow-hidden rounded-xl border border-champagne/60 bg-white/50 shadow-suave transition hover:shadow-lg">
      {!archivo.visible && (
        <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-tinta/80 px-2 py-1 font-body text-[10px] text-crema">
          <EyeOff className="h-3 w-3" /> Oculto
        </div>
      )}

      <button
        type="button"
        onClick={() => onAbrir(archivo)}
        className="block aspect-square w-full overflow-hidden bg-arena"
      >
        {archivo.tipo === 'imagen' ? (
          <img
            src={archivo.url}
            alt={archivo.nombre || 'Recuerdo'}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="relative h-full w-full bg-[#e8e2d7]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f7f3eb] to-[#cdbd9a]/40" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <Play
                  className="h-6 w-6 translate-x-0.5 text-black"
                  fill="currentColor"
                />
              </div>
            </div>
          </div>
        )}
      </button>

      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate font-body text-xs font-medium text-tinta">
            {archivo.usuario_nombre || 'Invitado'}
          </p>

          <p className="truncate font-body text-[11px] text-terracota">
            {archivo.etapa_nombre}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
          {esModerador && (
            <button
              type="button"
              onClick={() => onToggleVisible(archivo)}
              title={archivo.visible ? 'Ocultar' : 'Mostrar'}
              className="rounded-full p-1.5 text-tinta/60 transition hover:bg-arena hover:text-vino"
            >
              {archivo.visible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {puedeEliminar && (
            <button
              type="button"
              onClick={() => onEliminar(archivo)}
              title="Eliminar"
              className="rounded-full p-1.5 text-tinta/60 transition hover:bg-terracota/10 hover:text-terracota"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}