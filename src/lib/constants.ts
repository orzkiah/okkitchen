export const SITE = {
  name: "O'K Kitchen",
  tagline: "Fresh, Practical, Ready to Cook.",
  description:
    "Platform e-commerce ready-to-cook: bahan makanan segar yang sudah dibersihkan, dibumbui, dan dikemas higienis. Tinggal masak.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  whatsapp: "6281234567890",
  email: "halo@okkitchen.id",
} as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PROCESSING: "Diproses",
  PACKING: "Dikemas",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  QRIS: "QRIS",
  BANK_TRANSFER: "Transfer Bank",
  EWALLET: "E-Wallet",
};

export const COURIERS = [
  { id: "jne-reg", name: "JNE REG", cost: 12000, eta: "2-3 hari" },
  { id: "sicepat", name: "SiCepat BEST", cost: 15000, eta: "1-2 hari" },
  { id: "gosend", name: "GoSend Instant", cost: 25000, eta: "Hari ini" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Harga Termurah" },
  { value: "price-desc", label: "Harga Tertinggi" },
  { value: "best-seller", label: "Terlaris" },
] as const;

export const PRODUCTS_PER_PAGE = 12;
