"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";

export async function markMessageStatusAction(id: string, status: "NEW" | "READ" | "ARCHIVED") {
  const user = await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  await logAdminActivity(user.id, "UPDATE_STATUS", "ContactMessage", id, { status });
  revalidatePath("/admin/mensajes");
}

export async function deleteMessageAction(id: string) {
  const user = await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  await logAdminActivity(user.id, "DELETE", "ContactMessage", id);
  revalidatePath("/admin/mensajes");
}
