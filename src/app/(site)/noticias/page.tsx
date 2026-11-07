import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { Eyebrow } from "@/components/site/Eyebrow";
import { NewsGrid } from "@/components/site/NewsGrid";
import { richTextToHtml } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Noticias, actividades y campañas de Fundación HOCES.",
};

export default async function NoticiasPage() {
  const posts = await prisma.newsPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: { coverImage: true },
  });

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <Eyebrow>Noticias</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">
          Noticias y actividades
        </h1>
        <p className="mt-4 max-w-2xl text-forest/70">
          Historias, campañas y novedades de Fundación HOCES.
        </p>

        {posts.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Aún no hay noticias publicadas"
              description="Estamos preparando nuestras primeras publicaciones. Síguenos en Instagram mientras tanto para novedades."
            />
          </div>
        ) : (
          <NewsGrid
            posts={posts.map((post) => ({
              id: post.id,
              slug: post.slug,
              title: post.title,
              subtitle: post.subtitle,
              category: post.category,
              author: post.author,
              coverImage: post.coverImage,
              publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
              bodyHtml: richTextToHtml(post.body),
            }))}
          />
        )}
      </Container>
    </div>
  );
}
