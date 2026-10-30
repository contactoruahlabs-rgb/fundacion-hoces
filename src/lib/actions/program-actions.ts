"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { programSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

function parseProgramForm(formData: FormData) {
  return programSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    targetAudience: formData.get("targetAudience"),
    objectives: formData.get("objectives"),
    activities: formData.get("activities"),
    ctaLabel: formData.get("ctaLabel"),
    ctaLink: formData.get("ctaLink"),
    coverImageId: formData.get("coverImageId") || null,
    order: formData.get("order"),
    status: formData.get("status"),
  });
}

export async function createProgramAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseProgramForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const existing = await prisma.program.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return {
      ok: false,
      message: "Ya existe un servicio con ese slug.",
      fieldErrors: { slug: "Elige un identificador único" },
    };
  }

  const program = await prisma.program.create({ data: parsed.data });
  await logAdminActivity(user.id, "CREATE", "Program", program.id);

  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
  redirect("/admin/servicios");
}

export async function updateProgramAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseProgramForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const existing = await prisma.program.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) {
    return {
      ok: false,
      message: "Ya existe otro servicio con ese slug.",
      fieldErrors: { slug: "Elige un identificador único" },
    };
  }

  await prisma.program.update({ where: { id }, data: parsed.data });
  await logAdminActivity(user.id, "UPDATE", "Program", id);

  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
  revalidatePath(`/servicios/${parsed.data.slug}`);
  return { ok: true, message: "Servicio actualizado." };
}

export async function deleteProgramAction(id: string) {
  const user = await requireAdmin();
  await prisma.program.delete({ where: { id } });
  await logAdminActivity(user.id, "DELETE", "Program", id);
  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
}
