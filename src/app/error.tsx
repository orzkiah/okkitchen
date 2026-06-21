"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold">Terjadi kesalahan</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Maaf, ada gangguan di dapur kami. Silakan coba lagi.
        </p>
      </div>
      <Button variant="gradient" onClick={reset}>
        Coba Lagi
      </Button>
    </div>
  );
}
