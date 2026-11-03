import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { Eyebrow } from "@/components/site/Eyebrow";
import { TestimonialsGrid } from "@/components/site/TestimonialsGrid";

export const metadata: Metadata = {
  title: "Testimonios",
  description: "Testimonios de familias acompañadas por Fundación HOCES.",
};

export default async function TestimoniosPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED", consentGiven: true },
    orderBy: { order: "asc" },
    include: { media: true },
  });

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-5xl">
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
          <TestimonialsGrid testimonials={testimonials} />
        )}
      </Container>
    </div>
  );
}
