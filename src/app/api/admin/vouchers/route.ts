import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { voucherSchema } from "@/lib/zod/voucher";

async function guard() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const vouchers = await prisma.voucher.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ vouchers });
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = voucherSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }
  const d = parsed.data;

  const existing = await prisma.voucher.findUnique({ where: { code: d.code } });
  if (existing) {
    return NextResponse.json({ error: "Kode voucher sudah ada" }, { status: 409 });
  }

  const voucher = await prisma.voucher.create({
    data: {
      code: d.code,
      description: d.description || null,
      type: d.type,
      value: d.value,
      minSpend: d.minSpend,
      maxDiscount: d.maxDiscount ?? null,
      quota: d.quota ?? null,
      isActive: d.isActive,
      expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
    },
  });
  return NextResponse.json({ voucher }, { status: 201 });
}
