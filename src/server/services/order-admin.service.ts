import "server-only";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export async function getAllOrders(status?: OrderStatus) {
  try {
    return await prisma.order.findMany({
      where: status ? { status } : {},
      include: {
        items: true,
        payment: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function verifyPayment(orderId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { orderId },
      data: { status: "PAID", paidAt: new Date() },
    });
    return tx.order.update({
      where: { id: orderId },
      data: { status: "PROCESSING" },
    });
  });
}
