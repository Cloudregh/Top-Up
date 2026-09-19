"use client";
import Link from "next/link";
import { Check, FileText, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { CatalogueItem } from "@/lib/types";
import { ghs } from "@/lib/format";
import { productImageKey } from "@/lib/images";
import { Img } from "./Img";
import { ProductArt } from "./ProductArt";
import { useCart } from "./CartProvider";
import { useToast } from "./Toast";

export const AVAIL = {
  in_stock: { label: "In stock", cls: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  low: { label: "Low stock", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  out_of_stock: { label: "Out of stock", cls: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
} as const;

export function ProductPhoto({ name, className = "", w = 500 }: { name: string; className?: string; w?: number }) {
  const key = productImageKey(name);
  return key
    ? <Img k={key} w={w} h={w} alt={name} className={`size-full object-cover ${className}`} />
    : <div className="grid size-full place-items-center bg-[#eceffa]"><ProductArt name={name} size={Math.min(w / 3, 150)} /></div>;
}

export function ProductCard({ item, preview = false }: { item: CatalogueItem; preview?: boolean }) {
  const { add } = useCart();
  const toast = useToast();
  const [done, setDone] = useState(false);
  const a = AVAIL[item.availability];

  return (
    <div className="tile group flex h-full flex-col p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(47,63,184,.45)]">
      <Link href={preview ? "/login" : `/shop/${item.product_id}`} className="block">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0"><h3 className="line-clamp-1 text-sm font-semibold">{item.name}</h3><p className="text-xs text-muted">{item.pack_size}</p></div>
          {item.requires_prescription && <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-brand"><FileText size={11} /> Rx</span>}
        </div>
        <div className="relative mt-3 aspect-square overflow-hidden rounded-[20px] bg-white">
          <div className="size-full transition duration-700 group-hover:scale-110"><ProductPhoto name={item.name} /></div>
          {!preview && <span className={`absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${a.cls}`}><i className={`size-1.5 rounded-full ${a.dot}`} />{a.label}</span>}
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        {preview ? (
          <><span className="text-xs text-muted">Sign in for price</span><Link href="/login" className="btn btn-white !px-4 !py-2 text-xs">Sign in</Link></>
        ) : (
          <>
            <span className="text-lg font-bold tracking-tight">{ghs(item.price_pesewa)}</span>
            <button className="btn btn-white !px-4 !py-2 text-xs" disabled={item.availability === "out_of_stock"} aria-label={`Add ${item.name} to cart`}
              onClick={() => { add(item); setDone(true); toast(`${item.name} added`); setTimeout(() => setDone(false), 1200); }}>
              {done ? <Check size={14} /> : <ShoppingBag size={14} />} {done ? "Added" : "Shop Now"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
