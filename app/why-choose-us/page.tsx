import type { Metadata } from "next";
import { Clock, Truck, ShieldCheck, Award, Users, Stethoscope } from "lucide-react";
import { InfoHero, Section, Cta } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Why Choose Us" };
const REASONS = [
  [Clock, "Open 24/7", "24hrs pharmaceutical services and a 24/7 customer hotline."],
  [Award, "Award-winning", "Customers' Choice Awards Ghana 2024 — Pharmaceutical Company of the Year."],
  [ShieldCheck, "Insurance-friendly", "Partnered with leading health insurers across Ghana."],
  [Truck, "Delivered to you", "Home & office delivery with live order tracking."],
  [Stethoscope, "Pharmacist-led", "Prescription review and counselling from qualified pharmacists."],
  [Users, "Retail & wholesale", "One partner for individuals, clinics and businesses."],
] as const;
export default function Why() {
  return (
    <>
      <InfoHero eyebrow="Why Choose Us" title="Whatever you need… 24/7" intro="Quality healthcare products and services, backed by people who care." image="about_pharmacist" />
      <Section waitingFor="CMS: why-choose-us"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{REASONS.map(([I, t, d]) => <div key={t} className="tile p-6"><span className="grid size-11 place-items-center rounded-full bg-white text-brand"><I size={20} /></span><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>)}</div><div className="mt-8"><Cta href="/shop">Start shopping</Cta></div></Section>
    </>
  );
}
