"use client";

import { useActionState } from "react";
import { updateSiteSettingAction } from "@/lib/actions/settings-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, TextArea, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import type { SiteSetting } from "@prisma/client";

export function SiteSettingForm({ settings }: { settings: SiteSetting }) {
  const [state, formAction] = useActionState(updateSiteSettingAction, initialActionState);

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-5">
        <h2 className="font-subheading text-sm uppercase tracking-wide text-olive">Identidad institucional</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Nombre público" name="orgName" required error={state.fieldErrors?.orgName}>
            <TextInput id="orgName" name="orgName" defaultValue={settings.orgName} required />
          </FormField>
          <FormField label="Razón social / nombre legal" name="legalName" error={state.fieldErrors?.legalName}>
            <TextInput id="legalName" name="legalName" defaultValue={settings.legalName} />
          </FormField>
          <FormField label="RUT" name="rut" error={state.fieldErrors?.rut}>
            <TextInput id="rut" name="rut" defaultValue={settings.rut} />
          </FormField>
          <FormField label="Representante legal" name="legalRepresentative" error={state.fieldErrors?.legalRepresentative}>
            <TextInput id="legalRepresentative" name="legalRepresentative" defaultValue={settings.legalRepresentative} />
          </FormField>
          <FormField label="Lema / eslogan" name="slogan" error={state.fieldErrors?.slogan}>
            <TextInput id="slogan" name="slogan" defaultValue={settings.slogan} />
          </FormField>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-subheading text-sm uppercase tracking-wide text-olive">Contacto y ubicación</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Dirección" name="address" error={state.fieldErrors?.address}>
            <TextInput id="address" name="address" defaultValue={settings.address} />
          </FormField>
          <FormField label="Comuna" name="comuna" error={state.fieldErrors?.comuna}>
            <TextInput id="comuna" name="comuna" defaultValue={settings.comuna} />
          </FormField>
          <FormField label="Región" name="region" error={state.fieldErrors?.region}>
            <TextInput id="region" name="region" defaultValue={settings.region} />
          </FormField>
          <FormField label="Teléfono" name="phone" error={state.fieldErrors?.phone}>
            <TextInput id="phone" name="phone" defaultValue={settings.phone} />
          </FormField>
          <FormField label="WhatsApp" name="whatsapp" hint="Incluye el código de país, ej: +56912345678" error={state.fieldErrors?.whatsapp}>
            <TextInput id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp} />
          </FormField>
          <FormField label="Correo electrónico" name="email" error={state.fieldErrors?.email}>
            <TextInput id="email" name="email" type="email" defaultValue={settings.email} />
          </FormField>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-subheading text-sm uppercase tracking-wide text-olive">Redes sociales</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Instagram (usuario)" name="instagram" error={state.fieldErrors?.instagram}>
            <TextInput id="instagram" name="instagram" defaultValue={settings.instagram} />
          </FormField>
          <FormField label="Facebook (usuario)" name="facebook" error={state.fieldErrors?.facebook}>
            <TextInput id="facebook" name="facebook" defaultValue={settings.facebook} />
          </FormField>
          <FormField label="TikTok (usuario)" name="tiktok" error={state.fieldErrors?.tiktok}>
            <TextInput id="tiktok" name="tiktok" defaultValue={settings.tiktok} />
          </FormField>
          <FormField label="YouTube (URL)" name="youtube" error={state.fieldErrors?.youtube}>
            <TextInput id="youtube" name="youtube" defaultValue={settings.youtube} />
          </FormField>
          <FormField label="LinkedIn (URL)" name="linkedin" error={state.fieldErrors?.linkedin}>
            <TextInput id="linkedin" name="linkedin" defaultValue={settings.linkedin} />
          </FormField>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-subheading text-sm uppercase tracking-wide text-olive">Donaciones</h2>
        <FormField
          label="Montos sugeridos (JSON, en pesos chilenos)"
          name="donationSuggestedAmounts"
          hint="Ejemplo: [10000,20000,50000,100000]"
          error={state.fieldErrors?.donationSuggestedAmounts}
        >
          <TextInput
            id="donationSuggestedAmounts"
            name="donationSuggestedAmounts"
            defaultValue={settings.donationSuggestedAmounts}
            className="font-mono text-xs"
          />
        </FormField>
        <FormField
          label="Datos bancarios para donar"
          name="donationBankInfo"
          hint="Se muestra en la página de Donaciones. Déjalo vacío si prefieres coordinar todo por WhatsApp."
          error={state.fieldErrors?.donationBankInfo}
        >
          <TextArea id="donationBankInfo" name="donationBankInfo" rows={3} defaultValue={settings.donationBankInfo} />
        </FormField>
      </section>

      <section className="space-y-5">
        <h2 className="font-subheading text-sm uppercase tracking-wide text-olive">Pie de página y SEO</h2>
        <FormField label="Texto del pie de página" name="footerText" error={state.fieldErrors?.footerText}>
          <TextArea id="footerText" name="footerText" rows={2} defaultValue={settings.footerText} />
        </FormField>
        <FormField
          label="Descripción meta por defecto"
          name="metaDescriptionDefault"
          hint="Se usa en buscadores cuando una página no define su propia descripción."
          error={state.fieldErrors?.metaDescriptionDefault}
        >
          <TextArea
            id="metaDescriptionDefault"
            name="metaDescriptionDefault"
            rows={2}
            defaultValue={settings.metaDescriptionDefault}
          />
        </FormField>
      </section>

      <FormStatusBanner state={state} />
      <SubmitButton>Guardar configuración</SubmitButton>
    </form>
  );
}
