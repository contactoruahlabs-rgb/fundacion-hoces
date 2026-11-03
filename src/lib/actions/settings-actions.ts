"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { siteSettingSchema, aboutContentSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

export async function updateSiteSettingAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = siteSettingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    JSON.parse(parsed.data.donationSuggestedAmounts);
  } catch {
    return {
      ok: false,
      message: "Los montos sugeridos deben ser una lista JSON válida, ej: [10000,20000,50000]",
      fieldErrors: { donationSuggestedAmounts: "Formato JSON inválido" },
    };
  }

  const data = { ...parsed.data, logoMediaId: parsed.data.logoMediaId || null };
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  await logAdminActivity(user.id, "UPDATE", "SiteSetting", "1");

  revalidatePath("/", "layout");
  return { ok: true, message: "Configuración guardada." };
}

export async function updateAboutContentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = aboutContentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  for (const field of ["valores", "hitos"] as const) {
    try {
      JSON.parse(parsed.data[field]);
    } catch {
      return {
        ok: false,
        message: `El campo ${field} debe ser una lista JSON válida.`,
        fieldErrors: { [field]: "Formato JSON inválido" },
      };
    }
  }

  const data = { ...parsed.data, historiaImageId: parsed.data.historiaImageId || null };
  await prisma.aboutContent.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  await logAdminActivity(user.id, "UPDATE", "AboutContent", "1");

  revalidatePath("/quienes-somos");
  revalidatePath("/");
  return { ok: true, message: "Contenido institucional guardado." };
}

export async function addAboutGalleryImageAction(mediaId: string) {
  const user = await requireAdmin();
  const count = await prisma.aboutGalleryImage.count();
  await prisma.aboutGalleryImage.create({ data: { mediaId, order: count } });
  await logAdminActivity(user.id, "CREATE", "AboutGalleryImage", mediaId);

  revalidatePath("/admin/quienes-somos");
  revalidatePath("/quienes-somos");
}

export async function removeAboutGalleryImageAction(galleryImageId: string) {
  const user = await requireAdmin();
  await prisma.aboutGalleryImage.delete({ where: { id: galleryImageId } });
  await logAdminActivity(user.id, "DELETE", "AboutGalleryImage", galleryImageId);

  revalidatePath("/admin/quienes-somos");
  revalidatePath("/quienes-somos");
}

export async function reorderAboutGalleryAction(orderedIds: string[]) {
  const user = await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.aboutGalleryImage.update({ where: { id }, data: { order: index } }))
  );
  await logAdminActivity(user.id, "UPDATE", "AboutGalleryImage", undefined, { reorder: orderedIds });

  revalidatePath("/admin/quienes-somos");
  revalidatePath("/quienes-somos");
}

export async function updateAboutGalleryImageAction(galleryImageId: string, formData: FormData) {
  const user = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim().slice(0, 160);
  const description = String(formData.get("description") ?? "").trim().slice(0, 500);
  await prisma.aboutGalleryImage.update({ where: { id: galleryImageId }, data: { title, description } });
  await logAdminActivity(user.id, "UPDATE", "AboutGalleryImage", galleryImageId);

  revalidatePath("/admin/quienes-somos");
  revalidatePath("/quienes-somos");
}
