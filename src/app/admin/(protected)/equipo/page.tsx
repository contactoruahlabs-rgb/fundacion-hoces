import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ReorderPanel } from "@/components/admin/ReorderPanel";
import { deleteTeamMemberAction, reorderTeamMembersAction } from "@/lib/actions/team-actions";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" }, include: { photo: true } });
  const equipo = members.filter((m) => m.group === "EQUIPO");
  const directorio = members.filter((m) => m.group === "DIRECTORIO");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-forest">Equipo</h1>
          <p className="mt-1 text-sm text-forest/60">Profesionales que se muestran en el sitio público.</p>
        </div>
        <Link href="/admin/equipo/nuevo" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">
          + Agregar profesional
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {equipo.length > 1 && (
          <ReorderPanel
            title="Orden — Equipo"
            items={equipo.map((m) => ({ id: m.id, label: m.name, sublabel: m.role, thumbnail: m.photo?.path }))}
            onSave={reorderTeamMembersAction}
          />
        )}
        {directorio.length > 1 && (
          <ReorderPanel
            title="Orden — Directorio"
            items={directorio.map((m) => ({ id: m.id, label: m.name, sublabel: m.role, thumbnail: m.photo?.path }))}
            onSave={reorderTeamMembersAction}
          />
        )}
      </div>

      <div className="mt-8">
        <DataTable
          rows={members}
          emptyLabel="Aún no has agregado profesionales."
          columns={[
            {
              header: "Nombre",
              render: (m) => (
                <div>
                  <span className="font-medium text-forest">{m.name}</span>
                  {m.isPlaceholder && (
                    <span className="ml-2 rounded-full bg-sage/25 px-2 py-0.5 text-xs text-olive">nombre pendiente</span>
                  )}
                </div>
              ),
            },
            { header: "Rol", render: (m) => <span className="text-forest/70">{m.role}</span> },
            {
              header: "Sección",
              render: (m) => (
                <span className="text-forest/70">{m.group === "DIRECTORIO" ? "Directorio" : "Equipo"}</span>
              ),
            },
            { header: "Estado", render: (m) => <StatusBadge status={m.status} /> },
            {
              header: "Acciones",
              render: (m) => (
                <div className="flex gap-3">
                  <Link href={`/admin/equipo/${m.id}`} className="font-semibold text-olive hover:underline">
                    Editar
                  </Link>
                  <DeleteButton action={deleteTeamMemberAction.bind(null, m.id)} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
