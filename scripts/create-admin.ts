/**
 * Aprovisiona (o actualiza la clave de) el primer usuario administrador.
 * Uso:
 *   npx tsx scripts/create-admin.ts
 * Lee ADMIN_EMAIL, ADMIN_PASSWORD y ADMIN_NAME desde el entorno (.env).
 * Nunca se incluyen credenciales por defecto en el código.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Administrador";

  if (!email || !password) {
    console.error(
      "Define ADMIN_EMAIL y ADMIN_PASSWORD en tu archivo .env antes de ejecutar este script."
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("ADMIN_PASSWORD debe tener al menos 8 caracteres.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, name, isActive: true },
    update: { passwordHash, name, isActive: true },
  });

  console.log(`Usuario administrador listo: ${user.email}`);
  console.log("Recuerda eliminar ADMIN_PASSWORD de tu .env o cambiarla luego de este primer acceso.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
