import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, CreditCard, MapPin, Truck } from "lucide-react";
import { auth } from "@/auth";
import { getOrderByNumber } from "@/server/services/order.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { ReviewButton } from "@/features/reviews/review-button";
import { formatRupiah, formatDateTime, cn } from "@/lib/utils";
import { PAYMENT_METHOD_LABEL, ORDER_STATUS_LABEL } from "@/lib/constants";

type Params = Promise<{ orderNumber: string }>;

export const metadata: Metadata = { title: "Detail Pesanan" };

const TIMELINE = ["PENDING_PAYMENT", "PROCESSING", "PACKING", "SHIPPED", "COMPLETED"];

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { orderNumber } = await params;
  const session = await auth();
  const order = await getOrderByNumber(orderNumber, session!.user.id);
  if (!order) notFound();

  const isCancelled = order.status === "CANCELLED";
  const currentStep = TIMELINE.indexOf(order.status);
  const isPaid = order.payment?.status === "PAID";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary">
            ← Kembali ke riwayat
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Pay now banner */}
      {order.status === "PENDING_PAYMENT" && order.payment?.snapRedirectUrl && (
        <Card className="mb-6 border-gold/40 bg-gold/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">Selesaikan pembayaran</p>
              <p className="text-sm text-muted-foreground">
                Pesanan akan diproses setelah pembayaran dikonfirmasi.
              </p>
            </div>
            <Button asChild variant="gradient">
              <a href={order.payment.snapRedirectUrl} target="_blank" rel="noreferrer">
                <CreditCard className="size-4" /> Bayar Sekarang
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {!isCancelled && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between">
              {TIMELINE.map((s, i) => {
                const done = i <= currentStep;
                return (
                  <div key={s} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center">
                      <div className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : done ? "bg-primary" : "bg-muted")} />
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-xs",
                          done ? "border-primary bg-primary text-white" : "border-muted bg-card text-muted-foreground"
                        )}
                      >
                        {done ? <Check className="size-4" /> : i + 1}
                      </span>
                      <div className={cn("h-0.5 flex-1", i === TIMELINE.length - 1 ? "bg-transparent" : i < currentStep ? "bg-primary" : "bg-muted")} />
                    </div>
                    <span className="mt-2 hidden text-[11px] font-medium sm:block">
                      {ORDER_STATUS_LABEL[s]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-3 font-bold">Produk</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{item.name}</p>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground">{item.variantName}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {formatRupiah(item.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-sm font-bold">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                      {order.status === "COMPLETED" &&
                        (item.review ? (
                          <span className="text-xs text-success">✓ Sudah diulas</span>
                        ) : (
                          <ReviewButton orderItemId={item.id} productName={item.name} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          {order.address && (
            <Card>
              <CardContent className="p-4">
                <h2 className="mb-2 flex items-center gap-2 font-bold">
                  <MapPin className="size-4 text-primary" /> Alamat Pengiriman
                </h2>
                <p className="text-sm font-medium">
                  {order.address.recipient} · {order.address.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.address.fullAddress}, {order.address.district}, {order.address.city},{" "}
                  {order.address.province} {order.address.postalCode}
                </p>
                {order.courier && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm">
                    <Truck className="size-4 text-primary" /> {order.courier}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary */}
        <div>
          <Card>
            <CardContent className="space-y-3 p-4">
              <h2 className="font-bold">Rincian Pembayaran</h2>
              <div className="space-y-2 text-sm">
                <Row label="Metode" value={PAYMENT_METHOD_LABEL[order.payment?.method ?? ""] ?? "-"} />
                <Row
                  label="Status bayar"
                  value={isPaid ? "Lunas" : order.payment?.status ?? "-"}
                  accent={isPaid}
                />
                <div className="border-t pt-2" />
                <Row label="Subtotal" value={formatRupiah(order.subtotal)} />
                <Row label="Ongkir" value={formatRupiah(order.shippingCost)} />
                {order.discount > 0 && (
                  <Row label="Diskon" value={`- ${formatRupiah(order.discount)}`} />
                )}
                <div className="flex items-center justify-between border-t pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatRupiah(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", accent && "text-success")}>{value}</span>
    </div>
  );
}
