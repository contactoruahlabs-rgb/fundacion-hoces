"use client";

import { useActionState } from "react";
import { updateAboutContentAction } from "@/lib/actions/settings-actions";
import { initialActionState } from "@/lib/action-state";
import { TextArea, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import type { AboutContent } from "@prisma/client";

export function AboutContentForm({ about }: { about: AboutContent }) {
  const [state, formAction] = useActionState(updateAboutContentAction, initialActionState);

  return (
    <form action={formAction} className="space-y-6">
      <FormField label="Historia" name="historia" hint="Deja una línea en blanco entre párrafos." error={state.fieldErrors?.historia}>
        <TextArea id="historia" name="historia" rows={8} defaultValue={about.historia} />
      </FormField>
      <FormField label="Propósito" name="proposito" error={state.fieldErrors?.proposito}>
        <TextArea id="proposito" name="proposito" rows={6} defaultValue={about.proposito} />
      </FormField>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Misión" name="mision" error={state.fieldErrors?.mision}>
          <TextArea id="mision" name="mision" rows={8} defaultValue={about.mision} />
        </FormField>
        <FormField label="Visión" name="vision" error={state.fieldErrors?.vision}>
          <TextArea id="vision" name="vision" rows={8} defaultValue={about.vision} />
        </FormField>
      </div>
      <FormField
        label="Valores (formato JSON)"
        name="valores"
        hint='Ejemplo: [{"titulo":"Amor"},{"titulo":"Respeto"}]'
        error={state.fieldErrors?.valores}
      >
        <TextArea id="valores" name="valores" rows={3} defaultValue={about.valores} className="font-mono text-xs" />
      </FormField>
      <FormField
        label="Hitos (formato JSON)"
        name="hitos"
        hint='Ejemplo: [{"anio":"2025","texto":"Fundación e inauguración"}]'
        error={state.fieldErrors?.hitos}
      >
        <TextArea id="hitos" name="hitos" rows={3} defaultValue={about.hitos} className="font-mono text-xs" />
      </FormField>
      <FormField label="Enfoque cristiano" name="enfoqueCristiano" error={state.fieldErrors?.enfoqueCristiano}>
        <TextArea id="enfoqueCristiano" name="enfoqueCristiano" rows={5} defaultValue={about.enfoqueCristiano} />
      </FormField>
      <FormField label="Versículo (opcional)" name="versiculo" error={state.fieldErrors?.versiculo}>
        <TextArea id="versiculo" name="versiculo" rows={2} defaultValue={about.versiculo} />
      </FormField>

      <FormStatusBanner state={state} />
      <SubmitButton>Guardar cambios</SubmitButton>
    </form>
  );
}
