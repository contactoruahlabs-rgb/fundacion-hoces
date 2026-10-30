"use client";

import { useActionState } from "react";
import { createDocumentAction, updateDocumentAction } from "@/lib/actions/document-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, TextArea, Select, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { ImagePicker, type MediaOption } from "@/components/admin/ImagePicker";
import type { Document } from "@prisma/client";

export function DocumentForm({
  document,
  mediaOptions,
}: {
  document?: Document;
  mediaOptions: MediaOption[];
}) {
  const action = document ? updateDocumentAction.bind(null, document.id) : createDocumentAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Título" name="title" required error={state.fieldErrors?.title}>
        <TextInput id="title" name="title" required defaultValue={document?.title} />
      </FormField>

      <FormField label="Descripción" name="description" error={state.fieldErrors?.description}>
        <TextArea id="description" name="description" rows={3} defaultValue={document?.description} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Categoría" name="category" required error={state.fieldErrors?.category}>
          <Select id="category" name="category" defaultValue={document?.category ?? "MEMORIA_ANUAL"} required>
            <option value="MEMORIA_ANUAL">Memoria anual</option>
            <option value="INFORME_GESTION">Informe de gestión</option>
            <option value="TRANSPARENCIA">Transparencia</option>
            <option value="OTRO">Otro documento</option>
          </Select>
        </FormField>
        <FormField label="Año" name="year" required error={state.fieldErrors?.year}>
          <TextInput id="year" name="year" type="number" required defaultValue={document?.year ?? new Date().getFullYear()} />
        </FormField>
      </div>

      <FormField
        label={document ? "Reemplazar archivo PDF (opcional)" : "Archivo PDF"}
        name="file"
        required={!document}
        hint={document ? `Archivo actual: ${document.fileName}` : "Tamaño máximo 25MB."}
      >
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf"
          required={!document}
          className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm"
        />
      </FormField>

      <ImagePicker name="coverImageId" label="Imagen de portada (opcional)" options={mediaOptions} defaultValue={document?.coverImageId} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Orden" name="order" error={state.fieldErrors?.order}>
          <TextInput id="order" name="order" type="number" defaultValue={document?.order ?? 0} />
        </FormField>
        <FormField label="Estado" name="status" error={state.fieldErrors?.status}>
          <Select id="status" name="status" defaultValue={document?.status ?? "DRAFT"}>
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </Select>
        </FormField>
      </div>

      <FormStatusBanner state={state} />
      <SubmitButton>{document ? "Guardar cambios" : "Subir documento"}</SubmitButton>
    </form>
  );
}
