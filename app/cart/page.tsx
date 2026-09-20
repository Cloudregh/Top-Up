"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, FileText, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { AVAIL } from "@/components/ProductCard";
import { Empty, Skeleton } from "@/components/States";
import { FulfilmentPicker } from "@/components/FulfilmentPicker";
import { api } from "@/lib/api";
import { ghs } from "@/lib/format";
import { useState } from "react";
import type { CatalogueItem } from "@/lib/types";

export default function CartPage() {
  const { lines, total, count, hydrated, setQty, remove, reprice } = useCart();
  const { status } = useAuth();
  const router = useRouter();
  const [avail, setAvail] = useState<Record<string, CatalogueItem["availability"]>>({});
  const ids = lines.map((l) => l.product_id).join(",");

  // Re-check live stock and tier price whenever the cart is viewed.
  useEffect(() => {
    if (status !== "authed" || !ids) return;
    let live = true;
    Promise.allSettled(ids.split(",").map((id) => api<CatalogueItem>(`/catalogue/${id}`))).then((rs) => {
      if (!live) return;
      const items = rs.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
      setAvail(Object.fromEntries(items.map((i) => [i.product_id, i.availability])));
      reprice(items);
    });
    return () => { live = false; };
  }, [status, ids, reprice]);

  if (!hydrated) return <div className="container-x py-8"><Skeleton className="h-64" /></div>;
  if (!lines.length) return <div className="container-x py-12"><Empty title="Your cart is empty" hint="Browse the shop and add what you need." action={<Link href="/shop" className="btn btn-primary">Start shopping</Link>} /></div>;

  const blocked = lines.some((l) => avail[l.product_id] === "out_of_stock");
  const needsRx = lines.some((l) => l.requires_prescription);

  return (
    <div className="container-x py-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Your cart <span className="text-muted">({count})</span></h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
        <ul className="space-y-3">
          {lines.map((l) => {
            const a = avail[l.product_id];
            return (
              <li key={l.product_id} className="card flex gap-4 p-4">
                <div className="size-24 shrink-0 overflow-hidden rounded-2xl bg-mist"><ProductImage name={l.name} /></div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0"><Link href={`/shop/${l.product_id}`} className="line-clamp-2 font-semibold hover:text-brand">{l.name}</Link><p className="text-sm text-muted">{l.pack_size}</p></div>
                    <button onClick={() => remove(l.product_id)} aria-label={`Remove ${l.name}`} className="h-fit rounded-full p-2 text-muted hover:bg-rose-50 hover:text-rose-600"><Trash2 size={18} /></button>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-semibold">
                    {a && a !== "in_stock" && <span className={`rounded-full px-2 py-0.5 ${AVAIL[a].cls}`}>{AVAIL[a].label}</span>}
                    {l.requires_prescription && <span className="flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-brand"><FileText size={11} /> Rx</span>}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full bg-mist" role="group" aria-label={`Quantity of ${l.name}`}>
                      <button className="p-2.5" aria-label="Decrease" onClick={() => setQty(l.product_id, l.quantity - 1)}><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-semibold">{l.quantity}</span>
                      <button className="p-2.5" aria-label="Increase" onClick={() => setQty(l.product_id, l.quantity + 1)}><Plus size={14} /></button>
                    </div>
                    <span className="font-bold">{ghs(l.price_pesewa * l.quantity)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <FulfilmentPicker />
        </div>
        <aside className="card h-fit space-y-4 p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold">Summary</h2>
          <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>{ghs(total)}</span></div>
          <div className="flex justify-between border-t border-mist pt-4 text-lg font-bold"><span>Total</span><span>{ghs(total)}</span></div>
          {blocked && <p className="flex gap-2 rounded-2xl bg-rose-50 p-3 text-xs text-rose-800"><AlertTriangle size={16} className="shrink-0" /> Remove out-of-stock items to continue.</p>}
          {needsRx && <p className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-900">Your cart has prescription items — you&apos;ll pick an approved prescription at checkout.</p>}
          <button className="btn btn-primary w-full" disabled={blocked}
            onClick={() => router.push(status === "authed" ? "/checkout" : "/login?next=/checkout")}><ShoppingBag size={18} /> Checkout <ArrowRight size={16} /></button>
          <p className="text-center text-xs text-muted">Final price is confirmed when your order is placed.</p>
        </aside>
      </div>
    </div>
  );
}
