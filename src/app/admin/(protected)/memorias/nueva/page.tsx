import { prisma } from "@/lib/prisma";
import { DocumentForm } from "@/components/admin/DocumentForm";

export default async function NewDocumentPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Nuevo documento</h1>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <DocumentForm mediaOptions={media} />
      </div>
    </div>
  );
}
