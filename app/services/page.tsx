import type { Metadata } from "next";
import { Stethoscope } from "lucide-react";
import { InfoHero, Section, Cta } from "@/components/InfoPage";
import { SERVICES } from "@/lib/site";

export const metadata: Metadata = { title: "Services" };
export default function Services() {
  return (
    <>
      <InfoHero eyebrow="Pharmacy Services" title="Care beyond the counter" intro="Visit any of our branches and receive appropriate care specific to your health needs. Begin by selecting the service(s) you require, and we will assist you." image="shelves" />
      <Section waitingFor="CMS: services"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{SERVICES.map((s) => <div key={s.t} className="tile p-6"><span className="grid size-11 place-items-center rounded-full bg-white text-brand"><Stethoscope size={20} /></span><h3 className="mt-4 font-semibold">{s.t}</h3><p className="mt-1 text-sm text-muted">{s.d}</p></div>)}</div><div className="mt-8 flex gap-3"><Cta href="/appointment">Book an appointment</Cta></div></Section>
    </>
  );
}
