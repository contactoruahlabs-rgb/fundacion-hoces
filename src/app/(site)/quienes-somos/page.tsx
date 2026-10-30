import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getAboutContent, getSiteSettings } from "@/lib/site-data";
import { Container } from "@/components/site/Container";
import { Eyebrow } from "@/components/site/Eyebrow";
import { PillarRow } from "@/components/site/PillarRow";
import { OliveBranchOrnament, SeedClusterOrnament } from "@/components/site/BrandOrnament";
import { richTextToHtml } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Conoce la historia, misión, visión y valores de Fundación HOCES.",
};

type Valor = { titulo: string; descripcion?: string };
type Hito = { anio: string; texto: string };

export default async function QuienesSomosPage() {
  const [about, settings] = await Promise.all([getAboutContent(), getSiteSettings()]);
  const valores: Valor[] = JSON.parse(about.valores || "[]");
  const hitos: Hito[] = JSON.parse(about.hitos || "[]");

  const pillars: { title: string; children: ReactNode }[] = [];
  if (about.mision) {
    pillars.push({
      title: "Misión",
      children: <div className="prose-content" dangerouslySetInnerHTML={{ __html: richTextToHtml(about.mision) }} />,
    });
  }
  if (about.vision) {
    pillars.push({
      title: "Visión",
      children: <div className="prose-content" dangerouslySetInnerHTML={{ __html: richTextToHtml(about.vision) }} />,
    });
  }

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl text-center">
        <Eyebrow>Quiénes somos</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest sm:text-5xl">
          {settings.orgName}
        </h1>
        <p className="mt-2 text-lg text-forest/70">{settings.slogan}</p>
      </Container>

      {about.historia && (
        <section className="mt-16">
          <Container className="max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="order-2 lg:order-1">
                <h2 className="font-heading text-2xl font-bold text-forest sm:text-3xl">Nuestra historia</h2>
                <div
                  className="prose-content mt-5 text-forest/80"
                  dangerouslySetInnerHTML={{ __html: richTextToHtml(about.historia) }}
                />
              </div>

              <div className="relative order-1 lg:order-2">
                <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-forest to-olive">
                  <OliveBranchOrnament className="h-40 w-40 text-white/25" />
                </div>
                <blockquote className="relative mx-6 -mt-14 rounded-2xl bg-white p-6 shadow-xl sm:-mt-16 sm:ml-auto sm:mr-[-1.5rem] sm:max-w-xs">
                  <p className="text-sm italic leading-relaxed text-forest/85">
                    “Cosechando Sueños habla de esperanza: a pesar de las dificultades, se puede soñar
                    con un presente y un futuro para cada persona neurodivergente.”
                  </p>
                  <footer className="mt-4 text-xs font-semibold uppercase tracking-wide text-olive">
                    Sobre el lema de la fundación
                  </footer>
                </blockquote>
              </div>
            </div>
          </Container>
        </section>
      )}

      {about.proposito && (
        <section className="mt-20">
          <Container className="max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-forest">Nuestro propósito</h2>
            <div
              className="prose-content mt-4 text-forest/80"
              dangerouslySetInnerHTML={{ __html: richTextToHtml(about.proposito) }}
            />
          </Container>
        </section>
      )}

      {pillars.length > 0 && (
        <section className="mt-20 bg-surface-muted py-16">
          <Container className="max-w-5xl">
            <h2 className="text-center font-heading text-2xl font-bold text-forest sm:text-3xl">
              Misión y visión
            </h2>
            <div className="mt-12">
              <PillarRow items={pillars} />
            </div>
          </Container>
        </section>
      )}

      {valores.length > 0 && (
        <section className="mt-20">
          <Container className="max-w-3xl text-center">
            <h2 className="font-heading text-2xl font-bold text-forest">Nuestros valores</h2>
            <ul className="mt-6 flex flex-wrap justify-center gap-3">
              {valores.map((v) => (
                <li
                  key={v.titulo}
                  className="rounded-full bg-sage/25 px-4 py-2 text-sm font-subheading text-olive"
                >
                  {v.titulo}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {hitos.length > 0 && (
        <section className="mt-20">
          <Container className="max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-forest">Hitos</h2>
            <ol className="mt-6 space-y-4 border-l-2 border-sage pl-5">
              {hitos.map((h) => (
                <li key={h.anio + h.texto}>
                  <p className="font-subheading text-olive">{h.anio}</p>
                  <p className="text-sm text-forest/80">{h.texto}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {about.enfoqueCristiano && (
        <section className="mt-20">
          <Container className="max-w-3xl">
            <div className="relative overflow-hidden rounded-3xl border border-sage/40 bg-sage/10 p-8">
              <SeedClusterOrnament className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 text-sage/40" />
              <h2 className="font-heading text-xl font-bold text-forest">Nuestro enfoque cristiano</h2>
              <div
                className="prose-content relative mt-3 text-sm text-forest/80"
                dangerouslySetInnerHTML={{ __html: richTextToHtml(about.enfoqueCristiano) }}
              />
              {about.versiculo && (
                <p className="relative mt-4 font-subheading italic text-olive">“{about.versiculo}”</p>
              )}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
