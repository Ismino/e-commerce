"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const params = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(params.get("page") || 1));
  const go = (p: number) => {
    const q = new URLSearchParams(params);
    q.set("page", String(p));
    router.push(`/catalog?${q.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (totalPages <= 1) return null;

  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const btn = "btn-outline px-2 py-1";
  const active = "bg-indigo-600 text-white border-indigo-600";

  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-center gap-2">
      <button className={`${btn} disabled:opacity-50`} onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Previous page">Prev</button>
      {pages.map((p) => (
        <button key={p} onClick={() => go(p)} aria-current={p === page ? "page" : undefined}
                className={`${btn} ${p === page ? active : ""}`}>
          {p}
        </button>
      ))}
      <button className={`${btn} disabled:opacity-50`} onClick={() => go(page + 1)} disabled={page >= totalPages} aria-label="Next page">Next</button>
    </nav>
  );
}
