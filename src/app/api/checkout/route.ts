import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/zod/checkout";
import { createOrder } from "@/server/services/order.service";
import { createSnapTransaction, isMidtransConfigured } from "@/lib/midtrans";
import { SITE } from "@/lib/constants";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  try {
    const order = await createOrder({
      userId: session.user.id,
      ...parsed.data,
    });

    // Midtrans Snap (sandbox). Falls back to a dev flow if not configured.
    if (isMidtransConfigured) {
      const tx = await createSnapTransaction({
        orderId: order.orderNumber,
        grossAmount: order.total,
        items: [
          ...order.items.map((i) => ({
            id: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name.slice(0, 50),
          })),
          {
            id: "shipping",
            price: order.shippingCost,
            quantity: 1,
            name: `Ongkir ${order.courier ?? ""}`.slice(0, 50),
          },
          ...(order.discount > 0
            ? [{ id: "discount", price: -order.discount, quantity: 1, name: "Diskon" }]
            : []),
        ],
        customer: {
          name: order.user.name,
          email: order.user.email,
          phone: order.user.whatsapp ?? undefined,
        },
      });

      await prisma.payment.update({
        where: { orderId: order.id },
        data: {
          midtransToken: tx.token,
          midtransOrderId: order.orderNumber,
          snapRedirectUrl: tx.redirect_url,
        },
      });

      return NextResponse.json({
        orderNumber: order.orderNumber,
        token: tx.token,
        redirectUrl: tx.redirect_url,
      });
    }

    // Dev fallback: no Midtrans keys → return order to confirm manually.
    return NextResponse.json({
      orderNumber: order.orderNumber,
      devMode: true,
      redirectUrl: `${SITE.url}/orders/${order.orderNumber}`,
    });
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal membuat pesanan" },
      { status: 400 }
    );
  }
}
