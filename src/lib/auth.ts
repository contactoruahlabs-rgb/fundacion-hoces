import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, createHash, createHmac } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth-cookie-name";

export { SESSION_COOKIE };
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_MS = 15 * 60 * 1000; // 15 minutos

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET no está configurado. Defínelo en .env (ver .env.example)."
    );
  }
  return secret;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function hashIp(ip: string) {
  return createHmac("sha256", authSecret()).update(ip).digest("hex").slice(0, 32);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getClientIpHash() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return hashIp(ip);
}

export async function checkLoginRateLimit(email: string, ipHash: string) {
  const attempt = await prisma.loginAttempt.findUnique({
    where: { email_ipHash: { email, ipHash } },
  });
  if (attempt?.lockedUntil && attempt.lockedUntil > new Date()) {
    const minutes = Math.ceil((attempt.lockedUntil.getTime() - Date.now()) / 60000);
    return { allowed: false, minutes };
  }
  return { allowed: true, minutes: 0 };
}

export async function recordFailedLogin(email: string, ipHash: string) {
  const existing = await prisma.loginAttempt.findUnique({
    where: { email_ipHash: { email, ipHash } },
  });
  if (!existing) {
    await prisma.loginAttempt.create({ data: { email, ipHash, attemptCount: 1 } });
    return;
  }
  const windowExpired = Date.now() - existing.firstAttemptAt.getTime() > LOGIN_LOCK_MS;
  const nextCount = windowExpired ? 1 : existing.attemptCount + 1;
  const lockedUntil =
    nextCount >= LOGIN_MAX_ATTEMPTS ? new Date(Date.now() + LOGIN_LOCK_MS) : null;
  await prisma.loginAttempt.update({
    where: { id: existing.id },
    data: {
      attemptCount: nextCount,
      firstAttemptAt: windowExpired ? new Date() : existing.firstAttemptAt,
      lockedUntil,
    },
  });
}

export async function clearLoginAttempts(email: string, ipHash: string) {
  await prisma.loginAttempt
    .delete({ where: { email_ipHash: { email, ipHash } } })
    .catch(() => undefined);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const h = await headers();
  const userAgent = h.get("user-agent") ?? "";
  const ipHash = await getClientIpHash();

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      userAgent: userAgent.slice(0, 255),
      ipHash,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + SESSION_TTL_MS),
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session
      .delete({ where: { tokenHash: hashToken(token) } })
      .catch(() => undefined);
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || !session.user.isActive) {
    return null;
  }

  return session.user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function logAdminActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  await prisma.adminActivityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    },
  });
}
