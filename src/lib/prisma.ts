import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Adaptador nativo (node-postgres) en vez del motor Rust de Prisma: evita el
// arranque en frío de ese binario en funciones serverless, que podía tardar
// varios segundos y disparar el timeout de la función en rutas poco
// visitadas (el panel de administración).
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  connectionTimeoutMillis: 20_000,
  // El certificado del pooler de Supabase cuelga de una CA intermedia que
  // Node no trae en su almacén por defecto; sin esto, pg rechaza la
  // conexión TLS con "self-signed certificate in certificate chain".
  ssl: { rejectUnauthorized: false },
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
