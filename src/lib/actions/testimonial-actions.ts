"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

function parseForm(formData: FormData) {
  return testimonialSchema.safeParse({
    authorLabel: formData.get("authorLabel"),
    content: formData.get("content"),
    isAnonymous: formData.get("isAnonymous") === "on",
    consentGiven: formData.get("consentGiven") === "on",
    mediaId: formData.get("mediaId") || null,
    order: formData.get("order"),
    status: formData.get("status"),
  });
}

function guardConsent(parsed: { status: string; consentGiven: boolean }) {
  if (parsed.status === "PUBLISHED" && !parsed.consentGiven) {
    return "No puedes publicar un testimonio sin la autorización confirmada de la familia.";
  }
  return null;
}

export async function createTestimonialAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }
  const consentError = guardConsent(parsed.data);
  if (consentError) return { ok: false, message: consentError, fieldErrors: { consentGiven: consentError } };

  const testimonial = await prisma.testimonial.create({ data: parsed.data });
  await logAdminActivity(user.id, "CREATE", "Testimonial", testimonial.id);

  revalidatePath("/admin/testimonios");
  revalidatePath("/testimonios");
  redirect("/admin/testimonios");
}

export async function updateTestimonialAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }
  const consentError = guardConsent(parsed.data);
  if (consentError) return { ok: false, message: consentError, fieldErrors: { consentGiven: consentError } };

  await prisma.testimonial.update({ where: { id }, data: parsed.data });
  await logAdminActivity(user.id, "UPDATE", "Testimonial", id);

  revalidatePath("/admin/testimonios");
  revalidatePath("/testimonios");
  return { ok: true, message: "Testimonio actualizado." };
}

export async function deleteTestimonialAction(id: string) {
  const user = await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  await logAdminActivity(user.id, "DELETE", "Testimonial", id);
  revalidatePath("/admin/testimonios");
  revalidatePath("/testimonios");
}
