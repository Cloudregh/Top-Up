"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CatalogueItem } from "@/lib/types";

export interface CartLine {
  product_id: string; name: string; pack_size: string; price_pesewa: number;
  requires_prescription: boolean; quantity: number;
}
export type Fulfilment = { mode: "delivery"; address: string; phone: string } | { mode: "pickup"; branch: string; phone: string };

interface Ctx {
  lines: CartLine[]; count: number; total: number; hydrated: boolean;
  add: (i: CatalogueItem, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  reprice: (items: CatalogueItem[]) => void;
  clear: () => void;
}
const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => { const c = useContext(CartCtx); if (!c) throw new Error("CartProvider missing"); return c; };
const KEY = "topup.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* corrupt */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* quota */ } }, [lines, hydrated]);

  const add = useCallback((i: CatalogueItem, qty = 1) => setLines((ls) => {
    const ex = ls.find((l) => l.product_id === i.product_id);
    if (ex) return ls.map((l) => l === ex ? { ...l, quantity: Math.min(999, l.quantity + qty), price_pesewa: i.price_pesewa } : l);
    return [...ls, { product_id: i.product_id, name: i.name, pack_size: i.pack_size, price_pesewa: i.price_pesewa, requires_prescription: i.requires_prescription, quantity: qty }];
  }), []);
  const setQty = useCallback((id: string, qty: number) =>
    setLines((ls) => ls.map((l) => l.product_id === id ? { ...l, quantity: Math.max(1, Math.min(999, qty)) } : l)), []);
  const remove = useCallback((id: string) => setLines((ls) => ls.filter((l) => l.product_id !== id)), []);
  const reprice = useCallback((items: CatalogueItem[]) => setLines((ls) => ls.map((l) => {
    const f = items.find((i) => i.product_id === l.product_id);
    return f ? { ...l, price_pesewa: f.price_pesewa, requires_prescription: f.requires_prescription } : l;
  })), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => ({
    lines, hydrated, add, setQty, remove, reprice, clear,
    count: lines.reduce((s, l) => s + l.quantity, 0),
    total: lines.reduce((s, l) => s + l.quantity * l.price_pesewa, 0),
  }), [lines, hydrated, add, setQty, remove, reprice, clear]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
