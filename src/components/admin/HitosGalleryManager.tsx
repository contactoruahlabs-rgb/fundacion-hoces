"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import type { MediaOption } from "@/components/admin/ImagePicker";
import { ReorderPanel } from "@/components/admin/ReorderPanel";

type HitoItem = {
  id: string;
  mediaId: string;
  title: string;
  description: string;
  media: { path: string; altText: string };
};

export function HitosGalleryManager({
  gallery,
  mediaOptions,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
}: {
  gallery: HitoItem[];
  mediaOptions: MediaOption[];
  onAdd: (mediaId: string) => Promise<void>;
  onRemove: (galleryImageId: string) => Promise<void>;
  onUpdate: (galleryImageId: string, formData: FormData) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const usedIds = new Set(gallery.map((g) => g.mediaId));
  const available = mediaOptions.filter((m) => !usedIds.has(m.id));

  return (
    <div className="space-y-5">
      {gallery.length > 1 && (
        <ReorderPanel
          items={gallery.map((g) => ({ id: g.id, label: g.title || "Sin nombre", thumbnail: g.media.path }))}
          onSave={onReorder}
        />
      )}
      {gallery.length > 0 && (
        <div className="space-y-4">
          {gallery.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image src={item.media.path} alt={item.media.altText} fill className="object-cover" sizes="96px" />
              </div>
              <form action={onUpdate.bind(null, item.id)} className="flex-1 space-y-2">
                <input
                  type="text"
                  name="title"
                  defaultValue={item.title}
                  placeholder="Nombre del hito"
                  maxLength={160}
                  className="w-full rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-forest outline-none focus:border-olive"
                />
                <textarea
                  name="description"
                  defaultValue={item.description}
                  placeholder="Breve descripción"
                  rows={2}
                  maxLength={500}
                  className="w-full rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-forest outline-none focus:border-olive"
                />
                <div className="flex items-center gap-4">
                  <button type="submit" className="rounded-full bg-olive px-4 py-1.5 text-xs font-semibold text-white">
                    Guardar
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      if (!window.confirm("¿Quitar esta imagen de la galería?")) return;
                      startTransition(() => onRemove(item.id));
                    }}
                    className="text-xs font-semibold text-danger hover:underline disabled:opacity-60"
                  >
                    Quitar imagen
                  </button>
                </div>
              </form>
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
              onClick={() => startTransition(() => onAdd(opt.id))}
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
