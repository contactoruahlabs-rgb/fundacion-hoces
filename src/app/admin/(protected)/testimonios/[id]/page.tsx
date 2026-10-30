import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [testimonial, media] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
  ]);
  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Editar testimonio</h1>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <TestimonialForm testimonial={testimonial} mediaOptions={media} />
      </div>
    </div>
  );
}
