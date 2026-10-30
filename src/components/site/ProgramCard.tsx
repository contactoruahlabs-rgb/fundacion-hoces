import Image from "next/image";
import Link from "next/link";
import { OliveBranchOrnament } from "./BrandOrnament";

export function ProgramCard({
  slug,
  name,
  coverImage,
  className = "",
}: {
  slug: string;
  name: string;
  coverImage?: { path: string; altText: string } | null;
  className?: string;
}) {
  return (
    <Link
      href={`/servicios/${slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-sage/15 transition-shadow hover:shadow-md ${className}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-forest">
        {coverImage ? (
          <Image
            src={coverImage.path}
            alt={coverImage.altText || name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 80vw, 320px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <OliveBranchOrnament className="h-16 w-16 text-sage" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-olive sm:text-xs">Servicio</p>
        <h3 className="mt-1.5 flex-1 font-heading text-sm font-bold text-forest sm:mt-2 sm:text-lg">{name}</h3>
        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-olive sm:mt-4 sm:text-xs">
          Conocer más
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
