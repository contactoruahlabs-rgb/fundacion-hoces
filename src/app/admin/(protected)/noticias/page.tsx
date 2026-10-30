import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteNewsPostAction } from "@/lib/actions/news-actions";

export default async function AdminNewsPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-forest">Noticias</h1>
          <p className="mt-1 text-sm text-forest/60">Publica noticias, actividades y campañas.</p>
        </div>
        <Link href="/admin/noticias/nueva" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">
          + Nueva noticia
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          rows={posts}
          emptyLabel="Aún no has publicado ninguna noticia."
          columns={[
            { header: "Título", render: (p) => <span className="font-medium text-forest">{p.title}</span> },
            { header: "Categoría", render: (p) => <span className="text-forest/60">{p.category}</span> },
            { header: "Estado", render: (p) => <StatusBadge status={p.status} /> },
            {
              header: "Acciones",
              render: (p) => (
                <div className="flex gap-3">
                  <Link href={`/admin/noticias/${p.id}`} className="font-semibold text-olive hover:underline">
                    Editar
                  </Link>
                  <DeleteButton action={deleteNewsPostAction.bind(null, p.id)} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
