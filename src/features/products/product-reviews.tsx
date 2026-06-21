import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { UIReview } from "@/server/services/review.service";

interface Props {
  reviews: UIReview[];
  average: number;
  total: number;
  distribution: Record<number, number>;
}

export function ProductReviews({ reviews, average, total, distribution }: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-extrabold tracking-tight">Ulasan Pelanggan</h2>

      {total === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Belum ada ulasan"
          description="Jadilah yang pertama memberi ulasan setelah membeli produk ini."
        />
      ) : (
        <>
          <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-soft sm:flex-row sm:items-center">
            <div className="text-center sm:border-r sm:pr-8">
              <p className="text-5xl font-extrabold">{average.toFixed(1)}</p>
              <RatingStars rating={average} className="mt-1 justify-center" />
              <p className="mt-1 text-xs text-muted-foreground">{total} ulasan</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] ?? 0;
                const pct = total ? (count / total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3">{star}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((r) => (
              <article key={r.id} className="rounded-xl border bg-card p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {r.author.image && <AvatarImage src={r.author.image} alt={r.author.name} />}
                    <AvatarFallback>{r.author.name[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{r.author.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                  </div>
                  <div className="ml-auto">
                    <RatingStars rating={r.rating} />
                  </div>
                </div>
                {r.comment && <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>}
                {r.photos.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {r.photos.map((src, i) => (
                      <div
                        key={i}
                        className="relative h-20 w-20 overflow-hidden rounded-lg border"
                      >
                        <Image src={src} alt="Hasil masakan" fill sizes="80px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
