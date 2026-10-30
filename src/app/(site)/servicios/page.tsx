import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { Eyebrow } from "@/components/site/Eyebrow";
import { ProgramCard } from "@/components/site/ProgramCard";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Conoce los programas y servicios de Fundación HOCES: Psicología Clínica, Terapia Ocupacional, Fonoaudiología, Educación Diferencial, Psicopedagogía, Acondicionamiento Físico y Asistencia Social.",
};

export default async function ServiciosPage() {
  const programs = await prisma.program.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: { coverImage: true },
  });

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <Eyebrow>Servicios</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">
          Programas y servicios
        </h1>
        <p className="mt-4 max-w-2xl text-forest/70">
          Trabajamos de forma interdisciplinaria: distintas profesionales participan en el proceso de
          cada persona, con consejos clínicos periódicos para evaluar avances y ajustar las terapias.
        </p>

        {programs.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Estamos publicando esta sección"
              description="Muy pronto encontrarás aquí el detalle de todos nuestros servicios."
            />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {programs.map((p) => (
              <ProgramCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                coverImage={p.coverImage}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
