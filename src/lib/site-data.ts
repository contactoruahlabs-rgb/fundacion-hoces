import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (settings) return settings;
  // Valores por defecto si todavía no se ha guardado la configuración (primer arranque).
  return prisma.siteSetting.create({ data: { id: 1 } });
}

export async function getAboutContent() {
  const about = await prisma.aboutContent.findUnique({ where: { id: 1 }, include: { historiaImage: true } });
  if (about) return about;
  return prisma.aboutContent.create({ data: { id: 1 }, include: { historiaImage: true } });
}

export async function getSiteLogoPath() {
  const settings = await getSiteSettings();
  if (!settings.logoMediaId) return null;
  const media = await prisma.media.findUnique({ where: { id: settings.logoMediaId } });
  return media?.path ?? null;
}

export async function getHitos() {
  return prisma.hito.findMany({
    include: { coverImage: true, images: { include: { media: true }, orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
}
