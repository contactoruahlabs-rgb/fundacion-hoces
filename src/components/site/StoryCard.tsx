import Image from "next/image";
import Link from "next/link";
import { SeedClusterOrnament } from "./BrandOrnament";
import { formatDate } from "@/lib/utils";

export function StoryCard({
  slug,
  title,
  subtitle,
  category,
  coverImage,
  publishedAt,
}: {
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  coverImage?: { path: string; altText: string } | null;
  publishedAt?: Date | string | null;
}) {
  return (
    <Link
      href={`/noticias/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-sage/15 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-forest">
        {coverImage ? (
          <Image
            src={coverImage.path}
            alt={coverImage.altText || title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 360px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <SeedClusterOrnament className="h-16 w-16 text-sage" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-olive">
          {publishedAt ? `${formatDate(publishedAt)} · ` : ""}
          {category}
        </p>
        <h3 className="mt-2 font-heading text-lg font-bold text-forest">{title}</h3>
        {subtitle && <p className="mt-2 line-clamp-2 flex-1 text-sm text-forest/70">{subtitle}</p>}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-olive">
          Leer más
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
