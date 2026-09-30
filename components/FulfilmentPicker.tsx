"use client";
import { useEffect, useState } from "react";
import { Building2, Truck } from "lucide-react";
import { BranchSelect } from "./BranchSelect";
import { Select } from "./Select";
import { addresses, fulfilPref, type FulfilPref } from "@/lib/local";

/** Delivery-or-pickup choice. Persisted on-device; pre-fills checkout. */
export function FulfilmentPicker() {
  const [p, setP] = useState<FulfilPref | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => { setP(fulfilPref.get()); setSaved(addresses.get()); }, []);
  if (!p) return <div className="skeleton h-40" />;
  const up = (patch: Partial<FulfilPref>) => { const n = { ...p, ...patch }; setP(n); fulfilPref.set(n); };
  return (
    <section className="card space-y-4 p-6">
      <h2 className="text-lg font-bold">Delivery or pickup?</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {([["delivery", Truck, "Delivery", "Home or office"], ["pickup", Building2, "Pickup", "Collect at a branch"]] as const).map(([v, I, t, d]) => (
          <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${p.mode === v ? "border-brand bg-mist" : "border-transparent bg-mist/60"}`}>
            <input type="radio" name="cart-mode" className="sr-only" checked={p.mode === v} onChange={() => up({ mode: v })} /><I className="text-brand" /><span><b className="block">{t}</b><span className="text-xs text-muted">{d}</span></span>
          </label>
        ))}
      </div>
      {p.mode === "delivery" ? (
        <div>
          <label className="label" htmlFor="c-addr">Delivery address</label>
          {saved.length > 0 && <div className="mb-2"><Select aria-label="Saved addresses" value="" placeholder="Use a saved address…" onChange={(address) => up({ address })} options={saved.map((a) => ({ value: a, label: a }))} /></div>}
          <textarea id="c-addr" className="input min-h-20" value={p.address} onChange={(e) => up({ address: e.target.value })} placeholder="House no., street, area, landmark, city" />
        </div>
      ) : (
        <div><label className="label" htmlFor="c-br">Pickup branch</label><BranchSelect id="c-br" value={p.branch} picked={!!p.branchPicked} onChange={(branch) => up({ branch, branchPicked: true })} onAuto={(branch) => up({ branch })} /></div>
      )}
    </section>
  );
}
