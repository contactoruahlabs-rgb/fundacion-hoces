"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";

function revalidateHitos() {
  revalidatePath("/admin/quienes-somos");
  revalidatePath("/quienes-somos");
}

export async function createHitoAction(mediaId: string) {
  const user = await requireAdmin();
  const order = await prisma.hito.count();
  const hito = await prisma.hito.create({ data: { coverImageId: mediaId, order } });
  await prisma.hitoImage.create({ data: { hitoId: hito.id, mediaId, order: 0 } });
  await logAdminActivity(user.id, "CREATE", "Hito", hito.id);
  revalidateHitos();
}

export async function updateHitoAction(hitoId: string, formData: FormData) {
  const user = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim().slice(0, 160);
  const description = String(formData.get("description") ?? "").trim().slice(0, 500);
  await prisma.hito.update({ where: { id: hitoId }, data: { title, description } });
  await logAdminActivity(user.id, "UPDATE", "Hito", hitoId);
  revalidateHitos();
}

export async function deleteHitoAction(hitoId: string) {
  const user = await requireAdmin();
  await prisma.hito.delete({ where: { id: hitoId } });
  await logAdminActivity(user.id, "DELETE", "Hito", hitoId);
  revalidateHitos();
}

export async function reorderHitosAction(orderedIds: string[]) {
  const user = await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.hito.update({ where: { id }, data: { order: index } }))
  );
  await logAdminActivity(user.id, "UPDATE", "Hito", undefined, { reorder: orderedIds });
  revalidateHitos();
}

export async function addHitoImageAction(hitoId: string, mediaId: string) {
  const user = await requireAdmin();
  const order = await prisma.hitoImage.count({ where: { hitoId } });
  const image = await prisma.hitoImage.create({ data: { hitoId, mediaId, order } });
  await logAdminActivity(user.id, "CREATE", "HitoImage", image.id);
  revalidateHitos();
}

export async function removeHitoImageAction(hitoImageId: string) {
  const user = await requireAdmin();
  const image = await prisma.hitoImage.delete({ where: { id: hitoImageId } });

  const hito = await prisma.hito.findUnique({ where: { id: image.hitoId } });
  if (hito?.coverImageId === image.mediaId) {
    const remaining = await prisma.hitoImage.findFirst({
      where: { hitoId: image.hitoId },
      orderBy: { order: "asc" },
    });
    await prisma.hito.update({
      where: { id: image.hitoId },
      data: { coverImageId: remaining?.mediaId ?? null },
    });
  }

  await logAdminActivity(user.id, "DELETE", "HitoImage", hitoImageId);
  revalidateHitos();
}

export async function setHitoCoverAction(hitoId: string, mediaId: string) {
  const user = await requireAdmin();
  await prisma.hito.update({ where: { id: hitoId }, data: { coverImageId: mediaId } });
  await logAdminActivity(user.id, "UPDATE", "Hito", hitoId, { setCover: mediaId });
  revalidateHitos();
}
