"use client";

import { useActionState } from "react";
import { updateHomeBlockAction } from "@/lib/actions/home-block-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, TextArea, Checkbox, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { ImagePicker, type MediaOption } from "@/components/admin/ImagePicker";
import type { HomeBlock } from "@prisma/client";

const TYPE_LABELS: Record<string, string> = {
  HERO: "Portada principal",
  INTRO: "Presentación breve",
  MISSION_VISION: "Misión y visión",
  PROGRAMS: "Programas destacados",
  IMPACT: "Cifras de impacto",
  DONATIONS: "Donaciones",
  NEWS: "Noticias destacadas",
  MEMORIAS: "Transparencia / memorias",
  COLLAB: "Súmate / colabora",
};

export function HomeBlockForm({ block, mediaOptions }: { block: HomeBlock; mediaOptions: MediaOption[] }) {
  const action = updateHomeBlockAction.bind(null, block.id);
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <details className="rounded-2xl border border-border bg-white" open={!block.visible}>
      <summary className="flex cursor-pointer items-center justify-between px-6 py-4">
        <span className="font-subheading text-forest">{TYPE_LABELS[block.type] ?? block.type}</span>
        <span className={`text-xs font-semibold ${block.visible ? "text-success" : "text-forest/40"}`}>
          {block.visible ? "Visible" : "Oculto"}
        </span>
      </summary>
      <div className="border-t border-border px-6 py-6">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="type" value={block.type} />
          <Checkbox label="Mostrar esta sección en la página de inicio" name="visible" defaultChecked={block.visible} />

          <FormField label="Título" name="title" error={state.fieldErrors?.title}>
            <TextInput id={`title-${block.id}`} name="title" defaultValue={block.title} />
          </FormField>
          <FormField label="Subtítulo" name="subtitle" error={state.fieldErrors?.subtitle}>
            <TextInput id={`subtitle-${block.id}`} name="subtitle" defaultValue={block.subtitle} />
          </FormField>
          <FormField label="Texto" name="body" error={state.fieldErrors?.body}>
            <TextArea id={`body-${block.id}`} name="body" rows={3} defaultValue={block.body} />
          </FormField>

          {(block.type === "HERO" || block.type === "INTRO" || block.type === "DONATIONS" || block.type === "MEMORIAS" || block.type === "COLLAB") && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Texto del botón" name="ctaLabel" error={state.fieldErrors?.ctaLabel}>
                <TextInput id={`ctaLabel-${block.id}`} name="ctaLabel" defaultValue={block.ctaLabel} />
              </FormField>
              <FormField label="Enlace del botón" name="ctaLink" error={state.fieldErrors?.ctaLink}>
                <TextInput id={`ctaLink-${block.id}`} name="ctaLink" defaultValue={block.ctaLink} />
              </FormField>
            </div>
          )}

          {block.type === "HERO" && (
            <ImagePicker name="imageId" label="Imagen de fondo (opcional)" options={mediaOptions} defaultValue={block.imageId} />
          )}

          <FormField label="Orden" name="order" error={state.fieldErrors?.order}>
            <TextInput id={`order-${block.id}`} name="order" type="number" defaultValue={block.order} />
          </FormField>
          <input type="hidden" name="extraJson" value={block.extraJson} />

          <FormStatusBanner state={state} />
          <SubmitButton>Guardar sección</SubmitButton>
        </form>
      </div>
    </details>
  );
}
