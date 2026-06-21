# O'K Kitchen — Panduan Deployment

## 1. Persiapan layanan eksternal (gratis)

| Layanan | Untuk | Dapatkan |
|---|---|---|
| **Neon / Supabase** | PostgreSQL | `DATABASE_URL` |
| **Google Cloud Console** | Login Google | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (redirect: `https://DOMAIN/api/auth/callback/google`) |
| **Cloudinary** | Upload foto | `CLOUDINARY_*` + `NEXT_PUBLIC_CLOUDINARY_*` |
| **Midtrans (Sandbox)** | Pembayaran | `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY` |
| **Gmail App Password / SMTP** | Email | `SMTP_*` |

`AUTH_SECRET` → generate dengan `npx auth secret`.

## 2. Setup lokal

```bash
npm install
npm env          # isi semua nilai
npm run db:push               # buat tabel
npm run db:seed               # data demo + akun admin
npm run dev
```

Login admin: `admin@okkitchen.id` / `admin123`.

## 3. Deploy ke Vercel

1. Push repo ke GitHub.
2. Import project di **vercel.com** → framework otomatis terdeteksi (Next.js).
3. **Environment Variables**: salin semua dari `.env` (set `NEXT_PUBLIC_APP_URL`, `AUTH_URL`, `NEXTAUTH_URL` ke domain Vercel).
4. Deploy. `npm run build` sudah menjalankan `prisma generate`.
5. Setelah live, jalankan migrasi schema ke DB production: `npx prisma db push` (dengan `DATABASE_URL` production) lalu `npm run db:seed` bila perlu.

## 4. Konfigurasi Midtrans webhook

Di dashboard Midtrans Sandbox → **Settings → Configuration → Payment Notification URL**:

```
https://DOMAIN-ANDA.vercel.app/api/webhooks/midtrans
```

Webhook akan memverifikasi signature, menandai pembayaran **PAID**, mengurangi stok, menambah `soldCount`, dan mengirim email invoice.

## 5. Checklist produksi

- [ ] Semua env terisi di Vercel
- [ ] Google OAuth redirect URI sesuai domain
- [ ] Cloudinary unsigned/ signed upload aktif
- [ ] Midtrans webhook URL terdaftar
- [ ] `prisma db push` ke DB production
- [ ] Ganti password akun admin demo
