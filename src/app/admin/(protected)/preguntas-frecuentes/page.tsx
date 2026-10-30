import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteFaqAction } from "@/lib/actions/faq-actions";

export default async function AdminFaqPage() {
  const faqs = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-forest">Preguntas frecuentes</h1>
          <p className="mt-1 text-sm text-forest/60">Gestiona las preguntas frecuentes del sitio.</p>
        </div>
        <Link href="/admin/preguntas-frecuentes/nueva" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">
          + Nueva pregunta
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          rows={faqs}
          emptyLabel="Aún no has agregado preguntas frecuentes."
          columns={[
            { header: "Pregunta", render: (f) => <span className="font-medium text-forest">{f.question}</span> },
            { header: "Estado", render: (f) => <StatusBadge status={f.status} /> },
            {
              header: "Acciones",
              render: (f) => (
                <div className="flex gap-3">
                  <Link href={`/admin/preguntas-frecuentes/${f.id}`} className="font-semibold text-olive hover:underline">
                    Editar
                  </Link>
                  <DeleteButton action={deleteFaqAction.bind(null, f.id)} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
