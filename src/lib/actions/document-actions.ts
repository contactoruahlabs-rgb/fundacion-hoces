"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { documentSchema } from "@/lib/validations";
import { saveDocumentUpload, deleteUpload, UploadValidationError } from "@/lib/storage";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

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

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Selecciona el archivo PDF del documento." };
  }

  let saved;
  try {
    saved = await saveDocumentUpload(file);
  } catch (err) {
    if (err instanceof UploadValidationError) return { ok: false, message: err.message };
    return { ok: false, message: "No se pudo subir el archivo." };
  }

  const document = await prisma.document.create({
    data: {
      ...parsed.data,
      filePath: saved.path,
      fileName: file.name,
      fileSize: saved.size,
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

  const file = formData.get("file");
  let fileFields: { filePath: string; fileName: string; fileSize: number } | undefined;

  if (file instanceof File && file.size > 0) {
    try {
      const saved = await saveDocumentUpload(file);
      fileFields = { filePath: saved.path, fileName: file.name, fileSize: saved.size };
      await deleteUpload(existing.filePath);
    } catch (err) {
      if (err instanceof UploadValidationError) return { ok: false, message: err.message };
      return { ok: false, message: "No se pudo subir el nuevo archivo." };
    }
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
