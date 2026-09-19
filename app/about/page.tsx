import type { Metadata } from "next";
import { InfoHero, Section, Cta } from "@/components/InfoPage";
import { Img } from "@/components/Img";
import { AWARDS } from "@/lib/site";
import { AwardCard } from "@/components/AwardCard";
import { BranchFinder } from "@/components/BranchFinder";

export const metadata: Metadata = { title: "About Us" };
export default function About() {
  return (
    <>
      <InfoHero eyebrow="About Us" title="A leading pharmaceutical company in Ghana" intro="Top-Up Pharmacy is one of the best pharmacies in Ghana — a leading retail and wholesale pharmaceutical company with branches in Tema, Accra and beyond." image="pharmacy" />
      <Section waitingFor="CMS: about / CEO message"><div className="grid items-center gap-8 md:grid-cols-2">
        <Img k="pharmacy" w={900} alt="Inside a Top-Up Pharmacy branch" className="aspect-4/3 w-full rounded-[28px] object-cover" />
        <div className="space-y-4 text-muted"><p>&ldquo;We give exciting service, unparalleled fulfilment and significant impact in the retail pharmacy space. It&apos;s all possible because of the unalloyed support from our fiercely loyal customers.&rdquo;</p><p className="text-sm font-semibold text-ink">— CEO&apos;s Message</p><Cta href="/services">Our services</Cta></div>
      </div></Section>
      <Section title="Recognition"><ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{AWARDS.map((a) => <li key={a.t}><AwardCard a={a} /></li>)}</ul></Section>
      <Section title="Find a branch"><BranchFinder /></Section>
    </>
  );
}
