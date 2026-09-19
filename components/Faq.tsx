"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Faq({ items }: { items: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-[#e5e8f5]">
      {items.map(([q, a], i) => (
        <div key={q}>
          <button className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold sm:text-base" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            {q}<ChevronDown size={18} className={`shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
          </button>
          <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}><p className="overflow-hidden text-sm leading-relaxed text-muted">{a}</p></div>
        </div>
      ))}
    </div>
  );
}
