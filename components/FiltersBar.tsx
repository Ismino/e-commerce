"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SortKey } from "@/lib/url";
import type { Category } from "@/lib/types";

const inputCls =
  "w-full rounded-md border border-rose-200/60 bg-white/95 px-3 py-2 backdrop-blur focus:outline-none focus:ring-2 focus:ring-rose-400";

export default function FiltersBar() {
  const params = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(params.get("q") ?? "");
  useEffect(() => {
    const id = setTimeout(() => update({ q: search || undefined, page: 1 }), 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const update = (patch: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) =>
      v === undefined || v === "" ? q.delete(k) : q.set(k, String(v)),
    );
    router.push(`/catalog?${q.toString()}`);
  };

  const sort = (params.get("sort") as SortKey) ?? "newest";
  const category = params.get("category") ?? "";
  const priceMin = params.get("priceMin") ?? "";
  const priceMax = params.get("priceMax") ?? "";
  const ratingMin = params.get("ratingMin") ?? "";

  const { data: categories, isPending } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const r = await fetch("/api/categories", { cache: "no-store" });
      // kasta på icke-OK för att React Query ska kunna visa retry vid nätfel
      if (!r.ok) throw new Error("Failed to fetch categories");
      return (await r.json()) as Category[];
    },
    retry: 1,
  });

  const resetFilters = () =>
    update({
      category: undefined,
      priceMin: undefined,
      priceMax: undefined,
      ratingMin: undefined,
      page: 1,
    });

  const sortOptions: { label: string; value: SortKey }[] = useMemo(
    () => [
      { label: "Newest", value: "newest" },
      { label: "Price: Low → High", value: "price-asc" },
      { label: "Price: High → Low", value: "price-desc" },
      { label: "Rating: High → Low", value: "rating-desc" },
    ],
    [],
  );

  return (
    <section className="mb-4 rounded-2xl bg-gradient-to-br from-rose-200/60 to-sky-200/60 p-[1px] shadow-sm">
      <div className="grid grid-cols-1 gap-2 rounded-2xl border border-white/70 bg-white/90 p-3 backdrop-blur md:grid-cols-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-rose-700" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className={inputCls}
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-xs font-medium text-rose-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className={inputCls}
            value={category}
            onChange={(e) => update({ category: e.target.value || undefined, page: 1 })}
          >
            <option value="">All</option>
            {isPending && <option disabled>Loading…</option>}
            {categories?.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="mb-1 block text-xs font-medium text-rose-700" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            className={inputCls}
            value={sort}
            onChange={(e) => update({ sort: e.target.value, page: 1 })}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price & rating */}
        <div className="grid grid-cols-3 gap-2 md:col-span-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-rose-700" htmlFor="min">
              Min price
            </label>
            <input
              id="min"
              inputMode="numeric"
              pattern="[0-9]*"
              className={inputCls}
              value={priceMin}
              onChange={(e) => update({ priceMin: e.target.value || undefined, page: 1 })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-rose-700" htmlFor="max">
              Max price
            </label>
            <input
              id="max"
              inputMode="numeric"
              pattern="[0-9]*"
              className={inputCls}
              value={priceMax}
              onChange={(e) => update({ priceMax: e.target.value || undefined, page: 1 })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-rose-700" htmlFor="rating">
              Min rating
            </label>
            <input
              id="rating"
              inputMode="decimal"
              placeholder="0–5"
              className={inputCls}
              value={ratingMin}
              onChange={(e) => update({ ratingMin: e.target.value || undefined, page: 1 })}
            />
          </div>
        </div>

        <div className="flex items-end justify-end md:col-span-2">
          <button
            className="rounded-md border border-rose-300 bg-white px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
            onClick={resetFilters}
            aria-label="Reset filters"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
