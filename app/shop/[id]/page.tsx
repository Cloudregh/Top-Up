"use client";
import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Minus, Plus, ShoppingBag } from "lucide-react";
import { ProductArt } from "@/components/ProductArt";
import { AVAIL, ProductCard } from "@/components/ProductCard";
import { ErrorState, Skeleton } from "@/components/States";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/Toast";
import { useCatalogue, useFetch, useRequireAuth } from "@/lib/hooks";
import { ghs } from "@/lib/format";
import type { CatalogueItem } from "@/lib/types";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const authed = useRequireAuth();
  const { status } = useAuth();
  const { data: p, error, loading, retry } = useFetch<CatalogueItem>(authed ? `/catalogue/${id}` : null);
  const { add } = useCart(); const toast = useToast();
  const [qty, setQty] = useState(1);
  const related = useCatalogue("", "", 5);

  if (status === "loading" || (authed && loading)) return <div className="container-x grid gap-6 py-8 md:grid-cols-2"><Skeleton className="h-96" /><Skeleton className="h-96" /></div>;
  if (!authed) return null;
  if (error) return <div className="container-x py-8"><ErrorState title={error.status === 404 ? "Product not found" : "Couldn't load this product"} detail={error.detail || error.title} onRetry={error.status === 404 ? undefined : retry} /></div>;
  if (!p) return null;
  const a = AVAIL[p.availability];
  const out = p.availability === "out_of_stock";

  return (
    <div className="container-x py-8">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"><ArrowLeft size={16} /> Back to shop</Link>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="card grid min-h-96 place-items-center bg-mist p-8"><ProductArt name={p.name} size={260} /></div>
        <div className="card flex flex-col gap-5 p-8">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${a.cls}`}>{a.label}</span>
            {p.requires_prescription && <span className="flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-xs font-semibold text-brand"><FileText size={12} /> Prescription required</span>}
          </div>
          <div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{p.name}</h1><p className="mt-1 text-muted">{p.pack_size}</p></div>
          <p className="text-4xl font-extrabold tracking-tight">{ghs(p.price_pesewa)}<span className="ml-2 text-sm font-medium text-muted">your price</span></p>
          {p.requires_prescription && (
            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">This is a controlled medicine. You can add it to your cart, but checkout needs an <b>approved prescription</b>. <Link href="/prescriptions" className="font-semibold underline">Upload one</Link>.</div>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full bg-mist" role="group" aria-label="Quantity">
              <button className="p-3" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={16} /></button>
              <span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span>
              <button className="p-3" aria-label="Increase" onClick={() => setQty((q) => Math.min(999, q + 1))}><Plus size={16} /></button>
            </div>
            <button className="btn btn-primary flex-1" disabled={out} onClick={() => { add(p, qty); toast(`${qty}× ${p.name} added`); }}><ShoppingBag size={18} /> {out ? "Out of stock" : "Add to cart"}</button>
          </div>
        </div>
      </div>
      {related.items.filter((r) => r.product_id !== p.product_id).length > 0 && (
        <section className="mt-14"><h2 className="mb-5 text-2xl font-bold">You may also need</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{related.items.filter((r) => r.product_id !== p.product_id).slice(0, 4).map((r) => <ProductCard key={r.product_id} item={r} />)}</div>
        </section>)}
    </div>
  );
}
