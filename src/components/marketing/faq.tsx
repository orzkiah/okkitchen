"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Pertanyaan Umum</h2>
        <p className="mt-2 text-muted-foreground">Hal yang sering ditanyakan pelanggan.</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="overflow-hidden rounded-xl border bg-card shadow-soft">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
                aria-expanded={isOpen}
              >
                {item.q}
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-primary transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted-foreground">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
