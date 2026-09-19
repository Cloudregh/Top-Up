"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CreditCard, FileText, Loader2, Lock, MapPin, ShieldAlert, Truck } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { Empty } from "@/components/States";
import { api, errInfo, newKey } from "@/lib/api";
import { BRANCHES, fulfilment, prescriptionIds } from "@/lib/local";
import { startPayment } from "@/lib/orders";
import { useRequireAuth } from "@/lib/hooks";
import { ghs, shortId } from "@/lib/format";
import type { CustomerOrder, Prescription } from "@/lib/types";

const ERR_HELP: Record<string, string> = {
  "prescription-required": "A prescription is required for a controlled item in your cart.",
  "prescription-not-approved": "That prescription hasn't been approved yet. Only approved prescriptions can be used.",
  "prescription-already-used": "That prescription has already been used on another order. Upload a new one.",
  "insufficient-stock": "One of your items no longer has enough stock. Adjust your cart and try again.",
  "no-price": "One of your items has no price for your account. Please contact support.",
};

export default function CheckoutPage() {
  const authed = useRequireAuth();
  const router = useRouter();
  const { lines, total, hydrated, clear } = useCart();
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState(""); const [branch, setBranch] = useState(BRANCHES[0]); const [phone, setPhone] = useState("");
  const [rx, setRx] = useState(""); const [approved, setApproved] = useState<Prescription[]>([]);
  const [busy, setBusy] = useState<"" | "order" | "pay">("");
  const [err, setErr] = useState<ReturnType<typeof errInfo> | null>(null);
  const [failedOrder, setFailedOrder] = useState<string | null>(null);
  // Stable keys per checkout attempt so a double-click / retry never double-orders or double-charges.
  const orderKey = useRef(newKey()); const payKey = useRef(newKey()); const orderId = useRef<string | null>(null);

  const needsRx = lines.some((l) => l.requires_prescription);
  const sig = useMemo(() => JSON.stringify([lines.map((l) => [l.product_id, l.quantity]), rx]), [lines, rx]);
  const lastSig = useRef(sig);
  useEffect(() => { if (lastSig.current !== sig && !orderId.current) { orderKey.current = newKey(); } lastSig.current = sig; }, [sig]);

  useEffect(() => {
    if (!authed || !needsRx) return;
    Promise.allSettled(prescriptionIds.get().map((id) => api<Prescription>(`/prescriptions/${id}`))).then((rs) => {
      const ok = rs.flatMap((r) => (r.status === "fulfilled" && r.value.status === "approved" ? [r.value] : []));
      setApproved(ok); if (ok[0]) setRx((x) => x || ok[0].id);
    });
  }, [authed, needsRx]);

  if (!hydrated || !authed) return null;
  if (!lines.length) return <div className="container-x py-12"><Empty title="Nothing to check out" action={<Link href="/shop" className="btn btn-primary">Browse the shop</Link>} /></div>;

  async function place(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setFailedOrder(null);
    try {
      setBusy("order");
      if (!orderId.current) {
        const o = await api<CustomerOrder>("/orders", {
          method: "POST", idempotencyKey: orderKey.current,
          body: { prescription_id: needsRx ? rx || null : null, lines: lines.map((l) => ({ product_id: l.product_id, quantity: l.quantity })) },
        });
        orderId.current = o.id;
        fulfilment.set(o.id, { mode, where: mode === "delivery" ? address : branch, phone });
        clear();
      }
      setBusy("pay");
      const pay = await startPayment(orderId.current, payKey.current);
      if (pay.redirect_url) { window.location.href = pay.redirect_url; return; }
      router.replace(`/orders/${orderId.current}?pay=1`);
    } catch (x) {
      const info = errInfo(x); setErr(info); setBusy("");
      if (orderId.current) setFailedOrder(orderId.current); // order exists, payment didn't start
    }
  }

  return (
    <div className="container-x py-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Checkout</h1>
      <form onSubmit={place} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card space-y-4 p-6">
            <h2 className="text-lg font-bold">1. How would you like to receive it?</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {([["delivery", Truck, "Delivery", "Home or office"], ["pickup", Building2, "Pickup", "Collect at a branch"]] as const).map(([v, I, t, d]) => (
                <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${mode === v ? "border-brand bg-mist" : "border-transparent bg-mist/60"}`}>
                  <input type="radio" name="mode" className="sr-only" checked={mode === v} onChange={() => setMode(v)} /><I className="text-brand" /><span><b className="block">{t}</b><span className="text-xs text-muted">{d}</span></span>
                </label>
              ))}
            </div>
            {mode === "delivery"
              ? <div><label className="label" htmlFor="a">Delivery address</label><textarea id="a" className="input min-h-24" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no., street, area, landmark, city" /></div>
              : <div><label className="label" htmlFor="b">Pickup branch</label><select id="b" className="input" value={branch} onChange={(e) => setBranch(e.target.value)}>{BRANCHES.map((b) => <option key={b}>{b}</option>)}</select></div>}
            <div><label className="label" htmlFor="ph">Phone for the rider / pickup</label><input id="ph" type="tel" className="input" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="024 000 0000" /></div>
          </section>

          {needsRx && (
            <section className="card space-y-3 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold"><FileText size={18} /> 2. Prescription</h2>
              {approved.length ? (
                <select className="input" value={rx} onChange={(e) => setRx(e.target.value)} aria-label="Approved prescription">
                  {approved.map((p) => <option key={p.id} value={p.id}>Prescription {shortId(p.id)}{p.note ? ` — ${p.note}` : ""}</option>)}
                </select>
              ) : (
                <p className="flex gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900"><ShieldAlert size={18} className="shrink-0" /><span>You have no approved prescription yet. <Link href="/prescriptions" className="font-semibold underline">Upload one</Link> and come back once a pharmacist approves it.</span></p>
              )}
            </section>
          )}

          <section className="card space-y-3 p-6">
            <h2 className="text-lg font-bold">{needsRx ? "3" : "2"}. Payment</h2>
            <label className="flex items-center gap-3 rounded-2xl border-2 border-brand bg-mist p-4"><input type="radio" checked readOnly className="accent-[#2f3fb8]" /><CreditCard className="text-brand" /><span><b className="block">Paystack</b><span className="text-xs text-muted">Mobile money or card — you&apos;ll be redirected to pay securely</span></span></label>
            <label className="flex items-center gap-3 rounded-2xl bg-mist/60 p-4 opacity-60"><input type="radio" disabled /><Building2 className="text-muted" /><span><b className="block">Approved credit</b><span className="text-xs text-muted">Not yet available online — contact support to pay on account</span></span></label>
          </section>

          {err && (
            <div role="alert" className="space-y-2 rounded-[24px] bg-rose-50 p-5 text-sm text-rose-900">
              <p className="font-semibold">{failedOrder ? "We couldn't start your payment — you have not been charged." : err.title}</p>
              <p>{(err.code && ERR_HELP[err.code]) || err.detail || err.title}</p>
              {failedOrder && <p>Your order <b>#{shortId(failedOrder)}</b> is saved. Press <b>Pay again</b>, or <Link href={`/orders/${failedOrder}`} className="underline">open the order</Link>.</p>}
            </div>
          )}
        </div>

        <aside className="card h-fit space-y-4 p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold">Order summary</h2>
          <ul className="space-y-2 text-sm">{lines.map((l) => <li key={l.product_id} className="flex justify-between gap-3"><span className="truncate">{l.quantity}× {l.name}</span><span className="shrink-0">{ghs(l.quantity * l.price_pesewa)}</span></li>)}</ul>
          <div className="flex justify-between border-t border-mist pt-4 text-lg font-bold"><span>Total</span><span>{ghs(total)}</span></div>
          <button className="btn btn-primary w-full" disabled={!!busy || (needsRx && !rx)}>
            {busy ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />}
            {busy === "order" ? "Placing order…" : busy === "pay" ? "Opening payment…" : failedOrder ? `Pay again` : `Place order & pay ${ghs(total)}`}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted"><MapPin size={12} /> Prices are confirmed by us when your order is placed.</p>
        </aside>
      </form>
    </div>
  );
}
