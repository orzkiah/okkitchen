"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  /** unique key = productId + variantId */
  key: string;
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
  quantity: number;
  selected: boolean;
}

interface CartState {
  items: CartLine[];
  addItem: (item: Omit<CartLine, "key" | "quantity" | "selected">, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  toggleSelect: (key: string) => void;
  toggleSelectAll: (value: boolean) => void;
  clear: () => void;
  // derived helpers
  totalItems: () => number;
  selectedSubtotal: () => number;
}

const makeKey = (productId: string, variantId?: string) =>
  `${productId}:${variantId ?? "base"}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) =>
        set((state) => {
          const key = makeKey(item.productId, item.variantId);
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key
                  ? { ...i, quantity: Math.min(i.quantity + qty, i.stock) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, key, quantity: Math.min(qty, item.stock), selected: true },
            ],
          };
        }),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      updateQty: (key, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) }
              : i
          ),
        })),

      toggleSelect: (key) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key ? { ...i, selected: !i.selected } : i
          ),
        })),

      toggleSelectAll: (value) =>
        set((state) => ({
          items: state.items.map((i) => ({ ...i, selected: value })),
        })),

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((n, i) => n + i.quantity, 0),

      selectedSubtotal: () =>
        get()
          .items.filter((i) => i.selected)
          .reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "okkitchen-cart" }
  )
);
