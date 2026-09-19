import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck, Info, ShieldAlert, Stethoscope } from "lucide-react";
import { InfoHero, Section, Cta } from "@/components/InfoPage";
import { CampaignProducts } from "@/components/CampaignProducts";
import { NotSureCard } from "@/components/NotSureCard";
import { Pending } from "@/components/Pending";
import { CAMPAIGNS } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return CAMPAIGNS.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = CAMPAIGNS.find((x) => x.slug === slug);
  return { title: c?.title ?? "Health" };
}

const List = ({ items, tone = "bg-mist" }: { items: string[]; tone?: string }) => (
  <ul className="space-y-3">{items.map((t) => <li key={t} className={`flex gap-3 rounded-2xl ${tone} p-4 text-sm`}><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky" />{t}</li>)}</ul>
);

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CAMPAIGNS.find((x) => x.slug === slug);
  if (!c) notFound();

  return (
    <>
      <InfoHero eyebrow="Health Campaigns" title={c.title} intro={c.intro} image={c.img} />
      <div className="gutter mt-6"><Link href="/#campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"><ArrowLeft size={16} /> Back to home</Link></div>

      <Section title={c.searchTerms.length ? "Why it happens" : "Why screening matters"} waitingFor="CMS: pharmacist-approved condition content">
        <div className="grid gap-8 lg:grid-cols-2">
          <List items={c.why} />
          <div className="tile p-6"><h3 className="flex items-center gap-2 font-semibold"><Stethoscope size={18} className="text-brand" /> What can help</h3><div className="mt-4"><List items={c.selfCare} tone="bg-white" /></div></div>
        </div>
      </Section>

      <Section>
        <div className="rounded-[28px] bg-amber-50 p-6 sm:p-8">
          <h3 className="flex items-center gap-2 font-semibold text-amber-900"><ShieldAlert size={18} /> See a pharmacist or doctor if…</h3>
          <ul className="mt-4 grid gap-2 text-sm text-amber-900 sm:grid-cols-2">{c.seeHelp.map((t) => <li key={t} className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />{t}</li>)}</ul>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs text-muted"><Info size={14} className="mt-0.5 shrink-0" /> General information only — not a diagnosis. Always follow a pharmacist&apos;s or doctor&apos;s advice.</p>
      </Section>

      {c.searchTerms.length > 0 ? (
        <Section title="The right medication" waitingFor="CMS: pharmacist-curated product links (search terms → GET /catalogue?q=)">
          <p className="mb-6 max-w-2xl text-sm text-muted">Available now from our catalogue. Some items need a prescription — you&apos;ll be asked to upload one at checkout.</p>
          <CampaignProducts terms={c.searchTerms} />
        </Section>
      ) : (
        <Section title="Get screened">
          <Pending waitingFor="POST /enquiries (appointments)">
            <div className="tile flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-sm text-muted">Visit any of our branches to book a screening. Early detection saves lives.</p>{c.cta && <Cta href={c.cta.href}><CalendarCheck size={16} /> {c.cta.label}</Cta>}</div>
          </Pending>
        </Section>
      )}

      <Section><NotSureCard /></Section>
    </>
  );
}
