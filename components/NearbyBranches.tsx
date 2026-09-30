"use client";
import Link from "next/link";
import { LocateFixed, MapPin, Navigation, Phone } from "lucide-react";
import { mapsHref, nearestBranches, prettyPhone, stockAt, telHref, type StockItem } from "@/lib/branches";
import { inGhana, prettyKm } from "@/lib/geo";
import { SUPPORT } from "@/lib/format";
import type { Availability } from "@/lib/types";
import { AVAIL } from "./ProductCard";
import { ChangeLocation } from "./ChangeLocation";
import { Pending } from "./Pending";
import { Skeleton } from "./States";
import { useLocation } from "./LocationProvider";

const Stock = ({ a, long }: { a: Availability | null; long?: boolean }) =>
  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${a ? AVAIL[a].cls : "bg-white text-muted"}`}>{a ? AVAIL[a].label : long ? "Call to confirm stock" : "Call to confirm"}</span>;

/** The three branches closest to the customer (or who they're buying for), with each item's stock there. */
export function NearbyBranches({ items, className = "" }: { items: StockItem[]; className?: string }) {
  const { coords, state, locate, place } = useLocation();

  return (
    <section className={className}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><h2 className="text-2xl font-bold">{place ? `Branches near ${place.name}` : "Branches near you"}</h2><ChangeLocation /></div>
      {!coords ? (
        state === "locating" || state === "idle"
          ? <div className="grid gap-3 sm:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-40" />)}</div>
          : <div className="card flex flex-wrap items-center gap-4 p-6 text-sm text-muted">
              <p className="flex-1">{state === "denied" ? "Allow location access, or choose a town, to see which nearby branches have this in stock." : "We couldn't get your location."}</p>
              <button className="btn btn-white px-4! py-2! text-xs" onClick={locate}><LocateFixed size={14} /> Use my location</button>
            </div>
      ) : !inGhana(coords) ? (
        <div className="card p-6 text-sm text-muted">
          <b className="block text-base text-ink">Our branches aren&apos;t in your area</b>Top-Up Pharmacy branches are only in Ghana. <Link href="/contact" className="font-semibold underline">See all branches</Link>
        </div>
      ) : (
        <Pending waitingFor="per-branch stock (GET /catalogue/{id}/locations) + GET /locations coordinates">
          <ul className="grid gap-3 sm:grid-cols-3">
            {nearestBranches(coords).map((b) => (
              <li key={b.name} className="tile flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{b.name}</h3>
                  <span className="shrink-0 text-xs font-semibold text-muted">{prettyKm(b.km)}</span>
                </div>
                <p className="mt-2 flex gap-2 text-sm text-muted"><MapPin size={15} className="mt-0.5 shrink-0" />{b.area}</p>
                {items.length === 1
                  ? <span className="mt-3 self-start"><Stock a={stockAt(items[0])} long /></span>
                  : <ul className="mt-3 space-y-1.5">{items.map((it) => (
                      <li key={it.product_id} className="flex items-center gap-2 text-xs"><span className="min-w-0 flex-1 truncate">{it.name}</span><Stock a={stockAt(it)} /></li>
                    ))}</ul>}
                <div className="mt-auto flex gap-2 pt-4">
                  <a href={b.phone ? telHref(b.phone) : `tel:+${SUPPORT.phone}`} className="btn btn-white flex-1 px-3! py-2! text-xs"><Phone size={13} /> {b.phone ? prettyPhone(b.phone) : "Call main line"}</a>
                  <a href={mapsHref(b)} target="_blank" rel="noopener" className="btn btn-primary px-3! py-2! text-xs" aria-label={`Directions to ${b.name}`}><Navigation size={13} /> Directions</a>
                </div>
              </li>
            ))}
          </ul>
        </Pending>
      )}
    </section>
  );
}
