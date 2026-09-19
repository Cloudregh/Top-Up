"use client";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Scroll-snap row with round prev/next buttons (Mecura-style). */
export function Carousel({ children, itemClass = "w-[72%] sm:w-[38%] lg:w-[24%]", arrows = false }: { children: React.ReactNode; itemClass?: string; arrows?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  return (
    <div>
      <div ref={ref} className="hide-scroll -mx-[var(--g)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--g)] pb-2" data-lenis-prevent-wheel>
        {Array.isArray(children) ? children.map((c, i) => <div key={i} className={`shrink-0 snap-start ${itemClass}`}>{c}</div>) : <div className={`shrink-0 snap-start ${itemClass}`}>{children}</div>}
      </div>
      {arrows && (
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => go(-1)} aria-label="Previous" className="grid size-10 place-items-center rounded-full bg-white shadow ring-1 ring-black/5 hover:bg-mist"><ArrowLeft size={16} /></button>
          <button onClick={() => go(1)} aria-label="Next" className="grid size-10 place-items-center rounded-full bg-white shadow ring-1 ring-black/5 hover:bg-mist"><ArrowRight size={16} /></button>
        </div>
      )}
    </div>
  );
}
