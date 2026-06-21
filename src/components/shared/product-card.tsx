"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
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
    if (product.hasVariants) return; // handled via detail page
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
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.discountPct ? (
            <Badge variant="destructive">-{product.discountPct}%</Badge>
          ) : null}
          {product.isFeatured && (
            <Badge variant="gold" className="gap-1">
              <Sparkles className="size-3" /> Terlaris
            </Badge>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-sm">
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-white">
              Stok Habis
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-2">
          <RatingStars rating={product.rating} />
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              {product.discountPct ? (
                <p className="text-xs text-muted-foreground line-through">
                  {formatRupiah(product.price)}
                </p>
              ) : null}
              <p className="truncate text-base font-bold text-primary">
                {formatRupiah(effectivePrice)}
                {product.hasVariants && (
                  <span className="text-[10px] font-normal text-muted-foreground"> /pilihan</span>
                )}
              </p>
            </div>

            {product.hasVariants ? (
              <Button asChild size="icon" className="shrink-0" aria-label="Lihat pilihan">
                <Link href={`/products/${product.slug}`}>
                  <Plus className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button
                size="icon"
                className={cn("shrink-0")}
                disabled={outOfStock}
                onClick={handleAdd}
                aria-label="Tambah ke keranjang"
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
