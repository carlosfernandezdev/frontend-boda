/**
 * Formatea bytes a una unidad legible.
 */
export const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

/**
 * Formatea una fecha ISO a algo legible en español.
 * Devuelve '—' si no hay fecha (archivos sin metadata).
 */
export const formatFecha = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Solo la fecha (sin hora).
 */
export const formatSoloFecha = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Rango legible de una etapa: "20 jun, 17:00 – 18:30" o cruzando días.
 */
export const formatRango = (inicioIso, finIso) => {
  const ini = new Date(inicioIso);
  const fin = new Date(finIso);
  if (isNaN(ini.getTime()) || isNaN(fin.getTime())) return '—';

  const fecha = (d) =>
    d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' });
  const hora = (d) =>
    d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });

  const mismoDia = ini.toDateString() === fin.toDateString();
  if (mismoDia) {
    return `${fecha(ini)} · ${hora(ini)} – ${hora(fin)}`;
  }
  return `${fecha(ini)} ${hora(ini)} – ${fecha(fin)} ${hora(fin)}`;
};

/**
 * Convierte un ISO (del backend) al formato que espera <input type="datetime-local">,
 * que es "YYYY-MM-DDTHH:MM" en hora LOCAL del navegador.
 */
export const isoADatetimeLocal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  // Ajustamos por el offset local para que el input muestre la hora local
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

/**
 * Convierte el valor de <input type="datetime-local"> a ISO con la zona local
 * del navegador. El backend lo guarda como TIMESTAMPTZ (lo normaliza a UTC).
 */
export const datetimeLocalAIso = (valor) => {
  if (!valor) return null;
  const d = new Date(valor); // el navegador lo interpreta en hora local
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};
