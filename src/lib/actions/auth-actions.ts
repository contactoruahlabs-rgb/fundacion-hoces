"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  createSession,
  destroySession,
  getClientIpHash,
  getSessionUser,
  logAdminActivity,
  recordFailedLogin,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "@/lib/action-state";

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los datos ingresados.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const ipHash = await getClientIpHash();

  const rateLimit = await checkLoginRateLimit(email, ipHash);
  if (!rateLimit.allowed) {
    return {
      ok: false,
      message: `Demasiados intentos fallidos. Vuelve a intentarlo en ${rateLimit.minutes} minuto(s).`,
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;

  if (!user || !valid || !user.isActive) {
    await recordFailedLogin(email, ipHash);
    return { ok: false, message: "Correo o contraseña incorrectos." };
  }

  await clearLoginAttempts(email, ipHash);
  await createSession(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await logAdminActivity(user.id, "LOGIN", "User", user.id);

  redirect("/admin");
}

export async function logoutAction() {
  const user = await getSessionUser();
  if (user) {
    await logAdminActivity(user.id, "LOGOUT", "User", user.id);
  }
  await destroySession();
  redirect("/admin/login");
}
