"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DISPLAY_MS = 3000;

export function HeroCarousel({ images }: { images: { path: string; altText: string }[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, DISPLAY_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      {images.map((img, i) => (
        <Image
          key={img.path}
          src={img.path}
          alt={img.altText || ""}
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-300 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </>
  );
}
