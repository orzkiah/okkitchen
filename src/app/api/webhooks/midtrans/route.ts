import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { markOrderPaid } from "@/server/services/order.service";
import { sendOrderInvoiceEmail } from "@/lib/mailer";
import { formatRupiah } from "@/lib/utils";
import { SITE } from "@/lib/constants";

interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
}

/** Verify Midtrans signature: sha512(order_id + status_code + gross_amount + serverKey) */
function verifySignature(n: MidtransNotification): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  const expected = createHash("sha512")
    .update(n.order_id + n.status_code + n.gross_amount + serverKey)
    .digest("hex");
  return expected === n.signature_key;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as MidtransNotification;

    if (!verifySignature(body)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const { order_id, transaction_status, fraud_status } = body;
    const isSuccess =
      (transaction_status === "capture" && fraud_status === "accept") ||
      transaction_status === "settlement";

    if (isSuccess) {
      const order = await markOrderPaid(order_id, body);
      if (order?.user?.email) {
        await sendOrderInvoiceEmail(
          order.user.email,
          order.orderNumber,
          formatRupiah(order.total),
          `${SITE.url}/orders/${order.orderNumber}`
        );
      }
    } else if (["expire", "cancel", "deny"].includes(transaction_status)) {
      const order = await prisma.order.findUnique({ where: { orderNumber: order_id } });
      if (order) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { orderId: order.id },
            data: {
              status: transaction_status === "expire" ? "EXPIRED" : "FAILED",
              rawPayload: body as object,
            },
          }),
          prisma.order.update({
            where: { id: order.id },
            data: { status: "CANCELLED" },
          }),
        ]);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[midtrans-webhook]", e);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
