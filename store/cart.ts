"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export type CartItem = Pick<Product, "id" | "title" | "price" | "thumbnail"> & { qty: number };

type CartState = {
  items: Record<number, CartItem>;
  add: (p: Product) => void;
  remove: (id: number) => void;
  inc: (id: number) => void;
  dec: (id: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      add: (p) =>
        set((s) => {
          const existing = s.items[p.id];
          const qty = existing ? existing.qty + 1 : 1;
          return { items: { ...s.items, [p.id]: { id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, qty } } };
        }),
      remove: (id) => set((s) => { const { [id]: _, ...rest } = s.items; return { items: rest }; }),
      inc: (id) => set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], qty: s.items[id].qty + 1 } } })),
      dec: (id) => set((s) => {
        const it = s.items[id];
        if (!it) return s;
        const qty = it.qty - 1;
        if (qty <= 0) { const { [id]: _, ...rest } = s.items; return { items: rest }; }
        return { items: { ...s.items, [id]: { ...it, qty } } };
      }),
      clear: () => set({ items: {} }),
    }),
    { name: "cart-v1" }
  )
);

export const selectCount = (items: Record<number, CartItem>) =>
  Object.values(items).reduce((a, c) => a + c.qty, 0);

export const selectTotal = (items: Record<number, CartItem>) =>
  Object.values(items).reduce((a, c) => a + c.qty * c.price, 0);
