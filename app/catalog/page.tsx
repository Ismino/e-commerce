"use client";

import { Suspense } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import FiltersBar from "@/components/FiltersBar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import type { ProductsResponse } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/url";

export default function CatalogPage() {
  return (
    <div className="space-y-3">
      {/* Filters (läser search params) */}
      <Suspense fallback={<FiltersSkeleton />}>
        <FiltersBar />
      </Suspense>

      {/* Produkter (läser search params) */}
      <Suspense fallback={<GridSkeleton />}>
        <ProductsSection />
      </Suspense>
    </div>
  );
}

function ProductsSection() {
  const params = useSearchParams();
  const pageSize = Number(params.get("pageSize") || DEFAULT_PAGE_SIZE);
  const qs = params.toString();

  const { data, isFetching, error } = useQuery<ProductsResponse>({
    queryKey: ["products", qs],
    queryFn: async () => {
      const res = await fetch(`/api/products?${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return (await res.json()) as ProductsResponse;
    },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const page = data?.page ?? 1;
  const total = data?.total ?? 0;

  return (
    <>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          Something went wrong loading products. Try again.
        </div>
      )}

      <div aria-busy={isFetching ? "true" : "false"} aria-live="polite">
        {isFetching && !data ? (
          <GridSkeleton count={pageSize} />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Pagination totalPages={totalPages} />
            <p className="text-center text-xs text-neutral-600">
              Page {page} of {totalPages} • {total} results
            </p>
          </>
        ) : (
          <p className="rounded-lg border bg-white p-6 text-center text-sm text-neutral-600">
            No products match your query.
          </p>
        )}
      </div>
    </>
  );
}

/* Fallback-skelett som inte läser search params */
function FiltersSkeleton() {
  return (
    <section className="mb-4 rounded-2xl bg-gradient-to-br from-rose-200/60 to-sky-200/60 p-[1px] shadow-sm">
      <div className="grid grid-cols-1 gap-2 rounded-2xl border border-white/70 bg-white/90 p-3 backdrop-blur md:grid-cols-4">
        <div className="md:col-span-2 h-10 animate-pulse rounded-md bg-neutral-200" />
        <div className="h-10 animate-pulse rounded-md bg-neutral-200" />
        <div className="h-10 animate-pulse rounded-md bg-neutral-200" />
        <div className="md:col-span-2 grid grid-cols-3 gap-2">
          <div className="h-10 animate-pulse rounded-md bg-neutral-200" />
          <div className="h-10 animate-pulse rounded-md bg-neutral-200" />
          <div className="h-10 animate-pulse rounded-md bg-neutral-200" />
        </div>
      </div>
    </section>
  );
}

function GridSkeleton({ count = DEFAULT_PAGE_SIZE }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-52 animate-pulse rounded-xl border bg-white" />
      ))}
    </div>
  );
}
