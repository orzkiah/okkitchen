import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/zod/auth";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const { name, whatsapp, image } = parsed.data;
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, whatsapp, image: image || null },
    select: { id: true, name: true, whatsapp: true, image: true },
  });

  return NextResponse.json({ user });
}
