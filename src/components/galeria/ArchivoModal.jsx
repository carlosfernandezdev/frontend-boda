import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Calendar, Camera, User, Clock, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatFecha, formatBytes } from '../../utils/format.js';

/**
 * Modal de detalle. Muestra el archivo grande + su metadata.
 *
 * - El botón principal descarga la foto/video al dispositivo.
 * - Si moderadores/dueños cambian la etapa, se guarda automáticamente
 *   al cerrar el modal (ya no hay botón "Guardar").
 *
 * Se renderiza con un Portal directo al <body> para que ningún ancestro
 * con filter / transform lo descentre de la pantalla.
 */
export function ArchivoModal({ archivo, etapas, onCerrar, onReasignarEtapa }) {
  const { usuario, tienePermiso } = useAuth();
  const [etapaSel, setEtapaSel] = useState(archivo?.etapa_id ?? '');
  const [descargando, setDescargando] = useState(false);

  const esDueno = archivo?.usuario_id === usuario?.id;
  const puedeEditar = esDueno || tienePermiso('archivos.editar_todos');

  // Cierra el modal guardando primero la etapa si cambió
  const cerrar = () => {
    if (puedeEditar && archivo) {
      const original = archivo.etapa_id ?? '';
      if (String(etapaSel) !== String(original)) {
        const nuevaEtapa = etapaSel === '' ? null : Number(etapaSel);
        onReasignarEtapa(archivo, nuevaEtapa);
      }
    }
    onCerrar();
  };

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && cerrar();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Bloquear scroll del fondo mientras el modal está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!archivo) return null;

  const meta = archivo.metadata || {};

  const descargar = async () => {
    setDescargando(true);
    try {
      // Necesita CORS habilitado en el bucket R2 para poder leer el binario
      const res = await fetch(archivo.url, { mode: 'cors', cache: 'no-store' });
      const blob = await res.blob();
      const nombre = archivo.nombre || 'recuerdo';
      const file = new File([blob], nombre, { type: blob.type });

      // MÓVIL: hoja de compartir nativa -> permite "Guardar en Fotos"
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: nombre });
          return;
        } catch (e) {
          // Si el usuario cancela la hoja, no hacemos nada más
          if (e?.name === 'AbortError') return;
          // Si share falla por otro motivo, caemos a la descarga normal
        }
      }

      // ESCRITORIO (o sin Web Share): descarga al folder de Descargas
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Último recurso si el fetch falla (CORS sin configurar):
      // abre el archivo en una pestaña para guardarlo manualmente
      window.open(archivo.url, '_blank', 'noopener');
    } finally {
      setDescargando(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-tinta/70 p-4 backdrop-blur-sm"
      onClick={cerrar}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-crema shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media */}
        <div className="flex flex-1 items-center justify-center bg-tinta/95 p-2">
          {archivo.tipo === 'imagen' ? (
            <img
              src={archivo.url}
              className="max-h-[80vh] w-auto object-contain"
            />
          ) : (
            <video
              src={archivo.url}
              controls
              autoPlay
              className="max-h-[80vh] w-full"
            />
          )}
        </div>

        {/* Panel de info */}
        <div className="w-full overflow-y-auto p-6 md:w-80">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="font-display text-2xl text-vino">Detalle</h3>
            <button
              onClick={cerrar}
              className="rounded-full p-1.5 text-tinta/50 transition hover:bg-arena hover:text-vino"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <dl className="space-y-3 font-body text-sm">
            <Info icon={User} label="Subido por" valor={archivo.usuario_nombre} />
            <Info
              icon={Calendar}
              label="Tomada"
              valor={archivo.tomada_en ? formatFecha(archivo.tomada_en) : 'Sin fecha'}
            />
            <Info icon={Clock} label="Subida" valor={formatFecha(archivo.created_at)} />
            {meta.camara && <Info icon={Camera} label="Cámara" valor={meta.camara} />}
            {meta.gps && (
              <Info
                icon={MapPin}
                label="Ubicación"
                valor={
                  <a
                    href={`https://maps.google.com/?q=${meta.gps.lat},${meta.gps.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-terracota hover:underline"
                  >
                    Ver en mapa
                  </a>
                }
              />
            )}
          </dl>

          {/* Descargar */}
          <button
            onClick={descargar}
            disabled={descargando}
            className="btn-primary mt-6 w-full"
          >
            <Download className="h-4 w-4" />
            {descargando ? 'Descargando…' : 'Descargar'}
          </button>

          {/* Reasignar etapa — se guarda sola al cerrar */}
          {puedeEditar && (
            <div className="mt-6 border-t border-champagne/60 pt-4">
              <label className="label-base">Etapa</label>
              <select
                value={etapaSel}
                onChange={(e) => setEtapaSel(e.target.value)}
                className="w-full rounded-lg border border-champagne bg-white/60 px-3 py-2 font-body text-sm outline-none focus:border-terracota"
              >
                <option value="">Sin etapa</option>
                {etapas.map((et) => (
                  <option key={et.id} value={et.id}>
                    {et.nombre}
                  </option>
                ))}
              </select>
              <p className="mt-2 font-body text-xs text-tinta/40">
                Los cambios se guardan al cerrar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function Info({ icon: Icon, label, valor }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-1.5 text-tinta/50">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </dt>
      <dd className="text-right font-medium text-tinta">{valor}</dd>
    </div>
  );
}