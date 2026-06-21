import type { UIProduct } from "@/types";

// Demo photography (Unsplash). Replace with Cloudinary uploads in production.
const IMG = {
  nila: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=800&q=80",
  nila2: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
  ayam: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
  ayamDada: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
  ayamPaha: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80",
  ayamSayap: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80",
  ayamCampur: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&q=80",
};

export const SAMPLE_PRODUCTS: UIProduct[] = [
  {
    id: "prod-nila",
    slug: "paket-ikan-nila-bumbu-kuning",
    name: "Paket Ikan Nila Bumbu Kuning",
    description:
      "Paket ikan nila segar yang telah dibersihkan dan dilengkapi bumbu kuning siap masak. Tinggal masak, harum, dan menggugah selera.",
    price: 35000,
    stock: 24,
    image: IMG.nila,
    images: [IMG.nila, IMG.nila2],
    category: "Ikan",
    rating: 4.8,
    reviewCount: 126,
    soldCount: 340,
    cookingTime: 15,
    discountPct: 10,
    isFeatured: true,
    hasVariants: false,
    contents: ["Ikan nila segar", "Bumbu kuning", "Cabai", "Daun salam", "Serai"],
    cookingSteps: [
      "Panaskan sedikit minyak, tumis bumbu kuning hingga harum.",
      "Masukkan ikan nila, tambahkan air secukupnya.",
      "Masukkan daun salam dan serai, masak hingga matang ±15 menit.",
      "Koreksi rasa, sajikan selagi hangat.",
    ],
    nutrition: [
      { label: "Kalori", value: "220 kkal" },
      { label: "Protein", value: "26 g" },
      { label: "Lemak", value: "9 g" },
      { label: "Karbohidrat", value: "6 g" },
    ],
  },
  {
    id: "prod-ayam-pop",
    slug: "paket-ayam-pop",
    name: "Paket Ayam Pop",
    description:
      "Paket ayam pop siap masak dengan pilihan bagian ayam sesuai preferensi. Lengkap dengan bumbu ayam pop dan sambal pendamping.",
    price: 38000,
    stock: 0,
    image: IMG.ayam,
    images: [IMG.ayam, IMG.ayamDada, IMG.ayamPaha],
    category: "Ayam",
    rating: 4.9,
    reviewCount: 203,
    soldCount: 512,
    cookingTime: 20,
    isFeatured: true,
    hasVariants: true,
    variants: [
      { id: "var-dada", name: "Dada Semua", price: 42000, stock: 15, image: IMG.ayamDada },
      { id: "var-paha", name: "Paha Semua", price: 40000, stock: 18, image: IMG.ayamPaha },
      { id: "var-sayap", name: "Sayap Semua", price: 35000, stock: 20, image: IMG.ayamSayap },
      { id: "var-campur", name: "Campur", price: 38000, stock: 25, image: IMG.ayamCampur },
    ],
    contents: ["Ayam segar", "Bumbu ayam pop", "Sambal pendamping"],
    cookingSteps: [
      "Rebus ayam bersama bumbu ayam pop hingga meresap.",
      "Goreng sebentar hingga permukaan kering keemasan.",
      "Sajikan dengan sambal pendamping.",
    ],
    nutrition: [
      { label: "Kalori", value: "310 kkal" },
      { label: "Protein", value: "29 g" },
      { label: "Lemak", value: "18 g" },
      { label: "Karbohidrat", value: "8 g" },
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah Wijaya",
    role: "Mahasiswa",
    avatar: "https://i.pravatar.cc/100?img=47",
    rating: 5,
    text: "Sebagai anak kos, ini penyelamat banget! 15 menit udah jadi masakan enak. Bumbunya pas, nggak perlu mikir lagi.",
  },
  {
    name: "Budi Santoso",
    role: "Karyawan",
    avatar: "https://i.pravatar.cc/100?img=12",
    rating: 5,
    text: "Pulang kerja capek, tinggal masak 20 menit langsung makan enak. Ayam pop-nya juara, bisa pilih bagian sesuai selera.",
  },
  {
    name: "Ibu Ratna",
    role: "Ibu Rumah Tangga",
    avatar: "https://i.pravatar.cc/100?img=32",
    rating: 5,
    text: "Bahannya benar-benar segar dan higienis. Hemat waktu masak, anak-anak suka. Pengirimannya juga cepat.",
  },
  {
    name: "Andi Pratama",
    role: "Anak Kos",
    avatar: "https://i.pravatar.cc/100?img=68",
    rating: 4,
    text: "Praktis dan terjangkau. Cocok buat yang nggak jago masak tapi pengen makan rumahan. Recommended!",
  },
];

export const FAQS = [
  {
    q: "Apa itu produk ready to cook?",
    a: "Bahan makanan segar yang sudah dibersihkan, dibumbui, dan dikemas higienis. Anda tinggal memasak dalam waktu singkat tanpa repot menyiapkan bumbu.",
  },
  {
    q: "Berapa lama produk bisa disimpan?",
    a: "Produk sebaiknya dimasak dalam 1-2 hari dan disimpan di kulkas. Setiap kemasan mencantumkan saran penyimpanan.",
  },
  {
    q: "Bagaimana cara pemesanannya?",
    a: "Pilih menu, masukkan ke keranjang, checkout, pilih alamat & kurir, lalu bayar. Pesanan langsung kami proses.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menerima QRIS, Transfer Bank, dan E-Wallet melalui pembayaran yang aman.",
  },
];
