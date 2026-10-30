import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteDocumentAction } from "@/lib/actions/document-actions";

const CATEGORY_LABELS: Record<string, string> = {
  MEMORIA_ANUAL: "Memoria anual",
  INFORME_GESTION: "Informe de gestión",
  TRANSPARENCIA: "Transparencia",
  OTRO: "Otro",
};

export default async function AdminDocumentsPage() {
  const documents = await prisma.document.findMany({ orderBy: [{ year: "desc" }, { order: "asc" }] });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-forest">Memorias y transparencia</h1>
          <p className="mt-1 text-sm text-forest/60">Sube y gestiona memorias anuales y documentos de transparencia.</p>
        </div>
        <Link href="/admin/memorias/nueva" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">
          + Nuevo documento
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          rows={documents}
          emptyLabel="Aún no has subido ningún documento."
          columns={[
            { header: "Título", render: (d) => <span className="font-medium text-forest">{d.title}</span> },
            { header: "Categoría", render: (d) => <span className="text-forest/60">{CATEGORY_LABELS[d.category]}</span> },
            { header: "Año", render: (d) => d.year },
            { header: "Estado", render: (d) => <StatusBadge status={d.status} /> },
            {
              header: "Acciones",
              render: (d) => (
                <div className="flex gap-3">
                  <Link href={`/admin/memorias/${d.id}`} className="font-semibold text-olive hover:underline">
                    Editar
                  </Link>
                  <DeleteButton action={deleteDocumentAction.bind(null, d.id)} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
