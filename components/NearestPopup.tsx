"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { animate } from "animejs";
import { ArrowLeft, ChevronRight, LocateFixed, MapPin, Search, X } from "lucide-react";
import { mapsHref, nearestBranches } from "@/lib/branches";
import { GHANA_PLACES, inGhana, kmParts, type Place } from "@/lib/geo";
import { useBranchStock, type StockItem } from "@/lib/hooks";
import { useAuth } from "./AuthProvider";
import { useLocation } from "./LocationProvider";
import { AVAIL } from "./ProductCard";

const MARK = { WebkitMask: "url(/logo-mark-v2.png) center / contain no-repeat", mask: "url(/logo-mark-v2.png) center / contain no-repeat" };
const Mark = () => <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist"><span className="size-5 bg-brand" style={MARK} /></span>;

/** Floating nearest-branch card. Opens after sign-in and on every add-to-cart. */
export function NearestPopup() {
  const { popup, closeNearest } = useLocation();
  const { status } = useAuth();
  const path = usePathname();
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      animate(el, { translateY: [30, 0], opacity: [0, 1], scale: [0.95, 1], duration: 500, ease: "outExpo" });
  }, []);
  useEffect(() => {
    if (!popup) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && closeNearest();
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [popup, closeNearest]);
  // The cart shows the same card inline, so no floating copy there.
  if (!popup || status !== "authed" || path === "/cart") return null;
  const items = popup.product ? [popup.product] : [];
  return (
    <div ref={ref} key={popup.product?.product_id ?? "-"} role="dialog" aria-label="Your nearest Top-Up branch"
      className="fixed inset-x-3 bottom-40 z-60 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-80">
      <NearestBranchCard items={items} onClose={closeNearest} className="shadow-2xl ring-1 ring-black/5" />
    </div>
  );
}

/**
 * The customer's closest branch, styled after the home hero's "Pharmacy hours" card. Dots page through the
 * three nearest; `items` adds each one's stock at the branch shown. Also used inline (cart sidebar).
 */
