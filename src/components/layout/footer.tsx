import Link from "next/link";
import { Instagram, Facebook, MessageCircle, Mail } from "lucide-react";
import { Logo } from "./logo";
import { SITE } from "@/lib/constants";

const FOOTER_NAV = [
  {
    title: "Tentang Kami",
    links: [
      { label: "Cerita O'K Kitchen", href: "/#about" },
      { label: "Cara Kerja", href: "/#how-it-works" },
      { label: "Keunggulan", href: "/#features" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Kontak", href: `https://wa.me/${SITE.whatsapp}` },
      { label: "Lacak Pesanan", href: "/orders" },
    ],
  },
  {
    title: "Menu",
    links: [
      { label: "Semua Produk", href: "/products" },
      { label: "Ikan Nila Bumbu Kuning", href: "/products" },
      { label: "Ayam Pop", href: "/products" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      {/* Trust & Guarantee bar */}
      <div className="border-b border-border/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center sm:text-left text-xs text-muted-foreground">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <span className="text-xl">🌿</span>
              <div>
                <p className="font-bold text-foreground">100% Rempah Asli</p>
                <p className="text-[11px]">Tanpa pengawet sintetis</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <span className="text-xl">❄️</span>
              <div>
                <p className="font-bold text-foreground">Cold-Chain Delivery</p>
                <p className="text-[11px]">Ice gel pack terjaga segar</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-bold text-foreground">Garansi Kualitas</p>
                <p className="text-[11px]">Ganti baru jika bahan rusak</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <span className="text-xl">⚡</span>
              <div>
                <p className="font-bold text-foreground">Siap &lt; 20 Menit</p>
                <p className="text-[11px]">Praktis tinggal cemplung</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              {SITE.description}
            </p>
            <div className="flex gap-2">
              {[Instagram, Facebook, MessageCircle, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-background text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground shadow-sm"
                  aria-label="Media sosial"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-foreground">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Metode Bayar:</span>
            <span className="rounded bg-background px-2 py-0.5 font-semibold text-foreground border border-border/60">
              QRIS
            </span>
            <span className="rounded bg-background px-2 py-0.5 font-semibold text-foreground border border-border/60">
              GoPay
            </span>
            <span className="rounded bg-background px-2 py-0.5 font-semibold text-foreground border border-border/60">
              Transfer Bank
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
