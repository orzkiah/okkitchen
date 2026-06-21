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
    <footer className="mt-auto border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              {SITE.description}
            </p>
            <div className="flex gap-2">
              {[Instagram, Facebook, MessageCircle, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label="Media sosial"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
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

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}
          </p>
          <p>Dibuat dengan ❤️ untuk dapur Anda.</p>
        </div>
      </div>
    </footer>
  );
}
