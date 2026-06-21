import "server-only";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { COURIERS } from "@/lib/constants";
import type { OrderStatus, PaymentMethod, Prisma } from "@prisma/client";

export interface CheckoutItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderInput {
  userId: string;
  items: CheckoutItemInput[];
  addressId: string;
  courierId: string;
  voucherCode?: string;
  paymentMethod: PaymentMethod;
}

/** Recompute everything server-side; never trust client prices. */
export async function createOrder(input: CreateOrderInput) {
  const { userId, items, addressId, courierId, voucherCode, paymentMethod } = input;

  if (!items.length) throw new Error("Keranjang kosong");

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) throw new Error("Alamat tidak valid");

  const courier = COURIERS.find((c) => c.id === courierId);
  if (!courier) throw new Error("Kurir tidak valid");

  // Load products & variants for the requested items.
  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { images: true, variants: true },
  });

  const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.isActive) throw new Error("Produk tidak tersedia");

    let price = product.price;
    let stock = product.stock;
    let variantName: string | null = null;
    let image = product.images[0]?.url ?? null;

    if (product.hasVariants) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant || !variant.isActive) throw new Error("Varian tidak tersedia");
      price = variant.price;
      stock = variant.stock;
      variantName = variant.name;
      image = variant.image ?? image;
    }

    if (item.quantity < 1) throw new Error("Jumlah tidak valid");
    if (stock < item.quantity)
      throw new Error(`Stok ${product.name} tidak mencukupi`);

    const discounted = product.discountPct
      ? Math.round(price * (1 - product.discountPct / 100))
      : price;

    subtotal += discounted * item.quantity;
    orderItemsData.push({
      productId: product.id,
      variantId: item.variantId ?? null,
      name: product.name,
      variantName,
      image,
      price: discounted,
      quantity: item.quantity,
    });
  }

  // Voucher (revalidate server-side).
  let discount = 0;
  let voucherId: string | null = null;
  if (voucherCode) {
    const voucher = await prisma.voucher.findUnique({
      where: { code: voucherCode.toUpperCase() },
    });
    const now = new Date();
    const valid =
      voucher &&
      voucher.isActive &&
      subtotal >= voucher.minSpend &&
      (!voucher.startsAt || voucher.startsAt <= now) &&
      (!voucher.expiresAt || voucher.expiresAt >= now) &&
      (voucher.quota === null || voucher.usedCount < voucher.quota);
    if (valid && voucher) {
      voucherId = voucher.id;
      discount =
        voucher.type === "PERCENT"
          ? Math.round((subtotal * voucher.value) / 100)
          : voucher.value;
      if (voucher.maxDiscount && discount > voucher.maxDiscount)
        discount = voucher.maxDiscount;
      discount = Math.min(discount, subtotal);
    }
  }

  const shippingCost = courier.cost;
  const total = subtotal - discount + shippingCost;

  // Generate a per-day sequential order number.
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayCount = await prisma.order.count({
    where: { createdAt: { gte: startOfDay } },
  });
  const orderNumber = generateOrderNumber(todayCount + 1);

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      addressId,
      status: "PENDING_PAYMENT",
      subtotal,
      shippingCost,
      discount,
      total,
      courier: courier.name,
      voucherId,
      items: { createMany: { data: orderItemsData } },
      payment: {
        create: {
          method: paymentMethod,
          status: "PENDING",
          amount: total,
        },
      },
    },
    include: { items: true, payment: true, user: true },
  });

  return order;
}

/** Mark order paid (idempotent) — called by Midtrans webhook. */
export async function markOrderPaid(orderNumber: string, rawPayload?: unknown) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payment: true,
      user: { select: { name: true, email: true, whatsapp: true } },
      address: true,
    },
  });
  if (!order) throw new Error("Order tidak ditemukan");
  if (order.payment?.status === "PAID") return order; // idempotent

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { orderId: order.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        rawPayload: rawPayload as Prisma.InputJsonValue,
      },
    });
    await tx.order.update({
      where: { id: order.id },
      data: { status: "PROCESSING" },
    });

    // Decrement stock & bump soldCount now that payment is confirmed.
    for (const item of order.items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else if (item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      if (item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: { soldCount: { increment: item.quantity } },
        });
      }
    }

    if (order.voucherId) {
      await tx.voucher.update({
        where: { id: order.voucherId },
        data: { usedCount: { increment: 1 } },
      });
    }
  });

  return prisma.order.findUnique({
    where: { id: order.id },
    include: { items: true, payment: true, user: true, address: true },
  });
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderByNumber(orderNumber: string, userId?: string) {
  return prisma.order.findFirst({
    where: { orderNumber, ...(userId ? { userId } : {}) },
    include: {
      items: { include: { review: true } },
      payment: true,
      address: true,
      user: { select: { name: true, email: true } },
    },
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.order.update({ where: { id: orderId }, data: { status } });
}
