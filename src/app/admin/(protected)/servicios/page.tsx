import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProgramAction } from "@/lib/actions/program-actions";

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-forest">Programas / Servicios</h1>
          <p className="mt-1 text-sm text-forest/60">Gestiona los servicios que se muestran en el sitio.</p>
        </div>
        <Link href="/admin/servicios/nuevo" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">
          + Nuevo servicio
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          rows={programs}
          emptyLabel="Aún no has creado ningún servicio."
          columns={[
            { header: "Servicio", render: (p) => <span className="font-medium text-forest">{p.name}</span> },
            { header: "Slug", render: (p) => <span className="text-forest/60">/{p.slug}</span> },
            { header: "Estado", render: (p) => <StatusBadge status={p.status} /> },
            {
              header: "Acciones",
              render: (p) => (
                <div className="flex gap-3">
                  <Link href={`/admin/servicios/${p.id}`} className="font-semibold text-olive hover:underline">
                    Editar
                  </Link>
                  <DeleteButton action={deleteProgramAction.bind(null, p.id)} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
