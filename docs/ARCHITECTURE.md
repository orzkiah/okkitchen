# O'K Kitchen — System Architecture & Blueprint

> **Tagline:** Fresh, Practical, Ready to Cook.
> Platform e-commerce *ready-to-cook*: bahan segar yang dibersihkan, dibumbui, dikemas higienis.

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                      │
│   Next.js App Router · React 19 · Tailwind v4 · shadcn/ui     │
│   State: Zustand (cart/ui)  ·  Server cache: TanStack Query   │
│   Forms: React Hook Form + Zod                                │
└───────────────┬───────────────────────────────┬─────────────┘
                │ HTTP (RSC + fetch)             │
                ▼                                 ▼
┌──────────────────────────────┐   ┌───────────────────────────┐
│   Next.js Route Handlers      │   │   NextAuth / Auth.js       │
│   /api/* (REST-ish)           │   │   JWT sessions + Google    │
│   Server Actions (mutations)  │   │   Credentials provider     │
└───────────────┬──────────────┘   └─────────────┬─────────────┘
                │ Prisma Client                   │
                ▼                                  ▼
┌──────────────────────────────────────────────────────────────┐
│                      PostgreSQL (Neon/Supabase)                │
└──────────────────────────────────────────────────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌────────────┐   ┌────────────────┐   ┌──────────────────┐
│ Cloudinary │   │ Midtrans (Snap)│   │ Nodemailer (SMTP)│
│  (images)  │   │  payment + webhook │ invoice / reset │
└────────────┘   └────────────────┘   └──────────────────┘
```

**Layering (clean architecture):**
- `app/` — routing, pages, layouts (presentation)
- `components/` — reusable UI (presentation)
- `features/` — feature modules (hooks, schemas, components grouped by domain)
- `server/` — services & data access (business logic over Prisma)
- `lib/` — cross-cutting infra (prisma, auth, cloudinary, midtrans, mailer, utils)

---

## 2. Database ERD (logical)

```
User 1───* Address
User 1───1 Cart 1───* CartItem *───1 Product 1───* ProductVariant
User 1───* Order 1───* OrderItem *───? Product / ProductVariant
Order 1───1 Payment
Order *───? Voucher
User 1───* Review *───1 Product   (Review 1───1 OrderItem  → buyer-only)
Category 1───* Product 1───* ProductImage
```

Key decisions:
- **Money as integer Rupiah** — no float rounding errors.
- **Order/OrderItem snapshot** name/price/image at purchase — survives product edits & deletes.
- **Review ↔ OrderItem unique** — enforces "hanya pembeli yang bisa review", one review per purchased item.
- **Variants** carry their own price/stock/image/isActive (Ayam Pop). Products without variants use base `price`/`stock`.

Full schema: [`prisma/schema.prisma`](../prisma/schema.prisma)

---

## 3. Folder Structure (enterprise)

```
src/
├── app/
│   ├── (marketing)/              # public landing
│   │   └── page.tsx
│   ├── (shop)/                   # storefront
│   │   ├── products/
│   │   │   ├── page.tsx          # katalog (search/filter/sort)
│   │   │   └── [slug]/page.tsx   # detail produk
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── orders/
│   │       ├── page.tsx          # riwayat
│   │       └── [orderNumber]/page.tsx
│   ├── (auth)/
│   │   ├── login/ register/ forgot-password/ reset-password/
│   ├── (account)/
│   │   └── profile/  addresses/  security/
│   ├── admin/
│   │   ├── page.tsx              # dashboard
│   │   ├── products/  orders/  customers/  vouchers/  reports/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/  cart/  orders/  reviews/  vouchers/
│   │   ├── upload/route.ts       # cloudinary sign
│   │   ├── checkout/route.ts
│   │   └── webhooks/midtrans/route.ts
│   ├── layout.tsx   globals.css
├── components/
│   ├── ui/                       # shadcn primitives
│   ├── layout/                   # navbar, footer, sidebars
│   └── shared/                   # product-card, rating, empty-state, skeletons
├── features/
│   ├── auth/  products/  cart/  checkout/  orders/  reviews/  admin/
│   │     └── { components, hooks, schemas.ts, api.ts }
├── server/
│   ├── services/                 # product.service, order.service, ...
│   └── db.ts
├── lib/
│   ├── prisma.ts  auth.ts  cloudinary.ts  midtrans.ts  mailer.ts
│   ├── utils.ts  rupiah.ts  constants.ts
├── store/                        # zustand: cart-ui, theme
├── types/
└── prisma/  (schema.prisma, seed.ts, migrations/)
```

---

## 4. Sitemap

```
/                         Landing
/products                 Katalog
/products/[slug]          Detail
/cart                     Keranjang
/checkout                 Checkout (multi-step)
/orders                   Riwayat pesanan
/orders/[orderNumber]     Detail pesanan + invoice
/login /register          Auth
/forgot-password /reset-password
/profile /addresses /security
/admin                    Dashboard
/admin/products           CRUD produk + variant
/admin/orders             Kelola pesanan
/admin/customers          Kelola pelanggan
/admin/vouchers           Voucher
/admin/reports            Laporan + export
```

---

## 5. User Flow (happy path)

```
Browse → Detail (pilih variant Ayam Pop) → Add to Cart →
Cart (qty / voucher) → Checkout (alamat → kurir → ringkasan → bayar) →
Midtrans Snap → Webhook PAID → Order PROCESSING →
Email invoice → (admin: PACKING → SHIPPED → COMPLETED) →
Review (rating + foto masakan, buyer-only)
```

Auth gate: Cart boleh diisi tamu (local), tapi checkout butuh login.

---

## 6. API Endpoints (ringkas)

| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/products` | public | list + `?q&category&sort&page` |
| GET | `/api/products/[slug]` | public | detail + variants + reviews |
| POST | `/api/products` | admin | create |
| PATCH/DELETE | `/api/products/[id]` | admin | update / delete |
| GET/POST | `/api/cart` | user | ambil / sync keranjang |
| PATCH/DELETE | `/api/cart/[itemId]` | user | qty / hapus |
| POST | `/api/vouchers/validate` | user | cek voucher |
| POST | `/api/checkout` | user | buat order + Midtrans token |
| POST | `/api/webhooks/midtrans` | signature | update status bayar |
| GET | `/api/orders` | user | riwayat |
| GET | `/api/orders/[orderNumber]` | user/admin | detail + invoice |
| PATCH | `/api/admin/orders/[id]` | admin | ubah status |
| POST | `/api/reviews` | buyer | rating + foto |
| POST | `/api/upload` | user | signature Cloudinary |
| GET | `/api/admin/reports` | admin | penjualan + export |

Auth: `/api/auth/[...nextauth]` (Credentials + Google).

---

## 7. Implementasi → Deployment (roadmap)

1. **Fondasi** ✅ Next.js + Tailwind + deps + Prisma schema + design system
2. **DB & Auth** — Prisma migrate, seed, NextAuth (credentials + Google), register/login/reset
3. **Catalog** — services, katalog, detail produk, variant Ayam Pop
4. **Cart & Checkout** — Zustand cart, voucher, alamat, Midtrans Snap, webhook
5. **Orders & Reviews** — riwayat, status, invoice PDF, email, review buyer-only
6. **Admin** — dashboard, CRUD produk/variant, pesanan, pelanggan, laporan + export
7. **Polish** — dark mode, skeleton/empty/toast, SEO, a11y, audit
8. **Deploy** — Vercel + Postgres (Neon), env, Midtrans webhook URL, seed prod

---

## 8. Tech Stack

Frontend: Next.js 16 App Router · TypeScript · Tailwind v4 · shadcn/ui · TanStack Query · Zustand · React Hook Form · Zod
Backend: Next.js Route Handlers + Server Actions · Prisma ORM
DB: PostgreSQL · Auth: Auth.js (JWT + Google) · Storage: Cloudinary
Payment: Midtrans Snap (sandbox) · Email: Nodemailer · Deploy: Vercel
