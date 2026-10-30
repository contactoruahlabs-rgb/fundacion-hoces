import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { Eyebrow } from "@/components/site/Eyebrow";
import { StoryCard } from "@/components/site/StoryCard";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Noticias, actividades y campañas de Fundación HOCES.",
};

export default async function NoticiasPage() {
  const posts = await prisma.newsPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
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
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StoryCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                subtitle={post.subtitle}
                category={post.category}
                coverImage={post.coverImage}
                publishedAt={post.publishedAt}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
