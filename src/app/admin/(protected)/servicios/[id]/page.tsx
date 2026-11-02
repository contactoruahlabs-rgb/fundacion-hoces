import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { addProgramGalleryImageAction, removeProgramGalleryImageAction } from "@/lib/actions/program-actions";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, media] = await Promise.all([
    prisma.program.findUnique({
      where: { id },
      include: { gallery: { include: { media: true }, orderBy: { order: "asc" } } },
    }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
  ]);
  if (!program) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Editar servicio</h1>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <ProgramForm program={program} mediaOptions={media} />
      </div>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <h2 className="font-heading text-lg font-bold text-forest">Galería de fotos</h2>
        <p className="mt-1 text-sm text-forest/60">
          Imágenes adicionales que se muestran en la página pública de este servicio.
        </p>
        <div className="mt-5">
          <GalleryManager
            gallery={program.gallery}
            mediaOptions={media}
            onAdd={addProgramGalleryImageAction.bind(null, program.id)}
            onRemove={removeProgramGalleryImageAction}
          />
        </div>
      </div>
    </div>
  );
}
