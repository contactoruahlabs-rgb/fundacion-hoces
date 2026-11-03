import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { Eyebrow } from "@/components/site/Eyebrow";
import { SeedClusterOrnament } from "@/components/site/BrandOrnament";

export const metadata: Metadata = {
  title: "Equipo",
  description: "Conoce al equipo de profesionales de Fundación HOCES.",
};

export default async function EquipoPage() {
  const members = await prisma.teamMember.findMany({
    where: { status: "PUBLISHED", group: "EQUIPO" },
    orderBy: { order: "asc" },
    include: { photo: true },
  });

  return (
    <div className="relative overflow-hidden py-16 sm:py-20">
      <SeedClusterOrnament className="pointer-events-none absolute -right-10 top-10 hidden h-48 w-48 text-sage/30 lg:block" />
      <Container className="relative max-w-5xl">
        <Eyebrow>Equipo</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">
          Profesionales que acompañan a cada familia
        </h1>
        <p className="mt-4 max-w-2xl text-forest/70">
          Todas nuestras profesionales cuentan con más de 10 años de experiencia y trabajan también en
          educación, en programas especiales de colegios públicos y privados.
        </p>

        {members.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Estamos completando esta sección"
              description="Muy pronto publicaremos la información de nuestro equipo de profesionales."
            />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex flex-col items-center rounded-2xl border border-border bg-white p-3 text-center transition-shadow hover:shadow-md sm:items-start sm:p-6 sm:text-left"
              >
                {m.showPhoto && m.photo ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-full sm:h-40 sm:w-40">
                    <Image src={m.photo.path} alt={m.photo.altText || m.name} fill className="object-cover" sizes="(max-width: 640px) 80px, 160px" />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage/20 font-heading text-xl text-olive sm:h-40 sm:w-40 sm:text-3xl">
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
                <h2 className="mt-3 font-subheading text-sm text-forest sm:mt-5 sm:text-lg">{m.name}</h2>
                <p className="text-xs font-medium text-olive sm:text-sm">{m.role}</p>
                {m.experienceYears != null && (
                  <p className="mt-1 text-[11px] text-forest/60 sm:text-xs">{m.experienceYears} años de experiencia</p>
                )}
                {m.bio && <p className="mt-3 hidden text-sm text-forest/80 sm:block">{m.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
