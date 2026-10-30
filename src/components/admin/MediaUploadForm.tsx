"use client";

import { useActionState, useRef } from "react";
import { uploadImageAction } from "@/lib/actions/media-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";

export function MediaUploadForm() {
  const [state, formAction] = useActionState(uploadImageAction, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="space-y-4 rounded-2xl border border-border bg-white p-6"
    >
      <FormField label="Archivo de imagen" name="file" required hint="PNG, JPG, WEBP o AVIF. Máximo 8MB.">
        <input
          id="file"
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          required
          className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm"
        />
      </FormField>
      <FormField
        label="Texto alternativo"
        name="altText"
        required
        hint="Describe la imagen para personas que usan lectores de pantalla."
        error={state.fieldErrors?.altText}
      >
        <TextInput id="altText" name="altText" required maxLength={200} />
      </FormField>
      <FormField label="Descripción / uso previsto (opcional)" name="description">
        <TextInput id="description" name="description" maxLength={300} />
      </FormField>
      <FormStatusBanner state={state} />
      <SubmitButton>Subir imagen</SubmitButton>
    </form>
  );
}
