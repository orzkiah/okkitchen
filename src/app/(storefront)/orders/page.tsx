import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight } from "lucide-react";
import { auth } from "@/auth";
import { getUserOrders } from "@/server/services/order.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { formatRupiah, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Riwayat Pesanan" };

export default async function OrdersPage() {
  const session = await auth();
  const orders = await getUserOrders(session!.user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight">Riwayat Pesanan</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Belum ada pesanan"
          description="Pesanan yang kamu buat akan muncul di sini."
          action={
            <Button asChild variant="gradient">
              <Link href="/products">Mulai Belanja</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <p className="text-sm font-bold">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="flex items-center gap-3 py-3">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-card bg-muted"
                      >
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} produk
                    {order.items[0] && ` · ${order.items[0].name}`}
                    {order.items.length > 1 && ` +${order.items.length - 1} lainnya`}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">{formatRupiah(order.total)}</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/orders/${order.orderNumber}`}>
                      Lihat Detail <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
