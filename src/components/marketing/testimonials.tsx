"use client";

import * as React from "react";
import Image from "next/image";
import { CheckCircle2, Star, Sparkles, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/sample-data";

const ENRICHED_TESTIMONIALS = [
  {
    ...TESTIMONIALS[0],
    menu: "Paket Ayam Pop Padang",
    location: "Jakarta Barat",
    highlight: "15 Menit langsung santap",
  },
  {
    ...TESTIMONIALS[1],
    menu: "Paket Ikan Nila Bumbu Kuning",
    location: "Tangerang Selatan",
    highlight: "Bumbu meresap & ikan tidak amis",
  },
  {
    ...TESTIMONIALS[2],
    menu: "Paket Ayam Pop (Paha Semua)",
    location: "Depok",
    highlight: "Dapur tetap bersih tanpa ulek bumbu",
  },
  {
    ...TESTIMONIALS[3],
    menu: "Paket Ikan Nila Siap Masak",
    location: "Jakarta Selatan",
    highlight: "Praktis buat anak kos",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-border/60 bg-secondary/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold text-foreground mb-3">
            <Sparkles className="size-3.5 text-gold fill-gold" /> Ulasan Pelanggan Asli
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-serif">
            Cerita Nyata dari Dapur Rumah
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Lebih dari 1.000+ keluarga, karyawan sibuk, dan anak kos telah mempercayakan menu harian mereka.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ENRICHED_TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
            >
              <div>
                {/* Rating & Verified */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent">
                    <CheckCircle2 className="size-3" /> Terverifikasi
                  </span>
                </div>

                {/* Highlight banner */}
                <div className="rounded-xl bg-secondary/70 px-2.5 py-1 text-[11px] font-medium text-foreground mb-3">
                  "{t.highlight}"
                </div>

                {/* Body Quote */}
                <blockquote className="text-sm text-foreground/90 leading-relaxed">
                  “{t.text}”
                </blockquote>
              </div>

              {/* Author & Menu Cooked */}
              <div className="mt-6 pt-4 border-t border-border/60">
                <div className="flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-border/50"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{t.role} · {t.location}</p>
                  </div>
                </div>
                <div className="mt-2.5 rounded-lg bg-background/80 px-2.5 py-1 text-[10px] text-muted-foreground font-medium truncate border border-border/40">
                  🍳 Memasak: <span className="text-primary font-semibold">{t.menu}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
