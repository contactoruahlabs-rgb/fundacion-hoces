import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre").max(120),
  email: z.string().trim().email("Ingresa un correo válido").max(180),
  phone: z.string().trim().max(40).optional().default(""),
  reason: z.enum([
    "INFORMACION",
    "AGENDAR_HORA",
    "DONACION",
    "COLEGIOS",
    "VOLUNTARIADO",
    "OTRO",
  ]),
  message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)").max(4000),
  consentPrivacy: z.literal(true, {
    message: "Debes aceptar la política de privacidad para enviar el formulario",
  }),
  website: z.string().optional().default(""), // honeypot anti-spam: se valida manualmente en la acción, no aquí
});

export const programSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/, "Usa minúsculas, números y guiones"),
  shortDescription: z.string().trim().max(300).optional().default(""),
  description: z.string().trim().max(8000).optional().default(""),
  targetAudience: z.string().trim().max(2000).optional().default(""),
  objectives: z.string().trim().max(4000).optional().default(""),
  activities: z.string().trim().max(4000).optional().default(""),
  ctaLabel: z.string().trim().max(80).optional().default("Consultar por este servicio"),
  ctaLink: z.string().trim().max(300).optional().default(""),
  coverImageId: z.string().optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
});

export const teamMemberSchema = z.object({
  group: z.enum(["EQUIPO", "DIRECTORIO"]).optional().default("EQUIPO"),
  name: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(160),
  specialty: z.string().trim().max(300).optional().default(""),
  experienceYears: z.coerce.number().int().min(0).max(80).optional().nullable(),
  bio: z.string().trim().max(3000).optional().default(""),
  photoId: z.string().optional().nullable(),
  showPhoto: z.coerce.boolean().optional().default(false),
  isPlaceholder: z.coerce.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
});

export const newsPostSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Usa minúsculas, números y guiones"),
  subtitle: z.string().trim().max(300).optional().default(""),
  body: z.string().trim().max(20000).optional().default(""),
  category: z.string().trim().max(80).optional().default("Noticias"),
  author: z.string().trim().max(160).optional().default("Fundación HOCES"),
  coverImageId: z.string().optional().nullable(),
  metaTitle: z.string().trim().max(160).optional().default(""),
  metaDescription: z.string().trim().max(300).optional().default(""),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
});

export const documentSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().default(""),
  category: z.enum(["MEMORIA_ANUAL", "INFORME_GESTION", "TRANSPARENCIA", "OTRO"]),
  year: z.coerce.number().int().min(1990).max(2100),
  coverImageId: z.string().optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
});

export const testimonialSchema = z.object({
  authorLabel: z.string().trim().min(2).max(160),
  content: z.string().trim().min(5).max(3000),
  isAnonymous: z.coerce.boolean().optional().default(true),
  consentGiven: z.coerce.boolean().optional().default(false),
  mediaId: z.string().optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
});

export const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(3000),
  order: z.coerce.number().int().optional().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
});

export const siteSettingSchema = z.object({
  orgName: z.string().trim().min(2).max(160),
  legalName: z.string().trim().max(200).optional().default(""),
  rut: z.string().trim().max(20).optional().default(""),
  legalRepresentative: z.string().trim().max(160).optional().default(""),
  slogan: z.string().trim().max(160).optional().default(""),
  address: z.string().trim().max(300).optional().default(""),
  comuna: z.string().trim().max(120).optional().default(""),
  region: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  whatsapp: z.string().trim().max(40).optional().default(""),
  email: z.string().trim().max(180).optional().default(""),
  instagram: z.string().trim().max(120).optional().default(""),
  facebook: z.string().trim().max(120).optional().default(""),
  tiktok: z.string().trim().max(120).optional().default(""),
  youtube: z.string().trim().max(200).optional().default(""),
  linkedin: z.string().trim().max(200).optional().default(""),
  footerText: z.string().trim().max(1000).optional().default(""),
  donationBankInfo: z.string().trim().max(2000).optional().default(""),
  donationSuggestedAmounts: z.string().trim().optional().default("[]"),
  metaDescriptionDefault: z.string().trim().max(300).optional().default(""),
});

export const aboutContentSchema = z.object({
  historia: z.string().trim().max(8000).optional().default(""),
  mision: z.string().trim().max(4000).optional().default(""),
  vision: z.string().trim().max(4000).optional().default(""),
  proposito: z.string().trim().max(4000).optional().default(""),
  valores: z.string().trim().optional().default("[]"),
  hitos: z.string().trim().optional().default("[]"),
  enfoqueCristiano: z.string().trim().max(4000).optional().default(""),
  versiculo: z.string().trim().max(500).optional().default(""),
});

export const homeBlockSchema = z.object({
  type: z.string().trim().min(2).max(60),
  order: z.coerce.number().int().optional().default(0),
  visible: z.coerce.boolean().optional().default(true),
  title: z.string().trim().max(200).optional().default(""),
  subtitle: z.string().trim().max(300).optional().default(""),
  body: z.string().trim().max(4000).optional().default(""),
  ctaLabel: z.string().trim().max(80).optional().default(""),
  ctaLink: z.string().trim().max(300).optional().default(""),
  imageId: z.string().optional().nullable(),
  extraJson: z.string().trim().optional().default("{}"),
});
