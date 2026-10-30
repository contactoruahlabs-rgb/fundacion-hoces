// Aislado de auth.ts (que importa Prisma y bcrypt) para que el middleware,
// que corre en el Edge Runtime, pueda leer el nombre de la cookie sin
// arrastrar dependencias de Node.
export const SESSION_COOKIE = "hoces_session";
