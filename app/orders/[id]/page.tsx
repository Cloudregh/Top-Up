"use client";
import { Suspense, use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Truck, Check, CheckCircle2, CircleDot, Headset, Loader2, MapPin, RefreshCw, XCircle } from "lucide-react";
import { StatusPill } from "@/components/OrderStatus";
import { ErrorState, Skeleton } from "@/components/States";
import { useToast } from "@/components/Toast";
import { Pending } from "@/components/Pending";
import { api, errInfo } from "@/lib/api";
import { useFetch, useRequireAuth } from "@/lib/hooks";
import { fulfilment } from "@/lib/local";
import { startPayment, useProducts } from "@/lib/orders";
import { fmtDate, ghs, shortId } from "@/lib/format";
import type { CustomerOrder, OrderTracking } from "@/lib/types";

const STEPS = [["placed", "Order placed"], ["confirmed", "Confirmed"], ["paid", "Paid"], ["fulfilled", "Packed & dispatched"], ["delivered", "Delivered"]] as const;

function Order({ id }: { id: string }) {
  const authed = useRequireAuth();
  const toast = useToast();
  const returning = useSearchParams().get("pay") === "1";
  const { data: order, error, loading, retry, setData } = useFetch<CustomerOrder>(authed ? `/orders/${id}` : null);
  const { data: tracking, retry: retryTracking } = useFetch<OrderTracking>(authed ? `/orders/${id}/tracking` : null);
  const product = useProducts(order?.lines.map((l) => l.product_id) ?? []);
  const [poll, setPoll] = useState<"idle" | "checking" | "gave-up">(returning ? "checking" : "idle");
  const [busy, setBusy] = useState("");
  const tries = useRef(0);

  const refresh = useCallback(async () => {
    const o = await api<CustomerOrder>(`/orders/${id}`); setData(o); retryTracking(); return o;
  }, [id, setData, retryTracking]);

  // After returning from Paystack the webhook may lag: poll to a definite outcome.
  useEffect(() => {
    if (poll !== "checking" || !authed) return;
    const t = setInterval(async () => {
      tries.current++;
      try { const o = await refresh(); if (o.payment_status !== "unpaid" || o.status === "cancelled") { setPoll("idle"); clearInterval(t); return; } } catch { /* keep trying */ }
      if (tries.current >= 12) { setPoll("gave-up"); clearInterval(t); }
    }, 5000);
    return () => clearInterval(t);
  }, [poll, authed, refresh]);

  async function act(kind: "cancel" | "pay") {
    setBusy(kind);
    try {
      if (kind === "cancel") { setData(await api<CustomerOrder>(`/orders/${id}/cancel`, { method: "POST" })); retryTracking(); toast("Order cancelled"); }
      else { const p = await startPayment(id); if (p.redirect_url) window.location.href = p.redirect_url; else setPoll("checking"); }
    } catch (e) { const i = errInfo(e); toast(i.detail || i.title, "err"); } finally { setBusy(""); }
  }

  if (!authed || loading) return <div className="container-x space-y-4 py-8"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;
  if (error) return <div className="container-x py-8"><ErrorState title={error.status === 404 ? "Order not found" : "Couldn't load this order"} detail={error.detail || error.title} onRetry={error.status === 404 ? undefined : retry} /></div>;
  if (!order) return null;

  const ful = fulfilment.get(id);
  const seen = new Set(tracking?.history.map((h) => h.status));
  const atOf = (s: string) => tracking?.history.find((h) => h.status === s)?.at;
  const cancelled = order.status === "cancelled";
  const reached = (s: string) => seen.has(s) || (s === "placed") || STEPS.findIndex(([k]) => k === s) <= STEPS.findIndex(([k]) => k === order.status);
  const unpaid = order.payment_status === "unpaid" && !cancelled;

  return (
    <div className="container-x py-8">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"><ArrowLeft size={16} /> All orders</Link>

      {order.payment_status === "paid" && returning && (
        <div role="status" className="card mt-4 flex items-center gap-4 !bg-emerald-50 p-6"><CheckCircle2 className="shrink-0 text-emerald-600" size={36} /><div><h2 className="text-xl font-bold">Thank you — payment received</h2><p className="text-sm text-emerald-900/80">Order #{shortId(order.id)} is confirmed. We&apos;ll start preparing it right away.</p></div></div>
      )}
      {unpaid && poll === "checking" && (
        <div role="status" className="card mt-4 flex items-center gap-4 !bg-sky-50 p-6"><Loader2 className="shrink-0 animate-spin text-sky-600" size={32} /><div><h2 className="font-bold">Confirming your payment…</h2><p className="text-sm text-sky-900/80">This usually takes a few seconds. Please don&apos;t pay again.</p></div></div>
      )}
      {unpaid && poll === "gave-up" && (
        <div role="alert" className="card mt-4 space-y-3 !bg-amber-50 p-6"><h2 className="flex items-center gap-2 font-bold"><AlertCircle size={20} /> We haven&apos;t received confirmation yet</h2>
          <p className="text-sm text-amber-900/80">If you were charged, don&apos;t worry — it&apos;s reconciled automatically and this order will update to Paid. If you weren&apos;t charged, you can pay again below. Need certainty now? Tap <b>Need help?</b> and quote #{shortId(order.id)}.</p>
          <button className="btn btn-primary" onClick={() => { tries.current = 0; setPoll("checking"); }}><RefreshCw size={16} /> Check again</button></div>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Order #{shortId(order.id)}</h1><p className="text-sm text-muted">Placed {fmtDate(order.created_at, true)}</p></div><StatusPill order={order} /></div>
            <ul className="mt-5 divide-y divide-mist">{order.lines.map((l) => (
              <li key={l.product_id} className="flex justify-between gap-3 py-3 text-sm"><span>{l.quantity}× <b>{product(l.product_id)?.name ?? "Product"}</b> <span className="text-muted">{product(l.product_id)?.pack_size}</span></span><span>{ghs(l.unit_price_pesewa * l.quantity)}</span></li>))}</ul>
            <div className="flex justify-between border-t border-mist pt-4 text-lg font-bold"><span>Total</span><span>{ghs(order.total_pesewa)}</span></div>
          </section>

          <section className="card p-6">
            <h2 className="mb-5 text-lg font-bold">Tracking</h2>
            {cancelled ? <p className="flex items-center gap-2 text-rose-700"><XCircle size={20} /> This order was cancelled{atOf("cancelled") ? ` on ${fmtDate(atOf("cancelled")!, true)}` : ""}.</p> : (
              <ol className="space-y-0">{STEPS.map(([k, label], i) => {
                const done = reached(k); const current = order.status === k;
                return (
                  <li key={k} className="relative flex gap-4 pb-7 last:pb-0">
                    {i < STEPS.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${reached(STEPS[i + 1][0]) ? "bg-brand" : "bg-mist"}`} />}
                    <span className={`z-10 grid size-8 shrink-0 place-items-center rounded-full ${done ? "bg-brand text-white" : "bg-mist text-muted"}`}>{done ? (current ? <CircleDot size={16} /> : <Check size={16} />) : <span className="size-2 rounded-full bg-muted/50" />}</span>
                    <div><p className={`font-semibold ${done ? "" : "text-muted"}`}>{label}</p>{atOf(k) && <p className="text-xs text-muted">{fmtDate(atOf(k)!, true)}</p>}</div>
                  </li>);
              })}</ol>)}
            {order.fulfilment_status === "failed" && <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Your payment is safe — we&apos;re resolving a stock issue and will fulfil this order shortly.</p>}
          </section>
        </div>

        <aside className="space-y-4">
          {ful && <Pending waitingFor="GET /orders/{id} → delivery address / pickup"><section className="card p-6"><h2 className="mb-2 flex items-center gap-2 font-bold"><MapPin size={16} /> {ful.mode === "delivery" ? "Delivery to" : "Pickup at"}</h2><p className="text-sm">{ful.where}</p><p className="text-sm text-muted">{ful.phone}</p></section></Pending>}
          {!cancelled && (
            <Pending waitingFor="GET /orders/{id}/tracking → delivery status, ETA, rider (WP16)">
              <section className="card p-6"><h2 className="mb-2 flex items-center gap-2 font-bold"><Truck size={16} /> Delivery</h2>
                <p className="text-sm text-muted">Estimated delivery and live tracking will appear here once your order is dispatched.</p></section>
            </Pending>)}
          <section className="card space-y-3 p-6">
            {unpaid && <button className="btn btn-primary w-full" disabled={!!busy} onClick={() => act("pay")}>{busy === "pay" && <Loader2 size={16} className="animate-spin" />} Pay {ghs(order.total_pesewa)}</button>}
            {unpaid && poll === "idle" && <button className="btn btn-soft w-full" onClick={() => { tries.current = 0; setPoll("checking"); }}><RefreshCw size={16} /> I&apos;ve paid — check status</button>}
            {order.status === "placed" && order.payment_status === "unpaid" && <button className="btn btn-soft w-full !text-rose-600" disabled={!!busy} onClick={() => act("cancel")}>{busy === "cancel" && <Loader2 size={16} className="animate-spin" />} Cancel order</button>}
            {order.payment_status !== "unpaid" && !cancelled && <p className="flex gap-2 text-sm text-muted"><Headset size={16} className="mt-0.5 shrink-0" /> Paid orders can&apos;t be cancelled online. Tap <b>Need help?</b> and our team will sort a cancellation or refund.</p>}
            {order.payment_status === "refunded" && <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800">This order has been refunded.</p>}
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Suspense><Order id={id} /></Suspense>;
}
