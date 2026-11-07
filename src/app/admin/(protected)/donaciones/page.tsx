import { prisma } from "@/lib/prisma";
import { formatCLP } from "@/lib/utils";

export default async function AdminDonationsPage() {
  const donations = await prisma.donation.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  const totalApproved = donations
    .filter((d) => d.status === "APPROVED")
    .reduce((acc, d) => acc + d.amount, 0);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Transbank / Mercado Pago</h1>
      <p className="mt-1 text-sm text-forest/60">
        Estado de las pasarelas de pago e historial de donaciones registradas.
      </p>

      <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface-muted p-6">
        <h2 className="font-subheading text-base text-forest">Estado: Webpay conectado en producción</h2>
        <p className="mt-2 text-sm text-forest/70">
          Webpay Plus está activo con las credenciales productivas de Transbank: los pagos que entran por el
          sitio público mueven dinero real. Mercado Pago todavía no está conectado.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="font-subheading text-base text-forest">
          Donaciones registradas ({donations.length})
        </h2>
        <p className="mt-1 text-xs text-forest/50">Total aprobado: {formatCLP(totalApproved)}</p>
        {donations.length === 0 ? (
          <p className="mt-4 text-sm text-forest/60">Aún no hay donaciones registradas en el sistema.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted text-xs uppercase text-forest/60">
                <tr>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Donante</th>
                  <th className="px-4 py-3">Dedicatoria</th>
                  <th className="px-4 py-3">Pasarela</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="px-4 py-3">{formatCLP(d.amount)}</td>
                    <td className="px-4 py-3">{d.donorName || "—"}</td>
                    <td className="px-4 py-3">{d.dedication || "—"}</td>
                    <td className="px-4 py-3">{d.gateway}</td>
                    <td className="px-4 py-3">{d.status}</td>
                    <td className="px-4 py-3">{d.createdAt.toLocaleDateString("es-CL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
