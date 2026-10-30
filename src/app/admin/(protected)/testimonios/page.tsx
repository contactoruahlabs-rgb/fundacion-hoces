import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteTestimonialAction } from "@/lib/actions/testimonial-actions";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-forest">Testimonios</h1>
          <p className="mt-1 text-sm text-forest/60">
            Solo se pueden publicar testimonios con autorización confirmada de la familia.
          </p>
        </div>
        <Link href="/admin/testimonios/nuevo" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">
          + Nuevo testimonio
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          rows={testimonials}
          emptyLabel="Aún no has agregado testimonios."
          columns={[
            { header: "Autor", render: (t) => <span className="font-medium text-forest">{t.authorLabel}</span> },
            {
              header: "Autorización",
              render: (t) => (
                <span className={t.consentGiven ? "text-success" : "text-danger"}>
                  {t.consentGiven ? "Confirmada" : "Pendiente"}
                </span>
              ),
            },
            { header: "Estado", render: (t) => <StatusBadge status={t.status} /> },
            {
              header: "Acciones",
              render: (t) => (
                <div className="flex gap-3">
                  <Link href={`/admin/testimonios/${t.id}`} className="font-semibold text-olive hover:underline">
                    Editar
                  </Link>
                  <DeleteButton action={deleteTestimonialAction.bind(null, t.id)} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
