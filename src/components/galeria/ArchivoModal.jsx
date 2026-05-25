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
className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/70 p-3 backdrop-blur-sm md:p-4"      onClick={cerrar}
    >
      <div
className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-crema shadow-2xl md:max-h-[90vh] md:flex-row"        onClick={(e) => e.stopPropagation()}
      >
        {/* Media */}
        <div className="flex items-center justify-center bg-tinta/95">
          {archivo.tipo === 'imagen' ? (
            <img
              src={archivo.url}
              className="h-auto max-h-[65vh] w-full object-contain md:max-h-[80vh]"
            />
          ) : (
            <video
              src={archivo.url}
              controls
              autoPlay
              className="h-auto max-h-[65vh] w-full object-contain md:max-h-[80vh]"
            />
          )}
        </div>

        {/* Panel de info */}
        <div className="w-full p-5 md:w-80 md:overflow-y-auto md:p-6">
          <div className="mb-6 flex justify-end">
  <button
    onClick={cerrar}
    className="
      flex h-11 w-11 items-center justify-center
      rounded-full
      bg-white/70
      shadow-sm
      backdrop-blur-md
      text-tinta/55
      transition
      hover:scale-105
      hover:bg-white
      hover:text-vino
    "
  >
    <X className="h-5 w-5" />
  </button>
          </div>

          <dl className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 font-body text-sm">
            <Info icon={User} label="Subido por" valor={archivo.usuario_nombre} />
            
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
          <div className="mt-7 flex justify-center">
  <button
    onClick={descargar}
    disabled={descargando}
    className="
      flex items-center justify-center gap-2
      rounded-full
      bg-[#3f4438]
      px-7 py-3
      text-sm font-semibold text-white
      shadow-lg
      transition
      hover:scale-[1.02]
      hover:bg-[#2f3428]
    "
  >
            <Download className="h-4 w-4" />
            {descargando ? 'Descargando…' : 'Descargar'}
          </button>
          </div>

          
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