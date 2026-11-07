"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SeedClusterOrnament } from "./BrandOrnament";
import { formatDate } from "@/lib/utils";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  author?: string;
  coverImage: { path: string; altText: string } | null;
  publishedAt: string | null;
  bodyHtml: string;
};

export function NewsGrid({ posts }: { posts: NewsItem[] }) {
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

  const current = openIndex !== null ? posts[openIndex] : null;

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group flex flex-col overflow-hidden rounded-2xl bg-sage/15 text-left transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-forest">
              {post.coverImage ? (
                <Image
                  src={post.coverImage.path}
                  alt={post.coverImage.altText || post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <SeedClusterOrnament className="h-16 w-16 text-sage" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-olive">
                {post.publishedAt ? `${formatDate(post.publishedAt)} · ` : ""}
                {post.category}
              </p>
              <h3 className="mt-2 font-heading text-lg font-bold text-forest">{post.title}</h3>
              {post.subtitle && (
                <div className="relative mt-2 max-h-10 flex-1 overflow-hidden">
                  <p className="text-sm text-forest/70">{post.subtitle}</p>
                  <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-sage/15 to-transparent" />
                </div>
              )}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-olive">
                Leer más
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
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
            className={`relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ${
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
              {current.coverImage ? (
                <div className="relative h-56 w-full shrink-0 bg-forest/5 sm:h-64">
                  <Image
                    src={current.coverImage.path}
                    alt={current.coverImage.altText || current.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 672px"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-full items-center justify-center bg-sage/15">
                  <SeedClusterOrnament className="h-14 w-14 text-sage" />
                </div>
              )}
              <div className="p-6 sm:p-8">
                <p className="font-subheading text-xs uppercase tracking-wide text-olive">
                  {current.publishedAt ? `${formatDate(current.publishedAt)} · ` : ""}
                  {current.category}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-bold text-forest">{current.title}</h3>
                {current.author && <p className="mt-1 text-xs text-forest/50">{current.author}</p>}
                <div
                  className="prose-content mt-5 text-sm leading-relaxed text-forest/80"
                  dangerouslySetInnerHTML={{ __html: current.bodyHtml }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
