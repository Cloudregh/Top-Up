"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Building2, Download, LogOut, MapPin, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { ErrorState, Skeleton } from "@/components/States";
import { useToast } from "@/components/Toast";
import { api, errInfo } from "@/lib/api";
import { useFetch, useRequireAuth } from "@/lib/hooks";
import { addresses, notifPrefs } from "@/lib/local";
import { fmtDate, ghs } from "@/lib/format";
import type { Statement } from "@/lib/types";

const LICENCE = {
  valid: ["Valid", "bg-emerald-50 text-emerald-700"], expiring_soon: ["Expiring soon", "bg-amber-50 text-amber-700"], expired: ["Expired", "bg-rose-50 text-rose-700"],
} as const;

export default function AccountPage() {
  const authed = useRequireAuth();
  const { user, customer, logout, reloadCustomer } = useAuth();
  const router = useRouter(); const toast = useToast();
  const { data: st, error: stErr, loading: stLoading, retry } = useFetch<Statement>(authed && user ? `/customers/${user.customer_id}/statement` : null);
  const [addrs, setAddrs] = useState<string[]>([]); const [newAddr, setNewAddr] = useState("");
  const [prefs, setPrefs] = useState({ orderUpdates: true, prescriptionUpdates: true, promotions: false });
  const [edit, setEdit] = useState(false); const [f, setF] = useState({ name: "", licence_no: "", licence_expiry: "" }); const [saving, setSaving] = useState(false);

  useEffect(() => { setAddrs(addresses.get()); setPrefs(notifPrefs.get()); }, []);
  useEffect(() => { if (customer) setF({ name: customer.name, licence_no: customer.licence_no ?? "", licence_expiry: customer.licence_expiry ?? "" }); }, [customer]);

  if (!authed || !user) return <div className="container-x py-8"><Skeleton className="h-96" /></div>;
  const limit = customer?.credit_limit_pesewa ?? 0;
  const owed = st?.balance_pesewa ?? 0;
  const pct = limit ? Math.min(100, Math.round((owed / limit) * 100)) : 0;
  const lic = customer?.licence_status ? LICENCE[customer.licence_status] : null;

  const setAddresses = (a: string[]) => { setAddrs(a); addresses.set(a); };
  const togglePref = (k: keyof typeof prefs) => { const p = { ...prefs, [k]: !prefs[k] }; setPrefs(p); notifPrefs.set(p); };

  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!customer) return; setSaving(true);
    try {
      await api(`/customers/${customer.id}`, { method: "PATCH", body: { name: f.name, kind: customer.kind, licence_no: f.licence_no || null, licence_expiry: f.licence_expiry || null } });
      await reloadCustomer(); setEdit(false); toast("Details updated");
    } catch (x) { const i = errInfo(x); toast(i.status === 403 ? "Only our team can change these details — tap Need help?" : i.detail || i.title, "err"); }
    finally { setSaving(false); }
  }

  return (
    <div className="container-x space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{user.name}</h1><p className="text-muted">{user.email}</p></div>
        <button className="btn btn-soft" onClick={async () => { await logout(); router.replace("/"); }}><LogOut size={16} /> Sign out</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card space-y-4 p-6">
          <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-bold"><Building2 size={18} /> Business details</h2>{customer && !edit && <button className="text-sm font-semibold text-brand" onClick={() => setEdit(true)}>Edit</button>}</div>
          {!customer ? <Skeleton className="h-32" /> : edit ? (
            <form onSubmit={save} className="space-y-3">
              <div><label className="label" htmlFor="bn">Name</label><input id="bn" className="input" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
              <div><label className="label" htmlFor="ln">Licence number</label><input id="ln" className="input" value={f.licence_no} onChange={(e) => setF({ ...f, licence_no: e.target.value })} /></div>
              <div><label className="label" htmlFor="le">Licence expiry</label><input id="le" type="date" className="input" value={f.licence_expiry} onChange={(e) => setF({ ...f, licence_expiry: e.target.value })} /></div>
              <div className="flex gap-2"><button className="btn btn-primary" disabled={saving}>Save</button><button type="button" className="btn btn-soft" onClick={() => setEdit(false)}>Cancel</button></div>
            </form>
          ) : (
            <dl className="space-y-3 text-sm">
              {[["Business", customer.name], ["Account type", customer.kind], ["Licence no.", customer.licence_no ?? "—"], ["Licence expiry", customer.licence_expiry ? fmtDate(customer.licence_expiry) : "—"]].map(([k, v]) => <div key={k} className="flex justify-between"><dt className="text-muted">{k}</dt><dd className="font-semibold capitalize">{v}</dd></div>)}
              {lic && <div className="flex items-center justify-between"><dt className="text-muted">Licence status</dt><dd className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${lic[1]}`}><BadgeCheck size={14} />{lic[0]}</dd></div>}
              {customer.licence_status === "expiring_soon" || customer.licence_status === "expired" ? <p className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-900">Please send us your renewed licence so ordering isn&apos;t interrupted.</p> : null}
            </dl>)}
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="text-lg font-bold">Credit</h2>
          {stErr && limit === 0 ? <p className="text-sm text-muted">Credit information isn&apos;t available for this account.</p> : (
            <>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[["Limit", ghs(limit)], ["Outstanding", stLoading ? "…" : ghs(owed)], ["Available", stLoading ? "…" : ghs(Math.max(0, limit - owed))]].map(([k, v]) => <div key={k} className="rounded-2xl bg-mist p-3"><p className="text-xs text-muted">{k}</p><p className="mt-1 font-bold">{v}</p></div>)}
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Credit used"><div className={`h-full rounded-full ${pct > 85 ? "bg-rose-500" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div>
            </>)}
        </section>
      </div>

      <section className="card p-6">
        <h2 className="mb-4 text-lg font-bold">Statement</h2>
        {stLoading ? <Skeleton className="h-32" /> : stErr ? <ErrorState title="Statement unavailable" detail={stErr.detail || stErr.title} onRetry={retry} />
          : !st?.entries.length ? <p className="text-sm text-muted">No transactions yet.</p> : (
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-muted"><th className="pb-2">Date</th><th className="pb-2">Type</th><th className="pb-2 text-right">Amount</th><th /></tr></thead>
              <tbody className="divide-y divide-mist">{st.entries.map((e, i) => (
                <tr key={i}><td className="py-3">{fmtDate(e.created_at)}</td><td className="capitalize">{e.entry_type}{e.ref_doc_type ? ` · ${e.ref_doc_type.replace("_", " ")}` : ""}</td>
                  <td className={`text-right font-semibold ${e.amount_pesewa < 0 ? "text-emerald-700" : ""}`}>{ghs(e.amount_pesewa)}</td>
                  <td className="pl-3 text-right">{e.ref_doc_type === "invoice" && e.ref_doc_id && <Link href={`/invoices/${e.ref_doc_id}`} className="inline-flex items-center gap-1 font-semibold text-brand"><Download size={14} /> Invoice</Link>}</td></tr>))}</tbody></table></div>)}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card space-y-3 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold"><MapPin size={18} /> Delivery addresses</h2>
          {addrs.map((a, i) => <div key={i} className="flex items-start justify-between gap-2 rounded-2xl bg-mist p-3 text-sm"><span>{a}</span><button aria-label="Remove address" onClick={() => setAddresses(addrs.filter((_, j) => j !== i))}><Trash2 size={16} className="text-muted hover:text-rose-600" /></button></div>)}
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (newAddr.trim()) { setAddresses([...addrs, newAddr.trim()]); setNewAddr(""); } }}>
            <input className="input" value={newAddr} onChange={(e) => setNewAddr(e.target.value)} placeholder="Add an address" aria-label="New address" /><button className="btn btn-soft" aria-label="Add"><Plus size={16} /></button></form>
          <p className="text-xs text-muted">Saved on this device.</p>
        </section>
        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold">Notifications</h2>
          {([["orderUpdates", "Order updates"], ["prescriptionUpdates", "Prescription decisions"], ["promotions", "Offers & promotions"]] as const).map(([k, l]) => (
            <label key={k} className="flex cursor-pointer items-center justify-between rounded-2xl bg-mist p-3 text-sm font-medium">{l}
              <input type="checkbox" role="switch" checked={prefs[k]} onChange={() => togglePref(k)} className="size-5 accent-[#2f3fb8]" /></label>))}
          <p className="text-xs text-muted">Saved on this device.</p>
        </section>
      </div>
    </div>
  );
}
