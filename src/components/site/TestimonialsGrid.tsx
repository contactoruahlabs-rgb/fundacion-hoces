"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type TestimonialItem = {
  id: string;
  authorLabel: string;
  content: string;
  media: { path: string; altText: string } | null;
};

export function TestimonialsGrid({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [openIndex]);

  const current = openIndex !== null ? testimonials[openIndex] : null;

  return (
    <>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white text-left transition-shadow hover:shadow-md"
          >
            {t.media ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={t.media.path}
                  alt={t.media.altText || t.authorLabel}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 360px"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-sage/15">
                <span className="font-heading text-4xl text-sage/60" aria-hidden="true">
                  “
                </span>
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <p className="font-subheading text-sm text-olive">{t.authorLabel}</p>
              <div className="relative mt-2 max-h-20 overflow-hidden">
                <p className="text-sm text-forest/80">{t.content}</p>
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
              </div>
              <span className="mt-3 text-xs font-semibold text-olive">Leer testimonio completo →</span>
            </div>
          </button>
        ))}
      </div>

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
            className="relative flex w-full max-w-xl flex-col items-center overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {current.media && (
              <div className="relative mb-5 h-28 w-28 shrink-0 overflow-hidden rounded-full">
                <Image src={current.media.path} alt={current.media.altText || current.authorLabel} fill className="object-cover" sizes="112px" />
              </div>
            )}
            <span className="font-heading text-5xl text-sage/40" aria-hidden="true">
              “
            </span>
            <p className="mt-2 text-center text-forest/80">{current.content}</p>
            <footer className="mt-4 text-sm font-subheading text-olive">— {current.authorLabel}</footer>
          </div>
        </div>
      )}
    </>
  );
}
