import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateOrderStatus } from "@/server/services/order.service";
import { verifyPayment } from "@/server/services/order-admin.service";

const STATUSES = [
  "PENDING_PAYMENT",
  "PROCESSING",
  "PACKING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await req.json()) as { status?: string; verifyPayment?: boolean };

  if (body.verifyPayment) {
    const order = await verifyPayment(id);
    return NextResponse.json({ order });
  }

  if (body.status && STATUSES.includes(body.status as (typeof STATUSES)[number])) {
    const order = await updateOrderStatus(id, body.status as (typeof STATUSES)[number]);
    return NextResponse.json({ order });
  }

  return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
}
