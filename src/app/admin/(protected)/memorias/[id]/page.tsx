import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentForm } from "@/components/admin/DocumentForm";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [document, media] = await Promise.all([
    prisma.document.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
  ]);
  if (!document) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Editar documento</h1>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <DocumentForm document={document} mediaOptions={media} />
      </div>
    </div>
  );
}
