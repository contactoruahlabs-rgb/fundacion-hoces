"use client";

import Image from "next/image";
import { useRef } from "react";

export function HitosGallery({ images }: { images: { id: string; path: string; altText: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  if (images.length === 0) return null;

  return (
    <div className="relative mt-8">
      <div
        ref={trackRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-[4/5] w-[65vw] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-56"
          >
            <Image src={img.path} alt={img.altText} fill className="object-cover" sizes="(max-width: 640px) 65vw, 224px" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Ver fotos anteriores"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-forest shadow-md sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Ver fotos siguientes"
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white p-2 text-forest shadow-md sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
