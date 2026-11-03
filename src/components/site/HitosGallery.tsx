"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HitoImage = { id: string; path: string; altText: string; title: string; description: string };

export function HitosGallery({ images }: { images: HitoImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [openIndex, images.length]);

  if (images.length === 0) return null;

  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <div className="relative mt-8">
      <div
        ref={trackRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
      >
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group w-[65vw] shrink-0 snap-start text-left sm:w-56"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={img.path}
                alt={img.altText}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 640px) 65vw, 224px"
              />
            </div>
            {(img.title || img.description) && (
              <div className="mt-2">
                {img.title && <p className="font-subheading text-sm text-forest">{img.title}</p>}
                {img.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-forest/70">{img.description}</p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Ver fotos anteriores"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-[38%] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-forest shadow-md sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Ver fotos siguientes"
            onClick={() => scroll(1)}
            className="absolute right-0 top-[38%] hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white p-2 text-forest shadow-md sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div
            className="relative flex w-full max-w-3xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/20">
              <Image src={current.path} alt={current.altText} fill className="object-contain" sizes="90vw" />
            </div>
            {(current.title || current.description) && (
              <div className="mt-4 max-w-xl text-center text-white">
                {current.title && <p className="font-heading text-lg font-bold">{current.title}</p>}
                {current.description && <p className="mt-1 text-sm text-white/80">{current.description}</p>}
              </div>
            )}
            <p className="mt-2 text-xs text-white/50">
              {openIndex! + 1} / {images.length}
            </p>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))}
                  className="absolute left-0 top-1/3 flex h-10 w-10 -translate-x-2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:-translate-x-14"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Foto siguiente"
                  onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))}
                  className="absolute right-0 top-1/3 flex h-10 w-10 translate-x-2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:translate-x-14"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
