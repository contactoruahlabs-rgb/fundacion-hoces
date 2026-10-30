"use client";

import { useActionState } from "react";
import { createProgramAction, updateProgramAction } from "@/lib/actions/program-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, TextArea, Select, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { ImagePicker, type MediaOption } from "@/components/admin/ImagePicker";
import { slugify } from "@/lib/utils";
import type { Program } from "@prisma/client";

export function ProgramForm({
  program,
  mediaOptions,
}: {
  program?: Program;
  mediaOptions: MediaOption[];
}) {
  const action = program ? updateProgramAction.bind(null, program.id) : createProgramAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nombre del servicio" name="name" required error={state.fieldErrors?.name}>
          <TextInput
            id="name"
            name="name"
            required
            defaultValue={program?.name}
            onChange={(e) => {
              const slugInput = document.getElementById("slug") as HTMLInputElement | null;
              if (slugInput && !slugInput.dataset.touched) slugInput.value = slugify(e.target.value);
            }}
          />
        </FormField>
        <FormField label="Slug (URL)" name="slug" required hint="Solo minúsculas, números y guiones." error={state.fieldErrors?.slug}>
          <TextInput
            id="slug"
            name="slug"
            required
            defaultValue={program?.slug}
            onChange={(e) => {
              e.target.dataset.touched = "true";
            }}
          />
        </FormField>
      </div>

      <FormField label="Descripción breve" name="shortDescription" error={state.fieldErrors?.shortDescription}>
        <TextInput id="shortDescription" name="shortDescription" maxLength={300} defaultValue={program?.shortDescription} />
      </FormField>

      <FormField label="Descripción completa" name="description" hint="Deja una línea en blanco entre párrafos." error={state.fieldErrors?.description}>
        <TextArea id="description" name="description" rows={6} defaultValue={program?.description} />
      </FormField>

      <FormField label="¿A quiénes está dirigido?" name="targetAudience" error={state.fieldErrors?.targetAudience}>
        <TextArea id="targetAudience" name="targetAudience" rows={2} defaultValue={program?.targetAudience} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Objetivos" name="objectives" error={state.fieldErrors?.objectives}>
          <TextArea id="objectives" name="objectives" rows={4} defaultValue={program?.objectives} />
        </FormField>
        <FormField label="Actividades" name="activities" error={state.fieldErrors?.activities}>
          <TextArea id="activities" name="activities" rows={4} defaultValue={program?.activities} />
        </FormField>
      </div>

      <ImagePicker name="coverImageId" label="Imagen de portada" options={mediaOptions} defaultValue={program?.coverImageId} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Texto del botón" name="ctaLabel" error={state.fieldErrors?.ctaLabel}>
          <TextInput id="ctaLabel" name="ctaLabel" defaultValue={program?.ctaLabel ?? "Consultar por este servicio"} />
        </FormField>
        <FormField label="Enlace del botón (opcional)" name="ctaLink" hint="Déjalo vacío para usar WhatsApp por defecto." error={state.fieldErrors?.ctaLink}>
          <TextInput id="ctaLink" name="ctaLink" defaultValue={program?.ctaLink} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Orden" name="order" error={state.fieldErrors?.order}>
          <TextInput id="order" name="order" type="number" defaultValue={program?.order ?? 0} />
        </FormField>
        <FormField label="Estado" name="status" error={state.fieldErrors?.status}>
          <Select id="status" name="status" defaultValue={program?.status ?? "DRAFT"}>
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </Select>
        </FormField>
      </div>

      <FormStatusBanner state={state} />
      <SubmitButton>{program ? "Guardar cambios" : "Crear servicio"}</SubmitButton>
    </form>
  );
}
