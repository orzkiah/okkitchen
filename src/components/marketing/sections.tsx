import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Truck,
  ArrowRight,
  Flame,
  CheckCircle2,
  Package,
  HeartHandshake,
  UtensilsCrossed,
  ChefHat,
  Leaf,
  Timer,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";
import { getFeaturedProducts } from "@/server/services/product.service";

/* ---------------- HERO SECTION ---------------- */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-secondary/40 via-background to-background pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Decorative ambient culinary glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="culinary-pattern absolute inset-0 opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="space-y-6 lg:col-span-7">
            {/* Artisanal badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Dapur Segar Siap Masak · P-IRT & 100% Halal</span>
            </div>

            {/* Editorial Heading */}
            <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.12]">
              Masak Enak Tanpa Ribet,{" "}
              <span className="font-serif italic font-normal text-primary">
                Rasa Restoran
              </span>{" "}
              di Dapur Rumah.
            </h1>

            <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg leading-relaxed">
              Bahan segar pilihan yang sudah dibersihkan, dipotong rapi, dan dimarinasi
              bumbu rempah Nusantara asli. Buka vacuum pack, cemplung ke wajan,
              dan hidangkan masakan hangat dalam 15 menit.
            </p>

            {/* Reassurance Micro-Pills */}
            <div className="flex flex-wrap gap-y-2 gap-x-4 pt-1 text-xs font-medium text-foreground/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-accent" /> Tanpa repot ulek bumbu
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-accent" /> Kemasan vacuum higienis
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-accent" /> 100% Rempah alami
              </span>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="rounded-full shadow-soft hover:shadow-card-hover px-7 text-sm font-semibold gap-2">
                <Link href="/products">
                  Lihat Menu Hari Ini <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-border/80 px-6 text-sm font-semibold">
                <Link href="#how-it-works">Pelajari Cara Masak</Link>
              </Button>
            </div>

            {/* Foodie Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/60 max-w-lg">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  15 <span className="text-sm font-sans font-medium text-muted-foreground">Menit</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Rata-rata waktu masak</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  4.9 <span className="text-sm font-sans font-medium text-gold">★</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Kepuasan pelanggan</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  100%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Bahan segar & alami</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Culinary Showcase */}
          <div className="relative lg:col-span-5">
            {/* Main dish card */}
            <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card p-3 shadow-soft sm:p-4 transition-transform duration-500 hover:shadow-card-hover">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=900&q=80"
                  alt="Paket Ayam Pop O'K Kitchen"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm">
                    🔥 Menu Terlaris
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-lg font-bold">Paket Masak Ayam Pop Padang</p>
                  <p className="text-xs text-white/80">Lengkap dengan sambal khas & daun singkong rebus</p>
                </div>
              </div>

              {/* What's inside the meal kit preview */}
              <div className="mt-4 rounded-2xl bg-secondary/60 p-3.5 text-xs">
                <div className="flex items-center justify-between font-semibold text-foreground mb-2">
                  <span className="flex items-center gap-1.5">
                    <Package className="size-3.5 text-primary" /> Isi Dalam 1 Kemasan:
                  </span>
                  <span className="text-[11px] font-normal text-muted-foreground">Porsi 2-3 orang</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-muted-foreground text-[11px]">
                  <span className="flex items-center gap-1">✓ Ayam Segar Ungkep</span>
                  <span className="flex items-center gap-1">✓ Bumbu Rempah Lengkuas</span>
                  <span className="flex items-center gap-1">✓ Sambal Merah Padang</span>
                  <span className="flex items-center gap-1">✓ Daun Singkong Olahan</span>
                </div>
              </div>
            </div>

            {/* Floating culinary badge */}
            <div className="absolute -bottom-6 -left-4 hidden sm:flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-soft backdrop-blur-md">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent font-bold text-xl">
                ❄️
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Pengiriman Dingin Terjaga</p>
                <p className="text-[11px] text-muted-foreground">Ice gel pack menjaga kesegaran sampai rumah</p>
              </div>
            </div>

            {/* Quick prep badge top right */}
            <div className="absolute -top-4 -right-2 hidden sm:flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1.5 shadow-soft">
              <Timer className="size-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Siap Santap &lt; 20 Mnt</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- KEUNGGULAN (Bento Grid) ---------------- */
