"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LocateFixed, MapPin, Navigation, Phone } from "lucide-react";
import { branchStock, mapsHref, nearestBranches, prettyPhone, telHref } from "@/lib/branches";
import { prettyKm } from "@/lib/geo";
import { SUPPORT } from "@/lib/format";
import type { Availability, CatalogueItem } from "@/lib/types";
import { AVAIL } from "./ProductCard";
import { Pending } from "./Pending";
import { Skeleton } from "./States";
import { useLocation } from "./LocationProvider";

/** The customer's closest branches and whether each has this product. */
export function NearbyStock({ product }: { product: CatalogueItem }) {
  const { coords, state, locate } = useLocation();
  const [stock, setStock] = useState<Record<string, Availability> | null>(null);

  useEffect(() => {
    let live = true;
    branchStock(product.product_id).then((s) => live && setStock(s));
    return () => { live = false; };
  }, [product.product_id]);

  // Until per-branch stock exists, an out-of-stock product is out everywhere; otherwise ask the branch.
  const at = (name: string): Availability | null => stock?.[name] ?? (product.availability === "out_of_stock" ? "out_of_stock" : null);

  return (
    <section className="mt-14">
      <h2 className="mb-5 text-2xl font-bold">Branches near you</h2>
      {!coords ? (
        state === "locating" || state === "idle"
          ? <div className="grid gap-3 sm:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-40" />)}</div>
          : <div className="card flex flex-wrap items-center gap-4 p-6 text-sm text-muted">
              <p className="flex-1">{state === "denied" ? "Allow location access to see which nearby branches have this in stock." : "We couldn't get your location."}</p>
              <button className="btn btn-white px-4! py-2! text-xs" onClick={locate}><LocateFixed size={14} /> Use my location</button>
              <Link href="/contact" className="text-xs font-semibold underline">See all branches</Link>
            </div>
      ) : (
        <Pending waitingFor="per-branch stock (GET /catalogue/{id}/locations) + GET /locations coordinates">
          <ul className="grid gap-3 sm:grid-cols-3">
            {nearestBranches(coords).map((b) => {
              const a = at(b.name);
              return (
                <li key={b.name} className="tile flex flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug">{b.name}</h3>
                    <span className="shrink-0 text-xs font-semibold text-muted">{prettyKm(b.km)}</span>
                  </div>
                  <p className="mt-2 flex gap-2 text-sm text-muted"><MapPin size={15} className="mt-0.5 shrink-0" />{b.area}</p>
                  <span className={`mt-3 self-start rounded-full px-3 py-1 text-xs font-semibold ${a ? AVAIL[a].cls : "bg-white text-muted"}`}>{a ? AVAIL[a].label : "Call to confirm stock"}</span>
                  <div className="mt-auto flex gap-2 pt-4">
                    <a href={b.phone ? telHref(b.phone) : `tel:+${SUPPORT.phone}`} className="btn btn-white flex-1 px-3! py-2! text-xs"><Phone size={13} /> {b.phone ? prettyPhone(b.phone) : "Call main line"}</a>
                    <a href={mapsHref(b)} target="_blank" rel="noopener" className="btn btn-primary px-3! py-2! text-xs" aria-label={`Directions to ${b.name}`}><Navigation size={13} /> Directions</a>
                  </div>
                </li>
              );
            })}
          </ul>
        </Pending>
      )}
    </section>
  );
}
