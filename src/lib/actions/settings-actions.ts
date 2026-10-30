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

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    create: { id: 1, ...parsed.data },
    update: parsed.data,
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

  await prisma.aboutContent.upsert({
    where: { id: 1 },
    create: { id: 1, ...parsed.data },
    update: parsed.data,
  });
  await logAdminActivity(user.id, "UPDATE", "AboutContent", "1");

  revalidatePath("/quienes-somos");
  revalidatePath("/");
  return { ok: true, message: "Contenido institucional guardado." };
}
