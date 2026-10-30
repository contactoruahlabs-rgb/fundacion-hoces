import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { markMessageStatusAction, deleteMessageAction } from "@/lib/actions/contact-message-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/utils";

const REASON_LABELS: Record<string, string> = {
  INFORMACION: "Información",
  AGENDAR_HORA: "Agendar hora",
  DONACION: "Donación",
  COLEGIOS: "Colegios",
  VOLUNTARIADO: "Voluntariado",
  OTRO: "Otro",
};

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) notFound();

  if (message.status === "NEW") {
    const user = await requireAdmin();
    await prisma.contactMessage.update({ where: { id }, data: { status: "READ" } });
    await logAdminActivity(user.id, "UPDATE_STATUS", "ContactMessage", id, { status: "READ" });
  }

  const waHref = message.phone
    ? `https://wa.me/${message.phone.replace(/\D/g, "")}`
    : undefined;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/mensajes" className="text-sm font-semibold text-olive hover:underline">
        ← Volver a mensajes
      </Link>

      <div className="mt-4 rounded-2xl border border-border bg-white p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold text-forest">{message.name}</h1>
            <p className="text-sm text-forest/60">{message.email}</p>
            {message.phone && <p className="text-sm text-forest/60">{message.phone}</p>}
          </div>
          <span className="rounded-full bg-sage/25 px-3 py-1 text-xs font-semibold text-olive">
            {REASON_LABELS[message.reason]}
          </span>
        </div>

        <p className="mt-2 text-xs text-forest/40">{formatDate(message.createdAt)}</p>

        <p className="mt-6 whitespace-pre-wrap text-sm text-forest/80">{message.message}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${message.email}`} className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">
            Responder por correo
          </a>
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white">
              Responder por WhatsApp
            </a>
          )}
          <form action={markMessageStatusAction.bind(null, id, "ARCHIVED")}>
            <button className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-forest/70">
              Archivar
            </button>
          </form>
          <DeleteButton action={deleteMessageAction.bind(null, id)} confirmMessage="¿Eliminar este mensaje definitivamente?" />
        </div>
      </div>
    </div>
  );
}
