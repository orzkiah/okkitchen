"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingCart, Tag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { useCartStore } from "@/store/cart-store";
import { useVoucherStore } from "@/store/voucher-store";
import { formatRupiah, cn } from "@/lib/utils";

export function CartView() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleSelect = useCartStore((s) => s.toggleSelect);
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll);

  const { voucher, discountFor, apply, clear } = useVoucherStore();
  const [code, setCode] = React.useState("");
  const [applying, setApplying] = React.useState(false);

  const selected = items.filter((i) => i.selected);
  const subtotal = selected.reduce((s, i) => s + i.price * i.quantity, 0);
  const allSelected = items.length > 0 && items.every((i) => i.selected);
  const discount = discountFor(subtotal);
  const total = Math.max(0, subtotal - discount);

  async function handleApplyVoucher() {
    if (!code.trim()) return;
    setApplying(true);
    try {
      const res = await fetch("/api/vouchers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Voucher gagal", { description: json.error });
        return;
      }
      apply(json.voucher);
      toast.success("Voucher diterapkan", { description: json.voucher.code });
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setApplying(false);
    }
  }

  function handleCheckout() {
    if (selected.length === 0) {
      toast.error("Pilih minimal satu produk untuk checkout");
      return;
    }
    router.push("/checkout");
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Keranjang masih kosong"
        description="Yuk pilih menu favoritmu dan mulai masak praktis hari ini."
        action={
          <Button asChild variant="gradient">
            <Link href="/products">Jelajahi Menu</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
            />
            Pilih semua ({items.length})
          </label>
        </div>

        {items.map((item) => (
          <Card key={item.key}>
            <CardContent className="flex gap-3 p-3">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelect(item.key)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-input accent-[hsl(var(--primary))]"
              />
              <Link
                href={`/products/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
              >
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                )}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-primary">
                  {item.name}
                </Link>
                {item.variantName && (
                  <span className="mt-0.5 w-fit rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
                    {item.variantName}
                  </span>
                )}
                <span className="mt-1 font-bold text-primary">{formatRupiah(item.price)}</span>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-lg border">
                    <button
                      onClick={() => updateQty(item.key, item.quantity - 1)}
                      className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                      disabled={item.quantity <= 1}
                      aria-label="Kurangi"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.key, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                      disabled={item.quantity >= item.stock}
                      aria-label="Tambah"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-destructive hover:bg-destructive/10"
                    aria-label="Hapus"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="font-bold">Ringkasan Belanja</h2>

            {/* Voucher */}
            <div className="space-y-2">
              {voucher ? (
                <div className="flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-accent-foreground">
                    <Tag className="size-4 text-accent" /> {voucher.code}
                  </span>
                  <button onClick={clear} className="text-xs text-destructive hover:underline">
                    Hapus
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Kode voucher"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="h-10"
                  />
                  <Button variant="outline" onClick={handleApplyVoucher} disabled={applying}>
                    Pakai
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t pt-3 text-sm">
              <Row label={`Subtotal (${selected.length} item)`} value={formatRupiah(subtotal)} />
              {discount > 0 && (
                <Row label="Diskon voucher" value={`- ${formatRupiah(discount)}`} accent />
              )}
              <div className="flex items-center justify-between border-t pt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{formatRupiah(total)}</span>
              </div>
            </div>

            <Button
              variant="gradient"
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={selected.length === 0}
            >
              Checkout <ArrowRight className="size-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Ongkir dihitung di langkah checkout.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
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
