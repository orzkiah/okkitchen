import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductDetail } from "@/features/products/product-detail";
import { ProductReviews } from "@/features/products/product-reviews";
import { ProductCard } from "@/components/shared/product-card";
import {
  getProductBySlug,
  getProducts,
} from "@/server/services/product.service";
import { getProductReviews } from "@/server/services/review.service";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviewData, related] = await Promise.all([
    getProductReviews(slug),
    getProducts({ category: undefined, perPage: 5, sort: "best-seller" }),
  ]);

  const relatedProducts = related.products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-5 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Beranda</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/products" className="hover:text-primary">Menu</Link>
        <ChevronRight className="size-3.5" />
        <span className="truncate font-medium text-foreground">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      <div className="mt-12">
        <ProductReviews
          reviews={reviewData.reviews}
          average={reviewData.average}
          total={reviewData.total}
          distribution={reviewData.distribution}
        />
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-5 text-xl font-extrabold tracking-tight">Mungkin Anda Suka</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
