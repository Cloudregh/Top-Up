/* eslint-disable @next/next/no-img-element -- local static photos */
import type { Award } from "@/lib/site";

export function AwardCard({ a }: { a: Award }) {
  return (
    <figure className="tile flex h-full flex-col overflow-hidden p-2">
      <div className="aspect-4/3 overflow-hidden rounded-[22px]">
        <img src={a.img} alt={a.t} loading="lazy" decoding="async" className="size-full object-cover" style={{ objectPosition: a.pos ?? "center" }} />
      </div>
      <figcaption className="p-4"><p className="font-semibold leading-snug">{a.t}</p><p className="mt-1.5 text-xs text-muted">{a.by}</p></figcaption>
    </figure>
  );
}
