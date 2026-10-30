import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/Container";
import { richTextToHtml, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await prisma.newsPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.newsPost.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.subtitle,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.newsPost.findUnique({ where: { slug }, include: { coverImage: true } });
  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Link href="/noticias" className="text-sm font-semibold text-olive hover:underline">
          ← Noticias
        </Link>
        <p className="mt-6 font-subheading text-sm uppercase tracking-wide text-olive">{post.category}</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">{post.title}</h1>
        {post.subtitle && <p className="mt-4 text-lg text-forest/70">{post.subtitle}</p>}
        <p className="mt-3 text-xs text-forest/50">
          {post.author}
          {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
        </p>

        {post.coverImage && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage.path}
              alt={post.coverImage.altText || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div
          className="prose-content mt-8 text-forest/80"
          dangerouslySetInnerHTML={{ __html: richTextToHtml(post.body) }}
        />
      </Container>
    </article>
  );
}
