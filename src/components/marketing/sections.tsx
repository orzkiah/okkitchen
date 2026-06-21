import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  ChefHat,
  ShieldCheck,
  Truck,
  ShoppingBag,
  CreditCard,
  PackageCheck,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shared/product-card";
import { getFeaturedProducts } from "@/server/services/product.service";

/* ---------------- HERO ---------------- */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-10 top-40 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <Badge variant="secondary" className="gap-1.5 py-1.5 pl-1.5 pr-3">
            <span className="rounded-full brand-gradient px-2 py-0.5 text-[10px] font-bold text-white">
              NEW
            </span>
            Ready to Cook · Tinggal Masak
          </Badge>

          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Masak <span className="brand-gradient-text">Enak</span> Tanpa Ribet,{" "}
            <span className="brand-gradient-text">Siap dalam Menit.</span>
          </h1>

          <p className="max-w-md text-balance text-base text-muted-foreground md:text-lg">
            Bahan segar yang sudah dibersihkan, dibumbui, dan dikemas higienis.
            Cocok untuk mahasiswa, karyawan, anak kos, dan ibu rumah tangga.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="gradient">
              <Link href="/products">
                Belanja Sekarang <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/products">Lihat Menu</Link>
            </Button>
          </div>

          <div className="flex gap-6 pt-2">
            {[
              { n: "1.000+", l: "Pelanggan Puas" },
              { n: "4.9", l: "Rating Rata-rata" },
              { n: "15 mnt", l: "Rata-rata Masak" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-extrabold brand-gradient-text">{s.n}</p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border shadow-glow">
            <Image
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=80"
              alt="Makanan siap masak O'K Kitchen"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="glass absolute -bottom-5 -left-5 rounded-2xl border p-4 shadow-soft">
            <p className="text-xs text-muted-foreground">Estimasi masak</p>
            <p className="text-xl font-extrabold">⏱️ 15-20 menit</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- KEUNGGULAN ---------------- */
const FEATURES = [
  { icon: Leaf, title: "Bahan Segar", desc: "Dipilih setiap hari, kualitas terjaga." },
  { icon: ChefHat, title: "Siap Dimasak", desc: "Sudah dibumbui, tinggal masak." },
  { icon: ShieldCheck, title: "Higienis", desc: "Dikemas bersih & aman." },
  { icon: Truck, title: "Pengiriman Cepat", desc: "Sampai segar di depan pintu." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Kenapa O&apos;K Kitchen?</h2>
        <p className="mt-2 text-muted-foreground">Praktis, segar, dan tepercaya.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border bg-card p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
          >
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl brand-gradient text-white shadow-glow transition-transform group-hover:scale-110">
              <f.icon className="size-7" />
            </div>
            <h3 className="font-bold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- PRODUK TERLARIS ---------------- */
export async function BestSellers() {
  const featured = await getFeaturedProducts(4);
  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Produk Terlaris</h2>
            <p className="mt-1 text-muted-foreground">Favorit para pelanggan kami.</p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/products">
              Lihat semua <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
  { icon: ShoppingBag, title: "Pilih Menu", desc: "Telusuri katalog & pilih favoritmu." },
  { icon: CreditCard, title: "Checkout", desc: "Bayar mudah via QRIS / transfer / e-wallet." },
  { icon: PackageCheck, title: "Produk Dikirim", desc: "Dikemas higienis & dikirim cepat." },
  { icon: UtensilsCrossed, title: "Masak & Nikmati", desc: "Tinggal masak, sajian siap!" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Cara Kerja</h2>
        <p className="mt-2 text-muted-foreground">Empat langkah mudah sampai ke meja makan.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border-2 border-primary/30 bg-card shadow-soft">
              <s.icon className="size-7 text-primary" />
              <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full brand-gradient text-xs font-bold text-white">
                {i + 1}
              </span>
            </div>
            <h3 className="font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl brand-gradient px-6 py-14 text-center text-white shadow-glow">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-10 top-6 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        </div>
        <div className="relative">
          <h2 className="text-balance text-3xl font-extrabold md:text-4xl">
            Lapar? Tinggal masak, langsung kenyang.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/90">
            Pesan sekarang dan rasakan praktisnya memasak bersama O&apos;K Kitchen.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link href="/products">
              Belanja Sekarang <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
