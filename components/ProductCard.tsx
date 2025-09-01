"use client";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const inCart = !!useCart((s) => s.items[product.id]);

  return (
    <article className="card overflow-hidden transition-shadow hover:shadow-md">
      <img src={product.thumbnail} alt={product.title}
           className="aspect-[4/3] w-full object-cover" loading="lazy" />
      <div className="grid flex-1 grid-rows-[auto_1fr_auto] gap-2 p-3">
        <header className="min-w-0">
          <h3 className="truncate text-sm font-medium" title={product.title}>{product.title}</h3>
          <p className="mt-0.5 text-xs text-neutral-600">⭐ {product.rating.toFixed(1)}</p>
        </header>
        <div />
        <footer className="flex items-center justify-between">
          <div className="text-base font-semibold text-neutral-900">${product.price.toFixed(2)}</div>
          {inCart ? (
            <button className="btn-outline" onClick={() => remove(product.id)}
                    aria-label={`Remove ${product.title} from cart`}>Remove</button>
          ) : (
            <button className="btn-primary" onClick={() => add(product)}
                    aria-label={`Add ${product.title} to cart`}>Add</button>
          )}
        </footer>
      </div>
    </article>
  );
}
