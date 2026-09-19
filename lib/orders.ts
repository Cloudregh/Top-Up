"use client";
import { useEffect, useState } from "react";
import { api, errInfo, newKey } from "./api";
import type { CatalogueItem, Payment } from "./types";

/** Start Paystack checkout for an existing placed order. Returns the provider URL. */
export async function startPayment(orderId: string, key = newKey()): Promise<Payment> {
  return api<Payment>("/payments", { method: "POST", idempotencyKey: key, body: { customer_order_id: orderId, provider: "paystack" } });
}

const cache = new Map<string, CatalogueItem>();
/** Resolve product names/pack sizes for order lines (orders only carry product ids). */
export function useProducts(ids: string[]) {
  const [, tick] = useState(0);
  const key = ids.join(",");
  useEffect(() => {
    let live = true;
    ids.filter((i) => !cache.has(i)).forEach((i) =>
      api<CatalogueItem>(`/catalogue/${i}`).then((p) => { cache.set(i, p); live && tick((n) => n + 1); }).catch((e) => void errInfo(e)));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (id: string) => cache.get(id);
}
