"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams} from "next/navigation";

import FiltersBar from "@/components/FiltersBar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

import type { ProductResponse } from "/lib/types";
import { DEFAULT_PAGE_SIZE } from "@lib/url";

export default function CatalogPage() {
    const params = useSearchParams();
    const pageSize = Number(params.get("pageSize") || DEFAULT_PAGE_SIZE);
    const qs = params
}