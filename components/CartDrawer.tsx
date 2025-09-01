"use client";

import { useRef } from "react";
import { useCart, selectTotal } from "@/store/cart";

export default function CartDrawer() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { items, inc, dec, remove, clear } = useCart();
  const total = selectTotal(items);

  return (
    <dialog id="cart-drawer" ref={dialogRef} className="w-full max-w-lg rounded-xl p-0">
      {/* Ren vit header – ingen ikon */}
      <form method="dialog" className="sticky top-0 flex items-center justify-between border-b bg-white p-3">
        <h2 className="text-lg font-semibold">Your bag</h2>
        <button className="rounded-md border px-2 py-1 text-sm" aria-label="Close cart">✕</button>
      </form>

      <div className="max-h-[70dvh] overflow-auto bg-white p-3">
        {Object.values(items).length === 0 ? (
          <p className="p-3 text-sm text-neutral-600">Your bag is empty.</p>
        ) : (
          <ul className="space-y-3">
            {Object.values(items).map((it) => (
              <li key={it.id} className="flex gap-3 rounded-lg border bg-white p-2">
                <img src={it.thumbnail} alt={it.title} className="h-16 w-16 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{it.title}</div>
                  <div className="text-xs text-neutral-600">${it.price.toFixed(2)}</div>
                  <div className="mt-1 inline-flex items-center gap-1">
                    <button className="rounded border px-2" onClick={() => dec(it.id)} aria-label={`Decrease ${it.title}`}>−</button>
                    <span className="min-w-6 text-center text-sm">{it.qty}</span>
                    <button className="rounded border px-2" onClick={() => inc(it.id)} aria-label={`Increase ${it.title}`}>+</button>
                    <button className="ml-2 text-xs text-rose-700 underline" onClick={() => remove(it.id)}>Remove</button>
                  </div>
                </div>
                <div className="text-sm font-medium">${(it.qty * it.price).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between border-t bg-white p-3">
        <div className="text-sm">Subtotal: <strong>${total.toFixed(2)}</strong></div>
        <div className="space-x-2">
          <button className="rounded-md border border-rose-300 px-3 py-1 text-sm text-rose-700 hover:bg-rose-50" onClick={clear}>Clear</button>
          <button className="rounded-md bg-gradient-to-r from-rose-500 to-sky-500 px-3 py-1 text-sm font-medium text-white shadow hover:opacity-95">
            Checkout
          </button>
        </div>
      </div>
    </dialog>
  );
}
