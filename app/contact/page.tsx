import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { InfoHero, Section } from "@/components/InfoPage";
import { WhatsAppForm } from "@/components/WhatsAppForm";
import { LOCATIONS } from "@/lib/site";
import { SUPPORT, pretty } from "@/lib/format";

export const metadata: Metadata = { title: "Contact" };
export default function Contact() {
  return (
    <>
      <InfoHero eyebrow="Contact" title="We're here 24/7" intro="We offer a 24/7 customer hotline so we can help you. Find a store near you or send us a message." image="about_pharmacist" />
      <Section><div className="grid gap-4 md:grid-cols-3">
        <a href={`tel:+${SUPPORT.phone}`} className="tile p-6"><Phone className="text-brand" /><p className="mt-3 font-semibold">Call us</p><p className="text-sm text-muted">{pretty(SUPPORT.phone)}<br />{pretty(SUPPORT.phone2)}</p></a>
        <a href={`https://wa.me/${SUPPORT.whatsapp}`} target="_blank" rel="noopener" className="tile p-6"><MessageCircle className="text-brand" /><p className="mt-3 font-semibold">WhatsApp</p><p className="text-sm text-muted">Instant replies</p></a>
        <div className="tile p-6"><Clock className="text-brand" /><p className="mt-3 font-semibold">Hours</p><p className="text-sm text-muted">Open 24/7</p></div>
      </div></Section>
      <Section title="Our locations" waitingFor="GET /locations (customer-readable)"><ul className="grid gap-3 md:grid-cols-3">{LOCATIONS.map((l) => <li key={l.name} className="tile flex gap-3 p-5"><MapPin className="mt-0.5 shrink-0 text-brand" size={18} /><div><p className="font-semibold">{l.name}</p><p className="text-sm text-muted">{l.addr}</p></div></li>)}</ul></Section>
      <Section><div className="mx-auto max-w-2xl"><WhatsAppForm heading="Send us a message" fields={[{ name: "name", label: "Name" }, { name: "phone", label: "Phone", type: "tel" }, { name: "msg", label: "Message", textarea: true }]} /></div></Section>
    </>
  );
}
