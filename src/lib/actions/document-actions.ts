"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { documentSchema } from "@/lib/validations";
import { createDocumentUploadTicket, deleteUpload, UploadValidationError } from "@/lib/storage";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

export async function createDocumentUploadTicketAction(mimeType: string, size: number) {
  await requireAdmin();
  try {
    const ticket = await createDocumentUploadTicket(mimeType, size);
    return { ok: true as const, ticket };
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return { ok: false as const, message: err.message };
    }
    return { ok: false as const, message: "No se pudo preparar la subida. Intenta nuevamente." };
  }
}

function parseForm(formData: FormData) {
  return documentSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    year: formData.get("year"),
    coverImageId: formData.get("coverImageId") || null,
    order: formData.get("order"),
    status: formData.get("status"),
  });
}

export async function createDocumentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const filePath = formData.get("filePath");
  const fileName = formData.get("fileName");
  const fileSize = Number(formData.get("fileSize"));
  if (typeof filePath !== "string" || !filePath || typeof fileName !== "string" || !fileName || !fileSize) {
    return { ok: false, message: "Selecciona el archivo PDF del documento." };
  }

  const document = await prisma.document.create({
    data: {
      ...parsed.data,
      filePath,
      fileName,
      fileSize,
    },
  });
  await logAdminActivity(user.id, "CREATE", "Document", document.id);

  revalidatePath("/admin/memorias");
  revalidatePath("/transparencia");
  redirect("/admin/memorias");
}

export async function updateDocumentAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const existing = await prisma.document.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "El documento ya no existe." };

  const newFilePath = formData.get("filePath");
  const newFileName = formData.get("fileName");
  const newFileSize = Number(formData.get("fileSize"));
  let fileFields: { filePath: string; fileName: string; fileSize: number } | undefined;

  if (typeof newFilePath === "string" && newFilePath && typeof newFileName === "string" && newFileName && newFileSize) {
    fileFields = { filePath: newFilePath, fileName: newFileName, fileSize: newFileSize };
    await deleteUpload(existing.filePath);
  }

  await prisma.document.update({
    where: { id },
    data: { ...parsed.data, ...fileFields },
  });
  await logAdminActivity(user.id, "UPDATE", "Document", id);

  revalidatePath("/admin/memorias");
  revalidatePath("/transparencia");
  return { ok: true, message: "Documento actualizado." };
}

export async function reorderDocumentsAction(orderedIds: string[]) {
  const user = await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.document.update({ where: { id }, data: { order: index } }))
  );
  await logAdminActivity(user.id, "UPDATE", "Document", undefined, { reorder: orderedIds });

  revalidatePath("/admin/memorias");
  revalidatePath("/transparencia");
}

export async function deleteDocumentAction(id: string) {
  const user = await requireAdmin();
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return;
  await prisma.document.delete({ where: { id } });
  await deleteUpload(doc.filePath);
  await logAdminActivity(user.id, "DELETE", "Document", id);
  revalidatePath("/admin/memorias");
  revalidatePath("/transparencia");
}
