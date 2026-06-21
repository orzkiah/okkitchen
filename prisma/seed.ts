import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding O'K Kitchen...");

  // ---- Admin + demo customer ----
  const adminPass = await bcrypt.hash("admin123", 10);
  const custPass = await bcrypt.hash("customer123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@okkitchen.id" },
    update: {},
    create: {
      name: "Admin O'K",
      email: "admin@okkitchen.id",
      whatsapp: "6281234567890",
      password: adminPass,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@okkitchen.id" },
    update: {},
    create: {
      name: "Budi Pelanggan",
      email: "customer@okkitchen.id",
      whatsapp: "6289876543210",
      password: custPass,
      role: "CUSTOMER",
    },
  });

  // ---- Categories ----
  const ikan = await prisma.category.upsert({
    where: { slug: "ikan" },
    update: {},
    create: { name: "Ikan", slug: "ikan" },
  });
  const ayam = await prisma.category.upsert({
    where: { slug: "ayam" },
    update: {},
    create: { name: "Ayam", slug: "ayam" },
  });

  // ---- Product: Ikan Nila Bumbu Kuning ----
  await prisma.product.upsert({
    where: { slug: "paket-ikan-nila-bumbu-kuning" },
    update: {},
    create: {
      name: "Paket Ikan Nila Bumbu Kuning",
      slug: "paket-ikan-nila-bumbu-kuning",
      description:
        "Paket ikan nila segar yang telah dibersihkan dan dilengkapi bumbu kuning siap masak.",
      price: 35000,
      stock: 24,
      hasVariants: false,
      cookingTime: 15,
      isFeatured: true,
      discountPct: 10,
      soldCount: 340,
      categoryId: ikan.id,
      contents: "Ikan nila segar, Bumbu kuning, Cabai, Daun salam, Serai",
      cookingSteps:
        "Tumis bumbu kuning hingga harum.\nMasukkan ikan nila & air secukupnya.\nTambah daun salam & serai, masak ±15 menit.\nKoreksi rasa, sajikan hangat.",
      nutritionInfo: { calories: 220, protein: 26, fat: 9, carbs: 6 },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=800&q=80", order: 0 },
          { url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80", order: 1 },
        ],
      },
    },
  });

  // ---- Product: Ayam Pop (with variants) ----
  await prisma.product.upsert({
    where: { slug: "paket-ayam-pop" },
    update: {},
    create: {
      name: "Paket Ayam Pop",
      slug: "paket-ayam-pop",
      description:
        "Paket ayam pop siap masak dengan pilihan bagian ayam sesuai preferensi pelanggan.",
      price: 38000,
      stock: 0,
      hasVariants: true,
      cookingTime: 20,
      isFeatured: true,
      soldCount: 512,
      categoryId: ayam.id,
      contents: "Ayam segar, Bumbu ayam pop, Sambal pendamping",
      cookingSteps:
        "Rebus ayam bersama bumbu hingga meresap.\nGoreng sebentar hingga keemasan.\nSajikan dengan sambal pendamping.",
      nutritionInfo: { calories: 310, protein: 29, fat: 18, carbs: 8 },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80", order: 0 },
        ],
      },
      variants: {
        create: [
          { name: "Dada Semua", price: 42000, stock: 15, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80" },
          { name: "Paha Semua", price: 40000, stock: 18, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80" },
          { name: "Sayap Semua", price: 35000, stock: 20, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80" },
          { name: "Campur", price: 38000, stock: 25, image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&q=80" },
        ],
      },
    },
  });

  // ---- Voucher ----
  await prisma.voucher.upsert({
    where: { code: "OKHEMAT" },
    update: {},
    create: {
      code: "OKHEMAT",
      description: "Diskon 15% untuk pesanan pertama",
      type: "PERCENT",
      value: 15,
      minSpend: 50000,
      maxDiscount: 20000,
      isActive: true,
    },
  });

  console.log(`✅ Seed selesai. Admin: ${admin.email} / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
