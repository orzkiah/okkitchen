import Link from "next/link";
import Image from "next/image";
import { Users, ShoppingBag, Wallet, TrendingUp } from "lucide-react";
import { getDashboardStats } from "@/server/services/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { formatRupiah, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const maxChart = Math.max(...stats.salesChart.map((d) => d.total), 1);

  const cards = [
    { label: "Total Pelanggan", value: stats.totalCustomers.toLocaleString("id-ID"), icon: Users },
    { label: "Total Pesanan", value: stats.totalOrders.toLocaleString("id-ID"), icon: ShoppingBag },
    { label: "Total Penjualan", value: formatRupiah(stats.totalSales), icon: Wallet },
    { label: "Pendapatan Bulan Ini", value: formatRupiah(stats.revenueThisMonth), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-xl brand-gradient text-white shadow-glow">
                <c.icon className="size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="truncate text-lg font-extrabold">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Sales chart */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-bold">Penjualan 7 Hari Terakhir</h2>
            <div className="flex h-56 items-end gap-2">
              {stats.salesChart.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg brand-gradient transition-all"
                      style={{ height: `${(d.total / maxChart) * 100}%`, minHeight: d.total > 0 ? 4 : 0 }}
                      title={formatRupiah(d.total)}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best sellers */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-bold">Produk Terlaris</h2>
            {stats.bestSellers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data penjualan.</p>
            ) : (
              <div className="space-y-3">
                {stats.bestSellers.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-4 text-sm font-bold text-muted-foreground">{i + 1}</span>
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {p.image && <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />}
                    </div>
                    <p className="line-clamp-1 flex-1 text-sm font-medium">{p.name}</p>
                    <span className="text-sm font-semibold text-primary">{p.soldCount} terjual</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Pesanan Terbaru</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline">
              Lihat semua
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada pesanan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">No. Pesanan</th>
                    <th className="pb-2 font-medium">Pelanggan</th>
                    <th className="pb-2 font-medium">Tanggal</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o) => (
                    <tr key={o.orderNumber} className="border-b last:border-0">
                      <td className="py-2.5 font-medium">
                        <Link href={`/admin/orders`} className="hover:text-primary">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="py-2.5">{o.customer}</td>
                      <td className="py-2.5 text-muted-foreground">{formatDate(o.createdAt)}</td>
                      <td className="py-2.5 font-semibold">{formatRupiah(o.total)}</td>
                      <td className="py-2.5">
                        <OrderStatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
