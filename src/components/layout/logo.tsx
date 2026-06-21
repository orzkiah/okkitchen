import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <span className="relative grid place-items-center h-10 w-10 rounded-xl brand-gradient shadow-glow transition-transform group-hover:scale-105">
        <span className="font-extrabold text-white text-lg tracking-tighter">
          O&apos;K
        </span>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-extrabold text-base tracking-tight">
            O&apos;K <span className="brand-gradient-text">Kitchen</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            Ready to Cook
          </span>
        </span>
      )}
    </Link>
  );
}
