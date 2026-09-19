import type { Metadata } from "next";
import { InfoHero, Section, Cta } from "@/components/InfoPage";
import { Img } from "@/components/Img";
import { AWARDS, LOCATIONS } from "@/lib/site";

export const metadata: Metadata = { title: "About Us" };
export default function About() {
  return (
    <>
      <InfoHero eyebrow="About Us" title="A leading pharmaceutical company in Ghana" intro="Top-Up Pharmacy is one of the best pharmacies in Ghana — a leading retail and wholesale pharmaceutical company with branches in Tema, Accra and beyond." image="about_counter" />
      <Section waitingFor="CMS: about / CEO message"><div className="grid items-center gap-8 md:grid-cols-2">
        <Img k="about_pharmacist" w={900} h={700} alt="Top-Up pharmacist at work" className="aspect-[4/3] w-full rounded-[28px] object-cover" />
        <div className="space-y-4 text-muted"><p>&ldquo;We give exciting service, unparalleled fulfilment and significant impact in the retail pharmacy space. It&apos;s all possible because of the unalloyed support from our fiercely loyal customers.&rdquo;</p><p className="text-sm font-semibold text-ink">— CEO&apos;s Message</p><Cta href="/services">Our services</Cta></div>
      </div></Section>
      <Section title="Recognition" waitingFor="CMS: awards"><ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{AWARDS.map((a) => <li key={a.t} className="tile p-5"><p className="font-semibold">{a.t}</p><p className="mt-1 text-xs text-muted">{a.by}</p></li>)}</ul></Section>
      <Section title="Where to find us" waitingFor="GET /locations (customer-readable)"><ul className="grid gap-3 md:grid-cols-3">{LOCATIONS.map((l) => <li key={l.name} className="tile p-5"><p className="font-semibold">{l.name}</p><p className="mt-1 text-sm text-muted">{l.addr}</p></li>)}</ul></Section>
    </>
  );
}
