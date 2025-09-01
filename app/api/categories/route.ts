import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://dummyjson.com/products/categories", { cache: "force-cache" });
  const cats = (await res.json()) as string[];
  cats.sort((a, b) => a.localeCompare(b));
  return NextResponse.json(cats);
}
