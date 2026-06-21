import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/server/services/product.service";
import { ProductForm } from "@/features/admin/product-form";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/products" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Kembali ke produk
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Tambah Produk</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
