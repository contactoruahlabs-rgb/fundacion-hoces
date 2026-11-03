"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createMediaUploadTicketAction, confirmMediaUploadAction } from "@/lib/actions/media-actions";
import { TextInput, FormField } from "@/components/admin/FormField";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];

export function MediaUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [altError, setAltError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setAltError(undefined);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const altText = (form.elements.namedItem("altText") as HTMLInputElement).value.trim();
    const description = (form.elements.namedItem("description") as HTMLInputElement).value.trim();
    const file = fileInput.files?.[0];

    if (!file) {
      setMessage({ ok: false, text: "Selecciona una imagen para subir." });
      return;
    }
    if (!altText) {
      setAltError("Describe brevemente la imagen");
      setMessage({ ok: false, text: "El texto alternativo es obligatorio (accesibilidad)." });
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage({ ok: false, text: "El archivo no es una imagen válida (se aceptan PNG, JPG, WEBP o AVIF)." });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage({ ok: false, text: "La imagen supera el tamaño máximo permitido (8MB)." });
      return;
    }

    setIsUploading(true);
    try {
      const ticketRes = await createMediaUploadTicketAction(file.type, file.size);
      if (!ticketRes.ok) {
        setMessage({ ok: false, text: ticketRes.message });
        return;
      }
      const { ticket } = ticketRes;

      const uploadRes = await fetch(ticket.signedUrl, {
        method: "PUT",
        headers: {
          "content-type": file.type,
          "x-upsert": "false",
          "cache-control": "max-age=3600",
        },
        body: file,
      });
      if (!uploadRes.ok) {
        setMessage({ ok: false, text: "No se pudo subir la imagen al almacenamiento. Intenta nuevamente." });
        return;
      }

      const confirmRes = await confirmMediaUploadAction({
        path: ticket.path,
        filename: ticket.filename,
        publicUrl: ticket.publicUrl,
        mimeType: file.type,
        size: file.size,
        altText,
        description,
      });
      if (!confirmRes.ok) {
        setMessage({ ok: false, text: confirmRes.message });
        return;
      }

      setMessage({ ok: true, text: confirmRes.message });
      formRef.current?.reset();
      router.refresh();
    } catch {
      setMessage({ ok: false, text: "No se pudo subir la imagen. Revisa tu conexión e intenta nuevamente." });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-white p-6">
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
        error={altError}
      >
        <TextInput id="altText" name="altText" required maxLength={200} />
      </FormField>
      <FormField label="Descripción / uso previsto (opcional)" name="description">
        <TextInput id="description" name="description" maxLength={300} />
      </FormField>
      {message && (
        <p className={`rounded-lg px-3 py-2 text-sm ${message.ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={isUploading}
        className="rounded-full bg-olive px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isUploading ? "Subiendo..." : "Subir imagen"}
      </button>
    </form>
  );
}
