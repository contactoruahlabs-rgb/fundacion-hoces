import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsPostForm } from "@/components/admin/NewsPostForm";

export default async function EditNewsPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, media] = await Promise.all([
    prisma.newsPost.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
  ]);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Editar noticia</h1>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <NewsPostForm post={post} mediaOptions={media} />
      </div>
    </div>
  );
}
