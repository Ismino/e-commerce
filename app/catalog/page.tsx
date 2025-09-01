"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import FiltersBar from "@/components/FiltersBar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

import type { ProductsResponse } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/url";

export default function CatalogPage() {
  const params = useSearchParams();
  const pageSize = Number(params.get("pageSize") || DEFAULT_PAGE_SIZE);
  const qs = params.toString();

  const { data, isFetching, error } = useQuery<ProductsResponse>({
    queryKey: ["products", qs],
    queryFn: async () => {
      const res = await fetch(`/api/products?${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    keepPreviousData: true,
  });

  return (
    <div className="space-y-3">
      <FiltersBar />

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          Something went wrong loading products. Try again.
        </div>
      )}

      <div aria-busy={isFetching ? "true" : "false"} aria-live="polite">
        {isFetching && !data ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-xl border bg-white" />
            ))}
          </div>
        ) : data && data.products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {data.products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <Pagination totalPages={data.totalPages} />
            <p className="text-center text-xs text-neutral-600">
              Page {data.page} of {data.totalPages} • {data.total} results
            </p>
          </>
        ) : (
          <p className="rounded-lg border bg-white p-6 text-center text-sm text-neutral-600">
            No products match your query.
          </p>
        )}
      </div>
    </div>
  );
}
