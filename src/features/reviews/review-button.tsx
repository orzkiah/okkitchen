"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/features/upload/image-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ReviewButton({
  orderItemId,
  productName,
}: {
  orderItemId: string;
  productName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function submit() {
    if (rating === 0) {
      toast.error("Beri rating bintang dulu ya");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderItemId, rating, comment, photos }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Gagal", { description: json.error });
        return;
      }
      toast.success("Terima kasih atas ulasanmu! 🌟");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  function setPhotoAt(i: number, url: string) {
    setPhotos((prev) => {
      const next = [...prev];
      if (url) next[i] = url;
      else next.splice(i, 1);
      return next.filter(Boolean);
    });
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <MessageSquarePlus className="size-4" /> Beri Ulasan
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ulas Produk</DialogTitle>
            <DialogDescription>{productName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(s)}
                    aria-label={`${s} bintang`}
                  >
                    <Star
                      className={cn(
                        "size-8 transition-colors",
                        (hover || rating) >= s ? "fill-gold text-gold" : "fill-muted text-muted"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comment">Ulasan</Label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bagaimana rasanya? Ceritakan pengalaman memasakmu..."
                className="flex min-h-24 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Foto hasil masakan (opsional)</Label>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <ImageUpload
                    key={i}
                    value={photos[i]}
                    onChange={(url) => setPhotoAt(i, url)}
                    folder="okkitchen/reviews"
                    className="h-20 w-20"
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="gradient" onClick={submit} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              Kirim Ulasan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
