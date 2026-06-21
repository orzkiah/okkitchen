import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CatalogToolbar } from "@/features/products/catalog-toolbar";
import { Button } from "@/components/ui/button";
import {
  getProducts,
  getCategories,
  type SortKey,
} from "@/server/services/product.service";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Katalog Menu",
  description: "Jelajahi semua menu ready-to-cook O'K Kitchen. Segar, praktis, tinggal masak.",
};

type SearchParams = Promise<{
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({
      q: sp.q,
      category: sp.category,
      sort: (sp.sort as SortKey) ?? "newest",
      page,
      perPage: PRODUCTS_PER_PAGE,
    }),
  ]);

  const { products, total, totalPages } = result;

  const buildHref = (p: number) => {
    const next = new URLSearchParams();
    if (sp.q) next.set("q", sp.q);
    if (sp.category) next.set("category", sp.category);
    if (sp.sort) next.set("sort", sp.sort);
    next.set("page", String(p));
    return `/products?${next.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Katalog Menu</h1>
        <p className="mt-1 text-muted-foreground">
          {total} menu siap masak menanti untuk dimasak.
        </p>
      </header>

      <Suspense fallback={<div className="h-28" />}>
        <CatalogToolbar categories={categories} />
      </Suspense>

      <div className="mt-6">
        {products.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Menu tidak ditemukan"
            description="Coba kata kunci lain atau ubah filter kategori."
            action={
              <Button asChild variant="outline">
                <Link href="/products">Reset filter</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2">
          <Button
            asChild={page > 1}
            variant="outline"
            size="icon"
            disabled={page <= 1}
            aria-label="Sebelumnya"
          >
            {page > 1 ? (
              <Link href={buildHref(page - 1)}>
                <ChevronLeft className="size-4" />
              </Link>
            ) : (
              <span>
                <ChevronLeft className="size-4" />
              </span>
            )}
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <Button
                key={p}
                asChild
                variant={p === page ? "default" : "outline"}
                size="icon"
                className={cn(p === page && "pointer-events-none")}
              >
                <Link href={buildHref(p)}>{p}</Link>
              </Button>
            );
          })}

          <Button
            asChild={page < totalPages}
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            aria-label="Berikutnya"
          >
            {page < totalPages ? (
              <Link href={buildHref(page + 1)}>
                <ChevronRight className="size-4" />
              </Link>
            ) : (
              <span>
                <ChevronRight className="size-4" />
              </span>
            )}
          </Button>
        </nav>
      )}
    </div>
  );
}
