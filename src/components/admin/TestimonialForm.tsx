"use client";

import { useActionState } from "react";
import { createTestimonialAction, updateTestimonialAction } from "@/lib/actions/testimonial-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, TextArea, Select, Checkbox, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { ImagePicker, type MediaOption } from "@/components/admin/ImagePicker";
import type { Testimonial } from "@prisma/client";

export function TestimonialForm({
  testimonial,
  mediaOptions,
}: {
  testimonial?: Testimonial;
  mediaOptions: MediaOption[];
}) {
  const action = testimonial ? updateTestimonialAction.bind(null, testimonial.id) : createTestimonialAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField
        label="Identificación del autor"
        name="authorLabel"
        required
        hint='Ej: "Mamá de paciente, Padre Hurtado". Nunca el nombre completo de un niño o niña sin autorización.'
        error={state.fieldErrors?.authorLabel}
      >
        <TextInput id="authorLabel" name="authorLabel" required defaultValue={testimonial?.authorLabel} />
      </FormField>

      <FormField label="Testimonio" name="content" required error={state.fieldErrors?.content}>
        <TextArea id="content" name="content" rows={5} required defaultValue={testimonial?.content} />
      </FormField>

      <ImagePicker name="mediaId" label="Imagen asociada (opcional)" options={mediaOptions} defaultValue={testimonial?.mediaId} />

      <div className="flex flex-wrap gap-6">
        <Checkbox label="Mantener anónimo" name="isAnonymous" defaultChecked={testimonial?.isAnonymous ?? true} />
        <Checkbox
          label="Contamos con autorización firmada de la familia para publicar"
          name="consentGiven"
          defaultChecked={testimonial?.consentGiven}
        />
      </div>
      <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
        No puedes marcar este testimonio como &ldquo;Publicado&rdquo; sin confirmar la autorización.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Orden" name="order" error={state.fieldErrors?.order}>
          <TextInput id="order" name="order" type="number" defaultValue={testimonial?.order ?? 0} />
        </FormField>
        <FormField label="Estado" name="status" error={state.fieldErrors?.status}>
          <Select id="status" name="status" defaultValue={testimonial?.status ?? "DRAFT"}>
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </Select>
        </FormField>
      </div>

      <FormStatusBanner state={state} />
      <SubmitButton>{testimonial ? "Guardar cambios" : "Agregar testimonio"}</SubmitButton>
    </form>
  );
}
