import "server-only";
import { prisma } from "@/lib/prisma";

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  image: string | null;
  orderCount: number;
  totalSpent: number;
  joinedAt: string;
}

export async function getCustomers(): Promise<AdminCustomer[]> {
  try {
    const users = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        orders: {
          where: { payment: { status: "PAID" } },
          select: { total: true },
        },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      whatsapp: u.whatsapp,
      image: u.image,
      orderCount: u._count.orders,
      totalSpent: u.orders.reduce((s, o) => s + o.total, 0),
      joinedAt: u.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}
