"use client";
import { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { GHANA_PLACES, type Place } from "@/lib/geo";
import { useLocation } from "./LocationProvider";

/** "Buying for someone?" link that opens a town picker; the choice moves every nearest-branch view. */
export function ChangeLocation({ up = false, className = "text-sm" }: { up?: boolean; className?: string }) {
  const { place } = useLocation();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", off); addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", off); removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <div ref={root} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className={`flex items-center gap-1.5 font-semibold text-brand hover:underline ${className}`}>
        <MapPin size={14} className="shrink-0" /> {place ? `For someone in ${place.name} · Change` : "Buying for someone? Change location"}
      </button>
      {open && (
        <div className={`absolute right-0 z-40 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5 ${up ? "bottom-full mb-2" : "top-full mt-2"}`}>
          <PlacePicker onDone={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

/** Town list for "buying for someone else", plus "Use my location" to go back to GPS. */
export function PlacePicker({ onDone }: { onDone: () => void }) {
  const { setPlace, locate } = useLocation();
  const [q, setQ] = useState("");
  const list = GHANA_PLACES.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()));
  const pick = (p: Place | null) => { setPlace(p); if (!p) locate(); onDone(); };
  return (
    <div>
      <label className="relative block">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input autoFocus className="input py-2.5! pl-9! text-sm!" placeholder="Search a town or area in Ghana" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search a town" />
      </label>
      <ul data-lenis-prevent className="mt-2 max-h-52 overflow-y-auto overscroll-contain">
        {!q && <li><button type="button" onClick={() => pick(null)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-brand hover:bg-mist"><LocateFixed size={14} /> Use my location</button></li>}
        {list.map((p) => <li key={p.name}><button type="button" onClick={() => pick(p)} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-mist">{p.name}</button></li>)}
        {!list.length && <li className="px-3 py-2 text-sm text-muted">No match — try a nearby town.</li>}
      </ul>
    </div>
  );
}
