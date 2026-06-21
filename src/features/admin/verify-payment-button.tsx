"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function VerifyPaymentButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function verify() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verifyPayment: true }),
      });
      if (!res.ok) throw new Error();
      toast.success("Pembayaran diverifikasi");
      router.refresh();
    } catch {
      toast.error("Gagal memverifikasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={verify} disabled={loading}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : <BadgeCheck className="size-4" />}
      Verifikasi
    </Button>
  );
}
