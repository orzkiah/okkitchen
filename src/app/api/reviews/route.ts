import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/zod/review";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const { orderItemId, rating, comment, photos } = parsed.data;

  // Verify the item belongs to a COMPLETED order owned by this user.
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: true, review: true },
  });

  if (!orderItem || orderItem.order.userId !== session.user.id) {
    return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
  }
  if (orderItem.order.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Hanya pesanan yang selesai yang dapat diulas" },
      { status: 403 }
    );
  }
  if (orderItem.review) {
    return NextResponse.json({ error: "Produk ini sudah diulas" }, { status: 409 });
  }
  if (!orderItem.productId) {
    return NextResponse.json({ error: "Produk tidak valid" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      productId: orderItem.productId,
      orderItemId: orderItem.id,
      rating,
      comment: comment ?? null,
      photos: photos ?? [],
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