export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
      <div className="mb-12 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Mengapa O&apos;K Kitchen?
        </span>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-serif">
          Semua Kenikmatan Masak Sendiri,{" "}
          <span className="italic font-normal text-primary">Tanpa Kerumitannya.</span>
        </h2>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          Kami memangkas proses persiapan yang melelahkan sehingga Anda bisa fokus menikmati proses memasak dan kehangatan makan bersama.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Bento 1: Wide Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-7 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover md:col-span-2">
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ChefHat className="size-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                0 Menit Waktu Kupas & Ulek Bumbu
              </h3>
              <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
                Tidak ada lagi mata pedih mengiris bawang atau wastafel penuh pisau dan blender kotor.
                Bumbu sudah kami racik dari rempah segar asli, terukur presisi oleh chef, dan langsung siap tuang.
              </p>
            </div>

            {/* Visual Time Comparison */}
            <div className="rounded-2xl border border-border/60 bg-secondary/50 p-4">
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="space-y-1 border-b sm:border-b-0 sm:border-r border-border/60 pb-2 sm:pb-0 sm:pr-4">
                  <span className="font-semibold text-muted-foreground">Masak Tradisional (± 60 Menit)</span>
                  <p className="text-[11px] text-muted-foreground">Belanja pasar → Cuci kotoran daging → Kupas bawang & rempah → Ulek manual → Dapur berantakan.</p>
                </div>
                <div className="space-y-1 sm:pl-2">
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Sparkles className="size-3.5" /> Bersama O&apos;K Kitchen (± 15 Menit)
                  </span>
                  <p className="text-[11px] text-foreground font-medium">Buka kemasan vacuum → Cemplung ke wajan → Matang & sajikan hangat!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento 2 */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-7 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover">
          <div className="space-y-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Leaf className="size-6" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              100% Rempah Nusantara
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bukan bumbu bubuk instan atau perasa sachet. Menggunakan rempah basah segar petani lokal dengan aroma otentik rumahan.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-accent flex items-center gap-1.5">
            <ShieldCheck className="size-4" /> Tanpa pengawet sintetis
          </div>
        </div>

        {/* Bento 3 */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-7 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover">
          <div className="space-y-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
              <Package className="size-6" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Food-Grade Vacuum Pack
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Teknologi seal hampa udara menjaga serat daging tetap lembut dan bumbu meresap sempurna. Tahan hingga 7 hari di freezer.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-muted-foreground">
            Higienis & kedap aroma
          </div>
        </div>

        {/* Bento 4: Wide Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-7 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover md:col-span-2">
          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Truck className="size-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Pengiriman Dingin Terjamin Sampai Depan Pintu
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Setiap paket dikemas rapi dengan lapisan isolasi dan ice gel pack pendingin.
                Menjamin daging dan bumbu tetap dalam suhu ideal selama pengiriman instan maupun same-day.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-foreground/80 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-accent" /> Garansi ganti baru bila paket rusak
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-accent" /> Dikirim langsung dari dapur produksi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRODUK TERLARIS ---------------- */
export async function BestSellers() {
  const featured = await getFeaturedProducts(4);

  return (
    <section className="border-y border-border/60 bg-secondary/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Menu Rekomendasi
            </span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-serif">
              Favorit Para Chef Rumahan
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Resep paling laris yang paling sering dipesan ulang oleh pelanggan O&apos;K Kitchen.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-border/80 self-start sm:self-auto">
            <Link href="/products" className="gap-2">
              Semua Menu <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CARA KERJA ---------------- */
const STEPS = [
  {
    step: "01",
    title: "Pilih Menu Selera",
    desc: "Telusuri katalog aneka resep Nusantara & rumahan siap masak.",
    detail: "Tersedia olahan ayam, ikan, hingga bumbu kuning pilihan.",
  },
  {
    step: "02",
    title: "Paket Tiba Segar & Dingin",
    desc: "Dikemas vacuum pouch higienis lengkap dengan ice gel pack.",
    detail: "Bahan bersih, higienis, dan siap langsung diolah.",
  },
  {
    step: "03",
    title: "Cemplung & Masak",
    desc: "Ikuti 3 langkah panduan masak praktis di balik kemasan.",
    detail: "Tanpa repot ulek bumbu, tidak perlu tambah micin atau garam.",
  },
  {
    step: "04",
    title: "Sajikan Hangat",
    desc: "Hidangan hangat selezat resto siap disantap bersama keluarga.",
    detail: "Hemat waktu, hemat cucian piring, rasa terjamin nikmat.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Praktis & Mudah
        </span>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-serif">
          4 Langkah Sampai ke Meja Makan
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Bahkan bagi yang belum pernah masak sekalipun, hasil masakan dijamin nikmat dan memuaskan.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
          >
            <div>
              <span className="font-serif text-3xl font-black text-primary/30 transition-colors group-hover:text-primary">
                {s.step}
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
            <p className="mt-4 pt-3 border-t border-border/50 text-[11px] text-muted-foreground font-medium">
              {s.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CTA / INVITATION BANNER ---------------- */
export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 sm:pb-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 px-6 py-14 text-white shadow-soft sm:px-12 sm:py-16">
        {/* Decorative subtle ambient lights */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-gold blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="size-3.5 text-gold" /> Promo Pengguna Baru
          </div>

          <h2 className="text-balance text-3xl font-extrabold sm:text-4xl lg:text-5xl font-serif tracking-tight leading-tight">
            Ingin Makan Enak Malam Ini?{" "}
            <span className="italic font-normal text-gold">Tinggal Cemplung.</span>
          </h2>

          <p className="mx-auto max-w-lg text-sm sm:text-base text-stone-300 leading-relaxed">
            Dapatkan pengalaman memasak praktis tanpa stres. Gunakan kode voucher{" "}
            <code className="rounded bg-white/20 px-2 py-0.5 font-mono text-xs font-bold text-white">
              MASAKHEMAT
            </code>{" "}
            untuk potongan diskon 15% pada pesanan pertamamu.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-glow px-8 font-semibold text-sm h-12"
            >
              <Link href="/products">
                Mulai Belanja Menu <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white px-6 font-semibold text-sm h-12"
            >
              <Link href="/products?category=ayam">Lihat Menu Ayam</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4 text-xs text-stone-400">
            <span>✓ Tanpa langganan terikat</span>
            <span>✓ Pengiriman instan & same-day</span>
            <span>✓ Garansi kesegaran 100%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
