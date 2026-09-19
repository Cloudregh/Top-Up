"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, errInfo } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import { ProductCard } from "./ProductCard";
import { PlaceholderProducts } from "./PlaceholderProducts";
import { ErrorState, Skeleton } from "./States";
import type { CatalogueItem, Page } from "@/lib/types";

/** Medicines for a topic — live from GET /catalogue?q=<term> for each search term, de-duplicated. */
export function CampaignProducts({ terms }: { terms: string[] }) {
  const { status } = useAuth();
  const [items, setItems] = useState<CatalogueItem[] | null>(null);
  const [err, setErr] = useState<ReturnType<typeof errInfo> | null>(null);
  const [n, setN] = useState(0);
  const key = terms.join("|");

  useEffect(() => {
    if (status !== "authed") return;
    let live = true; setItems(null); setErr(null);
    Promise.all(terms.map((t) => api<Page<CatalogueItem>>(`/catalogue?q=${encodeURIComponent(t)}&limit=6`)))
      .then((pages) => {
        if (!live) return;
        const seen = new Map<string, CatalogueItem>();
        pages.flatMap((p) => p.data).forEach((i) => seen.set(i.product_id, i));
        setItems([...seen.values()].slice(0, 8));
      })
      .catch((e) => live && setErr(errInfo(e)));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, key, n]);

  if (status === "loading") return <Skeleton className="h-72" />;
  if (status === "guest") return <PlaceholderProducts n={4} />;
  if (err) return <ErrorState title="Couldn't load medicines" detail={err.detail || err.title} onRetry={() => setN((x) => x + 1)} />;
  if (!items) return <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-80" />)}</div>;
  if (!items.length) return <p className="tile p-8 text-center text-sm text-muted">We couldn&apos;t find matching products right now. <Link href="/shop" className="font-semibold text-brand underline">Browse the full catalogue</Link> or use the Need help? button and a pharmacist will guide you.</p>;
  return <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.product_id} item={p} />)}</div>;
}
