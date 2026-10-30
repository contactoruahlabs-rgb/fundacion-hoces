"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminActivity } from "@/lib/auth";
import { newsPostSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

function parseForm(formData: FormData) {
  return newsPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    subtitle: formData.get("subtitle"),
    body: formData.get("body"),
    category: formData.get("category"),
    author: formData.get("author"),
    coverImageId: formData.get("coverImageId") || null,
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    status: formData.get("status"),
  });
}

export async function createNewsPostAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const existing = await prisma.newsPost.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { ok: false, message: "Ya existe una publicación con ese slug.", fieldErrors: { slug: "Elige otro" } };
  }

  const publishedAt = parsed.data.status === "PUBLISHED" ? new Date() : null;
  const post = await prisma.newsPost.create({ data: { ...parsed.data, publishedAt } });
  await logAdminActivity(user.id, "CREATE", "NewsPost", post.id);

  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
  redirect("/admin/noticias");
}

export async function updateNewsPostAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const existing = await prisma.newsPost.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (existing) {
    return { ok: false, message: "Ya existe otra publicación con ese slug.", fieldErrors: { slug: "Elige otro" } };
  }

  const current = await prisma.newsPost.findUnique({ where: { id } });
  const publishedAt =
    parsed.data.status === "PUBLISHED" ? current?.publishedAt ?? new Date() : current?.publishedAt ?? null;

  await prisma.newsPost.update({ where: { id }, data: { ...parsed.data, publishedAt } });
  await logAdminActivity(user.id, "UPDATE", "NewsPost", id);

  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${parsed.data.slug}`);
  return { ok: true, message: "Publicación actualizada." };
}

export async function deleteNewsPostAction(id: string) {
  const user = await requireAdmin();
  await prisma.newsPost.delete({ where: { id } });
  await logAdminActivity(user.id, "DELETE", "NewsPost", id);
  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
}
