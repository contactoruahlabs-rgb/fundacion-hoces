"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import {
  addProgramGalleryImageAction,
  removeProgramGalleryImageAction,
} from "@/lib/actions/program-actions";
import type { MediaOption } from "@/components/admin/ImagePicker";
import type { ProgramGalleryImage, Media } from "@prisma/client";

type GalleryItem = ProgramGalleryImage & { media: Media };

export function ProgramGalleryManager({
  programId,
  gallery,
  mediaOptions,
}: {
  programId: string;
  gallery: GalleryItem[];
  mediaOptions: MediaOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const usedIds = new Set(gallery.map((g) => g.mediaId));
  const available = mediaOptions.filter((m) => !usedIds.has(m.id));

  return (
    <div className="space-y-5">
      {gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {gallery.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              <Image src={item.media.path} alt={item.media.altText} fill className="object-cover" sizes="160px" />
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (!window.confirm("¿Quitar esta imagen de la galería?")) return;
                  startTransition(() => removeProgramGalleryImageAction(item.id));
                }}
                className="absolute inset-0 flex items-center justify-center bg-forest/70 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-60"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-forest">Agregar imagen a la galería</span>
        <Link href="/admin/medios" target="_blank" className="text-xs font-semibold text-olive hover:underline">
          Subir nueva imagen ↗
        </Link>
      </div>
      {available.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-forest/60">
          No hay más imágenes disponibles en la biblioteca.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {available.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={isPending}
              onClick={() => startTransition(() => addProgramGalleryImageAction(programId, opt.id))}
              className="relative aspect-square overflow-hidden rounded-lg border border-border transition-opacity hover:opacity-80 disabled:opacity-60"
              aria-label={opt.altText || "Agregar imagen sin descripción"}
            >
              <Image src={opt.path} alt={opt.altText} fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
