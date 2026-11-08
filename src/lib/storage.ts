import "server-only";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET ?? "media";

function getClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Configura el proyecto de Supabase (ver .env.example)."
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

const IMAGE_SIGNATURES: Array<{ mime: string; check: (b: Buffer) => boolean }> = [
  { mime: "image/png", check: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/jpeg", check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/webp", check: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
  { mime: "image/avif", check: (b) => b.subarray(4, 8).toString("ascii") === "ftyp" && b.subarray(8, 12).toString("ascii").includes("av") },
];

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024; // 25MB

export class UploadValidationError extends Error {}

function sniffImageMime(buffer: Buffer): string | null {
  for (const sig of IMAGE_SIGNATURES) {
    if (sig.check(buffer)) return sig.mime;
  }
  return null;
}

function safeExt(mime: string) {
  switch (mime) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    case "image/avif":
      return ".avif";
    case "application/pdf":
      return ".pdf";
    default:
      return "";
  }
}

async function uploadToBucket(key: string, buffer: Buffer, mimeType: string) {
  const supabase = getClient();
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(key, buffer, {
    contentType: mimeType,
    upsert: false,
  });
  if (error) throw new Error(`No se pudo subir el archivo a Supabase Storage: ${error.message}`);
  return supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key).data.publicUrl;
}

export async function saveImageUpload(file: File) {
  if (file.size === 0) throw new UploadValidationError("El archivo está vacío.");
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadValidationError("La imagen supera el tamaño máximo permitido (8MB).");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageMime(buffer);
  if (!sniffed) {
    throw new UploadValidationError(
      "El archivo no es una imagen válida (se aceptan PNG, JPG, WEBP o AVIF)."
    );
  }

  const key = `images/${randomUUID()}${safeExt(sniffed)}`;
  const publicUrl = await uploadToBucket(key, buffer, sniffed);

  return {
    path: publicUrl,
    filename: key.split("/").pop()!,
    mimeType: sniffed,
    size: buffer.length,
    // Las dimensiones no se extraen en el servidor (sin dependencia de procesamiento de
    // imágenes); <Image> de Next.js las infiere igualmente en el cliente cuando no se
    // le pasan width/height explícitos mediante `fill`.
    width: undefined,
    height: undefined,
  };
}

const ALLOWED_IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

// Vercel limita a ~4.5MB el cuerpo de una función serverless, por debajo del
// límite de 8MB que la app permite para imágenes. Para fotos reales de
// celular (frecuentemente >4.5MB) el archivo nunca pasa por nuestro
// servidor: el navegador sube directo a Supabase Storage con una URL
// firmada, y solo los metadatos (ya subido el archivo) llegan por la acción
// del servidor.
export async function createImageUploadTicket(mimeType: string, size: number) {
  const ext = ALLOWED_IMAGE_MIME_TO_EXT[mimeType];
  if (!ext) {
    throw new UploadValidationError(
      "El archivo no es una imagen válida (se aceptan PNG, JPG, WEBP o AVIF)."
    );
  }
  if (size <= 0) throw new UploadValidationError("El archivo está vacío.");
  if (size > MAX_IMAGE_BYTES) {
    throw new UploadValidationError("La imagen supera el tamaño máximo permitido (8MB).");
  }

  const key = `images/${randomUUID()}${ext}`;
  const supabase = getClient();
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).createSignedUploadUrl(key);
  if (error) throw new Error(`No se pudo preparar la subida: ${error.message}`);

  const publicUrl = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key).data.publicUrl;
  return {
    path: key,
    filename: key.split("/").pop()!,
    signedUrl: data.signedUrl,
    publicUrl,
  };
}

// Mismo motivo que createImageUploadTicket: un PDF de memoria anual suele
// superar los ~4.5MB que Vercel permite en el cuerpo de una función
// serverless, así que el navegador lo sube directo a Supabase Storage.
export async function createDocumentUploadTicket(mimeType: string, size: number) {
  if (mimeType !== "application/pdf") {
    throw new UploadValidationError("El archivo no es un PDF válido.");
  }
  if (size <= 0) throw new UploadValidationError("El archivo está vacío.");
  if (size > MAX_DOCUMENT_BYTES) {
    throw new UploadValidationError("El documento supera el tamaño máximo permitido (25MB).");
  }

  const key = `documents/${randomUUID()}.pdf`;
  const supabase = getClient();
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).createSignedUploadUrl(key);
  if (error) throw new Error(`No se pudo preparar la subida: ${error.message}`);

  const publicUrl = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key).data.publicUrl;
  return {
    path: key,
    filename: key.split("/").pop()!,
    signedUrl: data.signedUrl,
    publicUrl,
  };
}

export async function deleteUpload(publicUrl: string) {
  const marker = `/storage/v1/object/public/${SUPABASE_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const key = publicUrl.slice(idx + marker.length);
  const supabase = getClient();
  await supabase.storage.from(SUPABASE_BUCKET).remove([key]);
}
