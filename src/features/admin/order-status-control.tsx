"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ORDER_STATUS_LABEL } from "@/lib/constants";

const STATUSES = [
  "PENDING_PAYMENT",
  "PROCESSING",
  "PACKING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

export function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(status);
  const [loading, setLoading] = React.useState(false);

  async function change(next: string) {
    setValue(next);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      toast.success("Status diperbarui");
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui status");
      setValue(status);
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(e) => change(e.target.value)}
      className="h-9 rounded-lg border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
