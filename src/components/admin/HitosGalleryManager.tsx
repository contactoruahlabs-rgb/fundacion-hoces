"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import type { MediaOption } from "@/components/admin/ImagePicker";
import { ReorderPanel } from "@/components/admin/ReorderPanel";

type HitoItem = {
  id: string;
  title: string;
  description: string;
  coverImageId: string | null;
  coverImage: { id: string; path: string; altText: string } | null;
  images: { id: string; mediaId: string; media: { id: string; path: string; altText: string } }[];
};

export function HitosGalleryManager({
  hitos,
  mediaOptions,
  onAddHito,
  onUpdateHito,
  onDeleteHito,
  onReorderHitos,
  onAddImage,
  onRemoveImage,
  onSetCover,
}: {
  hitos: HitoItem[];
  mediaOptions: MediaOption[];
  onAddHito: (mediaId: string) => Promise<void>;
  onUpdateHito: (hitoId: string, formData: FormData) => Promise<void>;
  onDeleteHito: (hitoId: string) => Promise<void>;
  onReorderHitos: (orderedIds: string[]) => Promise<void>;
  onAddImage: (hitoId: string, mediaId: string) => Promise<void>;
  onRemoveImage: (hitoImageId: string) => Promise<void>;
  onSetCover: (hitoId: string, mediaId: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      {hitos.length > 1 && (
        <ReorderPanel
          items={hitos.map((h) => ({ id: h.id, label: h.title || "Sin nombre", thumbnail: h.coverImage?.path }))}
          onSave={onReorderHitos}
        />
      )}

      {hitos.length > 0 && (
        <div className="space-y-5">
          {hitos.map((hito) => (
            <HitoCard
              key={hito.id}
              hito={hito}
              mediaOptions={mediaOptions}
              isPending={isPending}
              startTransition={startTransition}
              onUpdateHito={onUpdateHito}
              onDeleteHito={onDeleteHito}
              onAddImage={onAddImage}
              onRemoveImage={onRemoveImage}
              onSetCover={onSetCover}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-forest">Agregar un nuevo hito</span>
        <Link href="/admin/medios" target="_blank" className="text-xs font-semibold text-olive hover:underline">
          Subir nueva imagen ↗
        </Link>
      </div>
      {mediaOptions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-forest/60">
          No hay imágenes disponibles en la biblioteca.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {mediaOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={isPending}
              onClick={() => startTransition(() => onAddHito(opt.id))}
              className="relative aspect-square overflow-hidden rounded-lg border border-border transition-opacity hover:opacity-80 disabled:opacity-60"
              aria-label={opt.altText || "Crear hito con esta imagen principal"}
            >
              <Image src={opt.path} alt={opt.altText} fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-forest/50">
        Elige una foto principal para crear un nuevo hito. Luego podrás ponerle nombre, descripción y agregarle más
        fotos.
      </p>
    </div>
  );
}

function HitoCard({
  hito,
  mediaOptions,
  isPending,
  startTransition,
  onUpdateHito,
  onDeleteHito,
  onAddImage,
  onRemoveImage,
  onSetCover,
}: {
  hito: HitoItem;
  mediaOptions: MediaOption[];
  isPending: boolean;
  startTransition: (fn: () => void | Promise<void>) => void;
  onUpdateHito: (hitoId: string, formData: FormData) => Promise<void>;
  onDeleteHito: (hitoId: string) => Promise<void>;
  onAddImage: (hitoId: string, mediaId: string) => Promise<void>;
  onRemoveImage: (hitoImageId: string) => Promise<void>;
  onSetCover: (hitoId: string, mediaId: string) => Promise<void>;
}) {
  const usedIds = new Set(hito.images.map((img) => img.mediaId));
  const available = mediaOptions.filter((m) => !usedIds.has(m.id));

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg">
          {hito.coverImage ? (
            <Image src={hito.coverImage.path} alt={hito.coverImage.altText} fill className="object-cover" sizes="112px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-sage/15 text-xs text-forest/50">
              Sin foto
            </div>
          )}
        </div>
        <form action={onUpdateHito.bind(null, hito.id)} className="flex-1 space-y-2">
          <input
            type="text"
            name="title"
            defaultValue={hito.title}
            placeholder="Nombre del hito"
            maxLength={160}
            className="w-full rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-forest outline-none focus:border-olive"
          />
          <textarea
            name="description"
            defaultValue={hito.description}
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
                if (!window.confirm("¿Eliminar este hito y todas sus fotos?")) return;
                startTransition(() => onDeleteHito(hito.id));
              }}
              className="text-xs font-semibold text-danger hover:underline disabled:opacity-60"
            >
              Eliminar hito
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-forest/70">
          Fotos de este hito ({hito.images.length}) — haz clic en una para marcarla como foto principal
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {hito.images.map((img) => (
            <div key={img.id} className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border">
              <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(() => onSetCover(hito.id, img.mediaId))}
                className="absolute inset-0"
                aria-label="Marcar como foto principal"
              >
                <Image src={img.media.path} alt={img.media.altText} fill className="object-cover" sizes="64px" />
                {hito.coverImageId === img.mediaId && (
                  <span className="absolute inset-x-0 bottom-0 bg-olive/90 py-0.5 text-center text-[9px] font-semibold text-white">
                    Principal
                  </span>
                )}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(() => onRemoveImage(img.id))}
                aria-label="Quitar foto"
                className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {available.length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-semibold text-olive hover:underline">
              + Agregar más fotos a este hito
            </summary>
            <div className="mt-2 grid grid-cols-6 gap-2 sm:grid-cols-8">
              {available.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => onAddImage(hito.id, opt.id))}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border transition-opacity hover:opacity-80 disabled:opacity-60"
                  aria-label={opt.altText || "Agregar foto"}
                >
                  <Image src={opt.path} alt={opt.altText} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
