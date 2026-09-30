"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";
import { mapsHref, nearestBranches } from "@/lib/branches";
import { inGhana, kmParts } from "@/lib/geo";
import { useAuth } from "./AuthProvider";
import { PlacePicker } from "./ChangeLocation";
import { useLocation } from "./LocationProvider";

const MARK = { WebkitMask: "url(/logo-mark-v2.png) center / contain no-repeat", mask: "url(/logo-mark-v2.png) center / contain no-repeat" };
const Mark = () => <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist"><span className="size-5 bg-brand" style={MARK} /></span>;
const Pill = ({ cls, children }: { cls: string; children: React.ReactNode }) =>
  <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold sm:px-3 sm:py-1 sm:text-xs ${cls}`}>{children}</span>;
const OPEN = "bg-[#dff1e4] text-leaf";

/**
 * Body of the home hero's floating card. Guests see "Pharmacy hours · 24/7"; once a signed-in customer's
 * location is known it becomes their nearest branch (dots page through the three closest).
 */
export function HeroBranchCard() {
  const { status } = useAuth();
  const { coords, state, place } = useLocation();
  const [i, setI] = useState(0);
  const [picking, setPicking] = useState(false);

  const abroad = !!coords && !inGhana(coords);
  const near = coords && !abroad ? nearestBranches(coords) : [];
  const b = near[Math.min(i, near.length - 1)];
  const settled = status === "authed" && state !== "idle" && state !== "locating";

  if (picking) return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={() => setPicking(false)} aria-label="Back" className="-ml-1 rounded-full p-1 hover:bg-mist"><ArrowLeft size={16} /></button>
        <span className="text-xs font-semibold sm:text-sm">Who is it for?</span>
      </div>
      <div className="mt-3"><PlacePicker onDone={() => { setI(0); setPicking(false); }} /></div>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-semibold sm:text-sm">{b ? (place ? `Near ${place.name}` : "Nearest branch") : abroad ? "Branches" : "Pharmacy hours"}</span>
        {abroad ? <Pill cls="bg-rose-50 text-rose-700">Outside Ghana</Pill>
          : b && !b.hours?.includes("24") ? (b.hours ? <Pill cls="bg-mist text-muted">{b.hours}</Pill> : null)
          : <Pill cls={OPEN}>Open</Pill>}
      </div>

      {b ? (
        <>
          <a href={mapsHref(b)} target="_blank" rel="noopener" aria-label={`Directions to ${b.name}`} className="mt-3 flex items-center gap-2.5 text-xs">
            <Mark /><span className="flex-1 truncate font-medium">{b.name}</span><ChevronRight size={14} />
          </a>
          <div className="mt-2.5 flex items-end justify-between sm:mt-3">
            <p className="text-4xl font-medium leading-none tracking-tighter sm:text-6xl">{kmParts(b.km)[0]}<span className="ml-1 text-sm font-normal tracking-normal text-muted">/{kmParts(b.km)[1]} away</span></p>
            <span className="mb-1 flex flex-col gap-1.5">
              {near.map((x, j) => (
                <button key={x.name} onClick={() => setI(j)} aria-label={`Show ${x.name}`} aria-current={j === i}
                  className={`size-1.5 rounded-full transition ${j === i ? "bg-ink" : "bg-ink/20 hover:bg-ink/40"}`} />
              ))}
            </span>
          </div>
        </>
      ) : (
        <>
          <Link href="/contact" className="mt-3 hidden items-center gap-2.5 text-xs sm:flex">
            <Mark /><span className="flex-1 font-medium">Tema · Accra · Kumasi</span><ChevronRight size={14} />
          </Link>
          {abroad ? (
            <p className="mt-2.5 text-base font-semibold leading-tight tracking-tight sm:mt-3 sm:text-xl">Our branches aren&apos;t in your area<span className="mt-1 block text-[11px] font-normal tracking-normal text-muted">Top-Up branches are only in Ghana.</span></p>
          ) : (
            <div className="mt-2.5 flex items-end justify-between sm:mt-3">
              <p className="text-4xl font-medium leading-none tracking-tighter sm:text-6xl">24/7<span className="ml-1 text-sm font-normal text-muted">/open</span></p>
              <span className="mb-1 flex flex-col gap-1.5" aria-hidden><i className="size-1.5 rounded-full bg-ink/20" /><i className="size-1.5 rounded-full bg-ink" /><i className="size-1.5 rounded-full bg-ink/20" /></span>
            </div>
          )}
        </>
      )}

      {settled && (
        <button onClick={() => setPicking(true)} className="mt-3 flex items-center gap-1 text-left text-[11px] font-semibold text-brand hover:underline">
          <MapPin size={12} className="shrink-0" />
          {b ? (place ? "Change location" : "Buying for someone? Change location") : abroad ? "Buying for someone in Ghana?" : "Find your nearest branch"}
        </button>
      )}
    </>
  );
}
