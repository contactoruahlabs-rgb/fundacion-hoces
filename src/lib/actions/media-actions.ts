"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { saveImageUpload, deleteUpload, UploadValidationError } from "@/lib/storage";
import type { ActionState } from "@/lib/action-state";

export async function uploadImageAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Selecciona una imagen para subir." };
  }
  if (!altText) {
    return {
      ok: false,
      message: "El texto alternativo es obligatorio (accesibilidad).",
      fieldErrors: { altText: "Describe brevemente la imagen" },
    };
  }

  try {
    const saved = await saveImageUpload(file);
    const media = await prisma.media.create({
      data: {
        filename: saved.filename,
        path: saved.path,
        altText,
        description,
        mimeType: saved.mimeType,
        size: saved.size,
        width: saved.width,
        height: saved.height,
      },
    });
    await logAdminActivity(user.id, "UPLOAD", "Media", media.id, { filename: saved.filename });
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "No se pudo subir la imagen. Intenta nuevamente." };
  }

  revalidatePath("/admin/medios");
  return { ok: true, message: "Imagen subida correctamente." };
}

export async function deleteMediaAction(mediaId: string) {
  const user = await requireAdmin();

  const usageChecks = await Promise.all([
    prisma.teamMember.count({ where: { photoId: mediaId } }),
    prisma.program.count({ where: { coverImageId: mediaId } }),
    prisma.programGalleryImage.count({ where: { mediaId } }),
    prisma.document.count({ where: { coverImageId: mediaId } }),
    prisma.newsPost.count({ where: { coverImageId: mediaId } }),
    prisma.testimonial.count({ where: { mediaId } }),
    prisma.homeBlock.count({ where: { imageId: mediaId } }),
  ]);
  const inUse = usageChecks.some((c) => c > 0);
  if (inUse) {
    return {
      ok: false,
      message:
        "Esta imagen está en uso en otra sección del sitio. Reemplázala allí antes de eliminarla.",
    };
  }

  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) return { ok: false, message: "La imagen ya no existe." };

  await prisma.media.delete({ where: { id: mediaId } });
  await deleteUpload(media.path);
  await logAdminActivity(user.id, "DELETE", "Media", mediaId);

  revalidatePath("/admin/medios");
  return { ok: true, message: "Imagen eliminada." };
}
