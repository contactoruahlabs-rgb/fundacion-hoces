/**
 * Ornamentos decorativos de marca para Fundación HOCES, inspirados en el motivo
 * del logo (hoz y olivo): una rama de olivo estilizada y un racimo de semillas.
 * Trazo fino, sin relleno — pensados para usarse como detalle de fondo, nunca
 * como contenido informativo (aria-hidden).
 */

export function OliveBranchOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 140C45 110 55 80 50 40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="38" cy="96" rx="14" ry="7" stroke="currentColor" strokeWidth="1.5" transform="rotate(-35 38 96)" />
      <ellipse cx="55" cy="70" rx="14" ry="7" stroke="currentColor" strokeWidth="1.5" transform="rotate(-20 55 70)" />
      <ellipse cx="48" cy="118" rx="14" ry="7" stroke="currentColor" strokeWidth="1.5" transform="rotate(-50 48 118)" />
      <ellipse cx="58" cy="44" rx="12" ry="6" stroke="currentColor" strokeWidth="1.5" transform="rotate(-10 58 44)" />
      <circle cx="62" cy="30" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function SeedClusterOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="30" cy="30" r="22" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="22" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="90" cy="70" r="16" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="85" r="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Franja decorativa fina a modo de "firma visual" bajo imágenes de tarjetas. */
export function PatternStrip({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <polyline
        points="0,16 12,2 24,16 36,2 48,16 60,2 72,16 84,2 96,16 108,2 120,16 132,2 144,16 156,2 168,16 180,2 192,16 200,10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
