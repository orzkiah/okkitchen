import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/features/auth/components/profile-form";

export const metadata: Metadata = { title: "Profil Saya" };

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, email: true, whatsapp: true, image: true },
  });

  return (
    <ProfileForm
      initial={{
        name: user?.name ?? "",
        email: user?.email ?? "",
        whatsapp: user?.whatsapp ?? "",
        image: user?.image ?? "",
      }}
    />
  );
}
