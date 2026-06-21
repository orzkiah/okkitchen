import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Package } from "lucide-react";
import { getAdminProducts } from "@/server/services/product-admin.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteProductButton } from "@/features/admin/delete-product-button";
import { formatRupiah } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Produk</h1>
        <Button asChild variant="gradient">
          <Link href="/admin/products/new">
            <Plus className="size-4" /> Tambah Produk
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Belum ada produk"
          description="Tambahkan produk pertama Anda untuk mulai berjualan."
          action={
            <Button asChild variant="gradient">
              <Link href="/admin/products/new">Tambah Produk</Link>
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="p-4 font-medium">Produk</th>
                  <th className="p-4 font-medium">Kategori</th>
                  <th className="p-4 font-medium">Harga</th>
                  <th className="p-4 font-medium">Stok</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const stock = p.hasVariants
                    ? p.variants.reduce((s, v) => s + v.stock, 0)
                    : p.stock;
                  return (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {p.images[0] && (
                              <Image src={p.images[0].url} alt={p.name} fill sizes="48px" className="object-cover" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-1 font-medium">{p.name}</p>
                            {p.hasVariants && (
                              <span className="text-xs text-muted-foreground">
                                {p.variants.length} varian
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{p.category?.name ?? "-"}</td>
                      <td className="p-4 font-semibold">
                        {p.hasVariants
                          ? `dari ${formatRupiah(Math.min(...p.variants.map((v) => v.price), 0) || 0)}`
                          : formatRupiah(p.price)}
                      </td>
                      <td className="p-4">
                        <span className={stock <= 0 ? "text-destructive" : ""}>{stock}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={p.isActive ? "success" : "outline"}>
                          {p.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <Button asChild size="icon" variant="ghost" aria-label="Edit">
                            <Link href={`/admin/products/${p.id}/edit`}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <DeleteProductButton id={p.id} name={p.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
