"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MapPin,
  Truck,
  Wallet,
  QrCode,
  Building2,
  Loader2,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { useVoucherStore } from "@/store/voucher-store";
import { formatRupiah, cn } from "@/lib/utils";
import { COURIERS } from "@/lib/constants";
import type { Address } from "@/features/address/address-manager";

declare global {
  interface Window {
    snap?: { pay: (token: string, opts: Record<string, () => void>) => void };
  }
}

const PAYMENT_METHODS = [
  { id: "QRIS", label: "QRIS", desc: "Scan & bayar instan", icon: QrCode },
  { id: "BANK_TRANSFER", label: "Transfer Bank", desc: "Virtual account", icon: Building2 },
  { id: "EWALLET", label: "E-Wallet", desc: "GoPay, OVO, Dana", icon: Wallet },
] as const;

export function CheckoutView() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const allItems = useCartStore((s) => s.items);
  const items = React.useMemo(() => allItems.filter((i) => i.selected), [allItems]);
  const clearCart = useCartStore((s) => s.clear);
  const { voucher, discountFor, clear: clearVoucher } = useVoucherStore();

  const [addressId, setAddressId] = React.useState<string>("");
  const [courierId, setCourierId] = React.useState<string>(COURIERS[0].id);
  const [payment, setPayment] =
    React.useState<(typeof PAYMENT_METHODS)[number]["id"]>("QRIS");
  const [loading, setLoading] = React.useState(false);

  const { data: addresses, isLoading: loadingAddr } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await fetch("/api/addresses");
      if (!res.ok) throw new Error();
      return (await res.json()).addresses as Address[];
    },
  });

  React.useEffect(() => {
    if (addresses?.length && !addressId) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      setAddressId(def.id);
    }
  }, [addresses, addressId]);

  // Load Midtrans Snap script.
  React.useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    if (!clientKey || document.getElementById("midtrans-snap")) return;
    const s = document.createElement("script");
    s.id = "midtrans-snap";
    s.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    s.setAttribute("data-client-key", clientKey);
    document.body.appendChild(s);
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const courier = COURIERS.find((c) => c.id === courierId)!;
  const discount = discountFor(subtotal);
  const total = subtotal - discount + courier.cost;

  async function handleConfirm() {
    if (!addressId) {
      toast.error("Pilih alamat pengiriman terlebih dahulu");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          addressId,
          courierId,
          voucherCode: voucher?.code,
          paymentMethod: payment,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Checkout gagal", { description: json.error });
        return;
      }

      const finish = () => {
        clearCart();
        clearVoucher();
        router.push(`/orders/${json.orderNumber}`);
      };

      if (json.token && window.snap) {
        window.snap.pay(json.token, {
          onSuccess: finish,
          onPending: finish,
          onError: () => toast.error("Pembayaran gagal"),
          onClose: () =>
            toast.info("Pembayaran dibatalkan", {
              description: "Pesanan tersimpan di Menunggu Pembayaran.",
            }),
        });
      } else {
        // Dev fallback (no Midtrans keys configured).
        toast.success("Pesanan dibuat", {
          description: "Mode dev: pembayaran disimulasikan.",
        });
        finish();
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-medium">Tidak ada produk untuk di-checkout.</p>
          <Button asChild variant="gradient">
            <Link href="/cart">Kembali ke Keranjang</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* Step 1: Address */}
        <Section icon={MapPin} step={1} title="Alamat Pengiriman">
          {loadingAddr ? (
            <p className="text-sm text-muted-foreground">Memuat alamat...</p>
          ) : !addresses?.length ? (
            <div className="rounded-xl border border-dashed p-4 text-center text-sm">
              <p className="mb-2 text-muted-foreground">Belum ada alamat tersimpan.</p>
              <Button asChild size="sm" variant="outline">
                <Link href="/addresses">
                  <Plus className="size-4" /> Tambah Alamat
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {addresses.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAddressId(a.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors",
                    addressId === a.id ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                      addressId === a.id ? "border-primary bg-primary text-white" : "border-muted-foreground"
                    )}
                  >
                    {addressId === a.id && <Check className="size-3" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {a.label} · {a.recipient}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {a.phone} — {a.fullAddress}, {a.city}, {a.province} {a.postalCode}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Section>

        {/* Step 2: Courier */}
        <Section icon={Truck} step={2} title="Pilih Kurir">
          <div className="space-y-2">
            {COURIERS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCourierId(c.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition-colors",
                  courierId === c.id ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Estimasi {c.eta}</p>
                </div>
                <span className="text-sm font-bold text-primary">{formatRupiah(c.cost)}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Step 3: Payment */}
        <Section icon={Wallet} step={3} title="Metode Pembayaran">
          <div className="grid gap-2 sm:grid-cols-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-colors",
                  payment === m.id ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <m.icon className="size-5 text-primary" />
                <p className="text-sm font-semibold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* Summary */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="font-bold">Ringkasan Pesanan</h2>
            <div className="max-h-52 space-y-3 overflow-y-auto">
              {items.map((i) => (
                <div key={i.key} className="flex gap-2.5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {i.image && <Image src={i.image} alt={i.name} fill sizes="48px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-medium">{i.name}</p>
                    {i.variantName && (
                      <p className="text-[10px] text-muted-foreground">{i.variantName}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {i.quantity} × {formatRupiah(i.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-3 text-sm">
              <Row label="Subtotal" value={formatRupiah(subtotal)} />
              <Row label={`Ongkir (${courier.name})`} value={formatRupiah(courier.cost)} />
              {discount > 0 && (
                <Row label="Diskon" value={`- ${formatRupiah(discount)}`} accent />
              )}
              <div className="flex items-center justify-between border-t pt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{formatRupiah(total)}</span>
              </div>
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={handleConfirm}
              disabled={loading || !addressId}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Konfirmasi & Bayar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  step,
  title,
  children,
}: {
  icon: typeof MapPin;
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full brand-gradient text-xs font-bold text-white">
            {step}
          </span>
          <Icon className="size-4 text-primary" />
          <h2 className="font-bold">{title}</h2>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", accent && "text-accent")}>{value}</span>
    </div>
  );
}
