"use client";

import { useRef } from "react";
import { ProgramCard } from "./ProgramCard";

type Program = {
  id: string;
  slug: string;
  name: string;
  coverImage: { path: string; altText: string } | null;
};

export function ProgramsCarousel({ programs }: { programs: Program[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative mt-12">
      <div
        ref={scrollerRef}
        className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {programs.map((p) => (
          <ProgramCard key={p.id} slug={p.slug} name={p.name} coverImage={p.coverImage} className="w-72 shrink-0 sm:w-80" />
        ))}
      </div>
      <button
        type="button"
        onClick={scrollRight}
        aria-label="Ver más servicios"
        className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-olive/30 bg-white text-olive shadow-md transition-colors hover:bg-olive hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
