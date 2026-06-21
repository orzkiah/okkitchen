"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Clock, Flame, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { useCartStore } from "@/store/cart-store";
import { formatRupiah, cn } from "@/lib/utils";
import type { UIProduct, UIVariant } from "@/types";

export function ProductDetail({ product }: { product: UIProduct }) {
  const addItem = useCartStore((s) => s.addItem);

  const [variant, setVariant] = React.useState<UIVariant | undefined>(
    product.hasVariants ? product.variants?.[0] : undefined
  );
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState<"desc" | "nutrition" | "cooking">("desc");

  // Active price / stock / image depend on the selected variant.
  const basePrice = variant?.price ?? product.price;
  const effectivePrice = product.discountPct
    ? Math.round(basePrice * (1 - product.discountPct / 100))
    : basePrice;
  const stock = variant?.stock ?? product.stock;
  const gallery = product.images?.length ? product.images : [product.image];
  const [activeImg, setActiveImg] = React.useState(gallery[0]);

  // When variant changes, switch main image to the variant image.
  React.useEffect(() => {
    if (variant?.image) setActiveImg(variant.image);
  }, [variant]);

  React.useEffect(() => {
    setQty((q) => Math.min(Math.max(1, q), Math.max(1, stock)));
  }, [stock]);

  const outOfStock = stock <= 0;

  function handleAddToCart() {
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        variantId: variant?.id,
        name: product.name,
        variantName: variant?.name,
        slug: product.slug,
        image: variant?.image ?? product.image,
        price: effectivePrice,
        stock,
      },
      qty
    );
    toast.success("Ditambahkan ke keranjang", {
      description: `${qty}× ${product.name}${variant ? ` (${variant.name})` : ""}`,
    });
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted shadow-soft">
            {activeImg && (
              <Image
                src={activeImg}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            )}
            {product.discountPct ? (
              <Badge variant="destructive" className="absolute left-3 top-3">
                Promo -{product.discountPct}%
              </Badge>
            ) : null}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {gallery.map((img) => (
                <button
                  key={img}
                  onClick={() => setActiveImg(img)}
                  className={cn(
                    "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                    activeImg === img ? "border-primary" : "border-transparent"
                  )}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              {product.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <RatingStars rating={product.rating} showValue />
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {product.reviewCount} ulasan
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{product.soldCount} terjual</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-extrabold text-primary">
              {formatRupiah(effectivePrice)}
            </span>
            {product.discountPct ? (
              <span className="pb-1 text-base text-muted-foreground line-through">
                {formatRupiah(basePrice)}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
              <Clock className="size-4 text-primary" /> ± {product.cookingTime} menit
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                outOfStock ? "bg-destructive/10 text-destructive" : "bg-secondary"
              )}
            >
              <Flame className="size-4 text-primary" />
              {outOfStock ? "Stok habis" : `Stok: ${stock}`}
            </span>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Variant selector (Ayam Pop) */}
          {product.hasVariants && product.variants && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Pilih Bagian Ayam:</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {product.variants.map((v) => {
                  const selected = variant?.id === v.id;
                  const vOut = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => !vOut && setVariant(v)}
                      disabled={vOut}
                      className={cn(
                        "relative overflow-hidden rounded-xl border-2 p-2 text-left transition-all",
                        selected ? "border-primary shadow-soft" : "border-border hover:border-primary/50",
                        vOut && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-muted">
                        {v.image && (
                          <Image src={v.image} alt={v.name} fill sizes="120px" className="object-cover" />
                        )}
                        {selected && (
                          <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold leading-tight">{v.name}</p>
                      <p className="text-xs text-primary">{formatRupiah(v.price)}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {vOut ? "Habis" : `Stok ${v.stock}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contents */}
          {product.contents?.length ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Isi paket:</p>
              <div className="flex flex-wrap gap-2">
                {product.contents.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent-foreground"
                  >
                    <Check className="size-3 text-accent" /> {c}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Quantity + add to cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center rounded-lg border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                disabled={qty <= 1 || outOfStock}
                aria-label="Kurangi"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                disabled={qty >= stock || outOfStock}
                aria-label="Tambah"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              size="lg"
              variant="gradient"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={outOfStock}
            >
              <ShoppingCart className="size-5" />
              {outOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-1 border-b">
          {[
            { id: "desc", label: "Deskripsi" },
            { id: "nutrition", label: "Informasi Nutrisi" },
            { id: "cooking", label: "Cara Memasak" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors",
                tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="py-6 text-sm leading-relaxed">
          {tab === "desc" && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          {tab === "nutrition" && (
            <div className="grid max-w-md grid-cols-2 gap-3">
              {product.nutrition?.length ? (
                product.nutrition.map((n) => (
                  <div key={n.label} className="rounded-xl border p-3">
                    <p className="text-xs capitalize text-muted-foreground">{n.label}</p>
                    <p className="text-lg font-bold">{n.value}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Informasi nutrisi belum tersedia.</p>
              )}
            </div>
          )}

          {tab === "cooking" && (
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm">
                <Clock className="size-4 text-primary" /> Estimasi memasak: ± {product.cookingTime} menit
              </span>
              {product.cookingSteps?.length ? (
                <ol className="space-y-3">
                  {product.cookingSteps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full brand-gradient text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">Panduan memasak belum tersedia.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
