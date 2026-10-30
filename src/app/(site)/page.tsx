import Image from "next/image";
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { getAboutContent, getSiteSettings } from "@/lib/site-data";
import { Container } from "@/components/site/Container";
import { ButtonLink } from "@/components/site/Button";
import { Eyebrow } from "@/components/site/Eyebrow";
import { PillarRow } from "@/components/site/PillarRow";
import { ProgramsCarousel } from "@/components/site/ProgramsCarousel";
import { StoryCard } from "@/components/site/StoryCard";
import { OliveBranchOrnament, SeedClusterOrnament } from "@/components/site/BrandOrnament";
import { DonationWidget } from "@/components/site/DonationWidget";
import { richTextToHtml } from "@/lib/utils";

export default async function HomePage() {
  const [blocks, programs, news, about, settings] = await Promise.all([
    prisma.homeBlock.findMany({ where: { visible: true }, orderBy: { order: "asc" }, include: { image: true } }),
    prisma.program.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, include: { coverImage: true } }),
    prisma.newsPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3, include: { coverImage: true } }),
    getAboutContent(),
    getSiteSettings(),
  ]);

  const byType = Object.fromEntries(blocks.map((b) => [b.type, b]));
  const amounts: number[] = JSON.parse(settings.donationSuggestedAmounts || "[]");

  // En la portada mostramos solo el primer párrafo (ya es una idea completa
  // y autocontenida) para no ocupar tanto espacio; el texto completo vive en
  // /quienes-somos.
  const firstParagraph = (text: string) => text.trim().split(/\n\s*\n/)[0] ?? "";

  const pillars: { title: string; children: ReactNode }[] = [];
  if (about.mision) {
    pillars.push({
      title: "Misión",
      children: (
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: richTextToHtml(firstParagraph(about.mision)) }} />
      ),
    });
  }
  if (about.vision) {
    pillars.push({
      title: "Visión",
      children: (
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: richTextToHtml(firstParagraph(about.vision)) }} />
      ),
    });
  }

  return (
    <div>
      {/* ───────────── HERO ───────────── */}
      {byType.HERO && (
        <section className="relative overflow-hidden">
          {byType.HERO.image ? (
            <div className="relative flex min-h-[520px] items-end sm:min-h-[620px]">
              <Image
                src={byType.HERO.image.path}
                alt={byType.HERO.image.altText || ""}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/50 to-forest/10" />
              <Container className="relative w-full pb-16 pt-32 sm:pb-24">
                <Eyebrow tone="white">Fundación HOCES</Eyebrow>
                <h1 className="mt-4 max-w-2xl font-heading text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                  {byType.HERO.title}
                </h1>
                <p className="mt-5 max-w-xl text-lg text-white/90">{byType.HERO.subtitle}</p>
                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  {byType.HERO.ctaLabel && (
                    <ButtonLink href={byType.HERO.ctaLink || "/contacto"} className="w-full justify-center sm:w-auto">
                      {byType.HERO.ctaLabel}
                    </ButtonLink>
                  )}
                  <ButtonLink
                    href="/servicios"
                    className="w-full justify-center !bg-white/10 !text-white ring-1 ring-inset ring-white/40 hover:!bg-white/20 sm:w-auto"
                  >
                    Conocer nuestros servicios
                  </ButtonLink>
                  <ButtonLink href="/donaciones" className="w-full justify-center !bg-pink-500 !text-white hover:!bg-pink-600 sm:w-auto">
                    Donar <span aria-hidden="true" className="text-red-600">❤️</span>
                  </ButtonLink>
                </div>
              </Container>
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-sage/25 via-white to-white">
              <OliveBranchOrnament className="pointer-events-none absolute -right-6 top-10 h-40 w-40 text-sage/70 sm:h-52 sm:w-52" />
              <SeedClusterOrnament className="pointer-events-none absolute -left-4 bottom-6 h-28 w-28 text-olive/40" />
              <Container className="relative flex flex-col items-center gap-6 py-24 text-center sm:py-32">
                <Eyebrow>Fundación HOCES</Eyebrow>
                <h1 className="max-w-3xl font-heading text-4xl font-extrabold text-forest sm:text-5xl lg:text-6xl">
                  {byType.HERO.title}
                </h1>
                <p className="max-w-2xl text-lg text-forest/80">{byType.HERO.subtitle}</p>
                <div className="flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
                  {byType.HERO.ctaLabel && (
                    <ButtonLink href={byType.HERO.ctaLink || "/contacto"} className="w-full justify-center sm:w-auto">
                      {byType.HERO.ctaLabel}
                    </ButtonLink>
                  )}
                  <ButtonLink href="/servicios" variant="ghost" className="w-full justify-center sm:w-auto">
                    Conocer nuestros servicios
                  </ButtonLink>
                  <ButtonLink href="/donaciones" className="w-full justify-center !bg-pink-500 !text-white hover:!bg-pink-600 sm:w-auto">
                    Donar <span aria-hidden="true" className="text-red-600">❤️</span>
                  </ButtonLink>
                </div>
              </Container>
            </div>
          )}
        </section>
      )}

      {/* ───────────── DONACIONES (franja verde, texto blanco, tarjeta blanca) ───────────── */}
      {byType.DONATIONS && (
        <section className="relative overflow-hidden bg-olive py-10 sm:py-14">
          <SeedClusterOrnament className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 text-white/10" />
          <OliveBranchOrnament className="pointer-events-none absolute -bottom-10 -right-6 h-48 w-48 text-white/10" />
          <Container className="relative grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <Eyebrow tone="white">Dona hoy</Eyebrow>
              <h2 className="mt-2 font-heading text-xl font-bold text-white sm:text-3xl">
                {byType.DONATIONS.title}
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">{byType.DONATIONS.subtitle}</p>
              <div className="mt-4">
                <ButtonLink href="/donaciones" className="!bg-white/10 !px-4 !py-2 !text-xs !text-white ring-1 ring-inset ring-white/40 hover:!bg-white/20">
                  Cómo donar →
                </ButtonLink>
              </div>
            </div>

            <DonationWidget amounts={amounts} whatsapp={settings.whatsapp} />
          </Container>
        </section>
      )}

      {/* ───────────── INTRO (franja delgada) ───────────── */}
      {byType.INTRO && (
        <section className="py-5 sm:py-7">
          <Container className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:justify-between sm:gap-8 sm:text-left">
            <div>
              <h2 className="font-heading text-base font-bold text-forest sm:text-xl">{byType.INTRO.title}</h2>
              <p className="mt-1 max-w-2xl text-xs leading-snug text-forest/75 sm:text-sm">{byType.INTRO.body}</p>
            </div>
            {byType.INTRO.ctaLabel && (
              <ButtonLink href={byType.INTRO.ctaLink || "/quienes-somos"} variant="secondary" className="shrink-0 text-xs px-4 py-2">
                {byType.INTRO.ctaLabel}
              </ButtonLink>
            )}
          </Container>
        </section>
      )}

      {/* ───────────── PROGRAMAS (imagen + texto, al estilo editorial) ───────────── */}
      {byType.PROGRAMS && (
        <section className="pt-20 pb-8 sm:pb-10">
          <Container>
            <div className="max-w-xl">
              <Eyebrow>Nuestro trabajo</Eyebrow>
              <h2 className="mt-3 font-heading text-3xl font-bold text-forest sm:text-4xl">
                {byType.PROGRAMS.title}
              </h2>
              <p className="mt-4 text-forest/70">{byType.PROGRAMS.subtitle}</p>
            </div>

            {programs.length > 0 ? (
              <ProgramsCarousel programs={programs} />
            ) : (
              <p className="mt-10 text-sm text-forest/60">
                Estamos cargando el detalle de nuestros programas. Vuelve pronto.
              </p>
            )}
            <div className="mt-10">
              <ButtonLink href="/servicios" variant="ghost">
                {byType.PROGRAMS.ctaLabel || "Ver todos los servicios"}
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}

      {/* ───────────── MISIÓN Y VISIÓN (resumen; texto completo en /quienes-somos) ───────────── */}
      {byType.MISSION_VISION && (about.mision || about.vision) && (
        <section className="pb-8 pt-8 sm:pb-10 sm:pt-10">
          <Container className="max-w-5xl">
            <div className="text-center">
              <Eyebrow>Propósito</Eyebrow>
              <h2 className="mt-3 font-heading text-3xl font-bold text-forest sm:text-4xl">
                {byType.MISSION_VISION.title}
              </h2>
            </div>
            <div className="mt-8">
              <PillarRow items={pillars} />
            </div>
            <div className="mt-6 text-center">
              <ButtonLink href="/quienes-somos" variant="ghost" className="text-xs px-4 py-2">
                Conocer más →
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}

      {/* ───────────── NOTICIAS ───────────── */}
      {byType.NEWS && news.length > 0 && (
        <section className="bg-surface-muted py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Al día</Eyebrow>
                <h2 className="mt-3 font-heading text-3xl font-bold text-forest">{byType.NEWS.title}</h2>
              </div>
              <ButtonLink href="/noticias" variant="ghost">
                Ver todas
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {news.map((n) => (
                <StoryCard
                  key={n.id}
                  slug={n.slug}
                  title={n.title}
                  subtitle={n.subtitle}
                  category={n.category}
                  coverImage={n.coverImage}
                  publishedAt={n.publishedAt}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ───────────── MEMORIAS ───────────── */}
      {byType.MEMORIAS && (
        <section className="pb-20 pt-6 sm:pt-8">
          <Container>
            <div className="relative overflow-hidden rounded-3xl bg-olive px-8 py-14 text-center sm:px-16">
              <OliveBranchOrnament className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 text-white/15" />
              <Eyebrow tone="white">Transparencia</Eyebrow>
              <h2 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
                {byType.MEMORIAS.title}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/85">{byType.MEMORIAS.subtitle}</p>
              <div className="mt-7">
                <ButtonLink href="/transparencia" className="!bg-white !text-olive hover:!bg-white/90">
                  {byType.MEMORIAS.ctaLabel || "Ver documentos"}
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ───────────── COLABORA / CTA FINAL ───────────── */}
      {byType.COLLAB && (
        <section className="py-20">
          <Container className="text-center">
            <h2 className="font-heading text-3xl font-bold text-forest sm:text-4xl">{byType.COLLAB.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-forest/70">{byType.COLLAB.body}</p>
            <div className="mt-8">
              <ButtonLink href="/contacto">{byType.COLLAB.ctaLabel || "Contáctanos"}</ButtonLink>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
