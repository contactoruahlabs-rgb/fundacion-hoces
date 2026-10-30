"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactAction } from "@/lib/actions/contact-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, TextArea, Select, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";

const REASONS = [
  { value: "INFORMACION", label: "Información general" },
  { value: "AGENDAR_HORA", label: "Agendar una hora" },
  { value: "DONACION", label: "Donaciones" },
  { value: "COLEGIOS", label: "Trabajo con colegios" },
  { value: "VOLUNTARIADO", label: "Voluntariado" },
  { value: "OTRO", label: "Otro" },
];

type PendingMessage = {
  name: string;
  email: string;
  phone: string;
  message: string;
  reason: string;
};

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [state, formAction] = useActionState(submitContactAction, initialActionState);
  const pendingRef = useRef<PendingMessage | null>(null);

  // React 19 limpia los campos del formulario apenas la Server Action resuelve con éxito,
  // así que los datos para WhatsApp se capturan en el submit (antes del reset), no después.
  useEffect(() => {
    if (!state.ok || !pendingRef.current) return;
    const { name, email, phone, message, reason } = pendingRef.current;
    const reasonLabel = REASONS.find((r) => r.value === reason)?.label || "";

    const text = [
      `Hola, soy ${name}.`,
      reasonLabel && `Motivo: ${reasonLabel}.`,
      message && `Mensaje: ${message}`,
      email && `Mi correo: ${email}`,
      phone && `Mi teléfono: ${phone}`,
    ]
      .filter(Boolean)
      .join("\n");

    pendingRef.current = null;
    const digits = whatsapp.replace(/\D/g, "");
    window.location.href = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }, [state, whatsapp]);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const data = new FormData(e.currentTarget);
        pendingRef.current = {
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          phone: String(data.get("phone") || ""),
          message: String(data.get("message") || ""),
          reason: String(data.get("reason") || ""),
        };
      }}
      className="space-y-5"
      noValidate
    >
      {/* Honeypot anti-spam: invisible para personas, visible para bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">No completar este campo</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <FormField label="Nombre completo" name="name" required error={state.fieldErrors?.name}>
        <TextInput id="name" name="name" required maxLength={120} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Correo electrónico" name="email" required error={state.fieldErrors?.email}>
          <TextInput id="email" name="email" type="email" required maxLength={180} />
        </FormField>
        <FormField label="Teléfono (opcional)" name="phone" error={state.fieldErrors?.phone}>
          <TextInput id="phone" name="phone" maxLength={40} />
        </FormField>
      </div>

      <FormField label="Motivo de contacto" name="reason" required error={state.fieldErrors?.reason}>
        <Select id="reason" name="reason" defaultValue="INFORMACION" required>
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Mensaje" name="message" required error={state.fieldErrors?.message}>
        <TextArea id="message" name="message" rows={5} required maxLength={4000} />
      </FormField>

      <label className="flex items-start gap-2 text-sm text-forest/80">
        <input type="checkbox" name="consentPrivacy" required className="mt-1 h-4 w-4 rounded border-border text-olive" />
        <span>
          Acepto que mis datos sean usados para responder este mensaje, de acuerdo a la{" "}
          <a href="/privacidad" className="text-olive underline">
            política de privacidad
          </a>
          .
        </span>
      </label>
      {state.fieldErrors?.consentPrivacy && (
        <p className="text-xs text-danger" role="alert">
          {state.fieldErrors.consentPrivacy}
        </p>
      )}

      <FormStatusBanner state={state} />

      <SubmitButton>Enviar y continuar por WhatsApp</SubmitButton>
      <p className="text-center text-xs text-forest/50">
        Al enviar, te llevaremos a WhatsApp con tu mensaje ya escrito.
      </p>
    </form>
  );
}
