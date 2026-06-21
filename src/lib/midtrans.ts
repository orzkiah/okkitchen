import midtransClient from "midtrans-client";

export const isMidtransConfigured = !!process.env.MIDTRANS_SERVER_KEY;

/** Midtrans Snap client (sandbox by default). */
export function getSnap() {
  return new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey: process.env.MIDTRANS_SERVER_KEY ?? "",
    clientKey: process.env.MIDTRANS_CLIENT_KEY ?? "",
  });
}

export function getCoreApi() {
  return new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey: process.env.MIDTRANS_SERVER_KEY ?? "",
    clientKey: process.env.MIDTRANS_CLIENT_KEY ?? "",
  });
}

export interface SnapItem {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface CreateTransactionParams {
  orderId: string;
  grossAmount: number;
  items: SnapItem[];
  customer: { name: string; email: string; phone?: string };
}

export async function createSnapTransaction(params: CreateTransactionParams) {
  const snap = getSnap();
  const [firstName, ...rest] = params.customer.name.split(" ");
  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    item_details: params.items,
    customer_details: {
      first_name: firstName,
      last_name: rest.join(" ") || undefined,
      email: params.customer.email,
      phone: params.customer.phone,
    },
    credit_card: { secure: true },
  });
  return transaction as { token: string; redirect_url: string };
}
