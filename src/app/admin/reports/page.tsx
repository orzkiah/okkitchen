import { Wallet, ShoppingBag, TrendingUp } from "lucide-react";
import { getSalesReport } from "@/server/services/report.service";
import { Card, CardContent } from "@/components/ui/card";
import { PrintButton } from "@/features/admin/print-button";
import { ExportButtons } from "@/features/admin/export-buttons";
import { formatRupiah } from "@/lib/utils";

export default async function AdminReportsPage() {
  const report = await getSalesReport();
  const maxMonth = Math.max(...report.monthly.map((m) => m.total), 1);

  const cards = [
    { label: "Total Pendapatan (Lunas)", value: formatRupiah(report.totalRevenue), icon: Wallet },
    { label: "Total Pesanan", value: report.totalOrders.toLocaleString("id-ID"), icon: ShoppingBag },
    { label: "Rata-rata per Pesanan", value: formatRupiah(report.avgOrderValue), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Laporan Penjualan</h1>
        <div className="flex gap-2">
          <ExportButtons />
          <PrintButton />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-xl brand-gradient text-white">
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

      {/* Monthly chart */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-bold">Penjualan Bulanan (12 Bulan)</h2>
          <div className="flex h-56 items-end gap-2">
            {report.monthly.map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg brand-gradient"
                    style={{ height: `${(m.total / maxMonth) * 100}%`, minHeight: m.total > 0 ? 4 : 0 }}
                    title={formatRupiah(m.total)}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{m.month.slice(5)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best sellers table */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-bold">Produk Terlaris</h2>
          {report.bestSellers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada data penjualan.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">#</th>
                  <th className="pb-2 font-medium">Produk</th>
                  <th className="pb-2 text-right font-medium">Terjual</th>
                  <th className="pb-2 text-right font-medium">Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {report.bestSellers.map((p, i) => (
                  <tr key={p.name} className="border-b last:border-0">
                    <td className="py-2.5 text-muted-foreground">{i + 1}</td>
                    <td className="py-2.5 font-medium">{p.name}</td>
                    <td className="py-2.5 text-right">{p.soldCount}</td>
                    <td className="py-2.5 text-right font-semibold">{formatRupiah(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
