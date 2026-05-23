import { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { archivosApi } from '../../api/archivos.js';
import { getErrorMessage } from '../../api/client.js';

const MIMES_OK = [
  'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif',
  'video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm',
];

/**
 * Zona de carga. Sube los archivos uno por uno (el backend acepta uno por request)
 * y muestra el progreso individual. Al terminar todos, llama onComplete().
 */
export function SubirArchivo({ onComplete }) {
  const [arrastrando, setArrastrando] = useState(false);
  const [items, setItems] = useState([]); // { id, nombre, estado, progreso, error }
  const [subiendo, setSubiendo] = useState(false);
  const inputRef = useRef(null);

  const procesarArchivos = useCallback(
    async (fileList) => {
      const files = Array.from(fileList).filter((f) => MIMES_OK.includes(f.type));
      if (files.length === 0) return;

      setSubiendo(true);

      // Inicializar items en estado "pendiente"
      const nuevos = files.map((file, i) => ({
        id: `${Date.now()}-${i}`,
        file,
        nombre: file.name,
        estado: 'pendiente',
        progreso: 0,
        error: null,
      }));
      setItems((prev) => [...prev, ...nuevos]);

      // Subir secuencialmente
      for (const item of nuevos) {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, estado: 'subiendo' } : it))
        );
        try {
          await archivosApi.subir(item.file, {
            onProgress: (p) =>
              setItems((prev) =>
                prev.map((it) => (it.id === item.id ? { ...it, progreso: p } : it))
              ),
          });
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, estado: 'ok', progreso: 100 } : it
            )
          );
        } catch (err) {
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? { ...it, estado: 'error', error: getErrorMessage(err) }
                : it
            )
          );
        }
      }

      setSubiendo(false);
      onComplete?.();
    },
    [onComplete]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setArrastrando(false);
    procesarArchivos(e.dataTransfer.files);
  };

  const limpiarCompletados = () =>
    setItems((prev) => prev.filter((it) => it.estado !== 'ok'));

  return (
    <div className="mb-8">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          arrastrando
            ? 'border-terracota bg-terracota/5'
            : 'border-champagne bg-white/40 hover:border-terracota/50 hover:bg-white/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={MIMES_OK.join(',')}
          className="hidden"
          onChange={(e) => {
            procesarArchivos(e.target.files);
            e.target.value = ''; // permitir re-seleccionar el mismo archivo
          }}
        />
        <UploadCloud className="mx-auto mb-3 h-10 w-10 text-terracota" strokeWidth={1.5} />
        <p className="font-display text-xl text-vino">
          Arrastra tus fotos y videos acá
        </p>
        <p className="mt-1 font-body text-sm text-tinta/50">
          o haz click para elegir · imágenes y videos 
        </p>
      </div>

      {/* Lista de progreso */}
      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-3 rounded-lg border border-champagne bg-white/50 px-4 py-2.5"
            >
              <span className="flex-shrink-0">
                {it.estado === 'ok' && <CheckCircle2 className="h-5 w-5 text-oliva" />}
                {it.estado === 'error' && <AlertCircle className="h-5 w-5 text-terracota" />}
                {(it.estado === 'subiendo' || it.estado === 'pendiente') && (
                  <Loader2 className="h-5 w-5 animate-spin text-champagne" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm text-tinta">{it.nombre}</p>
                {it.estado === 'subiendo' && (
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-arena">
                    <div
                      className="h-full bg-terracota transition-all"
                      style={{ width: `${it.progreso}%` }}
                    />
                  </div>
                )}
                {it.estado === 'error' && (
                  <p className="font-body text-xs text-terracota">{it.error}</p>
                )}
              </div>
            </div>
          ))}

          {!subiendo && items.some((it) => it.estado === 'ok') && (
            <button
              onClick={limpiarCompletados}
              className="flex items-center gap-1 font-body text-xs text-tinta/50 hover:text-vino"
            >
              <X className="h-3 w-3" /> Limpiar completados
            </button>
          )}
        </div>
      )}
    </div>
  );
}
