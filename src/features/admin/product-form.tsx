"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/features/upload/image-upload";
import { productSchema, type ProductFormInput } from "@/lib/zod/product";

interface Props {
  categories: { name: string; slug: string }[];
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categorySlug?: string;
    images: string[];
    cookingTime?: number;
    cookingSteps?: string;
    contents?: string;
    discountPct?: number;
    isActive: boolean;
    isFeatured: boolean;
    hasVariants: boolean;
    variants: {
      id?: string;
      name: string;
      price: number;
      stock: number;
      image?: string;
      isActive: boolean;
    }[];
  };
}

const AYAM_POP_VARIANTS = ["Dada Semua", "Paha Semua", "Sayap Semua", "Campur"];

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? { ...product }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          images: [],
          isActive: true,
          isFeatured: false,
          hasVariants: false,
          variants: [],
          categorySlug: categories[0]?.slug,
        },
  });

  const images = watch("images") ?? [];
  const hasVariants = watch("hasVariants");

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  function setImageAt(i: number, url: string) {
    const next = [...images];
    if (url) next[i] = url;
    else next.splice(i, 1);
    setValue("images", next.filter(Boolean) as string[], { shouldValidate: true });
  }

  function quickAddAyamPop() {
    AYAM_POP_VARIANTS.forEach((name) =>
      append({ name, price: 38000, stock: 10, image: "", isActive: true })
    );
  }

  async function onSubmit(data: ProductFormInput) {
    setLoading(true);
    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Gagal menyimpan", { description: json.error });
        return;
      }
      toast.success(product ? "Produk diperbarui" : "Produk ditambahkan");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Images */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <Label>Foto Produk</Label>
          <div className="flex flex-wrap gap-3">
            {[0, 1, 2, 3].map((i) => (
              <ImageUpload
                key={i}
                value={images[i]}
                onChange={(url) => setImageAt(i, url)}
                folder="okkitchen/products"
                className="h-24 w-24"
              />
            ))}
          </div>
          {errors.images && <p className="text-xs text-destructive">{errors.images.message}</p>}
        </CardContent>
      </Card>

      {/* Basic info */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <Field label="Nama Produk" error={errors.name?.message}>
            <Input {...register("name")} placeholder="Paket Ikan Nila Bumbu Kuning" />
          </Field>

          <Field label="Deskripsi" error={errors.description?.message}>
            <textarea
              {...register("description")}
              className="flex min-h-24 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategori">
              <select
                {...register("categorySlug")}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Diskon (%)" error={errors.discountPct?.message}>
              <Input type="number" {...register("discountPct")} placeholder="0" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Estimasi Masak (menit)">
              <Input type="number" {...register("cookingTime")} placeholder="15" />
            </Field>
          </div>

          <Field label="Isi Paket (pisahkan dengan koma)">
            <Input {...register("contents")} placeholder="Ikan nila segar, Bumbu kuning, Cabai" />
          </Field>

          <Field label="Cara Memasak (satu langkah per baris)">
            <textarea
              {...register("cookingSteps")}
              className="flex min-h-24 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={"Tumis bumbu hingga harum\nMasukkan ikan & air\nMasak 15 menit"}
            />
          </Field>

          <div className="flex flex-wrap gap-6">
            <Toggle control={control} name="isActive" label="Aktif" />
            <Toggle control={control} name="isFeatured" label="Tampilkan sebagai unggulan" />
            <Toggle control={control} name="hasVariants" label="Punya varian (mis. Ayam Pop)" />
          </div>
        </CardContent>
      </Card>

      {/* Price / stock OR variants */}
      {!hasVariants ? (
        <Card>
          <CardContent className="grid grid-cols-2 gap-4 p-5">
            <Field label="Harga (Rp)" error={errors.price?.message}>
              <Input type="number" {...register("price")} />
            </Field>
            <Field label="Stok" error={errors.stock?.message}>
              <Input type="number" {...register("stock")} />
            </Field>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <Label>Varian Produk</Label>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={quickAddAyamPop}>
                  <Wand2 className="size-4" /> Isi Ayam Pop
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => append({ name: "", price: 0, stock: 0, image: "", isActive: true })}
                >
                  <Plus className="size-4" /> Tambah
                </Button>
              </div>
            </div>

            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">Belum ada varian. Tambahkan minimal satu.</p>
            )}

            <div className="space-y-3">
              {fields.map((field, i) => (
                <div key={field.id} className="flex flex-wrap items-end gap-3 rounded-xl border p-3">
                  <Controller
                    control={control}
                    name={`variants.${i}.image`}
                    render={({ field: f }) => (
                      <ImageUpload
                        value={f.value || ""}
                        onChange={f.onChange}
                        folder="okkitchen/variants"
                        className="h-16 w-16"
                      />
                    )}
                  />
                  <div className="min-w-32 flex-1">
                    <Label className="text-xs">Nama</Label>
                    <Input {...register(`variants.${i}.name`)} placeholder="Dada Semua" />
                  </div>
                  <div className="w-28">
                    <Label className="text-xs">Harga</Label>
                    <Input type="number" {...register(`variants.${i}.price`)} />
                  </div>
                  <div className="w-20">
                    <Label className="text-xs">Stok</Label>
                    <Input type="number" {...register(`variants.${i}.stock`)} />
                  </div>
                  <Toggle control={control} name={`variants.${i}.isActive`} label="Aktif" />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => remove(i)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" variant="gradient" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {product ? "Simpan Perubahan" : "Tambah Produk"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Toggle({ control, name, label }: { control: any; name: string; label: string }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
          />
          {label}
        </label>
      )}
    />
  );
}
