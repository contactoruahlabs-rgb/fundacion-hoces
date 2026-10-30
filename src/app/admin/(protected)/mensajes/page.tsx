import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { formatDate } from "@/lib/utils";

const REASON_LABELS: Record<string, string> = {
  INFORMACION: "Información",
  AGENDAR_HORA: "Agendar hora",
  DONACION: "Donación",
  COLEGIOS: "Colegios",
  VOLUNTARIADO: "Voluntariado",
  OTRO: "Otro",
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Formularios de contacto</h1>
      <p className="mt-1 text-sm text-forest/60">Mensajes recibidos a través del formulario del sitio.</p>

      <div className="mt-8">
        <DataTable
          rows={messages}
          emptyLabel="No has recibido mensajes todavía."
          columns={[
            {
              header: "De",
              render: (m) => (
                <div>
                  <p className={`font-medium ${m.status === "NEW" ? "text-forest" : "text-forest/60"}`}>{m.name}</p>
                  <p className="text-xs text-forest/50">{m.email}</p>
                </div>
              ),
            },
            { header: "Motivo", render: (m) => REASON_LABELS[m.reason] },
            { header: "Fecha", render: (m) => formatDate(m.createdAt) },
            {
              header: "Estado",
              render: (m) => (
                <span
                  className={
                    m.status === "NEW"
                      ? "rounded-full bg-olive/10 px-2.5 py-1 text-xs font-semibold text-olive"
                      : "rounded-full bg-forest/10 px-2.5 py-1 text-xs text-forest/60"
                  }
                >
                  {m.status === "NEW" ? "Nuevo" : m.status === "READ" ? "Leído" : "Archivado"}
                </span>
              ),
            },
            {
              header: "",
              render: (m) => (
                <Link href={`/admin/mensajes/${m.id}`} className="font-semibold text-olive hover:underline">
                  Ver
                </Link>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
