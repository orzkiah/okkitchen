"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppliedVoucher {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minSpend: number;
  maxDiscount?: number | null;
}

interface VoucherState {
  voucher: AppliedVoucher | null;
  apply: (v: AppliedVoucher) => void;
  clear: () => void;
  discountFor: (subtotal: number) => number;
}

export const useVoucherStore = create<VoucherState>()(
  persist(
    (set, get) => ({
      voucher: null,
      apply: (v) => set({ voucher: v }),
      clear: () => set({ voucher: null }),
      discountFor: (subtotal) => {
        const v = get().voucher;
        if (!v || subtotal < v.minSpend) return 0;
        let d = v.type === "PERCENT" ? Math.round((subtotal * v.value) / 100) : v.value;
        if (v.maxDiscount && d > v.maxDiscount) d = v.maxDiscount;
        return Math.min(d, subtotal);
      },
    }),
    { name: "okkitchen-voucher" }
  )
);
