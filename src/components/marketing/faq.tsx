"use client";

import * as React from "react";
import { ChevronDown, MessageCircle, HelpCircle } from "lucide-react";
import { FAQS } from "@/lib/sample-data";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
      <div className="mb-12 text-center max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Bantuan & Panduan
        </span>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-serif">
          Pertanyaan Seputar Dapur O&apos;K
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Semua hal yang perlu Anda ketahui mengenai kesegaran, penyimpanan, dan cara pengiriman.
        </p>
      </div>

      <div className="space-y-3.5 max-w-3xl mx-auto">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={cn(
                "overflow-hidden rounded-2xl border transition-all duration-300",
                isOpen
                  ? "border-primary/40 bg-card shadow-soft"
                  : "border-border/80 bg-card/60 hover:border-border hover:bg-card"
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-foreground text-sm sm:text-base transition-colors"
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary/80 text-foreground transition-transform duration-300",
                    isOpen && "rotate-180 bg-primary/10 text-primary"
                  )}
                >
                  <ChevronDown className="size-4" />
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Human Assistance Help Box */}
      <div className="mt-12 mx-auto max-w-3xl rounded-3xl border border-border/80 bg-secondary/40 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="font-bold text-foreground text-base">Masih ada pertanyaan lain?</p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Konsultasikan menu masakan atau tanyakan kesediaan stok langsung ke tim dapur kami.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full border-border/80 bg-background hover:bg-secondary gap-2 shrink-0">
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=Halo%20OK%20Kitchen,%20saya%20ingin%20tanya%20seputar%20menu%20ready-to-cook`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4 text-accent" />
            <span>Chat WhatsApp</span>
          </a>
        </Button>
      </div>
    </section>
  );
}
