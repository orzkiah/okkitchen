"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { TESTIMONIALS } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const total = TESTIMONIALS.length;

  const go = React.useCallback(
    (dir: number) => setIndex((i) => (i + dir + total) % total),
    [total]
  );

  React.useEffect(() => {
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [go]);

  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Kata Mereka</h2>
        <p className="mt-2 text-muted-foreground">Cerita dari dapur pelanggan O&apos;K Kitchen.</p>

        <div className="relative mt-10">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="w-full shrink-0 px-2"
                >
                  <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 shadow-soft">
                    <Quote className="mx-auto mb-4 size-8 text-primary/30" />
                    <blockquote className="text-balance text-lg font-medium">
                      “{t.text}”
                    </blockquote>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="text-left">
                        <figcaption className="font-semibold">{t.name}</figcaption>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-center">
                      <RatingStars rating={t.rating} size={16} />
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => go(-1)}
            aria-label="Sebelumnya"
            className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-full bg-card sm:-left-4"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(1)}
            aria-label="Berikutnya"
            className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full bg-card sm:-right-4"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Testimoni ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
