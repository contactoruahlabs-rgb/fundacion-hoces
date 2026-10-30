import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-data";
import { Container } from "@/components/site/Container";
import { ButtonLink } from "@/components/site/Button";
import { richTextToHtml } from "@/lib/utils";

export async function generateStaticParams() {
  const programs = await prisma.program.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await prisma.program.findUnique({ where: { slug } });
  if (!program) return {};
  return {
    title: program.name,
    description: program.shortDescription || program.name,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [program, settings] = await Promise.all([
    prisma.program.findUnique({
      where: { slug },
      include: { coverImage: true, gallery: { include: { media: true }, orderBy: { order: "asc" } } },
    }),
    getSiteSettings(),
  ]);

  if (!program || program.status !== "PUBLISHED") notFound();

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <p className="font-subheading text-sm uppercase tracking-wide text-olive">Servicio</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">{program.name}</h1>
        {program.shortDescription && (
          <p className="mt-4 text-lg text-forest/70">{program.shortDescription}</p>
        )}

        {program.coverImage && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={program.coverImage.path}
              alt={program.coverImage.altText || program.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {program.description && (
          <div
            className="prose-content mt-8 text-forest/80"
            dangerouslySetInnerHTML={{ __html: richTextToHtml(program.description) }}
          />
        )}

        {program.targetAudience && (
          <section className="mt-8 rounded-2xl bg-surface-muted p-6">
            <h2 className="font-subheading text-base text-forest">¿A quiénes está dirigido?</h2>
            <p className="mt-2 text-sm text-forest/80">{program.targetAudience}</p>
          </section>
        )}

        {program.objectives && (
          <section className="mt-6">
            <h2 className="font-heading text-xl font-bold text-forest">Objetivos</h2>
            <div
              className="prose-content mt-3 text-forest/80"
              dangerouslySetInnerHTML={{ __html: richTextToHtml(program.objectives) }}
            />
          </section>
        )}

        {program.activities && (
          <section className="mt-6">
            <h2 className="font-heading text-xl font-bold text-forest">Actividades</h2>
            <div
              className="prose-content mt-3 text-forest/80"
              dangerouslySetInnerHTML={{ __html: richTextToHtml(program.activities) }}
            />
          </section>
        )}

        {program.gallery.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-xl font-bold text-forest">Galería</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {program.gallery.map((g) => (
                <div key={g.id} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={g.media.path}
                    alt={g.media.altText || program.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <ButtonLink href={program.ctaLink || `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}>
            {program.ctaLabel}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
