"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { id: string; path: string; altText: string };
type HitoItem = {
  id: string;
  title: string;
  description: string;
  cover: Photo | null;
  photos: Photo[];
};

export function HitosGallery({ hitos }: { hitos: HitoItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [openHitoIndex, setOpenHitoIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  const openHito = (i: number) => {
    const hito = hitos[i];
    const coverIndex = hito.photos.findIndex((p) => p.id === hito.cover?.id);
    setPhotoIndex(coverIndex >= 0 ? coverIndex : 0);
    setOpenHitoIndex(i);
  };

  const currentHito = openHitoIndex !== null ? hitos[openHitoIndex] : null;
  const photos = currentHito?.photos ?? [];

  useEffect(() => {
    if (openHitoIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenHitoIndex(null);
      if (e.key === "ArrowRight") setPhotoIndex((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [openHitoIndex, photos.length]);

  if (hitos.length === 0) return null;

  const currentPhoto = photos[photoIndex] ?? null;

  return (
    <div className="relative mt-8">
      <div
        ref={trackRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
      >
        {hitos.map((hito, i) => (
          <button
            key={hito.id}
            type="button"
            onClick={() => openHito(i)}
            className="group w-[65vw] shrink-0 snap-start text-left sm:w-56"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sage/15">
              {hito.cover && (
                <Image
                  src={hito.cover.path}
                  alt={hito.cover.altText || hito.title}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="(max-width: 640px) 65vw, 224px"
                />
              )}
              {hito.photos.length > 1 && (
                <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white">
                  +{hito.photos.length - 1}
                </span>
              )}
            </div>
            {(hito.title || hito.description) && (
              <div className="mt-2">
                {hito.title && <p className="font-subheading text-sm text-forest">{hito.title}</p>}
                {hito.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-forest/70">{hito.description}</p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
      {hitos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Ver hitos anteriores"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-[38%] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-forest shadow-md sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Ver hitos siguientes"
            onClick={() => scroll(1)}
            className="absolute right-0 top-[38%] hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white p-2 text-forest shadow-md sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {currentHito && currentPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenHitoIndex(null)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpenHitoIndex(null)}
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
              <Image src={currentPhoto.path} alt={currentPhoto.altText} fill className="object-contain" sizes="90vw" />
            </div>
            {(currentHito.title || currentHito.description) && (
              <div className="mt-4 max-w-xl text-center text-white">
                {currentHito.title && <p className="font-heading text-lg font-bold">{currentHito.title}</p>}
                {currentHito.description && <p className="mt-1 text-sm text-white/80">{currentHito.description}</p>}
              </div>
            )}
            {photos.length > 1 && (
              <p className="mt-2 text-xs text-white/50">
                {photoIndex + 1} / {photos.length}
              </p>
            )}

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-0 top-1/3 flex h-10 w-10 -translate-x-2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:-translate-x-14"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Foto siguiente"
                  onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
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
