import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/quienes-somos",
  "/servicios",
  "/equipo",
  "/noticias",
  "/transparencia",
  "/donaciones",
  "/contacto",
  "/testimonios",
  "/preguntas-frecuentes",
  "/privacidad",
  "/terminos",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, posts] = await Promise.all([
    prisma.program.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.newsPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const programEntries: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${SITE_URL}/servicios/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/noticias/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticEntries, ...programEntries, ...postEntries];
}
