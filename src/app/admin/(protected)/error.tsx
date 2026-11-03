"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-border bg-white p-8 text-center">
      <h1 className="font-heading text-xl font-bold text-forest">No se pudo cargar esta sección</h1>
      <p className="mt-2 max-w-md text-sm text-forest/70">
        Puede haber sido una interrupción momentánea de conexión con la base de datos. Intenta de nuevo; si el
        problema persiste, vuelve en unos minutos.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white"
      >
        Reintentar
      </button>
    </div>
  );
}
