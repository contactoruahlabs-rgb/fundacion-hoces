import { prisma } from "@/lib/prisma";
import { HomeBlockForm } from "@/components/admin/HomeBlockForm";

export default async function AdminHomePage() {
  const [blocks, media] = await Promise.all([
    prisma.homeBlock.findMany({ orderBy: { order: "asc" } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Página de inicio</h1>
      <p className="mt-1 text-sm text-forest/60">
        Edita el contenido de cada sección de la página de inicio y muestra u oculta las que necesites.
      </p>

      <div className="mt-8 space-y-4">
        {blocks.map((block) => (
          <HomeBlockForm key={block.id} block={block} mediaOptions={media} />
        ))}
      </div>
    </div>
  );
}
