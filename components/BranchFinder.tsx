"use client";
import { useState } from "react";
import { Clock, MapPin, Navigation, Phone, Truck } from "lucide-react";
import { BRANCHES_LIST, REGIONS, mapsHref, prettyPhone, telHref, type Region } from "@/lib/branches";
import { Pending } from "./Pending";

export function BranchFinder({ compact = false }: { compact?: boolean }) {
  const [region, setRegion] = useState<Region | "All">("All");
  const list = BRANCHES_LIST.filter((b) => region === "All" || b.region === region);
  return (
    <Pending waitingFor="GET /locations (customer-readable branch list)">
      <div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Region">
          {(["All", ...REGIONS] as const).map((r) => (
            <button key={r} role="tab" aria-selected={region === r} onClick={() => setRegion(r)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${region === r ? "bg-deep text-white" : "bg-mist hover:bg-[#d8eafb]"}`}>
              {r}{r !== "All" && <span className="ml-1.5 opacity-60">{BRANCHES_LIST.filter((b) => b.region === r).length}</span>}
            </button>
          ))}
        </div>
        <ul className={`mt-6 grid gap-3 sm:grid-cols-2 ${compact ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
          {list.map((b) => (
            <li key={b.name} className="tile flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug">{b.name}</h3>
                {b.wholesale && <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-brand">Wholesale</span>}
              </div>
              <p className="mt-2 flex gap-2 text-sm text-muted"><MapPin size={15} className="mt-0.5 shrink-0" />{b.area}</p>
              <p className="mt-1.5 flex gap-2 text-sm text-muted"><Clock size={15} className="mt-0.5 shrink-0" />{b.hours}</p>
              {b.delivery && <p className="mt-1.5 flex gap-2 text-sm text-muted"><Truck size={15} className="mt-0.5 shrink-0" />Delivery available</p>}
              <div className="mt-auto flex gap-2 pt-4">
                <a href={telHref(b.phone)} className="btn btn-white flex-1 px-3! py-2! text-xs"><Phone size={13} /> {prettyPhone(b.phone)}</a>
                <a href={mapsHref(b)} target="_blank" rel="noopener" className="btn btn-primary px-3! py-2! text-xs" aria-label={`Directions to ${b.name}`}><Navigation size={13} /> Directions</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Pending>
  );
}
