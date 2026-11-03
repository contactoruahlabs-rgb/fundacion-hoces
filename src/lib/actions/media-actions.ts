"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { createImageUploadTicket, deleteUpload, UploadValidationError } from "@/lib/storage";

export async function createMediaUploadTicketAction(mimeType: string, size: number) {
  await requireAdmin();
  try {
    const ticket = await createImageUploadTicket(mimeType, size);
    return { ok: true as const, ticket };
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return { ok: false as const, message: err.message };
    }
    return { ok: false as const, message: "No se pudo preparar la subida. Intenta nuevamente." };
  }
}

export async function confirmMediaUploadAction(input: {
  path: string;
  filename: string;
  publicUrl: string;
  mimeType: string;
  size: number;
  altText: string;
  description: string;
}) {
  const user = await requireAdmin();
  const altText = input.altText.trim();
  if (!altText) {
    return { ok: false as const, message: "El texto alternativo es obligatorio (accesibilidad)." };
  }

  const media = await prisma.media.create({
    data: {
      filename: input.filename,
      path: input.publicUrl,
      altText,
      description: input.description.trim(),
      mimeType: input.mimeType,
      size: input.size,
    },
  });
  await logAdminActivity(user.id, "UPLOAD", "Media", media.id, { filename: input.filename });

  revalidatePath("/admin/medios");
  return { ok: true as const, message: "Imagen subida correctamente." };
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
