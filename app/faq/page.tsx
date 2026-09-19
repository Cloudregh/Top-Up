import type { Metadata } from "next";
import { InfoHero, Section } from "@/components/InfoPage";
import { Faq } from "@/components/Faq";
import { FAQS } from "@/lib/site";

export const metadata: Metadata = { title: "FAQ's" };
export default function FaqPage() {
  return (<><InfoHero eyebrow="Help" title="Frequently asked questions" intro="Quick answers about ordering, prescriptions, delivery and payment." /><Section waitingFor="CMS: FAQs"><div className="mx-auto max-w-3xl"><Faq items={FAQS} /></div></Section></>);
}
