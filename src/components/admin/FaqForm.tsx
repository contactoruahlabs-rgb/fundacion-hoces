"use client";

import { useActionState } from "react";
import { createFaqAction, updateFaqAction } from "@/lib/actions/faq-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, TextArea, Select, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import type { FaqItem } from "@prisma/client";

export function FaqForm({ faq }: { faq?: FaqItem }) {
  const action = faq ? updateFaqAction.bind(null, faq.id) : createFaqAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Pregunta" name="question" required error={state.fieldErrors?.question}>
        <TextInput id="question" name="question" required defaultValue={faq?.question} />
      </FormField>
      <FormField label="Respuesta" name="answer" required error={state.fieldErrors?.answer}>
        <TextArea id="answer" name="answer" rows={4} required defaultValue={faq?.answer} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Orden" name="order" error={state.fieldErrors?.order}>
          <TextInput id="order" name="order" type="number" defaultValue={faq?.order ?? 0} />
        </FormField>
        <FormField label="Estado" name="status" error={state.fieldErrors?.status}>
          <Select id="status" name="status" defaultValue={faq?.status ?? "DRAFT"}>
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </Select>
        </FormField>
      </div>
      <FormStatusBanner state={state} />
      <SubmitButton>{faq ? "Guardar cambios" : "Agregar pregunta"}</SubmitButton>
    </form>
  );
}
