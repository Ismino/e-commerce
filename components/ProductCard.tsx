"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const inCart = !!useCart((s) => s.items[product.id]);

  return (
    <article className="rounded-2xl bg-gradient-to-br from-rose-200/60 to-sky-200/60 p-[1px] shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-full flex-col rounded-2xl border border-white/70 bg-white/95 backdrop-blur">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={800}
          height={600}
          className="aspect-[4/3] w-full rounded-t-2xl object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
          priority={false}
        />
        <div className="grid flex-1 grid-rows-[auto_1fr_auto] gap-2 p-3">
          <header className="min-w-0">
            <h3 className="truncate text-sm font-medium" title={product.title}>
              {product.title}
            </h3>
            <p className="mt-0.5 text-xs text-sky-700/90">{product.rating.toFixed(1)}</p>
          </header>
          <div />
          <footer className="flex items-center justify-between">
            <div className="text-base font-semibold text-sky-700">${product.price.toFixed(2)}</div>
            {inCart ? (
              <button
                className="rounded-md border border-rose-300 px-3 py-1 text-sm text-rose-700 hover:bg-rose-50"
                onClick={() => remove(product.id)}
                aria-label={`Remove ${product.title} from cart`}
              >
                Remove
              </button>
            ) : (
              <button
                className="rounded-md bg-gradient-to-r from-rose-500 to-sky-500 px-3 py-1 text-sm font-medium text-white shadow hover:opacity-95"
                onClick={() => add(product)}
                aria-label={`Add ${product.title} to cart`}
              >
                Add
              </button>
            )}
          </footer>
        </div>
      </div>
    </article>
  );
}
