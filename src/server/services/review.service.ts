import "server-only";
import { prisma } from "@/lib/prisma";

export interface UIReview {
  id: string;
  rating: number;
  comment: string | null;
  photos: string[];
  createdAt: string;
  author: { name: string; image: string | null };
}

export async function getProductReviews(slug: string): Promise<{
  reviews: UIReview[];
  average: number;
  total: number;
  distribution: Record<number, number>;
}> {
  const empty = { reviews: [], average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!product) return empty;

    const rows = await prisma.review.findMany({
      where: { productId: product.id },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    rows.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
    });
    const total = rows.length;
    const average =
      total > 0 ? rows.reduce((s, r) => s + r.rating, 0) / total : 0;

    return {
      reviews: rows.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        photos: r.photos,
        createdAt: r.createdAt.toISOString(),
        author: { name: r.user.name, image: r.user.image },
      })),
      average: Math.round(average * 10) / 10,
      total,
      distribution,
    };
  } catch {
    return empty;
  }
}
