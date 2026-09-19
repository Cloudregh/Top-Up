import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { InfoHero, Section } from "@/components/InfoPage";
import { NEWS } from "@/lib/site";
import { fmtDate } from "@/lib/format";

export const metadata: Metadata = { title: "News" };
export default function News() {
  return (
    <>
      <InfoHero eyebrow="News" title="Latest from Top-Up" intro="Community screenings, awards and milestones from across our branches." />
      <Section><ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{NEWS.map((n) => (
        <li key={n.t} className="tile flex flex-col justify-between p-6"><span className="grid size-10 place-items-center rounded-full bg-white text-brand"><Newspaper size={18} /></span><h3 className="mt-5 font-semibold leading-snug">{n.t}</h3><p className="mt-3 text-xs text-muted">{fmtDate(n.d)}</p></li>))}</ul></Section>
    </>
  );
}
