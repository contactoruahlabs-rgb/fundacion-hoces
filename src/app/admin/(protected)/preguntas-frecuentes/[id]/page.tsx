import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FaqForm } from "@/components/admin/FaqForm";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await prisma.faqItem.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Editar pregunta frecuente</h1>
      <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <FaqForm faq={faq} />
      </div>
    </div>
  );
}
