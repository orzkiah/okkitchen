import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { UIProduct, UIVariant } from "@/types";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";

export type SortKey = "newest" | "price-asc" | "price-desc" | "best-seller";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    category: true;
    reviews: { select: { rating: true } };
  };
}>;

function mapProduct(p: ProductWithRelations): UIProduct {
  const reviewCount = p.reviews.length;
  const rating =
    reviewCount > 0
      ? p.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount
      : 0;

  const variants: UIVariant[] = p.variants.map((v) => ({
    id: v.id,
    name: v.name,
    price: v.price,
    stock: v.stock,
    image: v.image ?? p.images[0]?.url ?? "",
  }));

  // For variant products, show the lowest active variant price as "from".
  const activeVariants = variants.filter((v) => p.variants.find((pv) => pv.id === v.id)?.isActive);
  const displayPrice =
    p.hasVariants && activeVariants.length
      ? Math.min(...activeVariants.map((v) => v.price))
      : p.price;
  const displayStock = p.hasVariants
    ? activeVariants.reduce((s, v) => s + v.stock, 0)
    : p.stock;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: displayPrice,
    stock: displayStock,
    image: p.images[0]?.url ?? "",
    images: p.images.map((i) => i.url),
    category: p.category?.name ?? "Lainnya",
    rating: Math.round(rating * 10) / 10,
    reviewCount,
    soldCount: p.soldCount,
    cookingTime: p.cookingTime ?? 0,
    discountPct: p.discountPct ?? undefined,
    isFeatured: p.isFeatured,
    hasVariants: p.hasVariants,
    variants: p.hasVariants ? variants : undefined,
    contents: p.contents ? p.contents.split(",").map((s) => s.trim()) : undefined,
    cookingSteps: p.cookingSteps
      ? p.cookingSteps.split("\n").map((s) => s.trim()).filter(Boolean)
      : undefined,
    nutrition: p.nutritionInfo
      ? Object.entries(p.nutritionInfo as Record<string, unknown>).map(([k, v]) => ({
          label: k,
          value: String(v),
        }))
      : undefined,
  };
}

const INCLUDE = {
  images: { orderBy: { order: "asc" as const } },
  variants: true,
  category: true,
  reviews: { select: { rating: true } },
} satisfies Prisma.ProductInclude;

export interface ProductQuery {
  q?: string;
  category?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

export async function getProducts(query: ProductQuery = {}): Promise<{
  products: UIProduct[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const { q, category, sort = "newest", page = 1, perPage = 12 } = query;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    ...(category && category !== "all"
      ? { category: { slug: category } }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "best-seller"
          ? { soldCount: "desc" }
          : { createdAt: "desc" };

  try {
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: INCLUDE,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: items.map(mapProduct),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  } catch (e) {
    // Fallback to sample data when DB is unavailable (e.g. local dev pre-setup).
    console.warn("[product.service] DB unavailable, using sample data:", (e as Error).message);
    return fallbackProducts(query);
  }
}

export async function getProductBySlug(slug: string): Promise<UIProduct | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: INCLUDE,
    });
    return p ? mapProduct(p) : null;
  } catch {
    return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getFeaturedProducts(limit = 4): Promise<UIProduct[]> {
  try {
    const items = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { soldCount: "desc" },
      include: INCLUDE,
      take: limit,
    });
    if (items.length === 0) return SAMPLE_PRODUCTS.filter((p) => p.isFeatured);
    return items.map(mapProduct);
  } catch {
    return SAMPLE_PRODUCTS.filter((p) => p.isFeatured);
  }
}

export async function getCategories(): Promise<{ name: string; slug: string }[]> {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    });
    return cats;
  } catch {
    return [
      { name: "Ikan", slug: "ikan" },
      { name: "Ayam", slug: "ayam" },
    ];
  }
}

// ---- Sample-data fallback (search/filter/sort/paginate in-memory) ----
function fallbackProducts(query: ProductQuery) {
  const { q, category, sort = "newest", page = 1, perPage = 12 } = query;
  let list = [...SAMPLE_PRODUCTS];
  if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  if (category && category !== "all")
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "best-seller") list.sort((a, b) => b.soldCount - a.soldCount);

  const total = list.length;
  const start = (page - 1) * perPage;
  return {
    products: list.slice(start, start + perPage),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}
