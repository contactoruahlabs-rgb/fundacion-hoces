"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { teamMemberSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

function parseForm(formData: FormData) {
  return teamMemberSchema.safeParse({
    group: formData.get("group"),
    name: formData.get("name"),
    role: formData.get("role"),
    specialty: formData.get("specialty"),
    experienceYears: formData.get("experienceYears") || null,
    bio: formData.get("bio"),
    photoId: formData.get("photoId") || null,
    showPhoto: formData.get("showPhoto") === "on",
    isPlaceholder: formData.get("isPlaceholder") === "on",
    order: formData.get("order"),
    status: formData.get("status"),
  });
}

export async function createTeamMemberAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const member = await prisma.teamMember.create({ data: parsed.data });
  await logAdminActivity(user.id, "CREATE", "TeamMember", member.id);

  revalidatePath("/admin/equipo");
  revalidatePath("/equipo");
  revalidatePath("/directorio");
  redirect("/admin/equipo");
}

export async function updateTeamMemberAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  await prisma.teamMember.update({ where: { id }, data: parsed.data });
  await logAdminActivity(user.id, "UPDATE", "TeamMember", id);

  revalidatePath("/admin/equipo");
  revalidatePath("/equipo");
  revalidatePath("/directorio");
  return { ok: true, message: "Profesional actualizado." };
}

export async function deleteTeamMemberAction(id: string) {
  const user = await requireAdmin();
  await prisma.teamMember.delete({ where: { id } });
  await logAdminActivity(user.id, "DELETE", "TeamMember", id);
  revalidatePath("/admin/equipo");
  revalidatePath("/equipo");
  revalidatePath("/directorio");
}
