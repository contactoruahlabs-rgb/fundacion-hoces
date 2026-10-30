import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/Container";
import { formatCLP } from "@/lib/utils";
import { confirmTransbankDonation, cancelTransbankDonation, type DonationResult } from "@/lib/actions/donation-actions";

export const metadata: Metadata = {
  title: "Resultado de tu donación",
  robots: { index: false, follow: false },
};

export default async function DonacionRetornoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const tokenWs = first(params.token_ws);
  const tbkToken = first(params.TBK_TOKEN);
  const tbkBuyOrder = first(params.TBK_ORDEN_COMPRA);

  let result: DonationResult;
  if (tokenWs) {
    result = await confirmTransbankDonation(tokenWs);
  } else if (tbkToken || tbkBuyOrder) {
    result = tbkBuyOrder
      ? await cancelTransbankDonation(tbkBuyOrder)
      : { status: "CANCELLED", message: "Pago cancelado." };
  } else {
    result = { status: "ERROR", message: "No recibimos un resultado válido de Transbank." };
  }

  const config: Record<DonationResult["status"], { title: string; tone: string; body: string }> = {
    APPROVED: {
      title: "¡Gracias por tu donación!",
      tone: "border-olive bg-olive/5",
      body: "Tu pago fue aprobado por Webpay. Pronto recibirás la confirmación en tu correo.",
    },
    REJECTED: {
      title: "El pago no pudo completarse",
      tone: "border-red-300 bg-red-50",
      body: "Webpay rechazó la transacción o no pudimos verificarla. No se realizó ningún cobro.",
    },
    CANCELLED: {
      title: "Donación cancelada",
      tone: "border-border bg-surface-muted",
      body: "Cancelaste el proceso de pago. No se realizó ningún cobro.",
    },
    ERROR: {
      title: "No pudimos confirmar el resultado",
      tone: "border-red-300 bg-red-50",
      body: "Ocurrió un problema al verificar tu pago. Si el cargo aparece en tu cuenta, escríbenos por WhatsApp para confirmarlo.",
    },
  };

  const view = config[result.status];

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-lg text-center">
        <div className={`rounded-3xl border p-8 ${view.tone}`}>
          <h1 className="font-heading text-2xl font-bold text-forest">{view.title}</h1>
          <p className="mt-3 text-sm text-forest/80">{view.body}</p>

          <dl className="mt-6 space-y-2 text-left text-sm text-forest/70">
            {result.amount != null && (
              <div className="flex justify-between border-b border-border/60 pb-2">
                <dt>Monto</dt>
                <dd className="font-semibold text-forest">{formatCLP(result.amount)}</dd>
              </div>
            )}
            {result.buyOrder && (
              <div className="flex justify-between border-b border-border/60 pb-2">
                <dt>N.º de pedido</dt>
                <dd className="font-mono text-xs">{result.buyOrder}</dd>
              </div>
            )}
            {result.authorizationCode && (
              <div className="flex justify-between">
                <dt>Código de autorización</dt>
                <dd className="font-mono text-xs">{result.authorizationCode}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href="/donaciones" className="text-sm font-semibold text-olive hover:underline">
            Volver a Donaciones
          </Link>
          <Link href="/" className="text-sm text-forest/60 hover:underline">
            Ir al inicio
          </Link>
        </div>
      </Container>
    </div>
  );
}
