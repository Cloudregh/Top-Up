import type { Metadata } from "next";
import { InfoHero, Section } from "@/components/InfoPage";
import { WhatsAppForm } from "@/components/WhatsAppForm";
import { LOCATIONS, SERVICES } from "@/lib/site";

export const metadata: Metadata = { title: "Book an Appointment" };
export default function Appointment() {
  return (
    <>
      <InfoHero eyebrow="Health Hub" title="Book an appointment" intro="Visit any of our branches and receive appropriate care specific to your health needs." image="appointment" />
      <Section waitingFor="POST /enquiries (forms currently hand off to WhatsApp)"><div className="mx-auto max-w-2xl"><WhatsAppForm heading="Appointment request" cta="Request appointment on WhatsApp" fields={[
        { name: "name", label: "Full name" }, { name: "phone", label: "Phone", type: "tel" },
        { name: "service", label: "Service", options: SERVICES.map((s) => s.t) }, { name: "branch", label: "Branch", options: LOCATIONS.map((l) => l.name) },
        { name: "date", label: "Preferred date", type: "date" }, { name: "note", label: "Anything we should know?", textarea: true },
      ]} /></div></Section>
    </>
  );
}
