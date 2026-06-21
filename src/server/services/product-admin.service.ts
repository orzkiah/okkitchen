import "server-only";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ProductInput } from "@/lib/zod/product";

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let n = 1;
  // Ensure uniqueness.
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${n++}`;
  }
  return slug;
}

async function resolveCategoryId(slug?: string): Promise<string | null> {
  if (!slug) return null;
  const cat = await prisma.category.findUnique({ where: { slug } });
  return cat?.id ?? null;
}

export async function createProduct(input: ProductInput) {
  const slug = await uniqueSlug(input.name);
  const categoryId = await resolveCategoryId(input.categorySlug);

  return prisma.product.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      stock: input.hasVariants ? 0 : input.stock,
      hasVariants: input.hasVariants,
      cookingTime: input.cookingTime ?? null,
      cookingSteps: input.cookingSteps || null,
      contents: input.contents || null,
      discountPct: input.discountPct ?? null,
      isActive: input.isActive,
      isFeatured: input.isFeatured,
      categoryId,
      images: {
        create: input.images.map((url, i) => ({ url, order: i })),
      },
      variants: input.hasVariants
        ? {
            create: input.variants.map((v) => ({
              name: v.name,
              price: v.price,
              stock: v.stock,
              image: v.image || null,
              isActive: v.isActive,
            })),
          }
        : undefined,
    },
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  const slug = await uniqueSlug(input.name, id);
  const categoryId = await resolveCategoryId(input.categorySlug);

  return prisma.$transaction(async (tx) => {
    // Replace images.
    await tx.productImage.deleteMany({ where: { productId: id } });
    // Replace variants.
    await tx.productVariant.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        name: input.name,
        slug,
        description: input.description,
        price: input.price,
        stock: input.hasVariants ? 0 : input.stock,
        hasVariants: input.hasVariants,
        cookingTime: input.cookingTime ?? null,
        cookingSteps: input.cookingSteps || null,
        contents: input.contents || null,
        discountPct: input.discountPct ?? null,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
        categoryId,
        images: { create: input.images.map((url, i) => ({ url, order: i })) },
        variants: input.hasVariants
          ? {
              create: input.variants.map((v) => ({
                name: v.name,
                price: v.price,
                stock: v.stock,
                image: v.image || null,
                isActive: v.isActive,
              })),
            }
          : undefined,
      },
    });
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function getAdminProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: { take: 1, orderBy: { order: "asc" } },
        category: true,
        variants: true,
        _count: { select: { reviews: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function getAdminProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } }, variants: true, category: true },
  });
}
