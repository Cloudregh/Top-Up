/* eslint-disable @next/next/no-img-element -- static partner logos from /public */
import { INSURERS } from "@/lib/site";

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="marquee-track" aria-hidden={hidden || undefined}>
      {INSURERS.map((i) => (
        <li key={i.name} style={i.bg ? { background: i.bg } : undefined} className="relative h-24 w-52 shrink-0 overflow-hidden rounded-[22px] bg-white ring-1 ring-[#e3eefb] sm:h-28 sm:w-60">
          {i.logo
            ? <img src={i.logo} alt={hidden ? "" : i.name} loading="lazy" decoding="async" className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-contain" />
            : <span className="grid size-full place-items-center p-4 text-center text-sm font-bold leading-tight text-navy">{i.name}</span>}
        </li>
      ))}
    </ul>
  );
}

export function InsurerLogos() {
  return (
    <div className="marquee mt-6" role="group" aria-label="Insurance partners">
      <div className="marquee-row">
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}
