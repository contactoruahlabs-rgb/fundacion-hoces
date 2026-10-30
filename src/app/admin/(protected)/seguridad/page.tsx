import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminSecurityPage() {
  const [logs, activeSessions, lockedAttempts, users] = await Promise.all([
    prisma.adminActivityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: true },
    }),
    prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
    prisma.loginAttempt.findMany({ where: { lockedUntil: { gt: new Date() } } }),
    prisma.user.findMany({ select: { id: true, email: true, name: true, isActive: true, lastLoginAt: true } }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Seguridad y registros</h1>
      <p className="mt-1 text-sm text-forest/60">
        Sesiones activas, intentos de inicio de sesión bloqueados y registro de actividad administrativa.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="font-heading text-2xl font-bold text-forest">{activeSessions}</p>
          <p className="text-sm text-forest/60">Sesiones activas</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="font-heading text-2xl font-bold text-forest">{users.length}</p>
          <p className="text-sm text-forest/60">Usuarios administradores</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="font-heading text-2xl font-bold text-danger">{lockedAttempts.length}</p>
          <p className="text-sm text-forest/60">Bloqueos activos por intentos fallidos</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-subheading text-base text-forest">Usuarios</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase text-forest/60">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Último acceso</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.lastLoginAt ? formatDate(u.lastLoginAt) : "Nunca"}</td>
                  <td className="px-4 py-3">{u.isActive ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-forest/50">
          Los usuarios se crean mediante el script <code>scripts/create-admin.ts</code>, nunca desde un
          formulario público.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="font-subheading text-base text-forest">Actividad reciente</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase text-forest/60">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Entidad</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-border">
                  <td className="px-4 py-3">{log.user.name}</td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">
                    {log.entityType}
                    {log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ""}
                  </td>
                  <td className="px-4 py-3">{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
