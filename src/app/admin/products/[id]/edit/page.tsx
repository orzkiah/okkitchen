import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/server/services/product.service";
import { getAdminProduct } from "@/server/services/product-admin.service";
import { ProductForm } from "@/features/admin/product-form";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getAdminProduct(id),
  ]);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/products" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Kembali ke produk
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Edit Produk</h1>
      </div>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categorySlug: product.category?.slug,
          images: product.images.map((i) => i.url),
          cookingTime: product.cookingTime ?? undefined,
          cookingSteps: product.cookingSteps ?? undefined,
          contents: product.contents ?? undefined,
          discountPct: product.discountPct ?? undefined,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          hasVariants: product.hasVariants,
          variants: product.variants.map((v) => ({
            id: v.id,
            name: v.name,
            price: v.price,
            stock: v.stock,
            image: v.image ?? "",
            isActive: v.isActive,
          })),
        }}
      />
    </div>
  );
}
