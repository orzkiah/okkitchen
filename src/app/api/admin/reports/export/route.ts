import { auth } from "@/auth";
import { getSalesReport } from "@/server/services/report.service";

/** Exports the sales report as CSV (opens directly in Excel). */
export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const type = new URL(req.url).searchParams.get("type") ?? "daily";
  const report = await getSalesReport();

  let rows: string[][] = [];
  if (type === "monthly") {
    rows = [["Bulan", "Jumlah Pesanan", "Total Penjualan (Rp)"]];
    report.monthly.forEach((m) => rows.push([m.month, String(m.orders), String(m.total)]));
  } else if (type === "products") {
    rows = [["Produk", "Terjual", "Pendapatan (Rp)"]];
    report.bestSellers.forEach((p) =>
      rows.push([p.name, String(p.soldCount), String(p.revenue)])
    );
  } else {
    rows = [["Tanggal", "Jumlah Pesanan", "Total Penjualan (Rp)"]];
    report.daily.forEach((d) => rows.push([d.date, String(d.orders), String(d.total)]));
  }

  const csv = rows
    .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="laporan-${type}-okkitchen.csv"`,
    },
  });
}
