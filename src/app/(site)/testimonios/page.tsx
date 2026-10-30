import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { Eyebrow } from "@/components/site/Eyebrow";

export const metadata: Metadata = {
  title: "Testimonios",
  description: "Testimonios de familias acompañadas por Fundación HOCES.",
};

export default async function TestimoniosPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED", consentGiven: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-4xl">
        <Eyebrow>Testimonios</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">
          Historias que nos inspiran
        </h1>

        {testimonials.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Pronto compartiremos testimonios de familias"
              description="Publicamos testimonios únicamente con la autorización expresa de cada familia. Estamos reuniendo esas autorizaciones para compartir sus historias con el cuidado que merecen."
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="relative rounded-2xl border border-border bg-white p-6">
                <span className="absolute left-5 top-3 font-heading text-5xl text-sage/40" aria-hidden="true">
                  “
                </span>
                <p className="relative text-forest/80">{t.content}</p>
                <footer className="mt-4 text-sm font-subheading text-olive">— {t.authorLabel}</footer>
              </blockquote>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
