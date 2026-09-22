"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Sparkles } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Menu Masak" },
  { href: "/#how-it-works", label: "Cara Kerja" },
  { href: "/#features", label: "Keunggulan" },
  { href: "/orders", label: "Pesanan" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  React.useEffect(() => setMounted(true), []);

  // Hide on admin routes (admin has its own shell)
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 glass backdrop-blur-md">
      {/* Top micro-announcement ribbon */}
      <div className="hidden sm:block border-b border-border/40 bg-secondary/60 py-1.5 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4">
          <span className="flex items-center gap-1 font-medium text-primary">
            <Sparkles className="size-3 text-gold animate-pulse" /> Paket Ready to Cook
          </span>
          <span className="text-border">|</span>
          <span>Bahan segar dibersihkan & dibumbui • Tinggal cemplung, siap dalam 15 menit</span>
          <span className="text-border">|</span>
          <Link href="/products" className="font-semibold text-foreground underline-offset-4 hover:underline">
            Cek Menu Hari Ini →
          </Link>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  active
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Quick search button on desktop */}
          <Link
            href="/products"
            className="hidden lg:flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs text-muted-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-background"
          >
            <Search className="size-3.5 text-muted-foreground" />
            <span>Cari resep atau menu...</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              /
            </kbd>
          </Link>

          <ThemeToggle />

          <Button asChild variant="outline" size="sm" className="relative gap-2 rounded-full border-border/80 shadow-soft" aria-label="Keranjang">
            <Link href="/cart">
              <ShoppingBag className="size-4 text-primary" />
              <span className="hidden sm:inline text-xs font-semibold">Keranjang</span>
              {mounted && count > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground animate-in zoom-in-75">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          </Button>

          <UserMenu />

          {/* Standard 3-line hamburger menu for mobile */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
