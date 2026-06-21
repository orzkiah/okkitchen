import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama varian wajib"),
  price: z.coerce.number().int().min(0),
  stock: z.coerce.number().int().min(0),
  image: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  description: z.string().min(5, "Deskripsi wajib diisi"),
  price: z.coerce.number().int().min(0),
  stock: z.coerce.number().int().min(0),
  categorySlug: z.string().optional(),
  images: z.array(z.string().url()).min(1, "Minimal 1 foto produk"),
  cookingTime: z.coerce.number().int().min(0).optional(),
  cookingSteps: z.string().optional(),
  contents: z.string().optional(),
  discountPct: z.coerce.number().int().min(0).max(100).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  hasVariants: z.boolean().default(false),
  variants: z.array(variantSchema).default([]),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductInput = z.output<typeof productSchema>;
export type VariantInput = z.output<typeof variantSchema>;
