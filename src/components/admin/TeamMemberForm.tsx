"use client";

import { useActionState } from "react";
import { createTeamMemberAction, updateTeamMemberAction } from "@/lib/actions/team-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, TextArea, Select, Checkbox, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { ImagePicker, type MediaOption } from "@/components/admin/ImagePicker";
import type { TeamMember } from "@prisma/client";

export function TeamMemberForm({
  member,
  mediaOptions,
}: {
  member?: TeamMember;
  mediaOptions: MediaOption[];
}) {
  const action = member ? updateTeamMemberAction.bind(null, member.id) : createTeamMemberAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Sección" name="group" error={state.fieldErrors?.group}>
        <Select id="group" name="group" defaultValue={member?.group ?? "EQUIPO"}>
          <option value="EQUIPO">Equipo</option>
          <option value="DIRECTORIO">Directorio</option>
        </Select>
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nombre" name="name" required error={state.fieldErrors?.name}>
          <TextInput id="name" name="name" required defaultValue={member?.name} />
        </FormField>
        <FormField label="Rol / profesión" name="role" required error={state.fieldErrors?.role}>
          <TextInput id="role" name="role" required defaultValue={member?.role} />
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Especialidad" name="specialty" error={state.fieldErrors?.specialty}>
          <TextInput id="specialty" name="specialty" defaultValue={member?.specialty} />
        </FormField>
        <FormField label="Años de experiencia" name="experienceYears" error={state.fieldErrors?.experienceYears}>
          <TextInput id="experienceYears" name="experienceYears" type="number" defaultValue={member?.experienceYears ?? ""} />
        </FormField>
      </div>
      <FormField label="Biografía breve" name="bio" error={state.fieldErrors?.bio}>
        <TextArea id="bio" name="bio" rows={4} defaultValue={member?.bio} />
      </FormField>

      <ImagePicker name="photoId" label="Fotografía" options={mediaOptions} defaultValue={member?.photoId} />

      <div className="flex flex-wrap gap-6">
        <Checkbox label="Mostrar fotografía públicamente" name="showPhoto" defaultChecked={member?.showPhoto} />
        <Checkbox
          label="Rol confirmado, nombre pendiente de la fundación"
          name="isPlaceholder"
          defaultChecked={member?.isPlaceholder}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Orden" name="order" error={state.fieldErrors?.order}>
          <TextInput id="order" name="order" type="number" defaultValue={member?.order ?? 0} />
        </FormField>
        <FormField label="Estado" name="status" error={state.fieldErrors?.status}>
          <Select id="status" name="status" defaultValue={member?.status ?? "DRAFT"}>
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </Select>
        </FormField>
      </div>

      <FormStatusBanner state={state} />
      <SubmitButton>{member ? "Guardar cambios" : "Agregar profesional"}</SubmitButton>
    </form>
  );
}
