import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getAllOrders } from "@/server/services/order-admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { OrderStatusControl } from "@/features/admin/order-status-control";
import { VerifyPaymentButton } from "@/features/admin/verify-payment-button";
import { formatRupiah, formatDateTime, cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import type { OrderStatus } from "@prisma/client";

const FILTERS = ["all", ...Object.keys(ORDER_STATUS_LABEL)];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await getAllOrders(
    status && status !== "all" ? (status as OrderStatus) : undefined
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Pesanan</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/orders" : `/admin/orders?status=${f}`}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              (status ?? "all") === f
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:bg-secondary"
            )}
          >
            {f === "all" ? "Semua" : ORDER_STATUS_LABEL[f]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Tidak ada pesanan" />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="p-4 font-medium">No. Pesanan</th>
                  <th className="p-4 font-medium">Pelanggan</th>
                  <th className="p-4 font-medium">Tanggal</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Bayar</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0 align-middle">
                    <td className="p-4">
                      <Link href={`/admin/orders/${o.orderNumber}`} className="font-medium hover:text-primary">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{o.user.name}</p>
                      <p className="text-xs text-muted-foreground">{o.user.email}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">{formatDateTime(o.createdAt)}</td>
                    <td className="p-4 font-semibold">{formatRupiah(o.total)}</td>
                    <td className="p-4">
                      {o.payment?.status === "PAID" ? (
                        <span className="text-xs font-semibold text-success">Lunas</span>
                      ) : (
                        <VerifyPaymentButton orderId={o.id} />
                      )}
                    </td>
                    <td className="p-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <OrderStatusControl orderId={o.id} status={o.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
