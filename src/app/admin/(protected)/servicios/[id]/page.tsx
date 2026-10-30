import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProgramForm } from "@/components/admin/ProgramForm";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, media] = await Promise.all([
    prisma.program.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
  ]);
  if (!program) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Editar servicio</h1>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <ProgramForm program={program} mediaOptions={media} />
      </div>
    </div>
  );
}
