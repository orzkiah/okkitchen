import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  className,
  showValue = false,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              filled ? "fill-gold text-gold" : "fill-muted text-muted"
            )}
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-xs font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
