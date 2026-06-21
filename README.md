# O'K Kitchen 🍳

> **Fresh, Practical, Ready to Cook.**
> E-commerce *ready-to-cook* — bahan segar yang sudah dibersihkan, dibumbui, dan dikemas higienis. Tinggal masak.

Dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind v4**, **Prisma**, **PostgreSQL**, **Auth.js**, **TanStack Query**, **Zustand**, **Midtrans**, dan **Cloudinary**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env        # lalu isi nilainya

# 3. Siapkan database (PostgreSQL)
npm run db:push             # buat tabel dari schema
npm run db:seed             # isi data demo (produk, admin, voucher)

# 4. Jalankan
npm run dev                 # http://localhost:3000
```

### Akun demo (setelah seed)
| Role | Email | Password |
|---|---|---|
| Admin | `admin@okkitchen.id` | `admin123` |
| Customer | `customer@okkitchen.id` | `customer123` |

---

## 📜 Scripts

| Script | Fungsi |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Build production (generate Prisma + Next build) |
| `npm run typecheck` | Cek TypeScript |
| `npm run db:push` | Sync schema ke DB (tanpa migrasi) |
| `npm run db:migrate` | Buat & jalankan migrasi |
| `npm run db:seed` | Seed data demo |
| `npm run db:studio` | Prisma Studio (GUI database) |

---

## 📚 Dokumentasi

- **Arsitektur, ERD, Sitemap, API, Roadmap** → [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **Skema database** → [`prisma/schema.prisma`](prisma/schema.prisma)

---

## ✅ Status Implementasi (per fitur)

- [x] **Fase 1 — Fondasi**: scaffold, design system (tema brand + dark mode), komponen UI, Prisma schema, landing page lengkap (hero, keunggulan, produk terlaris, cara kerja, testimoni slider, FAQ, footer)
- [x] **Fase 2 — Auth**: register, login, Google (Auth.js v5 + JWT), forgot/reset password (email), profil + foto (Cloudinary), ubah password, alamat (CRUD), proteksi route via proxy/middleware
- [x] **Fase 3 — Katalog & Detail**: grid + search/filter/sort/paginasi, detail (gallery, nutrisi, cara masak, ulasan) + variant selector Ayam Pop (harga/foto/stok berubah)
- [x] **Fase 4 — Cart & Checkout**: keranjang (qty, pilih semua, voucher), checkout multi-step (alamat → kurir → bayar), Midtrans Snap + webhook
- [x] **Fase 5 — Pesanan & Review**: riwayat + status timeline, detail, invoice, email konfirmasi, review buyer-only (rating + foto)
- [x] **Fase 6 — Admin**: dashboard (statistik + grafik), CRUD produk + variant, kelola pesanan + verifikasi bayar + cetak invoice, pelanggan, voucher, laporan + export Excel
- [x] **Fase 7 — Polish**: SEO (robots + sitemap + metadata), dark mode, skeleton/empty/error states, toast, a11y. Build production hijau ✅

### Catatan ekspor laporan
Export tersedia sebagai **CSV (Excel)** via `/api/admin/reports/export`. Untuk **PDF**, gunakan tombol **Cetak** (print-to-PDF) di halaman Laporan & Invoice.
