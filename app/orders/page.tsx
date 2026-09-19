"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, RotateCcw } from "lucide-react";
import { Empty, ErrorState, Skeleton } from "@/components/States";
import { StatusPill } from "@/components/OrderStatus";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/Toast";
import { api, errInfo } from "@/lib/api";
import { useFetch, useRequireAuth } from "@/lib/hooks";
import { fmtDate, ghs, shortId } from "@/lib/format";
import type { CatalogueItem, CustomerOrder, Page } from "@/lib/types";

export default function OrdersPage() {
  const authed = useRequireAuth();
  const { data, error, loading, retry } = useFetch<Page<CustomerOrder>>(authed ? "/orders?limit=20" : null);
  const [extra, setExtra] = useState<CustomerOrder[]>([]);
  const [cursor, setCursor] = useState<string | null | undefined>(undefined);
  const [more, setMore] = useState(false);
  const { add } = useCart(); const toast = useToast();
  const next = cursor === undefined ? data?.next_cursor : cursor;
  const orders = [...(data?.data ?? []), ...extra];

  async function loadMore() {
    if (!next) return; setMore(true);
    try { const p = await api<Page<CustomerOrder>>(`/orders?limit=20&cursor=${encodeURIComponent(next)}`); setExtra((x) => [...x, ...p.data]); setCursor(p.next_cursor); }
    catch (e) { toast(errInfo(e).title, "err"); } finally { setMore(false); }
  }
  async function reorder(o: CustomerOrder) {
    const rs = await Promise.allSettled(o.lines.map((l) => api<CatalogueItem>(`/catalogue/${l.product_id}`).then((p) => ({ p, q: l.quantity }))));
    const ok = rs.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
    ok.forEach(({ p, q }) => add(p, q));
    toast(ok.length === o.lines.length ? "Items added to your cart" : `${ok.length} of ${o.lines.length} items added — some are unavailable`, ok.length ? "ok" : "err");
  }

  return (
    <div className="container-x py-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">My orders</h1>
      <div className="mt-6 space-y-3">
        {!authed || loading ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-28" />)
          : error ? <ErrorState title="Couldn't load your orders" detail={error.detail || error.title} onRetry={retry} />
          : !orders.length ? <Empty title="No orders yet" hint="When you place an order it will show up here." action={<Link href="/shop" className="btn btn-primary">Start shopping</Link>} />
          : <>
            {orders.map((o) => (
              <div key={o.id} className="card flex flex-wrap items-center gap-4 p-5">
                <Link href={`/orders/${o.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="min-w-0 flex-1"><p className="font-bold">Order #{shortId(o.id)}</p><p className="text-sm text-muted">{fmtDate(o.created_at)} · {o.lines.reduce((s, l) => s + l.quantity, 0)} items</p></div>
                  <StatusPill order={o} /><span className="w-24 text-right font-bold">{ghs(o.total_pesewa)}</span><ChevronRight size={18} className="text-muted" />
                </Link>
                <button className="btn btn-soft !py-2" onClick={() => reorder(o)}><RotateCcw size={14} /> Reorder</button>
              </div>
            ))}
            {next && <div className="pt-4 text-center"><button className="btn btn-white shadow" onClick={loadMore} disabled={more}>{more && <Loader2 size={16} className="animate-spin" />} Load more</button></div>}
          </>}
      </div>
    </div>
  );
}
