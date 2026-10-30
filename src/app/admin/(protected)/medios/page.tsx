import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteMediaAction } from "@/lib/actions/media-actions";
import { EmptyState } from "@/components/site/EmptyState";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Biblioteca de imágenes</h1>
      <p className="mt-1 text-sm text-forest/60">
        Sube aquí las imágenes que luego podrás asignar a servicios, noticias, equipo y documentos.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
        <MediaUploadForm />

        <div>
          {media.length === 0 ? (
            <EmptyState title="Sin imágenes todavía" description="Sube la primera imagen desde el formulario." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {media.map((m) => (
                <div key={m.id} className="overflow-hidden rounded-xl border border-border bg-white">
                  <div className="relative aspect-square">
                    <Image src={m.path} alt={m.altText} fill className="object-cover" sizes="200px" />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs text-forest/70" title={m.altText}>
                      {m.altText || "Sin descripción"}
                    </p>
                    <p className="mt-1 text-[11px] text-forest/40">{(m.size / 1024).toFixed(0)} KB</p>
                    <div className="mt-2">
                      <DeleteButton
                        action={deleteMediaAction.bind(null, m.id)}
                        confirmMessage="¿Eliminar esta imagen? Solo se puede eliminar si no está en uso."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
