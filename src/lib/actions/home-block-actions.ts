"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { homeBlockSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

function parseForm(formData: FormData) {
  return homeBlockSchema.safeParse({
    type: formData.get("type"),
    order: formData.get("order"),
    visible: formData.get("visible") === "on",
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    body: formData.get("body"),
    ctaLabel: formData.get("ctaLabel"),
    ctaLink: formData.get("ctaLink"),
    imageId: formData.get("imageId") || null,
    extraJson: formData.get("extraJson") || "{}",
  });
}

export async function updateHomeBlockAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }
  await prisma.homeBlock.update({ where: { id }, data: parsed.data });
  await logAdminActivity(user.id, "UPDATE", "HomeBlock", id);
  revalidatePath("/admin/inicio");
  revalidatePath("/");
  return { ok: true, message: "Bloque de inicio actualizado." };
}

export async function reorderHomeBlocksAction(order: { id: string; order: number }[]) {
  const user = await requireAdmin();
  await prisma.$transaction(
    order.map((o) => prisma.homeBlock.update({ where: { id: o.id }, data: { order: o.order } }))
  );
  await logAdminActivity(user.id, "REORDER", "HomeBlock");
  revalidatePath("/admin/inicio");
  revalidatePath("/");
}
