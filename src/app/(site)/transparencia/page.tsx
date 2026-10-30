import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-data";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { Eyebrow } from "@/components/site/Eyebrow";

export const metadata: Metadata = {
  title: "Transparencia",
  description: "Memorias anuales, informes de gestión y documentos de transparencia de Fundación HOCES.",
};

const CATEGORY_LABELS: Record<string, string> = {
  MEMORIA_ANUAL: "Memoria anual",
  INFORME_GESTION: "Informe de gestión",
  TRANSPARENCIA: "Transparencia",
  OTRO: "Documento",
};

export default async function TransparenciaPage() {
  const [documents, settings] = await Promise.all([
    prisma.document.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ year: "desc" }, { order: "asc" }],
      include: { coverImage: true },
    }),
    getSiteSettings(),
  ]);

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-4xl">
        <Eyebrow>Transparencia</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">
          Transparencia institucional
        </h1>
        <p className="mt-4 text-forest/70">
          {settings.legalName} — RUT {settings.rut} · Representante legal: {settings.legalRepresentative}
        </p>

        {documents.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Aún no hay documentos publicados"
              description="Fundación HOCES inició actividades en 2025. Aquí publicaremos nuestras memorias anuales e informes de gestión a medida que se vayan generando."
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex gap-4 rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
                {doc.coverImage ? (
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image src={doc.coverImage.path} alt={doc.coverImage.altText || doc.title} fill className="object-cover" sizes="80px" />
                  </div>
                ) : (
                  <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-xs text-forest/50">
                    PDF
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-olive">
                    {CATEGORY_LABELS[doc.category]} · {doc.year}
                  </p>
                  <h2 className="mt-1 font-subheading text-base text-forest">{doc.title}</h2>
                  {doc.description && <p className="mt-1 text-sm text-forest/70">{doc.description}</p>}
                  <div className="mt-3 flex gap-4 text-sm font-semibold">
                    <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="text-olive hover:underline">
                      Consultar
                    </a>
                    <a href={doc.filePath} download className="text-olive hover:underline">
                      Descargar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
