import { prisma } from "@/lib/prisma";
import { getAboutContent } from "@/lib/site-data";
import { AboutContentForm } from "@/components/admin/AboutContentForm";
import { HitosGalleryManager } from "@/components/admin/HitosGalleryManager";
import {
  addAboutGalleryImageAction,
  removeAboutGalleryImageAction,
  updateAboutGalleryImageAction,
  reorderAboutGalleryAction,
} from "@/lib/actions/settings-actions";

export default async function AdminAboutPage() {
  const [about, media, gallery] = await Promise.all([
    getAboutContent(),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
    prisma.aboutGalleryImage.findMany({ include: { media: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Quiénes somos</h1>
      <p className="mt-1 text-sm text-forest/60">
        Edita la historia, misión, visión, valores, hitos y enfoque cristiano que se muestran en el sitio.
      </p>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <AboutContentForm about={about} mediaOptions={media} />
      </div>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <h2 className="font-heading text-lg font-bold text-forest">Galería de Hitos</h2>
        <p className="mt-1 text-sm text-forest/60">
          Fotos que se muestran en la sección Hitos de la página pública. Cada foto puede tener un nombre y una
          breve descripción; al hacer clic en una foto en el sitio se abren todas en una vista ampliada.
        </p>
        <div className="mt-5">
          <HitosGalleryManager
            gallery={gallery}
            mediaOptions={media}
            onAdd={addAboutGalleryImageAction}
            onRemove={removeAboutGalleryImageAction}
            onUpdate={updateAboutGalleryImageAction}
            onReorder={reorderAboutGalleryAction}
          />
        </div>
      </div>
    </div>
  );
}
