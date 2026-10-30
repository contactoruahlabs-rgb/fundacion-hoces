"use client";

import { useActionState } from "react";
import { createNewsPostAction, updateNewsPostAction } from "@/lib/actions/news-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, TextArea, Select, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { ImagePicker, type MediaOption } from "@/components/admin/ImagePicker";
import { slugify } from "@/lib/utils";
import type { NewsPost } from "@prisma/client";

export function NewsPostForm({
  post,
  mediaOptions,
}: {
  post?: NewsPost;
  mediaOptions: MediaOption[];
}) {
  const action = post ? updateNewsPostAction.bind(null, post.id) : createNewsPostAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Título" name="title" required error={state.fieldErrors?.title}>
          <TextInput
            id="title"
            name="title"
            required
            defaultValue={post?.title}
            onChange={(e) => {
              const slugInput = document.getElementById("slug") as HTMLInputElement | null;
              if (slugInput && !slugInput.dataset.touched) slugInput.value = slugify(e.target.value);
            }}
          />
        </FormField>
        <FormField label="Slug (URL)" name="slug" required error={state.fieldErrors?.slug}>
          <TextInput
            id="slug"
            name="slug"
            required
            defaultValue={post?.slug}
            onChange={(e) => {
              e.target.dataset.touched = "true";
            }}
          />
        </FormField>
      </div>

      <FormField label="Subtítulo" name="subtitle" error={state.fieldErrors?.subtitle}>
        <TextInput id="subtitle" name="subtitle" defaultValue={post?.subtitle} />
      </FormField>

      <FormField label="Cuerpo de la noticia" name="body" hint="Deja una línea en blanco entre párrafos." error={state.fieldErrors?.body}>
        <TextArea id="body" name="body" rows={10} defaultValue={post?.body} />
      </FormField>

      <ImagePicker name="coverImageId" label="Imagen de portada" options={mediaOptions} defaultValue={post?.coverImageId} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Categoría" name="category" error={state.fieldErrors?.category}>
          <TextInput id="category" name="category" defaultValue={post?.category ?? "Noticias"} />
        </FormField>
        <FormField label="Autor" name="author" error={state.fieldErrors?.author}>
          <TextInput id="author" name="author" defaultValue={post?.author ?? "Fundación HOCES"} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Meta título (SEO)" name="metaTitle" error={state.fieldErrors?.metaTitle}>
          <TextInput id="metaTitle" name="metaTitle" defaultValue={post?.metaTitle} />
        </FormField>
        <FormField label="Meta descripción (SEO)" name="metaDescription" error={state.fieldErrors?.metaDescription}>
          <TextInput id="metaDescription" name="metaDescription" defaultValue={post?.metaDescription} />
        </FormField>
      </div>

      <FormField label="Estado" name="status" error={state.fieldErrors?.status}>
        <Select id="status" name="status" defaultValue={post?.status ?? "DRAFT"}>
          <option value="DRAFT">Borrador</option>
          <option value="PUBLISHED">Publicado</option>
          <option value="ARCHIVED">Archivado</option>
        </Select>
      </FormField>

      <FormStatusBanner state={state} />
      <SubmitButton>{post ? "Guardar cambios" : "Crear publicación"}</SubmitButton>
    </form>
  );
}
