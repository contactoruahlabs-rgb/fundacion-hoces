"use server";

import { prisma } from "@/lib/prisma";
import { getClientIpHash } from "@/lib/auth";
import { contactSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";
import { revalidatePath } from "next/cache";

export async function submitContactAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    reason: formData.get("reason"),
    message: formData.get("message"),
    consentPrivacy: formData.get("consentPrivacy") === "on",
    website: formData.get("website") ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los campos marcados.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  // Honeypot: un campo oculto que un humano nunca llena; si llega con valor, se descarta en silencio.
  if (parsed.data.website) {
    return { ok: true, message: "Gracias, hemos recibido tu mensaje." };
  }

  const ipHash = await getClientIpHash();

  const recentCount = await prisma.contactMessage.count({
    where: { ipHash, createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } },
  });
  if (recentCount >= 5) {
    return {
      ok: false,
      message: "Has enviado varios mensajes en poco tiempo. Intenta nuevamente en unos minutos.",
    };
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      reason: parsed.data.reason,
      message: parsed.data.message,
      consentPrivacy: parsed.data.consentPrivacy,
      ipHash,
    },
  });

  revalidatePath("/admin/mensajes");

  return {
    ok: true,
    message: "¡Gracias! Te llevamos a WhatsApp para continuar la conversación...",
  };
}
