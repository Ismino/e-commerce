import { NextRequest, NextResponse } from "next/server";
import type { Product, ProductsResponse } from "@/lib/types";

const BASE = "https://dummyjson.com";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const q = sp.get("q") ?? undefined;
  const category = sp.get("category") ?? undefined;

  const sort = (sp.get("sort") ?? "newest") as "price-asc" | "price-desc" | "rating-desc" | "newest";
  const priceMin = sp.get("priceMin");
  const priceMax = sp.get("priceMax");
  const ratingMin = sp.get("ratingMin");

  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const pageSize = Math.max(1, Math.min(60, Number(sp.get("pageSize") ?? "12")));
  const skip = (page - 1) * pageSize;

  // Behöver vi lokalt filter/sort som DummyJSON inte stödjer?
  const needsLocal = !!priceMin || !!priceMax || !!ratingMin || sort !== "newest";

  // 1) Paginera hos DummyJSON (limit+skip) när det går
  if (!needsLocal) {
    let endpoint = `${BASE}/products?limit=${pageSize}&skip=${skip}`;
    if (q) endpoint = `${BASE}/products/search?q=${encodeURIComponent(q)}&limit=${pageSize}&skip=${skip}`;
    if (!q && category) endpoint = `${BASE}/products/category/${encodeURIComponent(category)}?limit=${pageSize}&skip=${skip}`;

    const r = await fetch(endpoint, { cache: "no-store" });
    if (!r.ok) return NextResponse.json({ message: "Upstream error" }, { status: 500 });

    const json = (await r.json()) as { products: Product[]; total: number };
    const totalPages = Math.max(1, Math.ceil(json.total / pageSize));
    const payload: ProductsResponse = {
      products: json.products,
      total: json.total,
      page,
      pageSize,
      totalPages,
    };
    return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
  }

  // 2) Annars: hämta större set och gör filter/sort/paginering lokalt
  const BIG_LIMIT = 1000;
  let endpoint = `${BASE}/products?limit=${BIG_LIMIT}`;
  if (q) endpoint = `${BASE}/products/search?q=${encodeURIComponent(q)}&limit=${BIG_LIMIT}`;
  if (!q && category) endpoint = `${BASE}/products/category/${encodeURIComponent(category)}?limit=${BIG_LIMIT}`;

  const raw = await fetch(endpoint, { cache: "no-store" });
  if (!raw.ok) return NextResponse.json({ message: "Upstream error" }, { status: 500 });
  const data = (await raw.json()) as { products: Product[] };

  let list = data.products;

  const pMin = Number(priceMin ?? "0");
  const pMax = Number(priceMax ?? Number.POSITIVE_INFINITY);
  const rMin = Number(ratingMin ?? "0");
  list = list.filter((p) => p.price >= pMin && p.price <= pMax && p.rating >= rMin);

  list = list.sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "rating-desc": return b.rating - a.rating;
      default: return b.id - a.id; // "newest" proxy
    }
  });

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const products = list.slice(skip, skip + pageSize);

  const payload: ProductsResponse = { products, total, page, pageSize, totalPages };
  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
