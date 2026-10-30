import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { Eyebrow } from "@/components/site/Eyebrow";
import { SeedClusterOrnament } from "@/components/site/BrandOrnament";

export const metadata: Metadata = {
  title: "Directorio",
  description: "Conoce al directorio de Fundación HOCES.",
};

export default async function DirectorioPage() {
  const members = await prisma.teamMember.findMany({
    where: { status: "PUBLISHED", group: "DIRECTORIO" },
    orderBy: { order: "asc" },
    include: { photo: true },
  });

  return (
    <div className="relative overflow-hidden py-16 sm:py-20">
      <SeedClusterOrnament className="pointer-events-none absolute -right-10 top-10 hidden h-48 w-48 text-sage/30 lg:block" />
      <Container className="relative max-w-5xl">
        <Eyebrow>Directorio</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">
          Directorio de Fundación HOCES
        </h1>
        <p className="mt-4 max-w-2xl text-forest/70">
          Las personas que integran el directorio de la fundación.
        </p>

        {members.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Estamos completando esta sección"
              description="Muy pronto publicaremos la información del directorio."
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
              >
                {m.showPhoto && m.photo ? (
                  <div className="relative h-40 w-40 overflow-hidden rounded-full">
                    <Image src={m.photo.path} alt={m.photo.altText || m.name} fill className="object-cover" sizes="160px" />
                  </div>
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-full bg-sage/20 font-heading text-3xl text-olive">
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
                <h2 className="mt-5 font-subheading text-lg text-forest">{m.name}</h2>
                <p className="text-sm font-medium text-olive">{m.role}</p>
                {m.bio && <p className="mt-3 text-sm text-forest/80">{m.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
