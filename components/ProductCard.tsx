"use client";
import Link from "next/link";
import { Check, FileText, Plus } from "lucide-react";
import { useState } from "react";
import type { CatalogueItem } from "@/lib/types";
import { ghs } from "@/lib/format";
import { ProductArt } from "./ProductArt";
import { useCart } from "./CartProvider";
import { useToast } from "./Toast";

export const AVAIL = {
  in_stock: { label: "In stock", cls: "bg-emerald-50 text-emerald-700" },
  low: { label: "Low stock", cls: "bg-amber-50 text-amber-700" },
  out_of_stock: { label: "Out of stock", cls: "bg-rose-50 text-rose-700" },
} as const;

export function ProductCard({ item, preview = false }: { item: CatalogueItem; preview?: boolean }) {
  const { add } = useCart();
  const toast = useToast();
  const [done, setDone] = useState(false);
  const a = AVAIL[item.availability];

  return (
    <div className="card group flex flex-col p-4 transition hover:-translate-y-1">
      <Link href={preview ? "/login" : `/shop/${item.product_id}`} className="block">
        <div className="relative grid h-44 place-items-center rounded-[22px] bg-mist">
          <div className="transition duration-500 group-hover:scale-110 group-hover:-rotate-3"><ProductArt name={item.name} /></div>
          {!preview && <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${a.cls}`}>{a.label}</span>}
          {item.requires_prescription && <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand"><FileText size={12} /> Rx</span>}
        </div>
        <h3 className="mt-4 line-clamp-2 font-semibold leading-snug">{item.name}</h3>
        <p className="text-sm text-muted">{item.pack_size}</p>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        {preview ? (
          <><span className="text-xs text-muted">Sign in for your price</span><Link href="/login" className="btn btn-soft !px-4 !py-2">Sign in</Link></>
        ) : (
          <>
            <span className="text-lg font-bold">{ghs(item.price_pesewa)}</span>
            <button className="btn btn-soft !px-4 !py-2" disabled={item.availability === "out_of_stock"} aria-label={`Add ${item.name} to cart`}
              onClick={() => { add(item); setDone(true); toast(`${item.name} added`); setTimeout(() => setDone(false), 1200); }}>
              {done ? <Check size={16} /> : <Plus size={16} />} {done ? "Added" : "Add"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
