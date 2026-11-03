import { prisma } from "@/lib/prisma";
import { getAboutContent, getHitos } from "@/lib/site-data";
import { AboutContentForm } from "@/components/admin/AboutContentForm";
import { HitosGalleryManager } from "@/components/admin/HitosGalleryManager";
import {
  createHitoAction,
  updateHitoAction,
  deleteHitoAction,
  reorderHitosAction,
  addHitoImageAction,
  removeHitoImageAction,
  setHitoCoverAction,
} from "@/lib/actions/hito-actions";

export default async function AdminAboutPage() {
  const [about, media, hitos] = await Promise.all([
    getAboutContent(),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
    getHitos(),
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
          Cada hito tiene una foto principal, un nombre y una breve descripción, y puede tener varias fotos más. En
          el sitio público, al hacer clic en un hito se abren todas sus fotos para recorrerlas con las flechas.
        </p>
        <div className="mt-5">
          <HitosGalleryManager
            hitos={hitos}
            mediaOptions={media}
            onAddHito={createHitoAction}
            onUpdateHito={updateHitoAction}
            onDeleteHito={deleteHitoAction}
            onReorderHitos={reorderHitosAction}
            onAddImage={addHitoImageAction}
            onRemoveImage={removeHitoImageAction}
            onSetCover={setHitoCoverAction}
          />
        </div>
      </div>
    </div>
  );
}
