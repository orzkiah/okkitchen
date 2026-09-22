"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Sparkles, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "./rating-stars";
import { formatRupiah, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { UIProduct } from "@/types";
import { toast } from "sonner";

export function ProductCard({ product }: { product: UIProduct }) {
  const addItem = useCartStore((s) => s.addItem);

  const effectivePrice = product.discountPct
    ? Math.round(product.price * (1 - product.discountPct / 100))
    : product.price;

  const outOfStock = !product.hasVariants && product.stock <= 0;

  function handleAdd() {
    if (product.hasVariants) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: effectivePrice,
      stock: product.stock,
    });
    toast.success("Ditambahkan ke keranjang", { description: product.name });
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card-hover">
      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] sm:aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient backdrop overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 transition-opacity group-hover:opacity-40" />

        {/* Badges on top */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {product.discountPct ? (
            <span className="rounded-full bg-destructive/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
              Hemat {product.discountPct}%
            </span>
          ) : null}
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/90 px-2 py-0.5 text-[11px] font-bold text-stone-900 shadow-sm backdrop-blur-sm">
              <Sparkles className="size-3 fill-stone-900" /> Favorit
            </span>
          )}
        </div>

        {/* Cooking time tag bottom-left */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
          <Clock className="size-3 text-gold" />
          <span>{product.cookingTime || 15} mnt</span>
        </div>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-background/80 backdrop-blur-sm">
            <span className="rounded-full border border-destructive/30 bg-destructive/10 px-3.5 py-1 text-xs font-bold text-destructive">
              Habis Terjual
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category tag */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="font-medium text-primary/80 uppercase tracking-wider text-[10px]">
            {product.category}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {product.soldCount > 0 ? `${product.soldCount} terjual` : "Menu Baru"}
          </span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Review */}
        <div className="mt-2 flex items-center gap-1.5">
          <RatingStars rating={product.rating || 5} size={13} />
          <span className="text-xs font-semibold text-foreground">
            {(product.rating || 5).toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount || 24})
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-3.5 border-t border-border/50">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              {product.discountPct ? (
                <p className="text-xs text-muted-foreground line-through">
                  {formatRupiah(product.price)}
                </p>
              ) : null}
              <p className="truncate text-base sm:text-lg font-bold text-primary tracking-tight">
                {formatRupiah(effectivePrice)}
                {product.hasVariants && (
                  <span className="text-[11px] font-normal text-muted-foreground"> /opsi</span>
                )}
              </p>
            </div>

            {product.hasVariants ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 rounded-full px-3 text-xs font-semibold border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground shadow-sm"
              >
                <Link href={`/products/${product.slug}`}>
                  Pilih Opsi
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="default"
                className="h-9 w-9 rounded-full p-0 shadow-sm transition-transform active:scale-95 group-hover:scale-105"
                disabled={outOfStock}
                onClick={handleAdd}
                aria-label={`Tambah ${product.name} ke keranjang`}
              >
                <Plus className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
