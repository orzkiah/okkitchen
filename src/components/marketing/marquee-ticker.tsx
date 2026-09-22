import React from "react";
import { Sparkles, Leaf, ShieldCheck, Clock, Truck, ChefHat, HeartHandshake } from "lucide-react";

const TICKER_ITEMS = [
  { icon: Leaf, text: "100% Rempah Basah Nusantara" },
  { icon: ShieldCheck, text: "Tanpa Pengawet Sintetis" },
  { icon: Clock, text: "Siap Santap < 15 Menit" },
  { icon: Truck, text: "Pengiriman Dingin + Ice Gel" },
  { icon: ChefHat, text: "Racikan Chef Berpengalaman" },
  { icon: Sparkles, text: "Dapur Bersih Tanpa Ulek Bumbu" },
  { icon: HeartHandshake, text: "Garansi 100% Bahan Segar" },
];

export function MarqueeTicker() {
  return (
    <div className="relative w-full overflow-hidden border-b border-border/50 bg-secondary/50 py-3 select-none">
      {/* Subtle fade masks on edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee gap-8 text-xs font-semibold text-foreground/80">
        {/* Repeat twice for seamless infinite loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 shrink-0">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
              <item.icon className="size-3.5" />
            </span>
            <span>{item.text}</span>
            <span className="text-border mx-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
