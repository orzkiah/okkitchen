import Link from "next/link";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 group select-none", className)}>
      <div className="relative flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-primary via-primary to-gold/90 text-white shadow-soft transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow">
        <Utensils className="size-5 transition-transform duration-300 group-hover:rotate-6" />
        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent ring-2 ring-background">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-lg tracking-tight text-foreground">
              O&apos;K
            </span>
            <span className="font-sans text-xs font-black uppercase tracking-wider text-primary">
              Kitchen
            </span>
          </div>
          <span className="text-[10px] tracking-wide text-muted-foreground font-medium mt-0.5">
            Ready to Cook · Dapur Segar
          </span>
        </div>
      )}
    </Link>
  );
}
