"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { faqSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

function parseForm(formData: FormData) {
  return faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    order: formData.get("order"),
    status: formData.get("status"),
  });
}

export async function createFaqAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }
  const faq = await prisma.faqItem.create({ data: parsed.data });
  await logAdminActivity(user.id, "CREATE", "FaqItem", faq.id);
  revalidatePath("/admin/preguntas-frecuentes");
  revalidatePath("/preguntas-frecuentes");
  redirect("/admin/preguntas-frecuentes");
}

export async function updateFaqAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }
  await prisma.faqItem.update({ where: { id }, data: parsed.data });
  await logAdminActivity(user.id, "UPDATE", "FaqItem", id);
  revalidatePath("/admin/preguntas-frecuentes");
  revalidatePath("/preguntas-frecuentes");
  return { ok: true, message: "Pregunta actualizada." };
}

export async function deleteFaqAction(id: string) {
  const user = await requireAdmin();
  await prisma.faqItem.delete({ where: { id } });
  await logAdminActivity(user.id, "DELETE", "FaqItem", id);
  revalidatePath("/admin/preguntas-frecuentes");
  revalidatePath("/preguntas-frecuentes");
}
