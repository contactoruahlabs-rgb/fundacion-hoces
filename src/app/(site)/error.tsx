"use client";

import { Container } from "@/components/site/Container";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-24">
      <Container className="flex max-w-xl flex-col items-center text-center">
        <h1 className="font-heading text-2xl font-bold text-forest">Algo no cargó correctamente</h1>
        <p className="mt-3 text-sm text-forest/70">
          Tuvimos una interrupción momentánea. Por favor intenta de nuevo.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
      </Container>
    </div>
  );
}
