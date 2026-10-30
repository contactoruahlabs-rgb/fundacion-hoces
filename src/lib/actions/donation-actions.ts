"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { createTransbankTransaction, commitTransbankTransaction } from "@/lib/payments/transbank";

const MIN_AMOUNT_CLP = 1000;
const MAX_AMOUNT_CLP = 5_000_000;

type StartResult = { ok: true; url: string; token: string } | { ok: false; message: string };

export async function createTransbankDonationAction(input: {
  amount: number;
  donorName: string;
  donorEmail: string;
}): Promise<StartResult> {
  const amount = Math.trunc(input.amount);
  if (!Number.isFinite(amount) || amount < MIN_AMOUNT_CLP || amount > MAX_AMOUNT_CLP) {
    return {
      ok: false,
      message: `El monto debe estar entre ${MIN_AMOUNT_CLP.toLocaleString("es-CL")} y ${MAX_AMOUNT_CLP.toLocaleString("es-CL")} CLP.`,
    };
  }

  const donorName = input.donorName.trim().slice(0, 160);
  const donorEmail = input.donorEmail.trim().slice(0, 200);
  if (!donorName || !donorEmail) {
    return { ok: false, message: "Nombre y correo son obligatorios." };
  }

  const buyOrder = `hoces-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const returnUrl = `${siteUrl}/donaciones/retorno`;

  const donation = await prisma.donation.create({
    data: { amount, gateway: "TRANSBANK", status: "PENDING", donorName, donorEmail, buyOrder },
  });

  try {
    const response = await createTransbankTransaction(buyOrder, donation.id, amount, returnUrl);
    await prisma.donation.update({ where: { id: donation.id }, data: { token: response.token } });
    return { ok: true, url: response.url, token: response.token };
  } catch (err) {
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: "REJECTED",
        errorLog: err instanceof Error ? err.message : "Error desconocido al crear la transacción.",
      },
    });
    return { ok: false, message: "No se pudo iniciar el pago con Webpay. Intenta nuevamente o usa WhatsApp." };
  }
}

export type DonationResult = {
  status: "APPROVED" | "REJECTED" | "CANCELLED" | "ERROR";
  amount?: number;
  buyOrder?: string;
  authorizationCode?: string;
  message: string;
};

export async function confirmTransbankDonation(tokenWs: string): Promise<DonationResult> {
  const donation = await prisma.donation.findUnique({ where: { token: tokenWs } });
  if (!donation) {
    return { status: "ERROR", message: "No encontramos un pago pendiente asociado a este intento." };
  }
  if (donation.status === "APPROVED") {
    return {
      status: "APPROVED",
      amount: donation.amount,
      buyOrder: donation.buyOrder ?? undefined,
      message: "Este pago ya había sido confirmado anteriormente.",
    };
  }

  try {
    const response = await commitTransbankTransaction(tokenWs);

    const matchesOrder = response.buy_order === donation.buyOrder;
    const matchesAmount = response.amount === donation.amount;
    const approved = response.response_code === 0 && response.status === "AUTHORIZED";

    if (approved && matchesOrder && matchesAmount) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: "APPROVED",
          externalId: response.authorization_code,
          confirmedAt: new Date(),
        },
      });
      return {
        status: "APPROVED",
        amount: donation.amount,
        buyOrder: donation.buyOrder ?? undefined,
        authorizationCode: response.authorization_code,
        message: "Pago aprobado.",
      };
    }

    const reason = !matchesOrder || !matchesAmount ? "La respuesta de Transbank no coincide con el pedido original." : "El pago fue rechazado.";
    await prisma.donation.update({
      where: { id: donation.id },
      data: { status: "REJECTED", errorLog: reason },
    });
    return { status: "REJECTED", amount: donation.amount, message: reason };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido al confirmar el pago.";
    await prisma.donation.update({ where: { id: donation.id }, data: { status: "REJECTED", errorLog: message } });
    return { status: "ERROR", amount: donation.amount, message: "No se pudo confirmar el pago con Transbank." };
  }
}

export async function cancelTransbankDonation(buyOrder: string): Promise<DonationResult> {
  const donation = await prisma.donation.findUnique({ where: { buyOrder } });
  if (!donation) {
    return { status: "ERROR", message: "No encontramos el pedido asociado." };
  }
  if (donation.status === "PENDING") {
    await prisma.donation.update({ where: { id: donation.id }, data: { status: "CANCELLED" } });
  }
  return { status: "CANCELLED", amount: donation.amount, buyOrder: donation.buyOrder ?? undefined, message: "Pago cancelado por el usuario." };
}
