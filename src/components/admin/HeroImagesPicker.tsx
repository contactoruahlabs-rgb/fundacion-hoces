"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { MediaOption } from "@/components/admin/ImagePicker";

const MAX_IMAGES = 3;

function parseHeroImages(extraJson: string): string[] {
  try {
    const parsed = JSON.parse(extraJson || "{}");
    const ids = parsed.heroImages;
    return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function HeroImagesPicker({
  name,
  options,
  defaultExtraJson,
}: {
  name: string;
  options: MediaOption[];
  defaultExtraJson: string;
}) {
  const [selected, setSelected] = useState<string[]>(() => parseHeroImages(defaultExtraJson));
  const [extra] = useState<Record<string, unknown>>(() => {
    try {
      const parsed = JSON.parse(defaultExtraJson || "{}");
      const { heroImages: _heroImages, ...rest } = parsed;
      return rest;
    } catch {
      return {};
    }
  });

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_IMAGES) return prev;
      return [...prev, id];
    });
  }

  const value = JSON.stringify({ ...extra, heroImages: selected });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-forest">
          Carrusel de la portada (hasta {MAX_IMAGES} fotos, se desvanecen cada 3 segundos)
        </span>
        <Link href="/admin/medios" target="_blank" className="text-xs font-semibold text-olive hover:underline">
          Subir nueva imagen ↗
        </Link>
      </div>
      <input type="hidden" name={name} value={value} />
      {options.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-forest/60">
          Aún no hay imágenes en la biblioteca. Sube una desde “Biblioteca de imágenes”.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {options.map((opt) => {
            const order = selected.indexOf(opt.id);
            const isSelected = order !== -1;
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => toggle(opt.id)}
                disabled={!isSelected && selected.length >= MAX_IMAGES}
                className={`relative aspect-square overflow-hidden rounded-lg border disabled:opacity-40 ${
                  isSelected ? "border-olive ring-2 ring-olive/30" : "border-border"
                }`}
                aria-pressed={isSelected}
                aria-label={opt.altText || "Imagen sin descripción"}
              >
                <Image src={opt.path} alt={opt.altText} fill className="object-cover" sizes="120px" />
                {isSelected && (
                  <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-olive text-[11px] font-bold text-white">
                    {order + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-xs text-forest/50">
        Si no eliges ninguna, se usa la imagen de fondo de abajo como portada fija.
      </p>
    </div>
  );
}
