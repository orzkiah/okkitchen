import "server-only";
import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalSales: number; // sum of paid order totals
  revenueThisMonth: number;
  bestSellers: { name: string; soldCount: number; image: string }[];
  salesChart: { label: string; total: number }[]; // last 7 days
  recentOrders: {
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
}

const EMPTY: DashboardStats = {
  totalCustomers: 0,
  totalOrders: 0,
  totalSales: 0,
  revenueThisMonth: 0,
  bestSellers: [],
  salesChart: [],
  recentOrders: [],
};

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCustomers,
      totalOrders,
      paidAgg,
      monthAgg,
      bestSellerProducts,
      recent,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { payment: { status: "PAID" } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { payment: { status: "PAID" }, createdAt: { gte: startOfMonth } },
      }),
      prisma.product.findMany({
        orderBy: { soldCount: "desc" },
        take: 5,
        include: { images: { take: 1, orderBy: { order: "asc" } } },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { user: { select: { name: true } } },
      }),
    ]);

    // Sales chart: last 7 days (paid orders).
    const days: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const next = new Date(day);
      next.setDate(day.getDate() + 1);
      const agg = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
          payment: { status: "PAID" },
          createdAt: { gte: day, lt: next },
        },
      });
      days.push({
        label: day.toLocaleDateString("id-ID", { weekday: "short" }),
        total: agg._sum.total ?? 0,
      });
    }

    return {
      totalCustomers,
      totalOrders,
      totalSales: paidAgg._sum.total ?? 0,
      revenueThisMonth: monthAgg._sum.total ?? 0,
      bestSellers: bestSellerProducts.map((p) => ({
        name: p.name,
        soldCount: p.soldCount,
        image: p.images[0]?.url ?? "",
      })),
      salesChart: days,
      recentOrders: recent.map((o) => ({
        orderNumber: o.orderNumber,
        customer: o.user.name,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      })),
    };
  } catch (e) {
    console.warn("[admin.service] DB unavailable:", (e as Error).message);
    return EMPTY;
  }
}
