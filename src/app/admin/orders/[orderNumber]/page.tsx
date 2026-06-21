import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrderByNumber } from "@/server/services/order.service";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { OrderStatusControl } from "@/features/admin/order-status-control";
import { PrintButton } from "@/features/admin/print-button";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { PAYMENT_METHOD_LABEL, SITE } from "@/lib/constants";

type Params = Promise<{ orderNumber: string }>;

export default async function AdminOrderDetailPage({ params }: { params: Params }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/admin/orders" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Kembali ke pesanan
        </Link>
        <div className="flex items-center gap-2">
          <OrderStatusControl orderId={order.id} status={order.status} />
          <PrintButton />
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Invoice header */}
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <p className="text-lg font-extrabold brand-gradient-text">O&apos;K Kitchen</p>
              <p className="text-xs text-muted-foreground">{SITE.tagline}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">INVOICE</p>
              <p className="text-sm">{order.orderNumber}</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
              <div className="mt-1 print:hidden">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </div>

          {/* Customer + address */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Pelanggan</p>
              <p className="text-sm font-medium">{order.user?.name}</p>
              <p className="text-sm text-muted-foreground">{order.user?.email}</p>
            </div>
            {order.address && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Dikirim ke</p>
                <p className="text-sm font-medium">
                  {order.address.recipient} · {order.address.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.address.fullAddress}, {order.address.city}, {order.address.province}{" "}
                  {order.address.postalCode}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">Produk</th>
                <th className="py-2 text-center font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Harga</th>
                <th className="py-2 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2">
                    {item.name}
                    {item.variantName && (
                      <span className="text-muted-foreground"> ({item.variantName})</span>
                    )}
                  </td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">{formatRupiah(item.price)}</td>
                  <td className="py-2 text-right">{formatRupiah(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="ml-auto max-w-xs space-y-1.5 text-sm">
            <Row label="Subtotal" value={formatRupiah(order.subtotal)} />
            <Row label="Ongkir" value={formatRupiah(order.shippingCost)} />
            {order.discount > 0 && <Row label="Diskon" value={`- ${formatRupiah(order.discount)}`} />}
            <div className="flex items-center justify-between border-t pt-2 text-base font-bold">
              <span>Total</span>
              <span>{formatRupiah(order.total)}</span>
            </div>
            <p className="pt-1 text-xs text-muted-foreground">
              Metode: {PAYMENT_METHOD_LABEL[order.payment?.method ?? ""] ?? "-"} ·{" "}
              {order.payment?.status === "PAID" ? "Lunas" : "Belum dibayar"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
