"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  UtensilsCrossed,
  Clock,
  Sparkles,
  Package,
  HelpCircle,
  MessageCircle,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/products", label: "Menu Masak", icon: UtensilsCrossed, badge: "Siap Saji" },
  { href: "/#how-it-works", label: "Cara Kerja", icon: Clock },
  { href: "/#features", label: "Keunggulan", icon: Sparkles },
  { href: "/orders", label: "Lacak Pesanan", icon: Package },
  { href: "/#faq", label: "Bantuan & FAQ", icon: HelpCircle },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const pathname = usePathname();

  React.useEffect(() => setMounted(true), []);

  // Close drawer whenever the route changes
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* 3-line hamburger menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-full border border-border/80 bg-background/80 hover:bg-secondary text-foreground shadow-sm"
        aria-label="Buka menu navigasi"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5 text-foreground" />
      </Button>

      {/* Slide-out Drawer via Portal */}
      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setOpen(false)}
            />

            {/* Drawer Panel (slides from right) */}
            <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-out">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <Logo showText={true} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-secondary"
                  aria-label="Tutup menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                {/* Search Bar in Mobile Menu */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="relative"
                >
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari menu siap masak..."
                    className="h-10 w-full rounded-full border border-border/80 bg-secondary/50 pl-10 pr-4 text-xs shadow-sm focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </form>

                {/* Main Navigation Links */}
                <div className="space-y-1">
                  <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Menu Navigasi
                  </p>
                  {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-secondary"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight className="size-3.5 text-muted-foreground/50" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Direct WhatsApp Help */}
                <div className="pt-2 border-t border-border/60">
                  <a
                    href={`https://wa.me/${SITE.whatsapp}?text=Halo%20OK%20Kitchen,%20saya%20ingin%20tanya%20seputar%20menu`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-3.5 text-xs text-foreground transition-colors hover:bg-accent/10 shadow-sm"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent text-white">
                      <MessageCircle className="size-4" />
                    </div>
                    <div>
                      <p className="font-bold text-accent">Butuh Bantuan Masak?</p>
                      <p className="text-[11px] text-muted-foreground">Hubungi WhatsApp tim dapur</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-border/60 px-5 py-3.5 text-center text-[11px] text-muted-foreground bg-secondary/30">
                <p>© {new Date().getFullYear()} O&apos;K Kitchen · Fresh, Practical, Ready to Cook</p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