export function NearestBranchCard({ items = [], onClose, className = "" }: { items?: StockItem[]; onClose?: () => void; className?: string }) {
  const { coords, state, locate, place, setPlace } = useLocation();
  const [i, setI] = useState(0);
  const [picking, setPicking] = useState(false);
  const at = useBranchStock(items);

  const abroad = !!coords && !inGhana(coords);
  const near = coords && !abroad ? nearestBranches(coords) : [];
  const b = near[Math.min(i, near.length - 1)];

  const pill = picking ? null
    : abroad ? <Pill cls="bg-rose-50 text-rose-700">Outside Ghana</Pill>
    : b ? (b.hours?.includes("24") ? <Pill cls="bg-[#dff1e4] text-leaf">Open</Pill> : b.hours && <Pill cls="bg-mist text-muted">{b.hours}</Pill>)
    : state === "denied" || state === "unavailable" ? <Pill cls="bg-mist text-muted">Location off</Pill> : null;

  return (
    <div className={`rounded-[22px] bg-white p-5 ${className}`}>
      <div className="flex items-center gap-2">
        {picking && <button onClick={() => setPicking(false)} aria-label="Back" className="-ml-1 rounded-full p-1 hover:bg-mist"><ArrowLeft size={16} /></button>}
        <span className="flex-1 truncate text-sm font-semibold">{picking ? "Who is it for?" : place ? `Nearest to ${place.name}` : "Nearest branch"}</span>
        {pill}
        {onClose && <button onClick={onClose} aria-label="Close" className="-mr-1 rounded-full p-1 text-muted hover:bg-mist hover:text-ink"><X size={16} /></button>}
      </div>

      {picking ? (
        <PlacePicker onPick={(p) => { setPlace(p); setI(0); setPicking(false); if (!p) locate(); }} />
      ) : b ? (
        <>
          <a href={mapsHref(b)} target="_blank" rel="noopener" className="mt-3 flex items-center gap-2.5 text-sm" aria-label={`Directions to ${b.name}`}>
            <Mark /><span className="flex-1 truncate font-medium">{b.name}</span><ChevronRight size={16} />
          </a>
          <div className="mt-3 flex items-end justify-between">
            <p className="text-6xl font-medium leading-none tracking-tighter">{kmParts(b.km)[0]}<span className="ml-1 text-sm font-normal tracking-normal text-muted">/{kmParts(b.km)[1]} away</span></p>
            <span className="mb-1 flex flex-col gap-1.5">
              {near.map((x, j) => (
                <button key={x.name} onClick={() => setI(j)} aria-label={`Show ${x.name}`} aria-current={j === i}
                  className={`size-2 rounded-full transition ${j === i ? "bg-ink" : "bg-ink/20 hover:bg-ink/40"}`} />
              ))}
            </span>
          </div>
          {items.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {items.map((it) => {
                const a = at(it, b.name);
                return (
                  <li key={it.product_id} className="flex items-center gap-2 rounded-2xl bg-mist px-3 py-2 text-xs">
                    <span className="flex-1 truncate font-medium">{it.name}</span>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-semibold ${a ? AVAIL[a].cls : "bg-white text-muted"}`}>{a ? AVAIL[a].label : "Call to confirm"}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <ChangeLink onClick={() => setPicking(true)}>{place ? "Change location" : "Buying for someone? Change location"}</ChangeLink>
        </>
      ) : abroad ? (
        <>
          <div className="mt-3 flex items-center gap-2.5 text-sm"><Mark /><span className="flex-1 font-medium">Tema · Accra · Kumasi</span></div>
          <p className="mt-3 text-2xl font-semibold leading-tight tracking-tight">Our branches aren&apos;t in your area</p>
          <p className="mt-1 text-xs text-muted">Top-Up Pharmacy branches are only in Ghana.</p>
          <ChangeLink onClick={() => setPicking(true)}>Buying for someone in Ghana? Choose their town</ChangeLink>
        </>
      ) : state === "denied" || state === "unavailable" ? (
        <>
          <p className="mt-3 text-sm text-muted">Turn on location, or choose a town, to find your closest branch.</p>
          <div className="mt-4 flex gap-2">
            <button onClick={locate} className="btn btn-white flex-1 px-3! py-2! text-xs"><LocateFixed size={13} /> Use my location</button>
            <button onClick={() => setPicking(true)} className="btn btn-primary flex-1 px-3! py-2! text-xs"><MapPin size={13} /> Choose a town</button>
          </div>
        </>
      ) : (
        <div className="mt-3 space-y-3" aria-label="Finding your nearest branch"><div className="skeleton h-9" /><div className="skeleton h-14" /></div>
      )}
    </div>
  );
}

const Pill = ({ cls, children }: { cls: string; children: React.ReactNode }) =>
  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{children}</span>;

const ChangeLink = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) =>
  <button onClick={onClick} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"><MapPin size={13} /> {children}</button>;

/** Town list for "buying for someone else"; `null` means go back to my own location. */
function PlacePicker({ onPick }: { onPick: (p: Place | null) => void }) {
  const [q, setQ] = useState("");
  const list = GHANA_PLACES.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="mt-3">
      <label className="relative block">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input autoFocus className="input py-2.5! pl-9! text-sm!" placeholder="Search a town or area in Ghana" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search a town" />
      </label>
      <ul data-lenis-prevent className="mt-2 max-h-52 overflow-y-auto overscroll-contain">
        {!q && <li><button onClick={() => onPick(null)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-brand hover:bg-mist"><LocateFixed size={14} /> Use my location</button></li>}
        {list.map((p) => <li key={p.name}><button onClick={() => onPick(p)} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-mist">{p.name}</button></li>)}
        {!list.length && <li className="px-3 py-2 text-sm text-muted">No match — try a nearby town.</li>}
      </ul>
    </div>
  );
}
