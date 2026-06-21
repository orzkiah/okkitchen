import "server-only";
import { prisma } from "@/lib/prisma";

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  daily: { date: string; total: number; orders: number }[];
  monthly: { month: string; total: number; orders: number }[];
  bestSellers: { name: string; soldCount: number; revenue: number }[];
}

const EMPTY: SalesReport = {
  totalRevenue: 0,
  totalOrders: 0,
  avgOrderValue: 0,
  daily: [],
  monthly: [],
  bestSellers: [],
};

export async function getSalesReport(): Promise<SalesReport> {
  try {
    const now = new Date();
    const since = new Date(now);
    since.setDate(now.getDate() - 30);

    const paidOrders = await prisma.order.findMany({
      where: { payment: { status: "PAID" } },
      include: { items: true },
      orderBy: { createdAt: "asc" },
    });

    const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
    const totalOrders = paidOrders.length;

    // Daily (last 30 days)
    const dailyMap = new Map<string, { total: number; orders: number }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, { total: 0, orders: 0 });
    }
    // Monthly (last 12 months)
    const monthlyMap = new Map<string, { total: number; orders: number }>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, { total: 0, orders: 0 });
    }

    for (const o of paidOrders) {
      const dayKey = o.createdAt.toISOString().slice(0, 10);
      if (dailyMap.has(dayKey)) {
        const e = dailyMap.get(dayKey)!;
        e.total += o.total;
        e.orders += 1;
      }
      const monthKey = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyMap.has(monthKey)) {
        const e = monthlyMap.get(monthKey)!;
        e.total += o.total;
        e.orders += 1;
      }
    }

    // Best sellers (by quantity from paid order items)
    const productMap = new Map<string, { soldCount: number; revenue: number }>();
    for (const o of paidOrders) {
      for (const item of o.items) {
        const e = productMap.get(item.name) ?? { soldCount: 0, revenue: 0 };
        e.soldCount += item.quantity;
        e.revenue += item.price * item.quantity;
        productMap.set(item.name, e);
      }
    }

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
      daily: [...dailyMap.entries()].map(([date, v]) => ({ date, ...v })),
      monthly: [...monthlyMap.entries()].map(([month, v]) => ({ month, ...v })),
      bestSellers: [...productMap.entries()]
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 10),
    };
  } catch {
    return EMPTY;
  }
}
