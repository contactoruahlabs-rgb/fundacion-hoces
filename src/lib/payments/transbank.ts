import "server-only";
import { WebpayPlus } from "transbank-sdk";

// Credenciales públicas de integración (pruebas) documentadas por Transbank:
// https://www.transbankdevelopers.cl/documentacion/como_empezar
const INTEGRATION_COMMERCE_CODE = "597055555532";
const INTEGRATION_API_KEY = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";

export class TransbankConfigError extends Error {}

function getTransaction() {
  const isProduction = process.env.TRANSBANK_ENVIRONMENT === "production";

  if (isProduction) {
    const commerceCode = process.env.TRANSBANK_COMMERCE_CODE;
    const apiKey = process.env.TRANSBANK_API_KEY;
    if (!commerceCode || !apiKey) {
      throw new TransbankConfigError(
        "TRANSBANK_ENVIRONMENT=production requiere TRANSBANK_COMMERCE_CODE y TRANSBANK_API_KEY."
      );
    }
    return WebpayPlus.Transaction.buildForProduction(commerceCode, apiKey);
  }

  const commerceCode = process.env.TRANSBANK_COMMERCE_CODE || INTEGRATION_COMMERCE_CODE;
  const apiKey = process.env.TRANSBANK_API_KEY || INTEGRATION_API_KEY;
  return WebpayPlus.Transaction.buildForIntegration(commerceCode, apiKey);
}

export async function createTransbankTransaction(
  buyOrder: string,
  sessionId: string,
  amount: number,
  returnUrl: string
) {
  return getTransaction().create(buyOrder, sessionId, amount, returnUrl);
}

export async function commitTransbankTransaction(token: string) {
  return getTransaction().commit(token);
}

export async function getTransbankTransactionStatus(token: string) {
  return getTransaction().status(token);
}
