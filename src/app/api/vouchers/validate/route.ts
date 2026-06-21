import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = (await req.json()) as {
      code: string;
      subtotal: number;
    };

    if (!code) {
      return NextResponse.json({ error: "Kode voucher kosong" }, { status: 400 });
    }

    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() },
    });

    const now = new Date();
    if (
      !voucher ||
      !voucher.isActive ||
      (voucher.startsAt && voucher.startsAt > now) ||
      (voucher.expiresAt && voucher.expiresAt < now)
    ) {
      return NextResponse.json({ error: "Voucher tidak valid" }, { status: 404 });
    }

    if (voucher.quota !== null && voucher.usedCount >= voucher.quota) {
      return NextResponse.json({ error: "Kuota voucher habis" }, { status: 410 });
    }

    if (subtotal < voucher.minSpend) {
      return NextResponse.json(
        {
          error: `Minimal belanja Rp ${voucher.minSpend.toLocaleString("id-ID")} untuk voucher ini`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      voucher: {
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
        minSpend: voucher.minSpend,
        maxDiscount: voucher.maxDiscount,
      },
    });
  } catch (e) {
    console.error("[voucher-validate]", e);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
