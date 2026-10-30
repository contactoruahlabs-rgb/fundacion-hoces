import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [member, media] = await Promise.all([
    prisma.teamMember.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
  ]);
  if (!member) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Editar profesional</h1>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <TeamMemberForm member={member} mediaOptions={media} />
      </div>
    </div>
  );
}
