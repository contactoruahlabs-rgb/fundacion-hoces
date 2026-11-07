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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      cancelAnimationFrame(raf);
      setVisible(false);
    };
  }, [openIndex]);

  function close() {
    setVisible(false);
    setTimeout(() => setOpenIndex(null), 200);
  }

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
          className={`fixed inset-0 z-50 flex items-center justify-center bg-forest/50 p-4 backdrop-blur-sm transition-opacity duration-200 sm:p-8 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div
            className={`relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ${
              visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
            }`}
            style={{ maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={close}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-forest/40 text-white backdrop-blur-sm hover:bg-forest/60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="overflow-y-auto overscroll-contain">
              {current.media ? (
                <div className="relative h-56 w-full shrink-0 bg-forest/5 sm:h-64">
                  <Image
                    src={current.media.path}
                    alt={current.media.altText || current.authorLabel}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 576px"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-full items-center justify-center bg-sage/15">
                  <span className="font-heading text-5xl text-sage/50" aria-hidden="true">
                    “
                  </span>
                </div>
              )}
              <div className="p-6 text-center sm:p-8">
                <h3 className="font-subheading text-lg text-forest">{current.authorLabel}</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-forest/80 sm:text-base">
                  {current.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
