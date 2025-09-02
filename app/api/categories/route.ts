import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RawCat = string | { slug?: string; name?: string; url?: string };

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET() {
  try {
    const r = await fetch("https://dummyjson.com/products/categories", {
      cache: "no-store",
    });
    if (!r.ok) return NextResponse.json([], { status: 200 });

    const raw = (await r.json()) as RawCat[];

    const cats = (Array.isArray(raw) ? raw : [])
      .map((c) => {
        const slug = typeof c === "string" ? c : (c.slug ?? "");
        if (!slug) return null;
        const name = typeof c === "string" ? humanize(c) : (c.name ?? humanize(slug));
        return { slug, name };
      })
      .filter(Boolean) as { slug: string; name: string }[];

    cats.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(cats);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
