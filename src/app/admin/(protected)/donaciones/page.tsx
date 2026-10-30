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
        <h2 className="font-subheading text-base text-forest">Estado: Webpay conectado en modo de prueba</h2>
        <p className="mt-2 text-sm text-forest/70">
          Webpay Plus ya está integrado y funcionando en el <strong>ambiente de integración</strong> de
          Transbank (sandbox): los pagos que entran por el sitio público usan credenciales de prueba y no
          mueven dinero real. Mercado Pago todavía no está conectado.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-forest/70">
          <li>
            Afiliar a la fundación como comercio en Transbank (RUT, certificado de vigencia, representante
            legal y cuenta bancaria de la fundación) para obtener código de comercio y API key productivos.
          </li>
          <li>
            Reemplazar <code>TRANSBANK_COMMERCE_CODE</code> / <code>TRANSBANK_API_KEY</code> por los valores
            reales y cambiar <code>TRANSBANK_ENVIRONMENT</code> a <code>&quot;production&quot;</code> cuando
            Transbank valide la integración.
          </li>
          <li>Crear una cuenta de Mercado Pago y obtener el Access Token y Public Key, si se quiere activar también.</li>
          <li>
            Definir si se activará también el sistema de reserva de horas con abono (mencionado por la
            fundación, con un abono sugerido de {formatCLP(10000)}).
          </li>
        </ul>
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
                  <th className="px-4 py-3">Pasarela</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="px-4 py-3">{formatCLP(d.amount)}</td>
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
