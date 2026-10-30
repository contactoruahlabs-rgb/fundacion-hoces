"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type MediaOption = { id: string; path: string; altText: string };

export function ImagePicker({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: MediaOption[];
  defaultValue?: string | null;
}) {
  const [selected, setSelected] = useState(defaultValue ?? "");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-forest">{label}</span>
        <Link href="/admin/medios" target="_blank" className="text-xs font-semibold text-olive hover:underline">
          Subir nueva imagen ↗
        </Link>
      </div>
      <input type="hidden" name={name} value={selected} />
      {options.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-forest/60">
          Aún no hay imágenes en la biblioteca. Sube una desde “Biblioteca de imágenes”.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          <button
            type="button"
            onClick={() => setSelected("")}
            className={`flex aspect-square items-center justify-center rounded-lg border text-xs ${
              selected === "" ? "border-olive ring-2 ring-olive/30" : "border-border text-forest/50"
            }`}
          >
            Sin imagen
          </button>
          {options.map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`relative aspect-square overflow-hidden rounded-lg border ${
                selected === opt.id ? "border-olive ring-2 ring-olive/30" : "border-border"
              }`}
              aria-pressed={selected === opt.id}
              aria-label={opt.altText || "Imagen sin descripción"}
            >
              <Image src={opt.path} alt={opt.altText} fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
