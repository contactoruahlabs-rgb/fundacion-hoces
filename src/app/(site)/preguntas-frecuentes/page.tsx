import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { Eyebrow } from "@/components/site/Eyebrow";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Respuestas a las preguntas más frecuentes sobre Fundación HOCES.",
};

export default async function FaqPage() {
  const faqs = await prisma.faqItem.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Eyebrow>Ayuda</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">
          Preguntas frecuentes
        </h1>

        {faqs.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="Aún no hay preguntas publicadas" description="Vuelve pronto." />
          </div>
        ) : (
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-white">
            {faqs.map((faq) => (
              <details key={faq.id} className="group px-6 py-5">
                <summary className="cursor-pointer list-none font-subheading text-forest marker:content-none">
                  <span className="flex items-center justify-between">
                    {faq.question}
                    <span className="ml-4 text-olive transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-forest/80">{faq.answer}</p>
              </details>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
